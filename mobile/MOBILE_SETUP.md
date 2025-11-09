# Mobile App Setup Guide

## Prerequisites
1. **Same WiFi Network**: Your phone and computer MUST be on the same WiFi network
2. **Backend Running**: Backend server must be running on port 5000
3. **Expo Go App**: Install Expo Go app on your phone from App Store or Play Store

## Setup Steps

### 1. Start the Backend Server
```bash
cd ../backend
npm start
```

Look for the IP address in the console output. It will show something like:
```
📱 Mobile access: http://192.168.x.x:5000
```

### 2. Start the Mobile App
```bash
cd mobile
npm start
# or
npx expo start
```

### 3. Scan QR Code with Expo Go
- **iOS**: Open Camera app and scan the QR code
- **Android**: Open Expo Go app and scan the QR code

## Troubleshooting Network Errors

### Check Your IP Address
Run this command in the mobile folder:
```bash
node get-ip.js
```

### Common Issues

#### 1. "Network Error" or "Network request failed"
**Solution:**
- Verify both devices are on the same WiFi (not mobile data)
- Check if backend is running: Open browser on your phone and visit `http://YOUR_IP:5000`
- Check Windows Firewall settings - it may be blocking port 5000
- Restart both backend and Expo

#### 2. "Unable to connect to API"
**Solution:**
- Backend must listen on `0.0.0.0` (already configured)
- Check console logs for the API base URL - it should show your local IP
- Ensure no VPN is running on your computer

#### 3. Windows Firewall Blocking
If Windows Firewall is blocking the connection, you may need to:
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Find Node.js and allow it on Private networks

Or temporarily disable firewall for testing (not recommended for production).

### Testing Backend Connection

Open a browser on your phone and visit:
```
http://YOUR_IP_ADDRESS:5000/api/crops
```

Replace `YOUR_IP_ADDRESS` with your computer's IP (e.g., 192.168.1.100).

If you see JSON data, the backend is accessible. If you get a timeout or error, there's a network/firewall issue.

## Automatic Navigation

After successful login:
- **Farmers** → Automatically redirected to Farmer Dashboard (My Products)
- **Buyers** → Automatically redirected to Buyer Dashboard (Marketplace)

The app will automatically detect your role and show the appropriate dashboard.

## Debug Mode

To see detailed API logs:
1. Open the app in Expo Go
2. Shake your phone to open dev menu
3. Select "Show Dev Menu"
4. Enable "Remote JS Debugging"
5. Check console logs in your browser's developer tools
