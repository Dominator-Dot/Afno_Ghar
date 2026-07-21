const ProductModel = require('../models/productModel');

async function listProducts(req, res) {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

async function getProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

async function createProduct(req, res) {
  const { name, description, details, price, category, material, tag, stock, image_url, images } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  try {
    const product = await ProductModel.createProduct({
      name,
      description,
      details,
      price,
      category,
      material,
      tag,
      stock: stock || 0,
      image_url,
      images,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  const { name, description, details, price, category, material, tag, stock, image_url, images } = req.body;

  try {
    const updated = await ProductModel.updateProduct(req.params.id, {
      name,
      description,
      details,
      price,
      category,
      material,
      tag,
      stock,
      image_url,
      images,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await ProductModel.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: deleted.id });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
