const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  agreedRate: { type: Number }, // final agreed rate
  rateType: { type: String, enum: ['hourly', 'daily', 'fixed'] },
  totalAmount: { type: Number },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  notes: { type: String },
  cancelReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
