const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/workers - Search workers
router.get('/', async (req, res) => {
  try {
    const { skill, city, availability, minRate, maxRate, rating, page = 1, limit = 12 } = req.query;
    const query = { isAvailableNow: true };

    if (skill) query.skills = { $in: [skill] };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (availability) query.availability = availability;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (minRate || maxRate) {
      query.dailyRate = {};
      if (minRate) query.dailyRate.$gte = parseInt(minRate);
      if (maxRate) query.dailyRate.$lte = parseInt(maxRate);
    }

    const skip = (page - 1) * limit;
    const workers = await Worker.find(query)
      .populate('user', 'name phone city profilePhoto')
      .sort({ rating: -1, completedJobs: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(query);

    res.json({
      success: true,
      workers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/workers/:id - Worker detail
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name phone city state address profilePhoto createdAt');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker nahi mila' });
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/workers/profile - Create worker profile
router.post('/profile', protect, async (req, res) => {
  try {
    const existing = await Worker.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Profile already exist karti hai' });

    const worker = await Worker.create({ user: req.user._id, ...req.body });
    await User.findByIdAndUpdate(req.user._id, { role: 'worker' });
    res.status(201).json({ success: true, message: 'Worker profile bana di! 🎉', worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/workers/profile - Update worker profile
router.put('/profile', protect, async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!worker) return res.status(404).json({ success: false, message: 'Profile nahi mili' });
    res.json({ success: true, message: 'Profile update ho gayi!', worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/workers/availability - Toggle availability
router.put('/toggle-availability', protect, async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    worker.isAvailableNow = !worker.isAvailableNow;
    await worker.save();
    res.json({
      success: true,
      message: worker.isAvailableNow ? 'Aap available hain ✅' : 'Aap unavailable hain',
      isAvailableNow: worker.isAvailableNow
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
