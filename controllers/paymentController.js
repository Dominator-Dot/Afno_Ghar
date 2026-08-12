const { pool } = require("../config/database");
const { initiateKhaltiPayment, lookupKhaltiPayment } = require("../services/khaltiService");
const { buildEsewaForm, verifyResponseSignature, checkEsewaStatus } = require("../services/esewaService");

async function loadOrderPaymentContext(orderId, userId) {
  const result = await pool.query(
    `SELECT o.*, u.full_name, u.email, u.phone,
            COALESCE((SELECT SUM(p.amount) FROM payments p
                      WHERE p.order_id = o.id AND p.payment_status = 'completed'
                        AND p.payment_type <> 'refund'), 0) AS paid_amount
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = $1 AND o.user_id = $2`,
    [orderId, userId]
  );
  const order = result.rows[0];
  if (!order) throw new Error("Order not found");
  order.paid_amount = Number(order.paid_amount);
  order.total_amount = Number(order.total_amount);
  order.advance_required = Number(order.advance_required);
  order.outstanding = Math.max(0, order.total_amount - order.paid_amount);
  return order;
}

function amountForType(order, paymentType) {
  if (order.outstanding <= 0) throw new Error("This order is already fully paid");
  if (paymentType === "advance") {
    const stillNeededForAdvance = Math.max(0, order.advance_required - order.paid_amount);
    if (stillNeededForAdvance <= 0) throw new Error("Required advance has already been paid");
    return Math.min(stillNeededForAdvance, order.outstanding);
  }
  if (paymentType === "remaining" || paymentType === "full_payment") return order.outstanding;
  throw new Error("Invalid payment_type");
}

