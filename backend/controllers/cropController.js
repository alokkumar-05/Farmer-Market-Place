import asyncHandler from 'express-async-handler';
import Crop from '../models/Crop.js';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../utils/uploadImage.js';

/**
 * Get all crops (with optional filters)
 * @route GET /api/crops
 * @access Public
 */
const getAllCrops = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  // Build query filter
  let filter = { isAvailable: true };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  const crops = await Crop.find(filter)
    .populate('farmer', 'name email phone location')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: crops.length,
    data: crops,
  });
});

/**
 * Get single crop by ID
 * @route GET /api/crops/:id
 * @access Public
 */
const getCropById = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate(
    'farmer',
    'name email phone location'
  );

  if (crop) {
    res.json({
      success: true,
      data: crop,
    });
  } else {
    res.status(404);
    throw new Error('Crop not found');
  }
});

/**
 * Create a new crop listing (Farmer only)
 * @route POST /api/crops
 * @access Private/Farmer
 */
const createCrop = asyncHandler(async (req, res) => {
  const { name, description, price, unit, quantity, category, imageBase64 } =
    req.body;

  // Validate required fields
  if (!name || !description || !price || !quantity || !imageBase64) {
    res.status(400);
    throw new Error('Please provide all required fields including image');
  }

  // Upload image to Cloudinary
  const imageData = await uploadImageToCloudinary(imageBase64);

  // Create crop
  const crop = await Crop.create({
    farmer: req.user._id,
    name,
    description,
    price,
    unit: unit || 'kg',
    quantity,
    category: category || 'other',
    image: {
      url: imageData.url,
      publicId: imageData.publicId,
    },
  });

  if (crop) {
    const populatedCrop = await Crop.findById(crop._id).populate(
      'farmer',
      'name email phone location'
    );

    res.status(201).json({
      success: true,
      data: populatedCrop,
    });
  } else {
    res.status(400);
    throw new Error('Invalid crop data');
  }
});

/**
 * Update crop listing (Farmer only - own crops)
 * @route PUT /api/crops/:id
 * @access Private/Farmer
 */
const updateCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);

  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }

  // Check if user is the owner of the crop
  if (crop.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this crop');
  }

  const { name, description, price, unit, quantity, category, imageBase64 } =
    req.body;

  // Update image if new one is provided
  let imageData = crop.image;
  if (imageBase64) {
    // Delete old image from Cloudinary
    if (crop.image.publicId) {
      await deleteImageFromCloudinary(crop.image.publicId);
    }
    // Upload new image
    imageData = await uploadImageToCloudinary(imageBase64);
  }

  // Update crop fields
  crop.name = name || crop.name;
  crop.description = description || crop.description;
  crop.price = price !== undefined ? price : crop.price;
  crop.unit = unit || crop.unit;
  crop.quantity = quantity !== undefined ? quantity : crop.quantity;
  crop.category = category || crop.category;
  crop.image = {
    url: imageData.url || crop.image.url,
    publicId: imageData.publicId || crop.image.publicId,
  };

  const updatedCrop = await crop.save();

  const populatedCrop = await Crop.findById(updatedCrop._id).populate(
    'farmer',
    'name email phone location'
  );

  res.json({
    success: true,
    data: populatedCrop,
  });
});

/**
 * Delete crop listing (Farmer only - own crops)
 * @route DELETE /api/crops/:id
 * @access Private/Farmer
 */
const deleteCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);

  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }

  // Check if user is the owner of the crop
  if (crop.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this crop');
  }

  // Delete image from Cloudinary
  if (crop.image.publicId) {
    await deleteImageFromCloudinary(crop.image.publicId);
  }

  await crop.deleteOne();

  res.json({
    success: true,
    message: 'Crop removed successfully',
  });
});

/**
 * Get crops posted by logged-in farmer
 * @route GET /api/crops/my-crops
 * @access Private/Farmer
 */
const getMycrops = asyncHandler(async (req, res) => {
  const crops = await Crop.find({ farmer: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: crops.length,
    data: crops,
  });
});

export {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getMycrops,
};
