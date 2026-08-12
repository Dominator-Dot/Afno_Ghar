const express = require("express");
const controller = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.use(authenticateToken);

router.post("/", requireRoles("customer", "admin"), controller.createOrder);
router.get("/my", controller.getMyOrders);
router.get("/:orderNumber", controller.getOrderByNumber);
router.patch("/:id/status", requireRoles("admin", "worker", "delivery_staff"), controller.updateOrderStatus);

module.exports = router;
