import express from 'express';
import {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getMycrops,
} from '../controllers/cropController.js';
import { protect, farmerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/crops
 * @desc    Get all crops with optional filters
 * @access  Public
 */
router.get('/', getAllCrops);

/**
 * @route   GET /api/crops/my-crops
 * @desc    Get crops posted by logged-in farmer
 * @access  Private/Farmer
 */
router.get('/my-crops', protect, farmerOnly, getMycrops);

/**
 * @route   GET /api/crops/:id
 * @desc    Get single crop by ID
 * @access  Public
 */
router.get('/:id', getCropById);

/**
 * @route   POST /api/crops
 * @desc    Create a new crop listing
 * @access  Private/Farmer
 */
router.post('/', protect, farmerOnly, createCrop);

/**
 * @route   PUT /api/crops/:id
 * @desc    Update crop listing
 * @access  Private/Farmer
 */
router.put('/:id', protect, farmerOnly, updateCrop);

/**
 * @route   DELETE /api/crops/:id
 * @desc    Delete crop listing
 * @access  Private/Farmer
 */
router.delete('/:id', protect, farmerOnly, deleteCrop);

export default router;
