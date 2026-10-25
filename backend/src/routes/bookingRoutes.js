import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit date reservation inquiries
router.post('/', createBooking);

// Protected routes for studio administration
router.get('/', protect, adminOnly, getBookings);
router.get('/:id', protect, adminOnly, getBookingById);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

export default router;