async function createPendingPayment(orderId, paymentType, paymentMethod, amount) {
  const result = await pool.query(
    `INSERT INTO payments (order_id, payment_type, payment_method, amount, payment_status)
     VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
    [orderId, paymentType, paymentMethod, amount]
  );
  return result.rows[0];
}

async function completePayment(paymentId, gatewayTransactionId, gatewayResponse) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const paymentResult = await client.query(`SELECT * FROM payments WHERE id = $1 FOR UPDATE`, [paymentId]);
    const payment = paymentResult.rows[0];
    if (!payment) throw new Error("Payment record not found");

    if (payment.payment_status !== "completed") {
      await client.query(
        `UPDATE payments
         SET payment_status='completed', paid_at=CURRENT_TIMESTAMP,
             verified_at=CURRENT_TIMESTAMP, gateway_transaction_id=$2,
             gateway_response=$3::jsonb
         WHERE id=$1`,
        [paymentId, gatewayTransactionId || null, JSON.stringify(gatewayResponse || {})]
      );
    }

    const totalResult = await client.query(
      `SELECT o.id, o.total_amount, o.advance_required,
              COALESCE(SUM(CASE WHEN p.payment_status='completed' AND p.payment_type <> 'refund' THEN p.amount ELSE 0 END),0) AS paid
       FROM orders o LEFT JOIN payments p ON p.order_id=o.id
       WHERE o.id=$1 GROUP BY o.id`,
      [payment.order_id]
    );
    const row = totalResult.rows[0];
    const total = Number(row.total_amount);
    const advance = Number(row.advance_required);
    const paid = Number(row.paid);
    const remaining = Math.max(0, total - paid);

    let newStatus = null;
    if (remaining === 0) newStatus = "confirmed";
    else if (paid >= advance) newStatus = "advance_paid";

    await client.query(
      `UPDATE orders
       SET remaining_amount=$2,
           order_status = CASE
             WHEN $3::text IS NULL THEN order_status
             WHEN order_status IN ('pending','confirmed','advance_paid') THEN $3
             ELSE order_status
           END
       WHERE id=$1`,
      [payment.order_id, remaining, newStatus]
    );

    await client.query("COMMIT");
    return { remaining, paid, total };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function initiateKhalti(req, res) {
  try {
    const orderId = Number(req.body.order_id);
    const paymentType = String(req.body.payment_type || "advance");
    const order = await loadOrderPaymentContext(orderId, req.user.id);
    const amount = amountForType(order, paymentType);
    const payment = await createPendingPayment(order.id, paymentType, "khalti", amount);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const khalti = await initiateKhaltiPayment({
      return_url: `${backendUrl}/api/payments/khalti/callback`,
      website_url: frontendUrl,
      amount: Math.round(amount * 100),
      purchase_order_id: `PAY-${payment.id}`,
      purchase_order_name: order.order_number,
      customer_info: { name: order.full_name, email: order.email, phone: order.phone },
    });

    await pool.query(
      `UPDATE payments SET transaction_reference=$1, gateway_response=$2::jsonb WHERE id=$3`,
      [khalti.pidx, JSON.stringify(khalti), payment.id]
    );

    return res.status(201).json({ success: true, payment_id: payment.id, pidx: khalti.pidx, payment_url: khalti.payment_url });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message || "Failed to initiate Khalti payment" });
  }
}

async function khaltiCallback(req, res) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const pidx = String(req.query.pidx || "");
    if (!pidx) return res.redirect(`${frontend}/payment-failed?reason=missing-pidx`);

    const paymentResult = await pool.query(`SELECT p.*, o.order_number FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.transaction_reference=$1`, [pidx]);
    const payment = paymentResult.rows[0];
    if (!payment) return res.redirect(`${frontend}/payment-failed?reason=payment-not-found`);

    if (payment.payment_status === "completed") {
      return res.redirect(`${frontend}/payment-success?order=${encodeURIComponent(payment.order_number)}`);
    }

    const lookup = await lookupKhaltiPayment(pidx);
    const expectedPaisa = Math.round(Number(payment.amount) * 100);
    if (lookup.status !== "Completed" || Number(lookup.total_amount) !== expectedPaisa) {
      await pool.query(`UPDATE payments SET payment_status='failed', gateway_response=$2::jsonb WHERE id=$1`, [payment.id, JSON.stringify(lookup)]);
      return res.redirect(`${frontend}/payment-failed?order=${encodeURIComponent(payment.order_number)}`);
    }

    await completePayment(payment.id, lookup.transaction_id, lookup);
    return res.redirect(`${frontend}/payment-success?order=${encodeURIComponent(payment.order_number)}`);
  } catch (error) {
    console.error(error);
    return res.redirect(`${frontend}/payment-failed?reason=verification-error`);
  }
}

async function initiateEsewa(req, res) {
  try {
    const orderId = Number(req.body.order_id);
    const paymentType = String(req.body.payment_type || "advance");
    const order = await loadOrderPaymentContext(orderId, req.user.id);
    const amount = amountForType(order, paymentType);
    const payment = await createPendingPayment(order.id, paymentType, "esewa", amount);

    const transactionUuid = `${order.order_number}-P${payment.id}`;
    await pool.query(`UPDATE payments SET transaction_reference=$1 WHERE id=$2`, [transactionUuid, payment.id]);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const form = buildEsewaForm({
      amount,
      transactionUuid,
      successUrl: `${backendUrl}/api/payments/esewa/success`,
      failureUrl: `${backendUrl}/api/payments/esewa/failure?payment_id=${payment.id}`,
    });

    return res.status(201).json({ success: true, payment_id: payment.id, payment_url: form.action, fields: form.fields });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message || "Failed to initiate eSewa payment" });
  }
}

async function esewaSuccess(req, res) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const encoded = String(req.query.data || "");
    if (!encoded) return res.redirect(`${frontend}/payment-failed?reason=missing-data`);

    const data = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    if (!verifyResponseSignature(data) || data.status !== "COMPLETE") {
      return res.redirect(`${frontend}/payment-failed?reason=invalid-signature`);
    }

    const paymentResult = await pool.query(
      `SELECT p.*, o.order_number FROM payments p JOIN orders o ON o.id=p.order_id
       WHERE p.transaction_reference=$1`,
      [data.transaction_uuid]
    );
    const payment = paymentResult.rows[0];
    if (!payment) return res.redirect(`${frontend}/payment-failed?reason=payment-not-found`);

    if (payment.payment_status === "completed") {
      return res.redirect(`${frontend}/payment-success?order=${encodeURIComponent(payment.order_number)}`);
    }

    if (Number(data.total_amount) !== Number(payment.amount)) {
      return res.redirect(`${frontend}/payment-failed?reason=amount-mismatch`);
    }

    const status = await checkEsewaStatus({ transactionUuid: data.transaction_uuid, amount: payment.amount });
    if (status.status !== "COMPLETE" || Number(status.total_amount ?? status.totalAmount) !== Number(payment.amount)) {
      await pool.query(`UPDATE payments SET payment_status='failed', gateway_response=$2::jsonb WHERE id=$1`, [payment.id, JSON.stringify(status)]);
      return res.redirect(`${frontend}/payment-failed?order=${encodeURIComponent(payment.order_number)}`);
    }

    await completePayment(payment.id, data.transaction_code || status.ref_id || status.refId, { callback: data, status });
    return res.redirect(`${frontend}/payment-success?order=${encodeURIComponent(payment.order_number)}`);
  } catch (error) {
    console.error(error);
    return res.redirect(`${frontend}/payment-failed?reason=verification-error`);
  }
}

async function esewaFailure(req, res) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  const paymentId = Number(req.query.payment_id);
  if (Number.isInteger(paymentId) && paymentId > 0) {
    await pool.query(`UPDATE payments SET payment_status='failed' WHERE id=$1 AND payment_status='pending'`, [paymentId]).catch(() => {});
  }
  return res.redirect(`${frontend}/payment-failed`);
}

async function getOrderPayments(req, res) {
  try {
    const orderId = Number(req.params.orderId);
    const owner = await loadOrderPaymentContext(orderId, req.user.id);
    const result = await pool.query(
      `SELECT id, payment_type, payment_method, amount, payment_status, transaction_reference,
              gateway_transaction_id, paid_at, created_at
       FROM payments WHERE order_id=$1 ORDER BY created_at DESC`,
      [owner.id]
    );
    return res.json({ success: true, payments: result.rows });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
}

module.exports = { initiateKhalti, khaltiCallback, initiateEsewa, esewaSuccess, esewaFailure, getOrderPayments };
