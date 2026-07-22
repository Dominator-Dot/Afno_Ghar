import express from "express";
import { loadUsers, saveUsers, generateToken, decodeToken } from "../lib/users.js";

const router = express.Router();

router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const users = await loadUsers();

    if (users.find((user) => user.email === email)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    const token = generateToken(email);

    res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = await loadUsers();
    const user = users.find((item) => item.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(email);

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", async (req, res) => {
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

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Auth/me error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
