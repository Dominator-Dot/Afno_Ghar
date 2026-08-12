const express = require("express");
const controller = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/khalti/initiate", authenticateToken, controller.initiateKhalti);
router.get("/khalti/callback", controller.khaltiCallback);

router.post("/esewa/initiate", authenticateToken, controller.initiateEsewa);
router.get("/esewa/success", controller.esewaSuccess);
router.get("/esewa/failure", controller.esewaFailure);

router.get("/order/:orderId", authenticateToken, controller.getOrderPayments);

module.exports = router;
