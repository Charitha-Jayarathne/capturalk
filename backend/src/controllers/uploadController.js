import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Upload any image directly to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const folder = req.body.folder || 'capturalk/uploads';
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, { folder });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media from Cloudinary by public ID
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    const resourceType = req.query.resourceType || 'image';

    const result = await deleteFromCloudinary(publicId, resourceType);

    res.status(200).json({
      success: true,
      message: 'Cloudinary asset deleted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
