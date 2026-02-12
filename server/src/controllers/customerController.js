const Hall = require('../models/Hall');
const Menu = require('../models/Menu');
const EventType = require('../models/EventType');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

/**
 * Search halls with filters
 * @route GET /api/v1/customer/halls
 * @access Private (Customer only)
 */
const searchHalls = async (req, res) => {
  try {
    const {
      city,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      functionType,
      date,
      amenities
    } = req.query;

    // Build query object
    let query = {};

    // City filter
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Capacity filter
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseInt(minPrice);
      if (maxPrice) query.basePrice.$lte = parseInt(maxPrice);
    }

    // Function Type filter (Pakistani event functions)
    if (functionType) {
      query.supportedFunctions = functionType;
    }

    // Amenities filter (if provided as comma-separated string)
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      query.amenities = { $in: amenitiesArray };
    }

    // Find halls matching criteria
    const halls = await Hall.find(query).populate('owner', 'name');

    // If date is provided, filter halls with available time slots
    let filteredHalls = halls;
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      const searchDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const hallIds = halls.map(hall => hall._id);

      // Find available time slots for the date
      const availableSlots = await TimeSlot.find({
        hall: { $in: hallIds },
        date: searchDate,
        status: 'available'
      }).select('hall');

      const availableHallIds = [...new Set(availableSlots.map(slot => slot.hall.toString()))];
      filteredHalls = halls.filter(hall => availableHallIds.includes(hall._id.toString()));
    }

    // Get additional data for each hall
    let searchDate = null;
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      searchDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    }

    const hallsWithDetails = await Promise.all(
      filteredHalls.map(async (hall) => {
        const menus = await Menu.find({ hall: hall._id }).select('name pricePerPlate');
        const eventTypes = await EventType.find({ hall: hall._id }).select('name priceModifier');

        let availableSlots = [];
        if (searchDate) {
          availableSlots = await TimeSlot.find({
            hall: hall._id,
            date: searchDate,
            status: 'available'
          }).select('startTime endTime');
        }

        return {
          ...hall.toObject(),
          thumbnail: hall.thumbnail || (hall.images && hall.images[0]) || null,
          menus,
          eventTypes,
          availableSlots: date ? availableSlots : []
        };
      })
    );

    res.status(200).json({
      success: true,
      count: hallsWithDetails.length,
      halls: hallsWithDetails
    });

  } catch (error) {
    console.error('Search halls error:', error);
    res.status(500).json({ message: 'Failed to search halls' });
  }
};

/**
 * Get detailed hall information
 * @route GET /api/v1/customer/halls/:id
 * @access Private (Customer only)
 */
const getHallDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Find hall with populated owner
    const hall = await Hall.findById(id).populate('owner', 'name');
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Get related data
    const menus = await Menu.find({ hall: id });
    const eventTypes = await EventType.find({ hall: id });
    const timeSlots = await TimeSlot.find({ hall: id }).sort({ date: 1, startTime: 1 });

    // TODO: Add reviews and ratings when implemented
    const reviews = [];
    const averageRating = 0;

    res.status(200).json({
      success: true,
      hall: {
        ...hall.toObject(),
        menus,
        eventTypes,
        timeSlots,
        reviews,
        averageRating
      }
    });

  } catch (error) {
    console.error('Get hall details error:', error);
    res.status(500).json({ message: 'Failed to fetch hall details' });
  }
};

/**
 * Get time slots for a hall on a specific date
 * @route GET /api/v1/customer/halls/:id/time-slots
 * @access Private (Customer only)
 */
const getHallTimeSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists
    const hall = await Hall.findById(id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Build query
    const query = { hall: id };
    if (date) {
      // Parse date string (YYYY-MM-DD) and create UTC boundaries
      const [year, month, day] = date.split('-').map(Number);
      const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
      console.log(`Querying time slots for hall ${id} on ${date}:`, { startOfDay, endOfDay });
    }

    // Get time slots sorted by time
    const timeSlots = await TimeSlot.find(query).sort({ startTime: 1 });
    console.log(`Found ${timeSlots.length} time slots`);

    res.status(200).json({
      success: true,
      timeSlots
    });

  } catch (error) {
    console.error('Get hall time slots error:', error);
    res.status(500).json({ message: 'Failed to fetch time slots' });
  }
};

/**
 * Create a new booking
 * @route POST /api/v1/customer/bookings
 * @access Private (Customer only)
 */
