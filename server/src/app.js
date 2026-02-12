const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hallOwnerRoutes = require('./routes/hallOwnerRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Initialize Passport
require('./config/passport');

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(passport.initialize());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/hall-owner', hallOwnerRoutes);
app.use('/api/v1/customer', customerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API Running' });
});

module.exports = app;