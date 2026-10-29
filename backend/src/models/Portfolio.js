import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Portfolio item title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required for media management'],
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Sri Lanka',
    },
    clientName: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
