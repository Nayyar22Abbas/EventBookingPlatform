const User = require('../models/User');
const { generateEmailVerificationToken } = require('../utils/emailToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['customer', 'hall_owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be customer or hall_owner' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      accountStatus: 'active',
      isApproved: true
    });

    await user.save();

    // Generate email verification token
    const verificationToken = generateEmailVerificationToken(user._id);

    // TODO: Send verification email (simulate for now)
    console.log(`Verification token for ${email}: ${verificationToken}`);

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      verificationToken // TEMP: Remove in production
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

/**
 * Verify email using token
 * @route GET /api/v1/auth/verify-email/:token
 * @access Public
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Check token type
    if (decoded.type !== 'email_verification') {
      return res.status(400).json({ message: 'Invalid token type' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: 'Email already verified' });
    }

    // Update user based on role
    user.isEmailVerified = true;
    if (user.role === 'customer') {
      user.accountStatus = 'active';
    }
    // hall_owner stays 'pending' until admin approval

    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Email verification failed. Please try again.' });
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if Google user trying to login with password
    if (user.googleId && !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return res.status(401).json({ message: 'Account is suspended' });
    }

    // Check hall owner approval
    if (user.role === 'hall_owner' && !user.isApproved) {
      return res.status(401).json({ message: 'Account pending admin approval' });
    }

    // Generate tokens
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

    // Return response
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if stored refresh token matches
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new refresh token in httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return new access token
    res.status(200).json({
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Find user and remove refresh token from DB
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

/**
 * Update user role (after Google login)
 * @route POST /api/v1/auth/update-role
 * @access Private (Authenticated users only)
 */
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Validate role
    if (!['customer', 'hall_owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be customer or hall_owner' });
    }

    // Find user and update role
    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
        accountStatus: 'active',
        isApproved: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  updateRole
};