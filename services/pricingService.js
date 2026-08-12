const DIMENSION_SURCHARGE_RATE = Number(process.env.CUSTOM_DIMENSION_SURCHARGE_RATE || 0.10);

function toNumber(value) {
  return value === null || value === undefined || value === "" ? null : Number(value);
}

async function priceConfiguredItem(client, input) {
  const productId = Number(input.product_id);
  const quantity = Number(input.quantity || 1);

  if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid product_id or quantity");
  }

  const productResult = await client.query(
    `SELECT id, name, base_price, stock_quantity, product_type, is_customizable, status
     FROM products WHERE id = $1 FOR SHARE`,
    [productId]
  );
  const product = productResult.rows[0];
  if (!product || product.status !== "active") throw new Error("Product is not available");

  const materialId = input.material_id ? Number(input.material_id) : null;
  const colorId = input.color_id ? Number(input.color_id) : null;

  let materialName = null;
  let colorName = null;
  let materialExtra = 0;
  let colorExtra = 0;

  if (materialId) {
    const materialResult = await client.query(
      `SELECT m.name, pm.additional_price
       FROM product_materials pm
       JOIN materials m ON m.id = pm.material_id
       WHERE pm.product_id = $1 AND pm.material_id = $2
         AND pm.is_available = TRUE AND m.is_active = TRUE`,
      [productId, materialId]
    );
    if (!materialResult.rows[0]) throw new Error("Selected material is not available for this product");
    materialName = materialResult.rows[0].name;
    materialExtra = Number(materialResult.rows[0].additional_price);
  }

  if (colorId) {
    const colorResult = await client.query(
      `SELECT c.name, pc.additional_price
       FROM product_colors pc
       JOIN colors c ON c.id = pc.color_id
       WHERE pc.product_id = $1 AND pc.color_id = $2
         AND pc.is_available = TRUE AND c.is_active = TRUE`,
      [productId, colorId]
    );
    if (!colorResult.rows[0]) throw new Error("Selected color is not available for this product");
    colorName = colorResult.rows[0].name;
    colorExtra = Number(colorResult.rows[0].additional_price);
  }

  const length = toNumber(input.custom_length);
  const width = toNumber(input.custom_width);
  const height = toNumber(input.custom_height);
  const hasAnyDimension = [length, width, height].some((v) => v !== null);

  if (hasAnyDimension) {
    if (!product.is_customizable) throw new Error("This product cannot be customized");
    if ([length, width, height].some((v) => !Number.isFinite(v) || v <= 0)) {
      throw new Error("Provide positive custom_length, custom_width and custom_height together");
    }
  }

  if ((materialId || colorId) && !product.is_customizable) {
    throw new Error("This product cannot be customized");
  }

  const basePrice = Number(product.base_price);
  const dimensionExtra = hasAnyDimension ? roundMoney(basePrice * DIMENSION_SURCHARGE_RATE) : 0;
  const customizationPrice = roundMoney(materialExtra + colorExtra + dimensionExtra);
  const itemTotal = roundMoney((basePrice + customizationPrice) * quantity);
  const specialInstructions = String(input.special_instructions || "").trim() || null;
  const customized = Boolean(materialId || colorId || hasAnyDimension || specialInstructions);

  return {
    productId,
    productName: product.name,
    quantity,
    unitPrice: basePrice,
    materialId,
    materialName,
    colorId,
    colorName,
    customLength: length,
    customWidth: width,
    customHeight: height,
    specialInstructions,
    customizationPrice,
    itemTotal,
    customized,
  };
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

module.exports = { priceConfiguredItem, roundMoney };
