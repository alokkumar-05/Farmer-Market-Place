import express from 'express';
import {
  getChatHistory,
  sendMessage,
  getConversations,
  markAsRead,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/chat/conversations
 * @desc    Get all conversations for current user
 * @access  Private
 */
router.get('/conversations', protect, getConversations);

/**
 * @route   GET /api/chat/:userId
 * @desc    Get chat history with specific user
 * @access  Private
 */
router.get('/:userId', protect, getChatHistory);

/**
 * @route   POST /api/chat
 * @desc    Send a new message
 * @access  Private
 */
router.post('/', protect, sendMessage);

/**
 * @route   PUT /api/chat/mark-read/:userId
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/mark-read/:userId', protect, markAsRead);

export default router;
