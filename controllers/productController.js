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

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      slug,
      description = null,
      base_price,
      stock_quantity = 0,
      product_type = "ready_made",
      is_customizable = false,
      is_rentable = false,
      image_url = null,
    } = req.body;

    if (!category_id || !name || !slug || base_price === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "category_id, name, slug and base_price are required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO products (
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      [
        category_id,
        name.trim(),
        slug.trim(),
        description,
        base_price,
        stock_quantity,
        product_type,
        is_customizable,
        is_rentable,
        image_url,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create product:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "The selected category does not exist",
      });
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