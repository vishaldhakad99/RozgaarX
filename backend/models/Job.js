const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  titleHindi: { type: String }, // Hindi title
  description: { type: String },
  descriptionHindi: { type: String },
  skillRequired: {
    type: String,
    enum: ['plumber', 'electrician', 'housekeeping', 'carpenter', 'driver', 'cook', 'painter', 'gardener', 'security', 'other'],
    required: true
  },
  jobType: { type: String, enum: ['one-time', 'daily', 'weekly', 'monthly', 'bulk'], default: 'one-time' },
  city: { type: String, required: true },
  address: { type: String },
  budget: {
    min: { type: Number },
    max: { type: Number },
    type: { type: String, enum: ['hourly', 'daily', 'fixed'], default: 'daily' }
  },
  workersNeeded: { type: Number, default: 1 }, // for bulk hiring
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: String }, // "2 ghante", "1 din", etc.
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  applicants: [{
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  isBulkHiring: { type: Boolean, default: false },
  urgency: { type: String, enum: ['normal', 'urgent', 'very-urgent'], default: 'normal' },
  createdAt: { type: Date, default: Date.now }
});

jobSchema.index({ city: 1, skillRequired: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
