import express from 'express';
import * as orderModel from '../models/orderModel.js';
import * as productModel from '../models/productModel.js';

const router = express.Router();

// Create order
router.post('/orders', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { productId, quantity, paymentMethod } = req.body;

    if (!productId || !quantity || !paymentMethod) {
      return res.status(400).json({ error: 'Product ID, quantity, and payment method are required' });
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const totalPrice = product.price * quantity;

    const order = await orderModel.createOrder(
      req.session.userId,
      productId,
      product.seller_id,
      quantity,
      totalPrice,
      paymentMethod
    );

    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user orders
router.get('/orders', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const orders = await orderModel.getOrdersByUserId(req.session.userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller orders
router.get('/orders/seller/all', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can access seller orders' });
    }

    const orders = await orderModel.getOrdersBySellerId(req.session.vendorId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.session.userId !== order.user_id && req.session.vendorId !== order.seller_id && req.session.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (seller/admin only)
router.put('/orders/:id/status', async (req, res) => {
  try {
    if (!req.session.userId || !['seller', 'admin'].includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Only sellers and admins can update order status' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.updateOrderStatus(id, status);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment status
router.put('/orders/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await orderModel.updatePaymentStatus(id, paymentStatus);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update tracking number
router.put('/orders/:id/tracking', async (req, res) => {
  try {
    if (!req.session.userId || !['seller', 'admin'].includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Only sellers and admins can update tracking' });
    }

    const { id } = req.params;
    const { trackingNumber } = req.body;

    const order = await orderModel.updateTrackingNumber(id, trackingNumber);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating tracking number:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
