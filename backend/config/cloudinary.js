import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with API credentials
 * Used for uploading and managing crop images
 */
const configureCloudinary = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    console.warn('Cloudinary env vars are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
    return;
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });

  console.log('Cloudinary configured successfully');
};

export default configureCloudinary;
export { cloudinary };
