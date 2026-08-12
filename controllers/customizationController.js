const { pool } = require("../config/database");

// GET /api/customization/products/:id/options
const getCustomizationOptions = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Get product
    const productResult = await pool.query(
      `
      SELECT
        id,
        name,
        description,
        base_price,
        stock_quantity,
        product_type,
        is_customizable,
        status
      FROM products
      WHERE id = $1
        AND status IN ('available', 'active')
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productResult.rows[0];

    if (!product.is_customizable) {
      return res.status(400).json({
        success: false,
        message: "This product is not customizable",
      });
    }

    // Get available materials
    const materialsResult = await pool.query(
      `
      SELECT
        m.id,
        m.name,
        m.description,
        pm.additional_price
      FROM product_materials pm
      INNER JOIN materials m
        ON pm.material_id = m.id
      WHERE pm.product_id = $1
        AND pm.is_available = TRUE
        AND m.is_active = TRUE
      ORDER BY m.name
      `,
      [productId]
    );

    // Get available colors
    const colorsResult = await pool.query(
      `
      SELECT
        c.id,
        c.name,
        c.hex_code,
        pc.additional_price
      FROM product_colors pc
      INNER JOIN colors c
        ON pc.color_id = c.id
      WHERE pc.product_id = $1
        AND pc.is_available = TRUE
        AND c.is_active = TRUE
      ORDER BY c.name
      `,
      [productId]
    );

    return res.status(200).json({
      success: true,

      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        stock_quantity: product.stock_quantity,
        product_type: product.product_type,
        is_customizable: product.is_customizable,
      },

      materials: materialsResult.rows,
      colors: colorsResult.rows,
    });
  } catch (error) {
    console.error("Customization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load customization options",
    });
  }
};


// POST /api/customization/calculate-price
const calculateCustomizationPrice = async (req, res) => {
  try {
    const {
      product_id,
      material_id,
      color_id,
      custom_length,
      custom_width,
      custom_height,
    } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required",
      });
    }

    // Product base price
    const productResult = await pool.query(
  `
  SELECT
    id,
    name,
    description,
    base_price,
    stock_quantity,
    product_type,
    is_customizable,
    status
  FROM products
  WHERE id = $1
  `,
  [productId]
);

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productResult.rows[0];

    if (!product.is_customizable) {
      return res.status(400).json({
        success: false,
        message: "Product cannot be customized",
      });
    }

    let materialPrice = 0;
    let colorPrice = 0;

    // Check selected material
    if (material_id) {
      const materialResult = await pool.query(
        `
        SELECT
          m.id,
          m.name,
          pm.additional_price
        FROM product_materials pm
        INNER JOIN materials m
          ON pm.material_id = m.id
        WHERE pm.product_id = $1
          AND pm.material_id = $2
          AND pm.is_available = TRUE
        `,
        [product_id, material_id]
      );

      if (materialResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Selected material is not available for this product",
        });
      }

      materialPrice = Number(
        materialResult.rows[0].additional_price
      );
    }

    // Check selected color
    if (color_id) {
      const colorResult = await pool.query(
        `
        SELECT
          c.id,
          c.name,
          pc.additional_price
        FROM product_colors pc
        INNER JOIN colors c
          ON pc.color_id = c.id
        WHERE pc.product_id = $1
          AND pc.color_id = $2
          AND pc.is_available = TRUE
        `,
        [product_id, color_id]
      );

      if (colorResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Selected color is not available for this product",
        });
      }

      colorPrice = Number(
        colorResult.rows[0].additional_price
      );
    }

    const basePrice = Number(product.base_price);

    // Optional custom-size charge
    let dimensionCharge = 0;

    if (
      custom_length ||
      custom_width ||
      custom_height
    ) {
      // Demo rule: 10% extra for custom dimensions
      dimensionCharge = basePrice * 0.10;
    }

    const customizationPrice =
      materialPrice +
      colorPrice +
      dimensionCharge;

    const finalPrice =
      basePrice +
      customizationPrice;

    return res.status(200).json({
      success: true,

      pricing: {
        product_id: product.id,
        product_name: product.name,

        base_price: basePrice,
        material_price: materialPrice,
        color_price: colorPrice,
        dimension_charge: dimensionCharge,

        customization_price: customizationPrice,

        final_price: finalPrice,
      },
    });
  } catch (error) {
    console.error(
      "Calculate customization price error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate customization price",
    });
  }
};


module.exports = {
  getCustomizationOptions,
  calculateCustomizationPrice,
};