const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

/**
 * Generate email verification token
 * @param {string} userId - User ID to encode
 * @returns {string} JWT verification token (expires in 1 day)
 */
const generateEmailVerificationToken = (userId) => {
  const payload = {
    userId,
    type: 'email_verification'
  };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1d' });
};

module.exports = {
  generateEmailVerificationToken
};