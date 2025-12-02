import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/uploadImage.js';

/**
 * Register a new user (farmer or buyer)
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by pre-save middleware
    role,
    phone,
    location,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        qrCode: user.qrCode,
        accountHolderName: user.accountHolderName,
        address: user.address,
        bio: user.bio,
        upiId: user.upiId,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * Authenticate user & get token (Login)
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        qrCode: user.qrCode,
        accountHolderName: user.accountHolderName,
        address: user.address,
        bio: user.bio,
        upiId: user.upiId,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * Get current logged-in user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.accountHolderName = req.body.accountHolderName || user.accountHolderName;
    user.address = req.body.address || user.address;
    user.bio = req.body.bio || user.bio;
    user.upiId = req.body.upiId || user.upiId;

    // Handle QR Code Upload
    if (req.body.qrCodeBase64) {
      // Delete old QR code if exists
      if (user.qrCode && user.qrCode.publicId) {
        await deleteImageFromCloudinary(user.qrCode.publicId);
      }
      // Upload new QR code
      const imageData = await uploadImageToCloudinary(req.body.qrCodeBase64);
      user.qrCode = {
        url: imageData.url,
        publicId: imageData.publicId,
      };
    }

    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        qrCode: updatedUser.qrCode,
        accountHolderName: updatedUser.accountHolderName,
        address: updatedUser.address,
        bio: updatedUser.bio,
        upiId: updatedUser.upiId,
        token: generateToken(updatedUser._id),
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Get user by ID (Public Profile)
 * @route GET /api/auth/:id
 * @access Private
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        qrCode: user.qrCode,
        accountHolderName: user.accountHolderName,
        address: user.address,
        bio: user.bio,
        upiId: user.upiId,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, getUserProfile, updateUserProfile, getUserById };
