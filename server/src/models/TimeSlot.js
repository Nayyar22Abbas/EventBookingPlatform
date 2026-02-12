const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time must be in HH:MM format'
    }
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'blocked'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
timeSlotSchema.index({ hall: 1, date: 1 });

// Pre-save validation to ensure end time is after start time
timeSlotSchema.pre('save', async function() {
  if (this.startTime >= this.endTime) {
    throw new Error('End time must be after start time');
  }
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);