import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Allow image uploads from studio admin
router.post('/', upload.single('file'), uploadImage);
router.delete('/:publicId', deleteImage);

export default router;
