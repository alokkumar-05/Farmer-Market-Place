import { cloudinary } from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {String} imageBase64 - Base64 encoded image string
 * @param {String} folder - Cloudinary folder name (default: 'crops')
 * @returns {Object} - Object containing image URL and public ID
 */
const uploadImageToCloudinary = async (imageBase64, folder = 'crops') => {
  try {
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Optimize image size
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID of the image
 * @returns {Object} - Cloudinary deletion result
 */
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export { uploadImageToCloudinary, deleteImageFromCloudinary };
