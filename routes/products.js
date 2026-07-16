const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Public: list all products
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json(result.rows);
});

// Public: single product
router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// Protected: create product
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, price, category, stock, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Missing fields' });

  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, description, price, category, stock || 0, image_url]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;