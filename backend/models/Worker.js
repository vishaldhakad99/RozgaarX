const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{
    type: String,
    enum: ['plumber', 'electrician', 'housekeeping', 'carpenter', 'driver', 'cook', 'painter', 'gardener', 'security', 'other']
  }],
  primarySkill: {
    type: String,
    enum: ['plumber', 'electrician', 'housekeeping', 'carpenter', 'driver', 'cook', 'painter', 'gardener', 'security', 'other']
  },
  experience: { type: Number, default: 0 }, // in years
  dailyRate: { type: Number }, // per day rate in INR
  hourlyRate: { type: Number }, // per hour rate in INR
  monthlyRate: { type: Number }, // for full-time
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'on-demand'],
    default: 'on-demand'
  },
  city: { type: String, required: true },
  state: { type: String },
  pincode: { type: String },
  workRadius: { type: Number, default: 10 }, // km radius willing to work
  bio: { type: String }, // short description in Hindi/English
  languages: [{ type: String }],
  documents: {
    aadhar: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  isAvailableNow: { type: Boolean, default: true },
  portfolio: [{ type: String }], // image URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

workerSchema.index({ city: 1, skills: 1 });
workerSchema.index({ primarySkill: 1, isAvailableNow: 1 });

module.exports = mongoose.model('Worker', workerSchema);
