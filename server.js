import express from "express";
import cors from "cors";
import authRoutes from "./api/routes/auth.js";
import healthRoutes from "./api/routes/health.js";
import rentalRoutes from "./api/routes/rentals.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", rentalRoutes);

app.listen(PORT, () => {
  console.log(`\n✅ AfnoGhar Backend Server running on http://localhost:${PORT}`);
});
