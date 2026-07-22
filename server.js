/*
  DEPRECATED -- DO NOT RUN THIS FILE.
  ------------------------------------
  This was a throwaway mock backend (auth-only, backed by users.json)
  that duplicated the real Afno_Ghar-Backend/ project. It has been
  superseded: run the real backend instead (npm start / npm run dev
  in the Afno_Ghar-Backend repo, listening on the same port 5000 that
  VITE_API_BASE_URL already points at). This file, and the whole
  api/ folder next to it, are kept only so the git history isn't
  rewritten -- they are no longer wired into package.json's scripts.
  See BACKEND_SETUP.md for details.
*/

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
