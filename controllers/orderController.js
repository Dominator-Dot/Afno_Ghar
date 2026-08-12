const crypto = require("crypto");
const { pool } = require("../config/database");
const { priceConfiguredItem, roundMoney } = require("../services/pricingService");

function makeOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `AFNO-${date}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

async function getDelivery(client, addressId, userId) {
  const addressResult = await client.query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );
  const address = addressResult.rows[0];
  if (!address) throw new Error("Delivery address does not belong to this user");

  const zoneResult = await client.query(
    `SELECT estimated_days, delivery_charge
     FROM delivery_zones
     WHERE province = $1 AND district = $2 AND is_serviceable = TRUE
       AND (municipality = $3 OR municipality IS NULL)
     ORDER BY (municipality = $3) DESC
     LIMIT 1`,
    [address.province, address.district, address.municipality]
  );

  const zone = zoneResult.rows[0] || null;
  return {
    address,
    deliveryCharge: zone ? Number(zone.delivery_charge) : 0,
    estimatedDays: zone ? Number(zone.estimated_days) : null,
  };
}

async function createOrder(req, res) {
  const client = await pool.connect();
  try {
    const addressId = Number(req.body.address_id);
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!Number.isInteger(addressId) || addressId <= 0 || items.length === 0) {
      return res.status(400).json({ success: false, message: "address_id and at least one item are required" });
    }

    await client.query("BEGIN");

    const delivery = await getDelivery(client, addressId, req.user.id);
    const pricedItems = [];
    for (const item of items) pricedItems.push(await priceConfiguredItem(client, item));

    const subtotal = roundMoney(pricedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
    const customizationCharge = roundMoney(
      pricedItems.reduce((sum, item) => sum + item.customizationPrice * item.quantity, 0)
    );
    const deliveryCharge = roundMoney(delivery.deliveryCharge);
    const totalAmount = roundMoney(subtotal + customizationCharge + deliveryCharge);

    const customCount = pricedItems.filter((item) => item.customized).length;
    const orderType = customCount === 0 ? "ready_made" : customCount === pricedItems.length ? "custom" : "mixed";
    const advanceRate = Number(process.env.CUSTOM_ORDER_ADVANCE_RATE || 0.30);
    const advanceRequired = orderType === "ready_made" ? totalAmount : roundMoney(totalAmount * advanceRate);
    const estimatedDeliveryDate = delivery.estimatedDays
      ? new Date(Date.now() + delivery.estimatedDays * 86400000).toISOString().slice(0, 10)
      : null;

    const orderResult = await client.query(
      `INSERT INTO orders
       (order_number, user_id, address_id, order_type, order_status,
        subtotal, customization_charge, delivery_charge, discount_amount,
        total_amount, advance_required, remaining_amount, estimated_delivery_date, notes)
       VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,0,$8,$9,$8,$10,$11)
       RETURNING *`,
      [makeOrderNumber(), req.user.id, addressId, orderType, subtotal,
       customizationCharge, deliveryCharge, totalAmount, advanceRequired,
       estimatedDeliveryDate, req.body.notes || null]
    );
    const order = orderResult.rows[0];

    for (const item of pricedItems) {
      const itemResult = await client.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, selected_material, selected_color,
          quantity, unit_price, customization_price, custom_length, custom_width,
          custom_height, special_instructions, item_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING id`,
        [order.id, item.productId, item.productName, item.materialName, item.colorName,
         item.quantity, item.unitPrice, item.customizationPrice, item.customLength,
         item.customWidth, item.customHeight, item.specialInstructions, item.itemTotal]
      );

      if (item.customized) {
        await client.query(
          `INSERT INTO production_tracking (order_item_id, stage_id, tracking_status, started_at, completed_at)
           SELECT $1, ps.id,
                  CASE WHEN ps.stage_order = 1 THEN 'completed' ELSE 'pending' END,
                  CASE WHEN ps.stage_order = 1 THEN CURRENT_TIMESTAMP ELSE NULL END,
                  CASE WHEN ps.stage_order = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
           FROM production_stages ps
           ORDER BY ps.stage_order
           ON CONFLICT DO NOTHING`,
          [itemResult.rows[0].id]
        );
      }
    }

    await client.query("COMMIT");
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      payment_due_now: advanceRequired,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(400).json({ success: false, message: error.message || "Failed to create order" });
  } finally {
    client.release();
  }
}

async function getMyOrders(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, order_number, order_type, order_status, total_amount,
              advance_required, remaining_amount, estimated_delivery_date, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, orders: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to load orders" });
  }
}

async function getOrderByNumber(req, res) {
  try {
    const params = [req.params.orderNumber];
    let ownerClause = "";
    if (req.user.role === "customer") {
      params.push(req.user.id);
      ownerClause = ` AND o.user_id = $2`;
    }

    const orderResult = await pool.query(
      `SELECT o.*, a.province, a.district, a.municipality, a.street_address
       FROM orders o JOIN addresses a ON a.id = o.address_id
       WHERE o.order_number = $1${ownerClause}`,
      params
    );
    const order = orderResult.rows[0];
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const [itemsResult, paymentsResult] = await Promise.all([
      pool.query(`SELECT * FROM order_items WHERE order_id = $1 ORDER BY id`, [order.id]),
      pool.query(
        `SELECT id, payment_type, payment_method, amount, transaction_reference,
                gateway_transaction_id, payment_status, paid_at, created_at
         FROM payments WHERE order_id = $1 ORDER BY created_at DESC`,
        [order.id]
      ),
    ]);

    return res.json({ success: true, order, items: itemsResult.rows, payments: paymentsResult.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to load order" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const allowed = ["pending", "confirmed", "advance_paid", "in_production", "ready_for_delivery", "out_for_delivery", "delivered", "cancelled"];
    const status = String(req.body.order_status || "");
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid order status" });

    const result = await pool.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
      [status, Number(req.params.id)]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to update order" });
  }
}

module.exports = { createOrder, getMyOrders, getOrderByNumber, updateOrderStatus };
