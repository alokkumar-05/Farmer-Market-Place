# Farmer Marketplace - MERN + React Native (Expo) + Socket.IO

A full-stack marketplace application connecting farmers directly with buyers. Farmers can list their crops, and buyers can browse listings and chat with farmers in real-time.

## 🚀 Features

### Backend (Node.js + Express + MongoDB + Socket.IO)
- ✅ User authentication with JWT (Farmers & Buyers)
- ✅ Secure password hashing with bcryptjs
- ✅ Crop listing CRUD operations
- ✅ Image upload to Cloudinary
- ✅ Real-time chat using Socket.IO
- ✅ Role-based access control
- ✅ RESTful API with error handling

### Mobile (React Native + Expo)
- ✅ User registration and login
- ✅ Browse available crops
- ✅ Farmers can add/manage crops
- ✅ Real-time chat between buyers and farmers
- ✅ Image picker for crop photos
- ✅ Persistent authentication with AsyncStorage
- ✅ Clean UI with reusable components

## 📁 Project Structure

```
FarmerMarketplace/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/          # Database and Cloudinary configuration
│   ├── models/          # Mongoose models (User, Crop, Chat)
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware and error handlers
│   ├── utils/           # Helper functions
│   └── socket/          # Socket.IO chat handlers
│
├── mobile/
│   ├── App.js
│   ├── package.json
│   ├── screens/         # All screen components
│   ├── components/      # Reusable UI components
│   ├── context/         # AuthContext for state management
│   ├── services/        # API and Socket.IO services
│   ├── constants/       # Colors and theme
│   └── utils/           # Helper utilities
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Physical device

---

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create/Edit the `.env` file and add your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas connection string
   MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/farmer_marketplace?retryWrites=true&w=majority
   
   # JWT Secret (use a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   
   # Cloudinary credentials (from cloudinary.com dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

---

### Mobile Setup

1. **Navigate to mobile folder:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URLs:**
   
   Update your machine's IP address in:
   - `services/api.js` (line 9)
   - `services/socket.js` (line 7)
   
   **Find your IP address:**
   - **Windows:** Open CMD and run `ipconfig` (look for IPv4 Address)
   - **Mac/Linux:** Run `ifconfig` or `ip addr`
   
   Replace `192.168.1.100` with your actual IP address.

4. **Start Expo:**
   ```bash
   npm start
   ```

5. **Run on device:**
   - **iOS:** Press `i` in terminal (requires macOS with Xcode)
   - **Android:** Press `a` in terminal (requires Android Studio)
   - **Physical device:** Install Expo Go app and scan QR code

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | From MongoDB Atlas |
| `JWT_SECRET` | Secret key for JWT tokens | Random secure string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |

---

## 📱 Usage

### For Farmers:
1. Register as a **Farmer**
2. Log in to your account
3. Click **"Add New Crop"** button
4. Fill in crop details and upload image
5. View your listings on the main screen
6. Receive chat messages from buyers

### For Buyers:
1. Register as a **Buyer**
2. Log in to your account
3. Browse available crops
4. Tap on a crop to start chatting with the farmer
5. Send real-time messages

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get single crop
- `POST /api/crops` - Create crop (Farmer only)
- `PUT /api/crops/:id` - Update crop (Farmer only)
- `DELETE /api/crops/:id` - Delete crop (Farmer only)
- `GET /api/crops/my-crops` - Get farmer's crops (Farmer only)

### Chat
- `GET /api/chat/:userId` - Get chat history
- `POST /api/chat` - Send message
- `GET /api/chat/conversations` - Get all conversations
- `PUT /api/chat/mark-read/:userId` - Mark messages as read

---

## 🧩 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **dotenv** - Environment configuration

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Routing and navigation
- **Socket.IO Client** - Real-time chat
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence
- **Expo Image Picker** - Image selection

---

## 📝 Notes

- Make sure MongoDB Atlas is properly configured with network access (allow your IP or 0.0.0.0/0 for testing)
- Update CORS settings in `server.js` for production
- For production, use environment-specific API URLs
- Socket.IO requires the backend server to be running for real-time features
- Images are uploaded as Base64 and stored in Cloudinary

---

## 🐛 Troubleshooting

**Cannot connect to backend from mobile:**
- Ensure backend server is running
- Use your machine's IP address, not `localhost`
- Check firewall settings
- Ensure mobile device is on same WiFi network

**Socket.IO not connecting:**
- Verify Socket.IO server URL in `services/socket.js`
- Check backend server logs for connection attempts
- Ensure no firewall blocking WebSocket connections

**Image upload fails:**
- Verify Cloudinary credentials in `.env`
- Check image size (large images may timeout)
- Ensure Base64 conversion is working

---

## 👨‍💻 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Mobile Development
```bash
cd mobile
npm start    # Opens Expo DevTools
```

---

## 📄 License

ISC

---

## 🤝 Contributing

This is a template project. Feel free to customize and extend it for your needs!

---

**Created with ❤️ using MERN Stack + React Native (Expo) + Socket.IO**