const createBooking = async (req, res) => {
  try {
    const {
      hallId,
      timeSlotId,
      functionType,
      menuId,
      guestCount,
      additionalDetails,
      notes
    } = req.body;

    // Validate required fields
    if (!hallId || !timeSlotId || !functionType || !guestCount) {
      return res.status(400).json({
        message: 'Hall ID, time slot ID, function type, and guest count are required'
      });
    }

    // Validate numeric fields
    if (typeof guestCount !== 'number' || guestCount < 1) {
      return res.status(400).json({ message: 'Guest count must be a positive number' });
    }

    // Validate ObjectIds
    const idsToValidate = [hallId, timeSlotId];
    if (menuId) idsToValidate.push(menuId);

    for (const id of idsToValidate) {
      if (!require('mongoose').Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID provided' });
      }
    }

    // Find and validate hall
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Validate that hall supports the requested function type via EventType
    const eventType = await EventType.findOne({
      hall: hallId,
      name: functionType
    });
    if (!eventType) {
      return res.status(400).json({
        message: `This hall does not support ${functionType} events`
      });
    }

    // Validate guest capacity
    if (guestCount > hall.capacity) {
      return res.status(400).json({
        message: `Guest count exceeds hall capacity of ${hall.capacity}`
      });
    }

    // Find and validate time slot
    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot || timeSlot.hall.toString() !== hallId) {
      return res.status(404).json({ message: 'Time slot not found or does not belong to this hall' });
    }

    // Check if time slot is available
    if (timeSlot.status !== 'available') {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Validate optional menu reference
    let menu = null;
    let menuPrice = 0;
    if (menuId) {
      menu = await Menu.findById(menuId);
      if (!menu || menu.hall.toString() !== hallId) {
        return res.status(404).json({ message: 'Menu not found or does not belong to this hall' });
      }
      menuPrice = menu.pricePerPlate;
    }

    // Calculate pricing breakdown
    const basePrice = hall.basePrice;
    const totalMenuPrice = menuPrice * guestCount;

    // Function type charge using EventType's priceModifier
    const functionTypeCharge = basePrice * (eventType.priceModifier / 100);

    // Calculate additional charges
    let additionalChargesTotal = 0;
    const appliedCharges = [];

    if (hall.additionalCharges && hall.additionalCharges.length > 0) {
      for (const charge of hall.additionalCharges) {
        additionalChargesTotal += charge.price;
        appliedCharges.push({
          name: charge.name,
          price: charge.price
        });
      }
    }

    // Calculate total price
    const totalPrice = basePrice + totalMenuPrice + functionTypeCharge + additionalChargesTotal;

    // Create booking
    const booking = new Booking({
      hall: hallId,
      customer: req.user.id,
      timeSlot: timeSlotId,
      menu: menuId || null,
      eventType: eventType._id,
      functionType,
      guestCount,
      basePrice,
      menuPrice: totalMenuPrice,
      functionTypeCharge,
      additionalCharges: appliedCharges,
      totalPrice,
      notes: notes || '',
      status: 'pending'
    });

    await booking.save();

    // Populate booking for response
    await booking.populate([
      { path: 'hall', select: 'name address city basePrice' },
      { path: 'customer', select: 'name email' },
      { path: 'timeSlot', select: 'date startTime endTime' },
      { path: 'menu', select: 'name pricePerPlate' }
    ]);

    // Mark time slot as blocked (pending hall owner approval)
    timeSlot.status = 'blocked';
    await timeSlot.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        hall: booking.hall,
        customer: booking.customer,
        timeSlot: booking.timeSlot,
        menu: booking.menu,
        functionType: booking.functionType,
        guestCount: booking.guestCount,
        pricing: {
          basePrice: booking.basePrice,
          menuPrice: booking.menuPrice,
          functionTypeCharge: booking.functionTypeCharge,
          additionalCharges: booking.additionalCharges,
          total: booking.totalPrice
        },
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

/**
 * Calculate booking price breakdown (for preview)
 * @route POST /api/v1/customer/calculate-price
 * @access Private (Customer only)
 */
const calculatePrice = async (req, res) => {
  try {
    const {
      hallId,
      functionType,
      menuId,
      guestCount
    } = req.body;

    // Validate required fields
    if (!hallId || !functionType || !guestCount) {
      return res.status(400).json({
        message: 'Hall ID, function type, and guest count are required'
      });
    }

    // Validate numeric guestCount
    if (typeof guestCount !== 'number' || guestCount < 1) {
      return res.status(400).json({ message: 'Guest count must be a positive number' });
    }

    // Find and validate hall
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Validate that hall supports the requested function type via EventType
    const eventType = await EventType.findOne({
      hall: hallId,
      name: functionType
    });
    if (!eventType) {
      return res.status(400).json({
        message: `This hall does not support ${functionType} events`
      });
    }

    // Validate guest capacity
    if (guestCount > hall.capacity) {
      return res.status(400).json({
        message: `Guest count exceeds hall capacity of ${hall.capacity}`
      });
    }

    // Calculate pricing breakdown
    const basePrice = hall.basePrice;
    let menuPrice = 0;

    if (menuId) {
      const menu = await Menu.findById(menuId);
      if (!menu || menu.hall.toString() !== hallId) {
        return res.status(404).json({ message: 'Menu not found or does not belong to this hall' });
      }
      menuPrice = menu.pricePerPlate * guestCount;
    }

    // Function type charge using EventType's priceModifier
    const functionTypeCharge = basePrice * (eventType.priceModifier / 100);

    // Calculate additional charges
    let additionalChargesTotal = 0;
    const appliedCharges = [];

    if (hall.additionalCharges && hall.additionalCharges.length > 0) {
      for (const charge of hall.additionalCharges) {
        additionalChargesTotal += charge.price;
        appliedCharges.push({
          name: charge.name,
          price: charge.price
        });
      }
    }

    // Calculate total
    const totalPrice = basePrice + menuPrice + functionTypeCharge + additionalChargesTotal;

    res.status(200).json({
      success: true,
      pricing: {
        basePrice,
        menuPrice,
        functionTypeCharge,
        additionalCharges: appliedCharges,
        total: totalPrice
      }
    });

  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({ message: 'Failed to calculate price', error: error.message });
  }
};

/**
 * Get customer's booking history
 * @route GET /api/v1/customer/bookings
 * @access Private (Customer only)
 */
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate({
        path: 'hall',
        select: 'name address city images'
      })
      .populate({
        path: 'menu',
        select: 'name items pricePerPlate'
      })
      .populate({
        path: 'timeSlot',
        select: 'date startTime endTime'
      })
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
 * Submit a review for a completed booking
 * @route POST /api/v1/customer/reviews
 * @access Private (Customer only)
 */
const submitReview = async (req, res) => {
  try {
    const { hallId, rating, comment } = req.body;

    // Validate required fields
    if (!hallId || !rating) {
      return res.status(400).json({ message: 'Hall ID and rating are required' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(hallId)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Check if customer has a completed booking for this hall
    const completedBooking = await Booking.findOne({
      customer: req.user.id,
      hall: hallId,
      status: 'completed'
    });

    if (!completedBooking) {
      return res.status(403).json({
        message: 'You can only review halls for which you have completed bookings'
      });
    }

    // Check if customer has already reviewed this hall
    const existingReview = await Review.findOne({
      customer: req.user.id,
      hall: hallId
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this hall'
      });
    }

    // Create review
    const review = new Review({
      hall: hallId,
      customer: req.user.id,
      rating: parseInt(rating),
      comment: comment ? comment.trim() : undefined
    });

    await review.save();

    // Populate review for response
    await review.populate([
      { path: 'hall', select: 'name address city' },
      { path: 'customer', select: 'name' }
    ]);

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Submit review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this hall' });
    }
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

/**
 * Get reviews for a specific hall
 * @route GET /api/v1/customer/halls/:id/reviews
 * @access Private (Customer only)
 */
const getHallReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hall ID' });
    }

    // Check if hall exists
    const hall = await Hall.findById(id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Get reviews with customer info
    const reviews = await Review.find({ hall: id })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    res.status(200).json({
      success: true,
      hall: {
        id: hall._id,
        name: hall.name
      },
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviews
    });

  } catch (error) {
    console.error('Get hall reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

/**
 * Cancel a pending booking
 * @route PATCH /api/v1/customer/bookings/:id/cancel
 * @access Private (Customer only)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Find booking
    const booking = await Booking.findById(id)
      .populate({
        path: 'hall',
        select: 'name'
      })
      .populate({
        path: 'timeSlot'
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership - convert both to strings for comparison
    if (booking.customer.toString() !== String(req.user.id)) {
      console.log('Ownership check failed:', {
        bookingCustomer: booking.customer.toString(),
        reqUserId: String(req.user.id),
        match: booking.customer.toString() === String(req.user.id)
      });
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        message: `Cannot cancel a booking with status: ${booking.status}`
      });
    }

    // Update status
    booking.status = 'cancelled';
    await booking.save();

    // Mark time slot as available again
    await TimeSlot.findByIdAndUpdate(booking.timeSlot._id, {
      status: 'available'
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};

/**
 * Get customer's submitted reviews
 * @route GET /api/v1/customer/reviews
 * @access Private (Customer only)
 */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user.id })
      .populate({
        path: 'hall',
        select: 'name address city images'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

/**
 * Delete a review
 * @route DELETE /api/v1/customer/reviews/:id
 * @access Private (Customer only)
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership - convert both to strings for comparison
    if (review.customer.toString() !== String(req.user.id)) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    // Delete review
    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

module.exports = {
  searchHalls,
  getHallDetails,
  getHallTimeSlots,
  createBooking,
  calculatePrice,
  getBookings,
  cancelBooking,
  submitReview,
  getHallReviews,
  getMyReviews,
  deleteReview
};