import express from "express";
import { loadRentals, saveRentals } from "../lib/rentals.js";
import { loadUsers, decodeToken } from "../lib/users.js";

const router = express.Router();

router.post("/rentals", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const email = decodeToken(token);
    if (!email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const users = await loadUsers();
    const user = users.find((item) => item.email === email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { productId, productName, userName, userPhone, citizenNumber, address } = req.body;

    if (!productId || !productName || !userName || !userPhone || !citizenNumber || !address) {
      return res.status(400).json({ error: "Missing required rental fields" });
    }

    const rentals = await loadRentals();
    const newRental = {
      id: Date.now().toString(),
      productId,
      productName,
      userName,
      userPhone,
      citizenNumber,
      address,
      userEmail: user.email,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    rentals.push(newRental);
    await saveRentals(rentals);

    res.status(201).json({ rental: newRental });
  } catch (error) {
    console.error("Rental error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
