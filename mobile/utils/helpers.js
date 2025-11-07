/**
 * Format price with currency
 * @param {Number} price - Price value
 * @returns {String} - Formatted price string
 */
export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return '₹0';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

/**
 * Format date to readable format
 * @param {String} date - ISO date string
 * @returns {String} - Formatted date string
 */
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-IN', options);
};

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} maxLength - Maximum length
 * @returns {String} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 * @param {String} email - Email address
 * @returns {Boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Convert image URI to Base64
 * @param {String} uri - Image URI
 * @returns {Promise<String>} - Base64 string
 */
export const imageToBase64 = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Upload image to Cloudinary
 * @param {String} uri - Local image URI
 * @returns {Promise<String>} - Cloudinary URL
 */
export const uploadImageToCloudinary = async (uri) => {
  // TODO: Implement Cloudinary upload
  // For now, return the original URI
  return uri;
};
