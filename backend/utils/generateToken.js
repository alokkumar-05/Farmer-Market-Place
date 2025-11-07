import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {String} id - User ID to encode in token
 * @returns {String} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;
