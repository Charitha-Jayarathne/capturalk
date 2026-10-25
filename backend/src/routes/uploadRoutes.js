import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('file'), uploadImage);
router.delete('/:publicId', protect, adminOnly, deleteImage);

export default router;
