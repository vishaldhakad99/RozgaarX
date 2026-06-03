const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/bulk/hire - Bulk hire workers
router.post('/hire', protect, async (req, res) => {
  try {
    const { skill, city, workersCount, startDate, endDate, dailyBudget, jobDescription } = req.body;

    // Find available workers matching criteria
    const availableWorkers = await Worker.find({
      skills: { $in: [skill] },
      city: { $regex: city, $options: 'i' },
      isAvailableNow: true,
      dailyRate: { $lte: dailyBudget || 9999 }
    })
      .populate('user', 'name phone city')
      .limit(workersCount * 3); // Get extra to have options

    // Create bulk job posting
    const job = await Job.create({
      employer: req.user._id,
      title: `Bulk Hiring: ${workersCount} ${skill}s needed`,
      titleHindi: `Bulk Bharti: ${workersCount} ${skill} chahiye`,
      description: jobDescription,
      skillRequired: skill,
      city,
      jobType: 'bulk',
      workersNeeded: workersCount,
      startDate,
      endDate,
      budget: { min: dailyBudget * 0.8, max: dailyBudget, type: 'daily' },
      isBulkHiring: true,
      status: 'open'
    });

    res.json({
      success: true,
      message: `${availableWorkers.length} workers mile ${city} mein!`,
      job,
      availableWorkers: availableWorkers.slice(0, workersCount * 2),
      totalFound: availableWorkers.length,
      workersNeeded: workersCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/bulk/confirm - Confirm bulk bookings
router.post('/confirm', protect, async (req, res) => {
  try {
    const { jobId, workerIds, agreedRate, startDate, endDate } = req.body;

    const bookings = await Promise.all(
      workerIds.map(workerId =>
        Booking.create({
          job: jobId,
          employer: req.user._id,
          worker: workerId,
          agreedRate,
          startDate,
          endDate,
          status: 'confirmed',
          rateType: 'daily'
        })
      )
    );

    await Job.findByIdAndUpdate(jobId, {
      status: 'assigned',
      assignedWorkers: workerIds
    });

    res.json({
      success: true,
      message: `${bookings.length} workers confirm ho gaye! 🎉`,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/bulk/search - Quick bulk search
router.get('/search', async (req, res) => {
  try {
    const { skill, city, count = 10, maxRate } = req.query;
    const query = { isAvailableNow: true };
    if (skill) query.skills = { $in: [skill] };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (maxRate) query.dailyRate = { $lte: parseInt(maxRate) };

    const workers = await Worker.find(query)
      .populate('user', 'name phone city')
      .sort({ rating: -1 })
      .limit(parseInt(count));

    res.json({
      success: true,
      message: `${workers.length} ${skill || 'workers'} mile ${city || 'aapke shahar'} mein`,
      workers,
      total: workers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
