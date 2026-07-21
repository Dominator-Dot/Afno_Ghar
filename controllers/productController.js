const { pool } = require("../config/database");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.base_price,
        p.stock_quantity,
        p.product_type,
        p.is_customizable,
        p.is_rentable,
        p.image_url,
        p.status,
        c.name AS category
      FROM products AS p
      INNER JOIN categories AS c
        ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product ID must be a positive integer",
      });
    }

    const result = await pool.query(
      `
        SELECT
          p.*,
          c.name AS category
        FROM products AS p
        INNER JOIN categories AS c
          ON p.category_id = c.id
        WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

async function createProduct(req, res) {
  const { name, description, details, price, category, material, tag, stock, image_url, images } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      category_id,
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
  } catch (error) {
    console.error("Failed to create product:", error);

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

    if (error.code === "23514" || error.code === "22P02") {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};
