const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Job = require('../models/Job');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// @POST /api/bookings - Create booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ employer: req.user._id, ...req.body });
    // Update job status
    await Job.findByIdAndUpdate(req.body.job, { status: 'assigned' });
    res.status(201).json({ success: true, message: 'Booking confirm ho gayi! ✅', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/bookings/my - Get my bookings
router.get('/my', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ user: req.user._id });
      if (worker) query.worker = worker._id;
    } else {
      query.employer = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('job', 'title skillRequired city startDate')
      .populate('worker')
      .populate('employer', 'name phone city companyName')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, cancelReason: req.body.cancelReason },
      { new: true }
    );
    if (req.body.status === 'completed') {
      await Worker.findByIdAndUpdate(booking.worker, { $inc: { completedJobs: 1 } });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
