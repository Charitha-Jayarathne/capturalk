import Portfolio from '../models/Portfolio.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
export const getPortfolioItems = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolioItemById = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new portfolio item (with Cloudinary image upload)
// @route   POST /api/portfolio
// @access  Private/Admin
export const createPortfolioItem = async (req, res, next) => {
  try {
    const { title, category, description, location, clientName, featured, order } = req.body;

    let imageUrl = req.body.imageUrl;
    let cloudinaryPublicId = req.body.cloudinaryPublicId;

    // If an image file is attached via multipart/form-data
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `capturalk/portfolio/${category || 'general'}`,
      });
      imageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    if (!title || !imageUrl || !cloudinaryPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and an image (file or Cloudinary URL + public ID).',
      });
    }

    const newItem = await Portfolio.create({
      title,
      category: category || 'General',
      imageUrl,
      cloudinaryPublicId,
      description: description || '',
      location: location || 'Sri Lanka',
      clientName: clientName || '',
      featured: featured === 'true' || featured === true,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
export const updatePortfolioItem = async (req, res, next) => {
  try {
    let item = await Portfolio.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    // If a new image file is uploaded, replace the old Cloudinary asset
    if (req.file) {
      // Clean up previous image on Cloudinary
      if (item.cloudinaryPublicId) {
        await deleteFromCloudinary(item.cloudinaryPublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `capturalk/portfolio/${req.body.category || item.category}`,
      });
      req.body.imageUrl = uploadResult.secure_url;
      req.body.cloudinaryPublicId = uploadResult.public_id;
    }

    item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio item and remove image from Cloudinary
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
export const deletePortfolioItem = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    // Delete image from Cloudinary
    if (item.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(item.cloudinaryPublicId);
      } catch (cloudErr) {
        console.warn(`Warning: Could not remove asset from Cloudinary: ${cloudErr.message}`);
      }
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Portfolio item and Cloudinary image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
