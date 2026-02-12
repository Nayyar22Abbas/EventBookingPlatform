const express = require('express');
const passport = require('../config/passport');
const { register, verifyEmail, login, refresh, logout, updateRole } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   GET /api/v1/auth/verify-email/:token
// @desc    Verify email using token
// @access  Public
router.get('/verify-email/:token', verifyEmail);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refresh);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', logout);

// @route   POST /api/v1/auth/update-role
// @desc    Update user role (after Google login)
// @access  Private
router.post('/update-role', authMiddleware, updateRole);

// @route   GET /api/v1/auth/google
// @desc    Initiate Google OAuth login
// @access  Public
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'customer';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role })
  })(req, res, next);
});

// @route   GET /api/v1/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  try {
    const user = req.user;

    // Generate tokens
    const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Check if user is new or needs role selection
    // Mark for role selection if user just created (isEmailVerified is false for Google users initially)
    const roleSelectionPending = !user.isEmailVerified; // First time Google users
    user.isEmailVerified = true;
    if (user.accountStatus === 'pending' && user.role === 'customer') {
      user.accountStatus = 'active';
    }
    await user.save();

    // Redirect to frontend with token and user info
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userParam = encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleSelectionPending
    }));
    const redirectUrl = `${frontendUrl}/auth/google-callback?token=${accessToken}&user=${userParam}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ message: 'Google login failed' });
  }
});

module.exports = router;