const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  additionalCharges: [{
    name: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  supportedFunctions: [{
    type: String,
    enum: ['Mehndi', 'Baraat', 'Waleema', 'Birthday', 'Engagement', 'Reception', 'Other'],
    default: 'Other'
  }]
}, {
  timestamps: true
});

// Index for efficient queries
hallSchema.index({ owner: 1, city: 1 });
hallSchema.index({ city: 1, capacity: 1 });

module.exports = mongoose.model('Hall', hallSchema);