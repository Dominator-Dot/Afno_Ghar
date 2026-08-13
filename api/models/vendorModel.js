import pool from '../db/database.js';

export const createVendor = async (userId, shopName, location, description) => {
  const result = await pool.query(
    'INSERT INTO vendors (user_id, shop_name, location, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, shopName, location, description]
  );
  return result.rows[0];
};

export const getVendorByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM vendors WHERE user_id = $1', [userId]);
  return result.rows[0];
};

export const getAllVendors = async () => {
  const result = await pool.query('SELECT * FROM vendors');
  return result.rows;
};

export const getVendorById = async (id) => {
  const result = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateVendor = async (id, shopName, location, description) => {
  const result = await pool.query(
    'UPDATE vendors SET shop_name = $2, location = $3, description = $4 WHERE id = $1 RETURNING *',
    [id, shopName, location, description]
  );
  return result.rows[0];
};

export const updateVendorVerification = async (id, isVerified) => {
  const result = await pool.query(
    'UPDATE vendors SET is_verified = $2 WHERE id = $1 RETURNING *',
    [id, isVerified]
  );
  return result.rows[0];
};
