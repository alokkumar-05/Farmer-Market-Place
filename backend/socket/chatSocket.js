import Chat from '../models/Chat.js';

/**
 * Initialize Socket.IO for real-time chat
 * Handles connection, message sending, and disconnection
 * @param {Object} io - Socket.IO server instance
 */
const initializeSocket = (io) => {
  // Store connected users with their socket IDs
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    /**
     * User joins with their user ID
     * Maps userId to socket ID for targeted messaging
     */
    socket.on('join', (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);
      socket.join(userId); // Join room with userId
    });

    /**
     * Handle sending a message
     * Saves message to database and emits to receiver in real-time
     */
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, message, cropId } = data;

        // Save message to database
        const chatMessage = await Chat.create({
          sender: senderId,
          receiver: receiverId,
          message,
          crop: cropId || null,
        });

        // Populate message with user details
        const populatedMessage = await Chat.findById(chatMessage._id)
          .populate('sender', 'name email role')
          .populate('receiver', 'name email role')
          .populate('crop', 'name price');

        // Send message to receiver if they are online
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', populatedMessage);
        }

        // Send confirmation back to sender
        socket.emit('messageSent', populatedMessage);

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('messageError', { error: error.message });
      }
    });

    /**
     * Handle typing indicator
     * Notify receiver that sender is typing
     */
    socket.on('typing', (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', { userId: senderId });
      }
    });

    /**
     * Handle stop typing indicator
     */
    socket.on('stopTyping', (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userStoppedTyping', { userId: senderId });
      }
    });

    /**
     * Handle disconnection
     * Remove user from connected users map
     */
    socket.on('disconnect', () => {
      // Find and remove user from connected users
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.IO initialized successfully');
};

export default initializeSocket;
