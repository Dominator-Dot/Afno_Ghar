const express = require("express");
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", authenticateToken, requireRoles("admin"), productController.createProduct);

module.exports = router;
