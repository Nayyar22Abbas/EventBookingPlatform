const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pricePerPlate: {
    type: Number,
    required: true,
    min: 0
  },
  items: [{
    type: String,
    required: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient queries
menuSchema.index({ hall: 1 });

module.exports = mongoose.model('Menu', menuSchema);