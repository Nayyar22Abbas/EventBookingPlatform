const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Get role from state
    const state = JSON.parse(req.query.state || '{}');
    const role = state.role || 'customer';

    // Check if user exists
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // Existing user - login
      return done(null, user);
    }

    // New user - signup
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      role,
      isEmailVerified: true,
      accountStatus: 'active',
      isApproved: true
    });

    await user.save();
    return done(null, user);

  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;