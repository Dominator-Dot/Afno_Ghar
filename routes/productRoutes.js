const express = require("express");

const productController = require(
  "../controllers/productController"
);

const router = express.Router();

// GET /api/products
router.get("/", productController.getAllProducts);

// GET /api/products/:id
router.get("/:id", productController.getProductById);

// POST /api/products
router.post("/", productController.createProduct);

module.exports = router;