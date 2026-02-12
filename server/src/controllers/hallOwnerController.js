const Hall = require('../models/Hall');
const Menu = require('../models/Menu');
const EventType = require('../models/EventType');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const AddOn = require('../models/AddOn');

// Helper function to check time overlap
const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// DASHBOARD STATS

/**
 * Get dashboard statistics for hall owner
 * @route GET /api/v1/hall-owner/dashboard-stats
 * @access Private (Hall Owner only)
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get hall IDs owned by current user
    const userHalls = await Hall.find({ owner: userId });
    const hallIds = userHalls.map(hall => hall._id);
    
    // Count stats
    const totalHalls = userHalls.length;
    const totalMenus = await Menu.countDocuments({ hall: { $in: hallIds } });
    
    // Get bookings for owner's halls
    const now = new Date();
    const upcomingBookings = await Booking.countDocuments({
      hall: { $in: hallIds },
      $or: [
        { status: 'confirmed' },
        { status: 'pending' }
      ]
    });
    
    const pendingBookings = await Booking.countDocuments({
      hall: { $in: hallIds },
      status: 'pending'
    });
    
    res.status(200).json({
      success: true,
      totalHalls,
      totalMenus,
      upcomingBookings,
      pendingBookings
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message 
    });
  }
};

// IMAGE UPLOAD

/**
 * Upload hall images
 * @route POST /api/v1/hall-owner/upload-images
 * @access Private (Hall Owner only)
 */
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};

// HALL CRUD OPERATIONS

/**
 * Create a new hall
 * @route POST /api/v1/hall-owner/halls
 * @access Private (Hall Owner only)
 */
const createHall = async (req, res) => {
  try {
    const { name, description, address, city, capacity, basePrice, amenities, images } = req.body;

    // Validate required fields
    if (!name || !address || !city || !capacity || !basePrice) {
      return res.status(400).json({ message: 'Name, address, city, capacity, and basePrice are required' });
    }

    // Create hall
    const hall = new Hall({
      name,
      description,
      address,
      city,
      capacity: parseInt(capacity),
      basePrice: parseFloat(basePrice),
      amenities: amenities || [],
      images: images || [],
      owner: req.user.id
    });

    await hall.save();

    res.status(201).json({
      message: 'Hall created successfully',
      hall
    });

  } catch (error) {
    console.error('Create hall error:', error);
    res.status(500).json({ message: 'Failed to create hall' });
  }
};

/**
 * Update hall
 * @route PUT /api/v1/hall-owner/halls/:id
 * @access Private (Hall Owner only)
 */
const updateHall = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Find and update hall (only if owned by current user)
    const hall = await Hall.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or access denied' });
    }

    res.status(200).json({
      message: 'Hall updated successfully',
      hall
    });

  } catch (error) {
    console.error('Update hall error:', error);
    res.status(500).json({ message: 'Failed to update hall' });
  }
};

/**
 * Get all halls owned by current user
 * @route GET /api/v1/hall-owner/halls
 * @access Private (Hall Owner only)
 */
const getHalls = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: halls.length,
      halls
    });

  } catch (error) {
    console.error('Get halls error:', error);
    res.status(500).json({ message: 'Failed to fetch halls' });
  }
};

/**
 * Delete hall
 * @route DELETE /api/v1/hall-owner/halls/:id
 * @access Private (Hall Owner only)
 */
const deleteHall = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Find and delete hall (only if owned by current user)
    const hall = await Hall.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or access denied' });
    }

    // Delete related data
    await Menu.deleteMany({ hall: id });
    await EventType.deleteMany({ hall: id });
    await TimeSlot.deleteMany({ hall: id });
    await Booking.deleteMany({ hall: id });

    res.status(200).json({
      message: 'Hall and related data deleted successfully'
    });

  } catch (error) {
    console.error('Delete hall error:', error);
    res.status(500).json({ message: 'Failed to delete hall' });
  }
};

// MENU CRUD OPERATIONS

