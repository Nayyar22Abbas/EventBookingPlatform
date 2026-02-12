const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    enum: ['Mehndi', 'Baraat', 'Waleema', 'Birthday', 'Engagement', 'Reception', 'Other']
  },
  priceModifier: {
    type: Number,
    default: 0,
    min: -100,
    max: 1000 // Allow up to 1000% increase
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventTypeSchema.index({ hall: 1, name: 1 });

module.exports = mongoose.model('EventType', eventTypeSchema);