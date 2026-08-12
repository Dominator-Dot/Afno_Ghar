const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const TOKEN_EXPIRATION = "1h";

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
}

async function signup(req, res) {
  try {
    const { full_name, name, email, phone, password } = req.body;
    const fullName = String(full_name || name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();

    if (!fullName || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "full_name, email, phone and password are required",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existingUser = await UserModel.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = await UserModel.createUser({
      fullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      token: signToken(newUser),
      user: newUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email or phone is already registered" });
    }
    return nextOr500(error, res, "Failed to create user");
  }
}

async function login(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findByEmail(email);
    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      token: signToken(user),
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return nextOr500(error, res, "Failed to log in");
  }
}

async function me(req, res) {
  return res.json({ success: true, user: req.user });
}

function nextOr500(error, res, message) {
  console.error(error);
  return res.status(500).json({ success: false, message });
}

module.exports = { signup, login, me };
