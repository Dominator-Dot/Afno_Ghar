require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  testDatabaseConnection,
} = require("./config/database");

const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      status: "ok",
      message: "Afno Ghar API is running.",
      database: process.env.DB_NAME,
    });
  } catch (error) {
    return next(error);
  }
});

app.use("/api/products", productRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
  });
});

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(
        `Afno Ghar server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to start server.");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();