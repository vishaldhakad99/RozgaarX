const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role, city, state, language, companyName, companySize } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Yeh phone number already registered hai' });
    }

    const user = await User.create({
      name, phone, email, password, role: role || 'employer',
      city, state, language: language || 'hi', companyName, companySize
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Swagat hai KaamWala mein 🎉',
      token,
      user: {
        _id: user._id, name: user.name, phone: user.phone,
        role: user.role, city: user.city, language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Phone ya password galat hai' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id, name: user.name, phone: user.phone,
        role: user.role, city: user.city, language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await Worker.findOne({ user: user._id });
    }
    res.json({ success: true, user, workerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
