const express = require('express');
const {
  getDashboardStats,
  uploadImages,
  createHall,
  updateHall,
  getHalls,
  deleteHall,
  createMenu,
  updateMenu,
  getMenus,
  deleteMenu,
  createEventType,
  updateEventType,
  getEventTypes,
  deleteEventType,
  createTimeSlot,
  updateTimeSlot,
  getTimeSlots,
  deleteTimeSlot,
  getBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  createAddOn,
  getAddOns,
  updateAddOn,
  deleteAddOn
} = require('../controllers/hallOwnerController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// All hall owner routes require authentication and hall_owner role
router.use(authMiddleware);
router.use(authorizeRoles('hall_owner'));

// DASHBOARD STATS ROUTE
// @route   GET /api/v1/hall-owner/dashboard-stats
// @desc    Get dashboard statistics for hall owner
// @access  Private (Hall Owner only)
router.get('/dashboard-stats', getDashboardStats);

// IMAGE UPLOAD ROUTE
// @route   POST /api/v1/hall-owner/upload-images
// @desc    Upload hall images
// @access  Private (Hall Owner only)
router.post('/upload-images', upload.array('images', 10), uploadImages);

// HALL ROUTES
// @route   POST /api/v1/hall-owner/halls
// @desc    Create a new hall
// @access  Private (Hall Owner only)
router.post('/halls', createHall);

// @route   PUT /api/v1/hall-owner/halls/:id
// @desc    Update hall
// @access  Private (Hall Owner only)
router.put('/halls/:id', updateHall);

// @route   GET /api/v1/hall-owner/halls
// @desc    Get all halls owned by current user
// @access  Private (Hall Owner only)
router.get('/halls', getHalls);

// @route   DELETE /api/v1/hall-owner/halls/:id
// @desc    Delete hall
// @access  Private (Hall Owner only)
router.delete('/halls/:id', deleteHall);

// MENU ROUTES
// @route   POST /api/v1/hall-owner/menus
// @desc    Create a new menu
// @access  Private (Hall Owner only)
router.post('/menus', createMenu);

// @route   PUT /api/v1/hall-owner/menus/:id
// @desc    Update menu
// @access  Private (Hall Owner only)
router.put('/menus/:id', updateMenu);

// @route   GET /api/v1/hall-owner/menus
// @desc    Get all menus for owner's halls
// @access  Private (Hall Owner only)
router.get('/menus', getMenus);

// @route   DELETE /api/v1/hall-owner/menus/:id
// @desc    Delete menu
// @access  Private (Hall Owner only)
router.delete('/menus/:id', deleteMenu);

// EVENT TYPE ROUTES
// @route   POST /api/v1/hall-owner/event-types
// @desc    Create a new event type
// @access  Private (Hall Owner only)
router.post('/event-types', createEventType);

// @route   PUT /api/v1/hall-owner/event-types/:id
// @desc    Update event type
// @access  Private (Hall Owner only)
router.put('/event-types/:id', updateEventType);

// @route   GET /api/v1/hall-owner/event-types
// @desc    Get all event types for owner's halls
// @access  Private (Hall Owner only)
router.get('/event-types', getEventTypes);

// @route   DELETE /api/v1/hall-owner/event-types/:id
// @desc    Delete event type
// @access  Private (Hall Owner only)
router.delete('/event-types/:id', deleteEventType);

// TIME SLOT ROUTES
// @route   POST /api/v1/hall-owner/time-slots
// @desc    Create a new time slot
// @access  Private (Hall Owner only)
router.post('/time-slots', createTimeSlot);

// @route   PUT /api/v1/hall-owner/time-slots/:id
// @desc    Update time slot
// @access  Private (Hall Owner only)
router.put('/time-slots/:id', updateTimeSlot);

// @route   GET /api/v1/hall-owner/time-slots
// @desc    Get all time slots for owner's halls
// @access  Private (Hall Owner only)
router.get('/time-slots', getTimeSlots);

// @route   DELETE /api/v1/hall-owner/time-slots/:id
// @desc    Delete time slot
// @access  Private (Hall Owner only)
router.delete('/time-slots/:id', deleteTimeSlot);

// BOOKING MANAGEMENT ROUTES
// @route   GET /api/v1/hall-owner/bookings
// @desc    Get all bookings for owner's halls
// @access  Private (Hall Owner only)
router.get('/bookings', getBookings);

// @route   PATCH /api/v1/hall-owner/bookings/:id/accept
// @desc    Accept booking
// @access  Private (Hall Owner only)
router.patch('/bookings/:id/accept', acceptBooking);

// @route   PATCH /api/v1/hall-owner/bookings/:id/reject
// @desc    Reject booking
// @access  Private (Hall Owner only)
router.patch('/bookings/:id/reject', rejectBooking);

// @route   PATCH /api/v1/hall-owner/bookings/:id/complete
// @desc    Mark booking as completed
// @access  Private (Hall Owner only)
router.patch('/bookings/:id/complete', completeBooking);

// ADD-ON ROUTES
// @route   POST /api/v1/hall-owner/add-ons
// @desc    Create a new add-on
// @access  Private (Hall Owner only)
router.post('/add-ons', createAddOn);

// @route   GET /api/v1/hall-owner/add-ons
// @desc    Get all add-ons for owner
// @access  Private (Hall Owner only)
router.get('/add-ons', getAddOns);

// @route   PUT /api/v1/hall-owner/add-ons/:id
// @desc    Update add-on
// @access  Private (Hall Owner only)
router.put('/add-ons/:id', updateAddOn);

// @route   DELETE /api/v1/hall-owner/add-ons/:id
// @desc    Delete add-on
// @access  Private (Hall Owner only)
router.delete('/add-ons/:id', deleteAddOn);

module.exports = router;