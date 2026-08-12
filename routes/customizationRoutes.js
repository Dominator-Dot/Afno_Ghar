const express = require("express");

const {
  getCustomizationOptions,
  calculateCustomizationPrice,
} = require("../controllers/customizationController");

const router = express.Router();


// Get materials and colors for one product
router.get(
  "/products/:id/options",
  getCustomizationOptions
);


// Calculate customized furniture price
router.post(
  "/calculate-price",
  calculateCustomizationPrice
);


module.exports = router;