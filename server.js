import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./api/routes/authRoutes.js";
import healthRoutes from "./api/routes/health.js";
import productRoutes from "./api/routes/productRoutes.js";
import orderRoutes from "./api/routes/orderRoutes.js";
import rentalRoutes from "./api/routes/rentalRoutes.js";
import adminRoutes from "./api/routes/adminRoutes.js";
import sellerRoutes from "./api/routes/sellerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use("/api", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", rentalRoutes);
app.use("/api", adminRoutes);
app.use("/api", sellerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n✅ AfnoGhar Backend Server running on http://localhost:${PORT}`);
});