/**
 * Create a new menu
 * @route POST /api/v1/hall-owner/menus
 * @access Private (Hall Owner only)
 */
const createMenu = async (req, res) => {
  try {
    const { hall: hallId, name, description, pricePerPlate, items } = req.body;

    // Validate required fields
    if (!hallId || !name || !pricePerPlate) {
      return res.status(400).json({ message: 'Hall ID, name, and pricePerPlate are required' });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(hallId)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists and belongs to current user
    const hall = await Hall.findOne({ _id: hallId, owner: req.user.id });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or access denied' });
    }

    // Create menu
    const menu = new Menu({
      hall: hallId,
      name,
      description,
      pricePerPlate: parseFloat(pricePerPlate),
      items: items || []
    });

    await menu.save();

    res.status(201).json({
      message: 'Menu created successfully',
      menu
    });

  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ message: 'Failed to create menu' });
  }
};

/**
 * Update menu
 * @route PUT /api/v1/hall-owner/menus/:id
 * @access Private (Hall Owner only)
 */
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    // Find menu and check ownership through hall
    const menu = await Menu.findById(id).populate('hall');
    if (!menu || menu.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Menu not found or access denied' });
    }

    // Update menu
    Object.assign(menu, updates);
    await menu.save();

    res.status(200).json({
      message: 'Menu updated successfully',
      menu
    });

  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ message: 'Failed to update menu' });
  }
};

/**
 * Get all menus for owner's halls
 * @route GET /api/v1/hall-owner/menus
 * @access Private (Hall Owner only)
 */
const getMenus = async (req, res) => {
  try {
    // Get all halls owned by current user
    const halls = await Hall.find({ owner: req.user.id }).select('_id');
    const hallIds = halls.map(hall => hall._id);

    const menus = await Menu.find({ hall: { $in: hallIds } }).populate('hall', 'name');

    res.status(200).json({
      success: true,
      count: menus.length,
      menus
    });

  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ message: 'Failed to fetch menus' });
  }
};

/**
 * Delete menu
 * @route DELETE /api/v1/hall-owner/menus/:id
 * @access Private (Hall Owner only)
 */
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    // Find menu and check ownership through hall
    const menu = await Menu.findById(id).populate('hall');
    if (!menu || menu.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Menu not found or access denied' });
    }

    await Menu.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Menu deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({ message: 'Failed to delete menu' });
  }
};

// EVENT TYPE CRUD OPERATIONS

/**
 * Create a new event type
 * @route POST /api/v1/hall-owner/event-types
 * @access Private (Hall Owner only)
 */
const createEventType = async (req, res) => {
  try {
    const { hall: hallId, name, description, priceModifier } = req.body;

    // Validate required fields
    if (!hallId || !name || priceModifier === undefined) {
      return res.status(400).json({ message: 'Hall ID, name, and priceModifier are required' });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(hallId)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists and belongs to current user
    const hall = await Hall.findOne({ _id: hallId, owner: req.user.id });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or access denied' });
    }

    // Create event type
    const eventType = new EventType({
      hall: hallId,
      name,
      description,
      priceModifier: parseFloat(priceModifier)
    });

    await eventType.save();

    // Populate hall data before returning
    await eventType.populate('hall', 'name');

    res.status(201).json({
      message: 'Event type created successfully',
      eventType
    });

  } catch (error) {
    console.error('Create event type error:', error);
    res.status(500).json({ message: 'Failed to create event type' });
  }
};

/**
 * Update event type
 * @route PUT /api/v1/hall-owner/event-types/:id
 * @access Private (Hall Owner only)
 */
const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event type ID' });
    }

    // Find event type and check ownership through hall
    const eventType = await EventType.findById(id).populate('hall');
    if (!eventType || eventType.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Event type not found or access denied' });
    }

    // Update event type
    Object.assign(eventType, updates);
    await eventType.save();

    // Populate hall data before returning
    await eventType.populate('hall', 'name');

    res.status(200).json({
      message: 'Event type updated successfully',
      eventType
    });

  } catch (error) {
    console.error('Update event type error:', error);
    res.status(500).json({ message: 'Failed to update event type' });
  }
};

