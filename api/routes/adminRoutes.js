import express from 'express';
import * as userModel from '../models/userModel.js';
import * as vendorModel from '../models/vendorModel.js';
import * as orderModel from '../models/orderModel.js';
import * as rentalModel from '../models/rentalModel.js';
import pool from '../db/database.js';

const router = express.Router();

// Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

// Get all users (admin only)
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all vendors (admin only)
router.get('/admin/vendors', isAdmin, async (req, res) => {
  try {
    const vendors = await vendorModel.getAllVendors();
    return res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor details (admin only)
router.get('/admin/vendors/:id', isAdmin, async (req, res) => {
  try {
    const vendor = await vendorModel.getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    return res.status(200).json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify vendor (admin only)
router.put('/admin/vendors/:id/verify', isAdmin, async (req, res) => {
  try {
    const vendor = await vendorModel.updateVendorVerification(req.params.id, true);
    return res.status(200).json(vendor);
  } catch (error) {
    console.error('Error verifying vendor:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (admin only)
router.get('/admin/orders', isAdmin, async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales by vendor (admin only)
router.get('/admin/vendors/:id/sales', isAdmin, async (req, res) => {
  try {
    const orders = await orderModel.getOrdersBySellerId(req.params.id);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get purchases by buyer (admin only)
router.get('/admin/users/:id/purchases', isAdmin, async (req, res) => {
  try {
    const orders = await orderModel.getOrdersByUserId(req.params.id);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard stats (admin only)
router.get('/admin/dashboard/stats', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
        (SELECT COUNT(*) FROM users WHERE role = 'seller') as total_sellers,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT SUM(total_price) FROM orders) as total_revenue,
        (SELECT COUNT(*) FROM rentals) as total_rentals
    `);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
