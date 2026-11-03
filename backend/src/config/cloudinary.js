import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dt1ev5kjo',
  api_key: process.env.CLOUDINARY_API_KEY || '647995373355393',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'eBs1tteDc9_6kqzfZRKT73ulhl8',
  secure: true,
});

/**
 * Verifies Cloudinary connection & API credentials
 */
export const verifyCloudinaryConnection = async () => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return {
        success: false,
        message: 'Missing Cloudinary credentials in .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET)',
      };
    }

    const result = await cloudinary.api.ping();
    console.log(`✅ Cloudinary Connected Successfully: Status = ${result.status} (Cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`);
    return {
      success: true,
      status: result.status,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    };
  } catch (error) {
    const errorMsg = error?.error?.message || error?.message || 'Unknown Cloudinary error';
    console.error(`⚠️ Cloudinary Verification Note: ${errorMsg}`);
    return {
      success: false,
      message: errorMsg,
    };
  }
};

/**
 * Upload buffer to Cloudinary using stream
 * @param {Buffer} buffer
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder: 'capturalk/portfolio',
      resource_type: 'auto',
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Delete asset from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Cloudinary Delete Error (${publicId}):`, error.message);
    throw error;
  }
};

export default cloudinary;