/**
 * Get all event types for owner's halls
 * @route GET /api/v1/hall-owner/event-types
 * @access Private (Hall Owner only)
 */
const getEventTypes = async (req, res) => {
  try {
    // Get all halls owned by current user
    const halls = await Hall.find({ owner: req.user.id }).select('_id');
    const hallIds = halls.map(hall => hall._id);

    const eventTypes = await EventType.find({ hall: { $in: hallIds } }).populate('hall', 'name');

    res.status(200).json({
      success: true,
      count: eventTypes.length,
      eventTypes
    });

  } catch (error) {
    console.error('Get event types error:', error);
    res.status(500).json({ message: 'Failed to fetch event types' });
  }
};

/**
 * Delete event type
 * @route DELETE /api/v1/hall-owner/event-types/:id
 * @access Private (Hall Owner only)
 */
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event type ID' });
    }

    // Find event type and check ownership through hall
    const eventType = await EventType.findById(id).populate('hall');
    if (!eventType || eventType.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Event type not found or access denied' });
    }

    await EventType.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Event type deleted successfully'
    });

  } catch (error) {
    console.error('Delete event type error:', error);
    res.status(500).json({ message: 'Failed to delete event type' });
  }
};

// TIME SLOT CRUD OPERATIONS

/**
 * Create a new time slot
 * @route POST /api/v1/hall-owner/time-slots
 * @access Private (Hall Owner only)
 */
const createTimeSlot = async (req, res) => {
  try {
    const { hall: hallId, date, startTime, endTime, status } = req.body;

    // Validate required fields
    if (!hallId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Hall ID, date, startTime, and endTime are required' });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(hallId)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists and belongs to current user
    const hall = await Hall.findOne({ _id: hallId, owner: req.user.id });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or access denied' });
    }

    // Check for overlapping time slots
    const [year, month, day] = date.split('-').map(Number);
    const timeSlotDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    
    const existingSlots = await TimeSlot.find({
      hall: hallId,
      date: timeSlotDate,
      status: { $ne: 'blocked' } // Allow overlaps with blocked slots
    });

    const hasOverlap = existingSlots.some(slot =>
      checkTimeOverlap(startTime, endTime, slot.startTime, slot.endTime)
    );

    if (hasOverlap) {
      return res.status(409).json({ message: 'Time slot overlaps with existing slot' });
    }

    // Create time slot
    const timeSlot = new TimeSlot({
      hall: hallId,
      date: timeSlotDate,
      startTime,
      endTime,
      status: status || 'available'
    });

    await timeSlot.save();

    res.status(201).json({
      message: 'Time slot created successfully',
      timeSlot
    });

  } catch (error) {
    console.error('Create time slot error:', error);
    if (error.message.includes('End time must be after start time')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create time slot' });
  }
};

/**
 * Update time slot
 * @route PUT /api/v1/hall-owner/time-slots/:id
 * @access Private (Hall Owner only)
 */
const updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid time slot ID' });
    }

    // Find time slot and check ownership through hall
    const timeSlot = await TimeSlot.findById(id).populate('hall');
    if (!timeSlot || timeSlot.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Time slot not found or access denied' });
    }

    // If updating time fields, check for overlaps
    if (updates.date || updates.startTime || updates.endTime) {
      const checkDate = updates.date ? new Date(updates.date) : timeSlot.date;
      const checkStart = updates.startTime || timeSlot.startTime;
      const checkEnd = updates.endTime || timeSlot.endTime;

      const existingSlots = await TimeSlot.find({
        hall: timeSlot.hall._id,
        date: checkDate,
        _id: { $ne: id }, // Exclude current slot
        status: { $ne: 'blocked' }
      });

      const hasOverlap = existingSlots.some(slot =>
        checkTimeOverlap(checkStart, checkEnd, slot.startTime, slot.endTime)
      );

      if (hasOverlap) {
        return res.status(409).json({ message: 'Updated time slot overlaps with existing slot' });
      }
    }

    // Update time slot
    Object.assign(timeSlot, updates);
    await timeSlot.save();

    res.status(200).json({
      message: 'Time slot updated successfully',
      timeSlot
    });

  } catch (error) {
    console.error('Update time slot error:', error);
    if (error.message.includes('End time must be after start time')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update time slot' });
  }
};

