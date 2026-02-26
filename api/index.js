require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../server/src/app');

// MongoDB connection state
let mongoConnected = false;

const connectMongo = async () => {
  if (mongoConnected) return;
  
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  mongoConnected = true;
};

// Vercel serverless handler - middleware
module.exports = async (req, res) => {
  try {
    await connectMongo();
    app(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
