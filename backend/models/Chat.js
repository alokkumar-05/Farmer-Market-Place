import mongoose from 'mongoose';

/**
 * Chat Schema for storing chat messages between buyers and farmers
 * Supports real-time messaging via Socket.IO
 */
const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop', // Optional: link chat to specific crop
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster queries on sender-receiver pairs
 */
chatSchema.index({ sender: 1, receiver: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
