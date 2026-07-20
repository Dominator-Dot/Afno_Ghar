require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const pool = require('./db');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Afno Ghar API running' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0] });
  } catch (error) {
    console.error('DB test failed:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.accepts('html')) {
    return res.status(500).render('error', { message: 'Internal Server Error' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
