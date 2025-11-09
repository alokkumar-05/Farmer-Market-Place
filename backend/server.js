import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import initializeSocket from './socket/chatSocket.js';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Load environment variables
dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
await connectDB();

// Configure Cloudinary
configureCloudinary();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies (increased limit for images)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets in public/
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/chat', chatRoutes);

// Root route - serve the web UI landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple UI routes (served from /public)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/crops', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crops.html'));
});
app.get('/buyer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buyer.html'));
});
app.get('/farmer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'farmer.html'));
});
app.get('/add-product', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO chat handlers
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Backend accessible at http://localhost:${PORT}`);
  // Get local IP for mobile testing
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`📱 Mobile access: http://${iface.address}:${PORT}`);
      }
    }
  }
});
