import pool from '../db/database.js';
import bcrypt from 'bcryptjs';

export const createUser = async (email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
    [email, hashedPassword, role]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const createUserProfile = async (userId, firstName, lastName, phone, photoUrl) => {
  const result = await pool.query(
    'INSERT INTO user_profiles (user_id, first_name, last_name, phone, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, firstName, lastName, phone, photoUrl]
  );
  return result.rows[0];
};

export const getUserProfile = async (userId) => {
  const result = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
  return result.rows[0];
};

export const updateUserProfile = async (userId, firstName, lastName, phone, photoUrl) => {
  const result = await pool.query(
    'UPDATE user_profiles SET first_name = $2, last_name = $3, phone = $4, photo_url = $5 WHERE user_id = $1 RETURNING *',
    [userId, firstName, lastName, phone, photoUrl]
  );
  return result.rows[0];
};
