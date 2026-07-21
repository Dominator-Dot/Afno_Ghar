const pool = require('../db');

async function createRental({ productId, productName, userId, userName, userPhone, citizenNumber, address }) {
  const result = await pool.query(
    `INSERT INTO rentals (product_id, product_name, user_id, user_name, user_phone, citizen_number, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [productId || null, productName, userId, userName, userPhone, citizenNumber, address]
  );
  return result.rows[0];
}

async function findAllForUser(userId) {
  const result = await pool.query(
    'SELECT * FROM rentals WHERE user_id = $1 ORDER BY requested_at DESC',
    [userId]
  );
  return result.rows;
}

module.exports = {
  createRental,
  findAllForUser,
};
