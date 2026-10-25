import express from 'express';
import {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/portfolioController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public gallery endpoints
router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItemById);

// Protected admin endpoints with multipart upload support
router.post('/', protect, adminOnly, upload.single('image'), createPortfolioItem);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

export default router;
