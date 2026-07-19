const { pool } = require("../config/database");

// ===============================
// GET ALL PRODUCTS
// ===============================
const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
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
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ===============================
// GET PRODUCT BY ID
// ===============================
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const [product] = await pool.query(
      `
      SELECT
        p.*,
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      WHERE p.id = ?
    `,
      [id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: product[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      slug,
      description,
      base_price,
      stock_quantity,
      product_type,
      is_customizable,
      is_rentable,
      image_url,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO products
      (
        category_id,
        name,
        slug,
        description,
        base_price,
        stock_quantity,
        product_type,
        is_customizable,
        is_rentable,
        image_url
      )
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `,
      [
        category_id,
        name,
        slug,
        description,
        base_price,
        stock_quantity,
        product_type,
        is_customizable,
        is_rentable,
        image_url,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
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