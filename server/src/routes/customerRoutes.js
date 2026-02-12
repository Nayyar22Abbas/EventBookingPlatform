const express = require('express');
const { searchHalls, getHallDetails, getHallTimeSlots, createBooking, calculatePrice, getBookings, cancelBooking, submitReview, getHallReviews, getMyReviews, deleteReview } = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// All customer routes require authentication and customer role
router.use(authMiddleware);
router.use(authorizeRoles('customer'));

// @route   GET /api/v1/customer/halls
// @desc    Search halls with filters
// @access  Private (Customer only)
router.get('/halls', searchHalls);

// @route   GET /api/v1/customer/halls/:id
// @desc    Get detailed hall information
// @access  Private (Customer only)
router.get('/halls/:id', getHallDetails);

// @route   GET /api/v1/customer/halls/:id/time-slots
// @desc    Get time slots for a hall on a specific date
// @access  Private (Customer only)
router.get('/halls/:id/time-slots', getHallTimeSlots);

// @route   POST /api/v1/customer/calculate-price
// @desc    Calculate booking price breakdown (for preview)
// @access  Private (Customer only)
router.post('/calculate-price', calculatePrice);

// @route   POST /api/v1/customer/bookings
// @desc    Create a new booking
// @access  Private (Customer only)
router.post('/bookings', createBooking);

// @route   GET /api/v1/customer/bookings
// @desc    Get customer's booking history
// @access  Private (Customer only)
router.get('/bookings', getBookings);

// @route   PATCH /api/v1/customer/bookings/:id/cancel
// @desc    Cancel a pending booking
// @access  Private (Customer only)
router.patch('/bookings/:id/cancel', cancelBooking);

// @route   POST /api/v1/customer/reviews
// @desc    Submit a review for a completed booking
// @access  Private (Customer only)
router.post('/reviews', submitReview);

// @route   GET /api/v1/customer/reviews
// @desc    Get customer's submitted reviews
// @access  Private (Customer only)
router.get('/reviews', getMyReviews);

// @route   DELETE /api/v1/customer/reviews/:id
// @desc    Delete a review
// @access  Private (Customer only)
router.delete('/reviews/:id', deleteReview);

// @route   GET /api/v1/customer/halls/:id/reviews
// @desc    Get reviews for a specific hall
// @access  Private (Customer only)
router.get('/halls/:id/reviews', getHallReviews);

module.exports = router;