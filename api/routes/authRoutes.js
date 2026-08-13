import express from 'express';
import * as userModel from '../models/userModel.js';
import * as vendorModel from '../models/vendorModel.js';

const router = express.Router();

// Signup route
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, shopName, location } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Check if user exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const user = await userModel.createUser(email, password, role);

    // Create user profile
    await userModel.createUserProfile(user.id, firstName || '', lastName || '', '', null);

    // If seller role, create vendor profile
    if (role === 'seller') {
      if (!shopName || !location) {
        return res.status(400).json({ error: 'Shop name and location required for sellers' });
      }
      await vendorModel.createVendor(user.id, shopName, location, '');
    }

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userEmail = user.email;

    return res.status(201).json({
      message: 'Signup successful',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await userModel.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userEmail = user.email;

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout route
router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.status(200).json({
    userId: req.session.userId,
    userRole: req.session.userRole,
    userEmail: req.session.userEmail
  });
});

export default router;
