import pool from '../db/database.js';

export const createProduct = async (sellerId, name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice) => {
  const result = await pool.query(
    'INSERT INTO products (seller_id, name, description, price, image_url, category, stock, rental_available, rental_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [sellerId, name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice]
  );
  return result.rows[0];
};

export const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

export const getProductsBySellerId = async (sellerId) => {
  const result = await pool.query('SELECT * FROM products WHERE seller_id = $1', [sellerId]);
  return result.rows;
};

export const updateProduct = async (id, name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice) => {
  const result = await pool.query(
    'UPDATE products SET name = $2, description = $3, price = $4, image_url = $5, category = $6, stock = $7, rental_available = $8, rental_price = $9 WHERE id = $1 RETURNING *',
    [id, name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice]
  );
  return result.rows[0];
};

export const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getProductsByCategory = async (category) => {
  const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
  return result.rows;
};
