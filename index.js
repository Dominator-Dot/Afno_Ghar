require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' })); // match your React dev server port
const authRoutes = require('./routes/auth');


app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Afno Ghar API running' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));const pool = require('./db');

app.get('/db-test', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json(result);
});