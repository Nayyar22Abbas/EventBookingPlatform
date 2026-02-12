const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Required only if not a Google user
    }
  },
  role: {
    type: String,
    enum: ['admin', 'hall_owner', 'customer'],
    default: 'customer'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'pending'
  },
  googleId: {
    type: String,
    sparse: true // Allows multiple null values but unique non-null
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save hook to hash password
userSchema.pre('save', async function() {
  // Only hash password if it exists and has been modified
  if (!this.password || !this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if hall owner is approved
userSchema.methods.isHallOwnerApproved = function() {
  return this.role === 'hall_owner' && this.isApproved === true;
};

// Modify toJSON to exclude sensitive fields
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);