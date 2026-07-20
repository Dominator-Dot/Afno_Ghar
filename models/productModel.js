const pool = require('../db');

async function findAll() {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

async function createProduct({ name, description, price, category, stock, image_url }) {
  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, category, stock || 0, image_url]
  );
  return result.rows[0];
}

async function updateProduct(id, { name, description, price, category, stock, image_url }) {
  const result = await pool.query(
    `UPDATE products SET name=$1, description=$2, price=$3, category=$4, stock=$5, image_url=$6 WHERE id=$7 RETURNING *`,
    [name, description, price, category, stock, image_url, id]
  );
  return result.rows[0];
}

async function deleteProduct(id) {
  const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]);
  return result.rows[0];
}

module.exports = {
  findAll,
  findById,
  createProduct,
  updateProduct,
  deleteProduct,
};
