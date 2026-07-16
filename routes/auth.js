const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid Username' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid Password' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const authenticateToken = require('../middleware/authMiddleware');

router.get('/me', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
  res.json(result.rows[0]);
});