const ProductModel = require('../models/productModel');

async function home(req, res) {
  try {
    const products = await ProductModel.findAll();
    res.render('home', { products, error: null });
  } catch (error) {
    console.error('Render home page error:', error);
    res.render('home', {
      products: [],
      error: 'Unable to load products. Ensure the database is configured and initialized.',
    });
  }
}

module.exports = {
  home,
};
