# Running Farmer Marketplace with Expo Go

This guide will help you run the mobile app using Expo Go on your physical device.

## Prerequisites

1. **Backend Server Running**: The backend must be running on your computer
2. **Same WiFi Network**: Your phone and computer must be on the same WiFi network
3. **Expo Go App**: Install Expo Go from App Store (iOS) or Play Store (Android)

## Step-by-Step Setup

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend should be running on `http://localhost:5000`

### 2. Start the Mobile App

In a new terminal:

```bash
cd mobile
npm install
npm start
```

### 3. Connect with Expo Go

1. Open Expo Go app on your phone
2. Scan the QR code shown in the terminal
3. Wait for the app to load

### 4. Check the API Connection

When the app starts, check the Expo console/terminal for:
```
📡 API Base URL: http://192.168.x.x:5000/api
📍 Using Expo hostUri for API: http://192.168.x.x:5000/api
```

This shows the app is correctly detecting your computer's IP address.

## Common Issues & Solutions

### Issue: "Cannot connect to server"

**Solution:**
1. Verify backend is running: Open `http://localhost:5000/api/auth/login` in your browser
2. Check your computer's firewall - it may be blocking port 5000
3. Ensure both devices are on the same WiFi (not guest network)
4. Try restarting both the backend and mobile app

### Issue: "Network request failed"

**Solution:**
1. Check the API URL in the Expo console
2. Make sure it shows your local IP (192.168.x.x), not localhost
3. Test the API from your phone's browser: `http://192.168.x.x:5000/api/auth/login`

### Issue: Login fails with valid credentials

**Solution:**
1. Check the backend logs for errors
2. Verify MongoDB is running and connected
3. Try registering a new user first
4. Check the Expo console for detailed error messages

## Windows Firewall Configuration

If you're on Windows and getting connection errors:

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `5000`
6. Select "Allow the connection"
7. Apply to all profiles
8. Name it "Farmer Marketplace Backend"

## Testing the Connection

### Test Backend from Computer:
```bash
curl http://localhost:5000/api/auth/login
```

### Test Backend from Phone:
1. Open your phone's browser
2. Navigate to `http://YOUR_COMPUTER_IP:5000/api/auth/login`
3. You should see: `Cannot POST /api/auth/login` (this is good - means server is reachable)

## Finding Your Computer's IP Address

### Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with 192.168)

### Mac/Linux:
```bash
ifconfig | grep "inet "
```

## Environment Variables (Optional)

If automatic IP detection doesn't work, you can set a manual API URL:

Create `mobile/.env`:
```
API_BASE_URL=http://YOUR_COMPUTER_IP:5000/api
```

Then restart the Expo app.

## Debug Mode

To see detailed API logs:
1. Shake your phone to open Expo menu
2. Enable "Debug Remote JS"
3. Open Chrome DevTools to see console logs

## Contact

If you continue to have issues, check:
- Backend terminal for errors
- Expo terminal for connection logs  
- Phone's Expo Go app logs (shake phone → View logs)
