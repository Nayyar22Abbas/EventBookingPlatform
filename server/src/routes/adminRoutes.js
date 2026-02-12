const express = require('express');
const { getPendingHallOwners, approveHallOwner, rejectHallOwner, getEnquiries, respondToEnquiry, closeEnquiry, getAllHalls, deleteHall } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(authorizeRoles('admin'));

// @route   GET /api/v1/admin/pending-hall-owners
// @desc    Get all pending hall owner approvals
// @access  Private (Admin only)
router.get('/pending-hall-owners', getPendingHallOwners);

// @route   PATCH /api/v1/admin/approve-hall-owner/:id
// @desc    Approve hall owner account
// @access  Private (Admin only)
router.patch('/approve-hall-owner/:id', approveHallOwner);

// @route   PATCH /api/v1/admin/reject-hall-owner/:id
// @desc    Reject hall owner account
// @access  Private (Admin only)
router.patch('/reject-hall-owner/:id', rejectHallOwner);

// ENQUIRY MANAGEMENT ROUTES
// @route   GET /api/v1/admin/enquiries
// @desc    Get all enquiries with optional status filter
// @access  Private (Admin only)
router.get('/enquiries', getEnquiries);

// @route   PATCH /api/v1/admin/enquiries/:id/respond
// @desc    Respond to an enquiry
// @access  Private (Admin only)
router.patch('/enquiries/:id/respond', respondToEnquiry);

// @route   PATCH /api/v1/admin/enquiries/:id/close
// @desc    Close an enquiry
// @access  Private (Admin only)
router.patch('/enquiries/:id/close', closeEnquiry);

// HALL MODERATION ROUTES
// @route   GET /api/v1/admin/halls
// @desc    Get all halls for moderation
// @access  Private (Admin only)
router.get('/halls', getAllHalls);

// @route   DELETE /api/v1/admin/halls/:id
// @desc    Delete a hall (admin moderation)
// @access  Private (Admin only)
router.delete('/halls/:id', deleteHall);

module.exports = router;