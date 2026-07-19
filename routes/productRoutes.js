const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

// Get all products
router.get("/", productController.getAllProducts);

// Get one product
router.get("/:id", productController.getProductById);

// Add new product
router.post("/", productController.createProduct);

module.exports = router;