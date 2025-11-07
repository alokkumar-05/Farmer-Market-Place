import mongoose from 'mongoose';

/**
 * Crop Schema for farmer crop listings
 * Includes crop details, pricing, and image
 */
const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide crop name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide crop description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'quintal', 'ton', 'piece'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide available quantity'],
      min: 0,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Please provide crop image'],
      },
      publicId: {
        type: String, // Cloudinary public ID for deletion
      },
    },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'other'],
      default: 'other',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
