import express from 'express';
import * as productModel from '../models/productModel.js';
import * as orderModel from '../models/orderModel.js';
import * as rentalModel from '../models/rentalModel.js';
import * as vendorModel from '../models/vendorModel.js';

const router = express.Router();

// Seller middleware
const isSeller = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'seller') {
    return res.status(403).json({ error: 'Seller access only' });
  }
  next();
};

// Get seller dashboard data
router.get('/seller/dashboard', isSeller, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorByUserId(req.session.userId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const products = await productModel.getProductsBySellerId(vendor.id);
    const orders = await orderModel.getOrdersBySellerId(vendor.id);
    const rentals = await rentalModel.getRentalsBySellerId(vendor.id);

    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRentals: rentals.length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0)
    };

    return res.status(200).json({
      vendor,
      stats,
      recentOrders: orders.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller inventory
router.get('/seller/inventory', isSeller, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorByUserId(req.session.userId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const products = await productModel.getProductsBySellerId(vendor.id);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller orders
router.get('/seller/orders', isSeller, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorByUserId(req.session.userId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const orders = await orderModel.getOrdersBySellerId(vendor.id);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller rental requests
router.get('/seller/rentals', isSeller, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorByUserId(req.session.userId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const rentals = await rentalModel.getRentalsBySellerId(vendor.id);
    return res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching rental requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add product to inventory
router.post('/seller/products', isSeller, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorByUserId(req.session.userId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const { name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await productModel.createProduct(
      vendor.id,
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
      rentalAvailable,
      rentalPrice
    );

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inventory
router.put('/seller/products/:id', isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice } = req.body;

    const product = await productModel.updateProduct(
      id,
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
      rentalAvailable,
      rentalPrice
    );

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/seller/orders/:id/status', isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await orderModel.updateOrderStatus(id, status);
    
    if (trackingNumber) {
      await orderModel.updateTrackingNumber(id, trackingNumber);
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify rental request
router.put('/seller/rentals/:id/verify', isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const rental = await rentalModel.updateVerificationStatus(id, status);
    return res.status(200).json(rental);
  } catch (error) {
    console.error('Error verifying rental:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