/**
 * Get all time slots for owner's halls
 * @route GET /api/v1/hall-owner/time-slots
 * @access Private (Hall Owner only)
 */
const getTimeSlots = async (req, res) => {
  try {
    // Find all halls owned by user, then get time slots for those halls
    const halls = await Hall.find({ owner: req.user.id }).select('_id');
    const hallIds = halls.map(hall => hall._id);

    const timeSlots = await TimeSlot.find({ hall: { $in: hallIds } })
      .populate('hall', 'name')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timeSlots.length,
      timeSlots
    });

  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({ message: 'Failed to fetch time slots' });
  }
};

/**
 * Delete time slot
 * @route DELETE /api/v1/hall-owner/time-slots/:id
 * @access Private (Hall Owner only)
 */
const deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid time slot ID' });
    }

    // Find time slot and check ownership through hall
    const timeSlot = await TimeSlot.findById(id).populate('hall');
    if (!timeSlot || timeSlot.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Time slot not found or access denied' });
    }

    // Check if time slot is booked
    if (timeSlot.status === 'booked') {
      return res.status(400).json({ message: 'Cannot delete a booked time slot' });
    }

    await timeSlot.remove();

    res.status(200).json({
      message: 'Time slot deleted successfully'
    });

  } catch (error) {
    console.error('Delete time slot error:', error);
    res.status(500).json({ message: 'Failed to delete time slot' });
  }
};

// BOOKING MANAGEMENT OPERATIONS

/**
 * Get all bookings for owner's halls
 * @route GET /api/v1/hall-owner/bookings
 * @access Private (Hall Owner only)
 */
const getBookings = async (req, res) => {
  try {
    // Find all halls owned by user, then get bookings for those halls
    const halls = await Hall.find({ owner: req.user.id }).select('_id');
    const hallIds = halls.map(hall => hall._id);

    const bookings = await Booking.find({ hall: { $in: hallIds } })
      .populate('hall', 'name')
      .populate('customer', 'name email')
      .populate('menu', 'name pricePerPlate')
      .populate('eventType', 'name priceModifier')
      .populate('timeSlot', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

/**
 * Accept booking
 * @route PATCH /api/v1/hall-owner/bookings/:id/accept
 * @access Private (Hall Owner only)
 */
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Find booking and check ownership through hall
    const booking = await Booking.findById(id).populate('hall').populate('timeSlot');
    if (!booking || booking.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not in pending status' });
    }

    // Check if time slot is blocked (waiting for acceptance)
    if (booking.timeSlot.status !== 'blocked') {
      return res.status(400).json({ message: 'Time slot is not in pending status' });
    }

    // Update booking status
    booking.status = 'confirmed';
    await booking.save();

    // Update time slot status to booked (now confirmed)
    booking.timeSlot.status = 'booked';
    await booking.timeSlot.save();

    // TODO: Send confirmation email to customer
    console.log(`Booking ${id} accepted for customer ${booking.customer}`);

    res.status(200).json({
      message: 'Booking accepted successfully',
      booking
    });

  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ message: 'Failed to accept booking' });
  }
};

/**
 * Reject booking
 * @route PATCH /api/v1/hall-owner/bookings/:id/reject
 * @access Private (Hall Owner only)
 */
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Find booking and check ownership through hall
    const booking = await Booking.findById(id).populate('hall').populate('timeSlot');
    if (!booking || booking.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not in pending status' });
    }

    // Update booking status
    booking.status = 'rejected';
    await booking.save();

    // Release the time slot back to available
    booking.timeSlot.status = 'available';
    await booking.timeSlot.save();

    // TODO: Send rejection email to customer with reason
    console.log(`Booking ${id} rejected for reason: ${reason || 'No reason provided'}`);

    res.status(200).json({
      message: 'Booking rejected successfully',
      booking
    });

  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Failed to reject booking' });
  }
};

