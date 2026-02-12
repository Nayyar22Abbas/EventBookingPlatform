const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema(
  {
    hallOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide an add-on name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide the add-on price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      enum: ['Entertainment', 'Catering', 'Photography', 'Decoration', 'Lighting', 'Transportation', 'Staff', 'Other'],
      default: 'Other'
    },
    image: {
      type: String,
      default: null
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for faster queries by hall owner
addOnSchema.index({ hallOwner: 1 });

module.exports = mongoose.model('AddOn', addOnSchema);
