const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(401).json({ message: 'Account is not active' });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    // Handle token verification errors
    if (error.message.includes('Invalid or expired access token')) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = authMiddleware;