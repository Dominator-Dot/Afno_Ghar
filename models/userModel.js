const { pool } = require("../config/database");

// Find user by email
async function findByEmail(email) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      email,
      phone,
      password_hash,
      role,
      status,
      created_at,
      updated_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

// Find user by ID
async function findById(id) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

// Create a new user
async function createUser({
  fullName,
  email,
  phone,
  passwordHash,
}) {
  const result = await pool.query(
    `
    INSERT INTO users (
      full_name,
      email,
      phone,
      password_hash
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      full_name,
      email,
      phone,
      role,
      status,
      created_at
    `,
    [
      fullName,
      email.toLowerCase(),
      phone,
      passwordHash,
    ]
  );

  return result.rows[0];
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};