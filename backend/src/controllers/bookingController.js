import Booking from '../models/Booking.js';

// @desc    Create a new date booking inquiry
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, eventType, eventDate, location, notes } = req.body;

    if (!name || !phone || !email || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, email, and eventDate.',
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      eventType: eventType || 'Traditional / Kandyan Wedding',
      eventDate,
      location: location || 'Sri Lanka',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Booking inquiry received successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booking inquiries
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res, next) => {
  try {
    const { status, eventType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking inquiry by ID
// @route   GET /api/bookings/:id
// @access  Private/Admin
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking inquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking inquiry status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'confirmed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking inquiry
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
