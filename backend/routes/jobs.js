const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// @GET /api/jobs - Get all jobs (for workers)
router.get('/', async (req, res) => {
  try {
    const { skill, city, jobType, urgency, page = 1, limit = 10 } = req.query;
    const query = { status: 'open' };
    if (skill) query.skillRequired = skill;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (urgency) query.urgency = urgency;

    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .populate('employer', 'name phone city companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);
    res.json({ success: true, jobs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/jobs - Post a job
router.post('/', protect, async (req, res) => {
  try {
    const job = await Job.create({ employer: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Kaam post ho gaya! 🎉', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/jobs/my - Employer's jobs
router.get('/my', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate('assignedWorkers')
      .sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name phone city companyName')
      .populate('applicants.worker');
    if (!job) return res.status(404).json({ success: false, message: 'Kaam nahi mila' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/jobs/:id/apply - Worker applies for job
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Kaam nahi mila' });

    const alreadyApplied = job.applicants.find(a => a.worker.toString() === req.body.workerId);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Aap pehle se apply kar chuke hain' });
    }

    job.applicants.push({ worker: req.body.workerId });
    await job.save();
    res.json({ success: true, message: 'Apply ho gaya! Employer reply karega 👍' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/jobs/:id/status - Update job status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