/**
 * Mark booking as completed
 * @route PATCH /api/v1/hall-owner/bookings/:id/complete
 * @access Private (Hall Owner only)
 */
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Find booking and check ownership through hall
    const booking = await Booking.findById(id).populate('hall');
    if (!booking || booking.hall.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    // Check if booking is confirmed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be marked as completed' });
    }

    // Update booking status
    booking.status = 'completed';
    await booking.save();

    // TODO: Send completion confirmation to customer
    console.log(`Booking ${id} marked as completed`);

    res.status(200).json({
      message: 'Booking marked as completed successfully',
      booking
    });

  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({ message: 'Failed to complete booking' });
  }
};

// ADD-ON CRUD OPERATIONS

/**
 * Create a new add-on
 * @route POST /api/v1/hall-owner/add-ons
 * @access Private (Hall Owner only)
 */
const createAddOn = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Create add-on
    const addOn = new AddOn({
      hallOwner: req.user.id,
      name,
      description,
      price: parseFloat(price),
      category: category || 'Other'
    });

    await addOn.save();

    res.status(201).json({
      message: 'Add-on created successfully',
      addOn
    });

  } catch (error) {
    console.error('Create add-on error:', error);
    res.status(500).json({ message: 'Failed to create add-on' });
  }
};

/**
 * Get all add-ons for hall owner
 * @route GET /api/v1/hall-owner/add-ons
 * @access Private (Hall Owner only)
 */
const getAddOns = async (req, res) => {
  try {
    const addOns = await AddOn.find({ hallOwner: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Add-ons retrieved successfully',
      addOns
    });

  } catch (error) {
    console.error('Get add-ons error:', error);
    res.status(500).json({ message: 'Failed to retrieve add-ons' });
  }
};

/**
 * Update an add-on
 * @route PUT /api/v1/hall-owner/add-ons/:id
 * @access Private (Hall Owner only)
 */
const updateAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available } = req.body;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid add-on ID' });
    }

    // Find and verify ownership
    const addOn = await AddOn.findById(id);
    if (!addOn || addOn.hallOwner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Add-on not found or access denied' });
    }

    // Update fields
    if (name) addOn.name = name;
    if (description) addOn.description = description;
    if (price) addOn.price = parseFloat(price);
    if (category) addOn.category = category;
    if (available !== undefined) addOn.available = available;

    await addOn.save();

    res.status(200).json({
      message: 'Add-on updated successfully',
      addOn
    });

  } catch (error) {
    console.error('Update add-on error:', error);
    res.status(500).json({ message: 'Failed to update add-on' });
  }
};

/**
 * Delete an add-on
 * @route DELETE /api/v1/hall-owner/add-ons/:id
 * @access Private (Hall Owner only)
 */
const deleteAddOn = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid add-on ID' });
    }

    // Find and verify ownership
    const addOn = await AddOn.findById(id);
    if (!addOn || addOn.hallOwner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Add-on not found or access denied' });
    }

    // Delete add-on
    await AddOn.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Add-on deleted successfully'
    });

  } catch (error) {
    console.error('Delete add-on error:', error);
    res.status(500).json({ message: 'Failed to delete add-on' });
  }
};

module.exports = {
  // Dashboard
  getDashboardStats,
  uploadImages,
  // Halls
  createHall,
  updateHall,
  getHalls,
  deleteHall,
  // Menus
  createMenu,
  updateMenu,
  getMenus,
  deleteMenu,
  // Event Types
  createEventType,
  updateEventType,
  getEventTypes,
  deleteEventType,
  // Time Slots
  createTimeSlot,
  updateTimeSlot,
  getTimeSlots,
  deleteTimeSlot,
  // Bookings
  getBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  // Add-ons
  createAddOn,
  getAddOns,
  updateAddOn,
  deleteAddOn
};