import { io } from 'socket.io-client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolve Socket.IO server URL dynamically for development
 * Uses Expo host when available, otherwise falls back to emulator/localhost
 */
const getDevSocketURL = () => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:5000`;
  }
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${localhost}:5000`;
};

const SOCKET_URL = __DEV__ ? getDevSocketURL() : (process.env.SOCKET_URL || getDevSocketURL());

let socket = null;

/**
 * Initialize Socket.IO connection
 * @param {String} userId - Current user's ID
 */
export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join with user ID
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

/**
 * Get socket instance
 * @returns {Socket} - Socket.IO instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Send message via Socket.IO
 * @param {Object} messageData - Message data
 */
export const sendSocketMessage = (messageData) => {
  if (socket && socket.connected) {
    socket.emit('sendMessage', messageData);
  }
};

/**
 * Listen for incoming messages
 * @param {Function} callback - Callback function to handle received messages
 */
export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on('receiveMessage', callback);
  }
};

/**
 * Listen for message sent confirmation
 * @param {Function} callback - Callback function
 */
export const onMessageSent = (callback) => {
  if (socket) {
    socket.on('messageSent', callback);
  }
};

/**
 * Emit typing indicator
 * @param {String} senderId - Current user's ID
 * @param {String} receiverId - Other user's ID
 */
export const emitTyping = (senderId, receiverId) => {
  if (socket && socket.connected) {
    socket.emit('typing', { senderId, receiverId });
  }
};

/**
 * Emit stop typing indicator
 * @param {String} senderId - Current user's ID
 * @param {String} receiverId - Other user's ID
 */
export const emitStopTyping = (senderId, receiverId) => {
  if (socket && socket.connected) {
    socket.emit('stopTyping', { senderId, receiverId });
  }
};

/**
 * Listen for typing indicator
 * @param {Function} callback - Callback function
 */
export const onUserTyping = (callback) => {
  if (socket) {
    socket.on('userTyping', callback);
  }
};

/**
 * Listen for stop typing indicator
 * @param {Function} callback - Callback function
 */
export const onUserStoppedTyping = (callback) => {
  if (socket) {
    socket.on('userStoppedTyping', callback);
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  sendSocketMessage,
  onReceiveMessage,
  onMessageSent,
  emitTyping,
  emitStopTyping,
  onUserTyping,
  onUserStoppedTyping,
  disconnectSocket,
};
