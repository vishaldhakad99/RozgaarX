const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// @POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ reviewer: req.user._id, ...req.body });
    // Update worker average rating
    const reviews = await Review.find({ worker: req.body.worker });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Worker.findByIdAndUpdate(req.body.worker, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: reviews.length
    });
    res.status(201).json({ success: true, message: 'Review de diya! Shukriya 🙏', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/reviews/worker/:workerId
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('reviewer', 'name city')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
