import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide client phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
    },
    eventType: {
      type: String,
      required: [true, 'Please select an event type'],
      default: 'Traditional / Kandyan Wedding',
    },
    eventDate: {
      type: String,
      required: [true, 'Please provide event date'],
    },
    location: {
      type: String,
      default: 'Sri Lanka',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
