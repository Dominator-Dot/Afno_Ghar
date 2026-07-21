const pool = require('../db');

async function findAll() {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

async function createProduct({ name, description, details, price, category, material, tag, stock, image_url, images }) {
  const result = await pool.query(
    `INSERT INTO products (name, description, details, price, category, material, tag, stock, image_url, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [name, description, details, price, category, material, tag, stock || 0, image_url, JSON.stringify(images || [])]
  );
  return result.rows[0];
}

async function updateProduct(id, { name, description, details, price, category, material, tag, stock, image_url, images }) {
  const result = await pool.query(
    `UPDATE products SET name=$1, description=$2, details=$3, price=$4, category=$5, material=$6, tag=$7, stock=$8, image_url=$9, images=$10 WHERE id=$11 RETURNING *`,
    [name, description, details, price, category, material, tag, stock, image_url, JSON.stringify(images || []), id]
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
