import pool from '../db/database.js';

export const createOrder = async (userId, productId, sellerId, quantity, totalPrice, paymentMethod) => {
  const result = await pool.query(
    'INSERT INTO orders (user_id, product_id, seller_id, quantity, total_price, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, productId, sellerId, quantity, totalPrice, paymentMethod]
  );
  return result.rows[0];
};

export const getOrdersByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC', [userId]);
  return result.rows;
};

export const getOrdersBySellerId = async (sellerId) => {
  const result = await pool.query('SELECT * FROM orders WHERE seller_id = $1 ORDER BY order_date DESC', [sellerId]);
  return result.rows;
};

export const getOrderById = async (id) => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *',
    [id, status]
  );
  return result.rows[0];
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const result = await pool.query(
    'UPDATE orders SET payment_status = $2 WHERE id = $1 RETURNING *',
    [id, paymentStatus]
  );
  return result.rows[0];
};

export const updateTrackingNumber = async (id, trackingNumber) => {
  const result = await pool.query(
    'UPDATE orders SET tracking_number = $2 WHERE id = $1 RETURNING *',
    [id, trackingNumber]
  );
  return result.rows[0];
};

export const getAllOrders = async () => {
  const result = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
  return result.rows;
};
