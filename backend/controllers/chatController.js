import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Chat from '../models/Chat.js';

/**
 * Get chat history between two users
 * @route GET /api/chat/:userId
 * @access Private
 */
const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Other user's ID
  console.log('getChatHistory request:', { userId, currentUserId: req.user._id });

  let currentUserId, otherUserId;
  try {
    currentUserId = new mongoose.Types.ObjectId(req.user._id);
    otherUserId = new mongoose.Types.ObjectId(userId);
  } catch (error) {
    console.error('Invalid ID format in getChatHistory:', error);
    res.status(400);
    throw new Error('Invalid user ID format');
  }

  // Find all messages between current user and specified user
  const messages = await Chat.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  })
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .populate('crop', 'name price')
    .sort({ createdAt: 1 }); // Sort by oldest first

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

/**
 * Send a new message
 * @route POST /api/chat
 * @access Private
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message, cropId } = req.body;

  // Validate required fields
  if (!receiverId || !message) {
    res.status(400);
    throw new Error('Please provide receiver ID and message');
  }

  // Create new chat message
  const chatMessage = await Chat.create({
    sender: req.user._id,
    receiver: receiverId,
    message,
    crop: cropId || null,
  });

  const populatedMessage = await Chat.findById(chatMessage._id)
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .populate('crop', 'name price');

  res.status(201).json({
    success: true,
    data: populatedMessage,
  });
});

/**
 * Get all conversations for current user (list of users chatted with)
 * @route GET /api/chat/conversations
 * @access Private
 */
const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = new mongoose.Types.ObjectId(req.user._id);

  // Get all unique users current user has chatted with
  const conversations = await Chat.aggregate([
    {
      $match: {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', currentUserId] },
            '$receiver',
            '$sender',
          ],
        },
        lastMessage: { $first: '$message' },
        lastMessageTime: { $first: '$createdAt' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', currentUserId] },
                  { $eq: ['$isRead', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 1,
        'user._id': 1,
        'user.name': 1,
        'user.email': 1,
        'user.role': 1,
        lastMessage: 1,
        lastMessageTime: 1,
        unreadCount: 1,
      },
    },
    {
      $sort: { lastMessageTime: -1 },
    },
  ]);

  res.json({
    success: true,
    count: conversations.length,
    data: conversations,
  });
});

/**
 * Mark messages as read
 * @route PUT /api/chat/mark-read/:userId
 * @access Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Sender's ID
  const currentUserId = req.user._id; // Receiver (current user)

  // Update all unread messages from userId to current user
  const result = await Chat.updateMany(
    {
      sender: userId,
      receiver: currentUserId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  res.json({
    success: true,
    message: 'Messages marked as read',
    modifiedCount: result.modifiedCount,
  });
});

export { getChatHistory, sendMessage, getConversations, markAsRead };
