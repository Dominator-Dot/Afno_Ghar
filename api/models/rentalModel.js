import pool from '../db/database.js';

export const createRental = async (userId, productId, sellerId, rentalLocation, startDate, endDate, rentalPrice) => {
  const result = await pool.query(
    'INSERT INTO rentals (user_id, product_id, seller_id, rental_location, start_date, end_date, rental_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [userId, productId, sellerId, rentalLocation, startDate, endDate, rentalPrice]
  );
  return result.rows[0];
};

export const getRentalsByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM rentals WHERE user_id = $1', [userId]);
  return result.rows;
};

export const getRentalsBySellerId = async (sellerId) => {
  const result = await pool.query('SELECT * FROM rentals WHERE seller_id = $1', [sellerId]);
  return result.rows;
};

export const getRentalById = async (id) => {
  const result = await pool.query('SELECT * FROM rentals WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateVerificationStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE rentals SET verification_status = $2 WHERE id = $1 RETURNING *',
    [id, status]
  );
  return result.rows[0];
};

export const getPendingVerifications = async () => {
  const result = await pool.query('SELECT * FROM rentals WHERE verification_status = $1', ['pending']);
  return result.rows;
};
