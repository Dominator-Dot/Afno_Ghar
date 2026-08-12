const customizationRoutes = require(
  "./routes/customizationRoutes"
);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { testDatabaseConnection } = require("./config/database");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api/customization",
  customizationRoutes
);
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use(
  "/api/customization",
  customizationRoutes
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customization", customizationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", message: "Afno Ghar API is running." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

async function startServer() {
  try {
    await testDatabaseConnection();
    app.listen(PORT, () => console.log(`Afno Ghar server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
