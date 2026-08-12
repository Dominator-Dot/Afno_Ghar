const { pool } = require("../config/database");

async function getOrderTracking(req, res) {
  try {
    const params = [req.params.orderNumber];
    let ownerClause = "";
    if (req.user.role === "customer") {
      params.push(req.user.id);
      ownerClause = " AND o.user_id = $2";
    }

    const orderResult = await pool.query(
      `SELECT o.id, o.order_number, o.order_status, o.estimated_delivery_date
       FROM orders o WHERE o.order_number = $1${ownerClause}`,
      params
    );
    const order = orderResult.rows[0];
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const trackingResult = await pool.query(
      `SELECT oi.id AS order_item_id, oi.product_name,
              pt.id AS tracking_id, ps.name AS stage, ps.stage_order,
              pt.tracking_status, pt.started_at, pt.completed_at, pt.remarks, pt.updated_at
       FROM order_items oi
       JOIN production_tracking pt ON pt.order_item_id = oi.id
       JOIN production_stages ps ON ps.id = pt.stage_id
       WHERE oi.order_id = $1
       ORDER BY oi.id, ps.stage_order`,
      [order.id]
    );

    return res.json({ success: true, order, tracking: trackingResult.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to load tracking" });
  }
}

async function updateTrackingStage(req, res) {
  const client = await pool.connect();
  try {
    const trackingId = Number(req.params.trackingId);
    const status = String(req.body.tracking_status || "");
    const allowed = ["pending", "in_progress", "completed", "delayed"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid tracking status" });

    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE production_tracking pt
       SET tracking_status = $1,
           started_at = CASE WHEN $1 = 'in_progress' AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
           completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END,
           remarks = $2,
           updated_by = $3
       WHERE pt.id = $4
       RETURNING pt.*`,
      [status, req.body.remarks || null, req.user.id, trackingId]
    );
    const tracking = result.rows[0];
    if (!tracking) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Tracking stage not found" });
    }

    const stageInfo = await client.query(
      `SELECT ps.stage_order, oi.order_id
       FROM production_tracking pt
       JOIN production_stages ps ON ps.id = pt.stage_id
       JOIN order_items oi ON oi.id = pt.order_item_id
       WHERE pt.id = $1`,
      [trackingId]
    );

    const { stage_order: stageOrder, order_id: orderId } = stageInfo.rows[0];
    if (status === "in_progress" && Number(stageOrder) > 1) {
      await client.query(
        `UPDATE orders SET order_status = 'in_production'
         WHERE id = $1 AND order_status IN ('confirmed','advance_paid')`,
        [orderId]
      );
    }
    if (status === "completed" && Number(stageOrder) === 8) {
      await client.query(`UPDATE orders SET order_status = 'ready_for_delivery' WHERE id = $1`, [orderId]);
    }

    await client.query("COMMIT");
    return res.json({ success: true, tracking });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to update tracking" });
  } finally {
    client.release();
  }
}

module.exports = { getOrderTracking, updateTrackingStage };
