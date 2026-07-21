const express = require('express');
const rentalController = require('../controllers/rentalController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Matches the frontend's src/api/rentalsApi.js -> POST {API_BASE_URL}/rentals
router.post('/', authenticateToken, rentalController.createRental);
router.get('/', authenticateToken, rentalController.listMyRentals);

module.exports = router;
