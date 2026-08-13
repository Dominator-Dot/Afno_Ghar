import express from 'express';
import * as productModel from '../models/productModel.js';

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get products by category
router.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productModel.getProductsByCategory(category);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (seller only)
router.post('/products', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' });
    }

    const { name, description, price, imageUrl, category, stock, rentalAvailable, rentalPrice } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await productModel.createProduct(
      req.session.vendorId,
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

// Update product (seller only)
router.put('/products/:id', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can update products' });
    }

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

// Delete product (seller only)
router.delete('/products/:id', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can delete products' });
    }

    const { id } = req.params;
    const product = await productModel.deleteProduct(id);

    return res.status(200).json({ message: 'Product deleted', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
