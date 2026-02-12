const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType'
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  functionType: {
    type: String,
    enum: ['Mehndi', 'Baraat', 'Waleema', 'Birthday', 'Engagement', 'Reception', 'Other'],
    required: true,
    default: 'Other'
  },
  guestCount: {
    type: Number,
    min: 1,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  basePrice: {
    type: Number,
    min: 0
  },
  menuPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  functionTypeCharge: {
    type: Number,
    min: 0,
    default: 0
  },
  additionalCharges: [{
    name: String,
    price: Number
  }],
  totalPrice: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ hall: 1, status: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ timeSlot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);