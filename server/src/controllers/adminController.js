const User = require('../models/User');
const Hall = require('../models/Hall');
const Menu = require('../models/Menu');
const EventType = require('../models/EventType');
const TimeSlot = require('../models/TimeSlot');
const Enquiry = require('../models/Enquiry');

/**
 * Get all pending hall owners
 * @route GET /api/v1/admin/pending-hall-owners
 * @access Private (Admin only)
 */
const getPendingHallOwners = async (req, res) => {
  try {
    const pendingHallOwners = await User.find({
      role: 'hall_owner',
      isApproved: false,
      accountStatus: 'pending'
    }).select('name email createdAt').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingHallOwners.length,
      data: pendingHallOwners
    });

  } catch (error) {
    console.error('Get pending hall owners error:', error);
    res.status(500).json({ message: 'Failed to fetch pending hall owners' });
  }
};

/**
 * Approve hall owner account
 * @route PATCH /api/v1/admin/approve-hall-owner/:id
 * @access Private (Admin only)
 */
const approveHallOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id);

    if (!user || user.role !== 'hall_owner') {
      return res.status(404).json({ message: 'Hall owner not found' });
    }

    // Update user
    user.isApproved = true;
    user.accountStatus = 'active';
    await user.save();

    // TODO: Send approval email notification
    console.log(`Hall owner ${user.email} approved`);

    res.status(200).json({
      message: 'Hall owner approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        isApproved: user.isApproved
      }
    });

  } catch (error) {
    console.error('Approve hall owner error:', error);
    res.status(500).json({ message: 'Failed to approve hall owner' });
  }
};

/**
 * Reject hall owner account
 * @route PATCH /api/v1/admin/reject-hall-owner/:id
 * @access Private (Admin only)
 */
const rejectHallOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id);

    if (!user || user.role !== 'hall_owner') {
      return res.status(404).json({ message: 'Hall owner not found' });
    }

    // Update user
    user.isApproved = false;
    user.accountStatus = 'suspended';
    await user.save();

    // TODO: Send rejection email notification
    console.log(`Hall owner ${user.email} rejected`);

    res.status(200).json({
      message: 'Hall owner rejected',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        isApproved: user.isApproved
      }
    });

  } catch (error) {
    console.error('Reject hall owner error:', error);
    res.status(500).json({ message: 'Failed to reject hall owner' });
  }
};

// ENQUIRY MANAGEMENT FUNCTIONS

/**
 * Get all enquiries with optional status filter
 * @route GET /api/v1/admin/enquiries
 * @access Private (Admin only)
 */
const getEnquiries = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    let query = {};
    if (status && ['pending', 'responded', 'closed'].includes(status)) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query)
      .populate('hall', 'name address city')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });

  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ message: 'Failed to fetch enquiries' });
  }
};

/**
 * Respond to an enquiry
 * @route PATCH /api/v1/admin/enquiries/:id/respond
 * @access Private (Admin only)
 */
const respondToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    // Validate required fields
    if (!response || !response.trim()) {
      return res.status(400).json({ message: 'Response is required' });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enquiry ID' });
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Update enquiry
    enquiry.response = response.trim();
    enquiry.status = 'responded';
    await enquiry.save();

    // Populate for response
    await enquiry.populate('hall', 'name address city');
    await enquiry.populate('customer', 'name email');

    res.status(200).json({
      message: 'Enquiry responded successfully',
      enquiry
    });

  } catch (error) {
    console.error('Respond to enquiry error:', error);
    res.status(500).json({ message: 'Failed to respond to enquiry' });
  }
};

/**
 * Close an enquiry
 * @route PATCH /api/v1/admin/enquiries/:id/close
 * @access Private (Admin only)
 */
const closeEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enquiry ID' });
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Update status
    enquiry.status = 'closed';
    await enquiry.save();

    // Populate for response
    await enquiry.populate('hall', 'name address city');
    await enquiry.populate('customer', 'name email');

    res.status(200).json({
      message: 'Enquiry closed successfully',
      enquiry
    });

  } catch (error) {
    console.error('Close enquiry error:', error);
    res.status(500).json({ message: 'Failed to close enquiry' });
  }
};

// HALL MODERATION FUNCTIONS

/**
 * Get all halls for moderation
 * @route GET /api/v1/admin/halls
 * @access Private (Admin only)
 */
const getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.find({})
      .populate('owner', 'name email isApproved accountStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: halls.length,
      halls
    });

  } catch (error) {
    console.error('Get all halls error:', error);
    res.status(500).json({ message: 'Failed to fetch halls' });
  }
};

/**
 * Delete a hall (admin moderation)
 * @route DELETE /api/v1/admin/halls/:id
 * @access Private (Admin only)
 */
const deleteHall = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    const hall = await Hall.findById(id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Cascade delete all related data
    await Promise.all([
      Menu.deleteMany({ hall: id }),
      EventType.deleteMany({ hall: id }),
      TimeSlot.deleteMany({ hall: id }),
      Enquiry.deleteMany({ hall: id })
    ]);

    // Delete the hall itself
    await Hall.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Hall and all related data deleted successfully'
    });

  } catch (error) {
    console.error('Delete hall error:', error);
    res.status(500).json({ message: 'Failed to delete hall' });
  }
};

module.exports = {
  getPendingHallOwners,
  approveHallOwner,
  rejectHallOwner,
  getEnquiries,
  respondToEnquiry,
  closeEnquiry,
  getAllHalls,
  deleteHall
};