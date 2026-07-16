import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, "users.json");

// Middleware
app.use(cors());
app.use(express.json());

// Helper: Load users from file
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: Save users to file
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// Helper: Generate simple token (in production, use JWT)
function generateToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString("base64");
}

// ============= ROUTES =============

// Sign Up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const users = await loadUsers();

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production: hash this with bcrypt!
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

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = await loadUsers();

    // Find user
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Email not found" });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
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

// Get current user (verify token)
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Decode token to get email
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const email = decoded.split(":")[0];

    const users = await loadUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Auth/me error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ AfnoGhar Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Users stored in: ${USERS_FILE}\n`);
});
