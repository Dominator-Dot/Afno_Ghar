const express = require("express");
const controller = require("../controllers/trackingController");
const authenticateToken = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.use(authenticateToken);

router.get("/orders/:orderNumber", controller.getOrderTracking);
router.patch("/:trackingId", requireRoles("admin", "worker"), controller.updateTrackingStage);

module.exports = router;
