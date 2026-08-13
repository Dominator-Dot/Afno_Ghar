import express from 'express';
import * as rentalModel from '../models/rentalModel.js';
import * as productModel from '../models/productModel.js';

const router = express.Router();

// Create rental request
router.post('/rentals', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { productId, rentalLocation, startDate, endDate } = req.body;

    if (!productId || !rentalLocation || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = await productModel.getProductById(productId);
    if (!product || !product.rental_available) {
      return res.status(404).json({ error: 'Product not available for rental' });
    }

    const rental = await rentalModel.createRental(
      req.session.userId,
      productId,
      product.seller_id,
      rentalLocation,
      startDate,
      endDate,
      product.rental_price
    );

    return res.status(201).json(rental);
  } catch (error) {
    console.error('Error creating rental:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user rentals
router.get('/rentals', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const rentals = await rentalModel.getRentalsByUserId(req.session.userId);
    return res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller rentals
router.get('/rentals/seller/all', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can access' });
    }

    const rentals = await rentalModel.getRentalsBySellerId(req.session.vendorId);
    return res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching rental requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rental by ID
router.get('/rentals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await rentalModel.getRentalById(id);

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    return res.status(200).json(rental);
  } catch (error) {
    console.error('Error fetching rental:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update verification status (admin/seller only)
router.put('/rentals/:id/verify', async (req, res) => {
  try {
    if (!req.session.userId || !['admin', 'seller'].includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const rental = await rentalModel.updateVerificationStatus(id, status);
    return res.status(200).json(rental);
  } catch (error) {
    console.error('Error updating verification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending verifications (admin only)
router.get('/rentals/pending/all', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can access' });
    }

    const rentals = await rentalModel.getPendingVerifications();
    return res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
