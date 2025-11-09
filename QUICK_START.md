# Quick Start Guide - Farmer Marketplace with Expo Go

## ✅ Prerequisites Checklist

- [ ] Node.js installed
- [ ] MongoDB running (local or Atlas)
- [ ] Expo Go app installed on your phone
- [ ] Phone and computer on the same WiFi network

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend (Terminal 1)

```powershell
cd backend
npm install
npm start
```

**Expected output:**
```
✅ MongoDB connected
Server running in development mode on port 5000
Backend accessible at http://localhost:5000
📱 Mobile access: http://192.168.x.x:5000
```

**Note the IP address shown** (192.168.x.x) - this is what your phone will use!

### Step 2: Test Backend Connection (Optional but Recommended)

Open a new terminal:

```powershell
node test-backend.js
```

**Expected output:**
```
🔍 Farmer Marketplace Backend Connection Test
📍 Your computer's IP address: 192.168.x.x
✅ Backend is running on localhost:5000
✅ Backend is accessible from network at 192.168.x.x:5000
✨ Everything looks good!
```

### Step 3: Start Mobile App (Terminal 2)

```powershell
cd mobile
npm install
npm start
```

**Expected output:**
```
Starting Metro Bundler...
📡 API Base URL: http://192.168.x.x:5000/api
QR code displayed...
```

**Scan the QR code with Expo Go** on your phone.

## 📱 Using the App

### First Time Setup:

1. **Register a new account:**
   - Tap "Don't have an account? Register"
   - Fill in: Name, Email, Password
   - Select Role: Farmer or Buyer
   - Tap "Register"

2. **Or Login with existing account:**
   - Enter Email and Password
   - Tap "Login"

### What to Check:

✅ **In the terminal where you ran `npm start` (mobile):**
   - Look for: `📍 Using Expo hostUri for API: http://192.168.x.x:5000/api`
   - This confirms the correct IP is detected

✅ **When you try to login:**
   - Console will show: `Attempting login for: your@email.com`
   - Then: `Login response received: true`
   - Then: `Login successful for user: Your Name`

## ❌ Troubleshooting

### Problem: "Cannot connect to server"

**Diagnosis:**
```powershell
# Check if backend is running
node test-backend.js
```

**Solutions:**
1. ✅ Backend not running → Run `cd backend && npm start`
2. ✅ Firewall blocking → See firewall section below
3. ✅ Wrong network → Connect phone and PC to same WiFi
4. ✅ IP address wrong → Check the console output

### Problem: "Invalid email or password"

**Solutions:**
1. Register a new account first
2. Check backend logs for MongoDB connection issues
3. Make sure you're using the correct credentials

### Problem: "Network request failed"

**Check:**
1. Look at the mobile app terminal for the API URL
2. Should show `http://192.168.x.x:5000/api` NOT `localhost`
3. Test the IP from your phone's browser: `http://192.168.x.x:5000`

### Problem: App loads but login doesn't work

**Debug:**
1. Shake your phone to open Expo menu
2. Tap "Show Expo Console"
3. Look for error messages
4. Check backend terminal for request logs

## 🔥 Windows Firewall Fix

If backend test shows "not accessible from network":

### Method 1: PowerShell (Run as Administrator)

```powershell
New-NetFirewallRule -DisplayName "Farmer Marketplace" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### Method 2: GUI

1. Open "Windows Defender Firewall with Advanced Security"
2. Click "Inbound Rules" → "New Rule..."
3. Type: Port
4. Protocol: TCP, Port: 5000
5. Action: Allow the connection
6. Profile: All
7. Name: Farmer Marketplace Backend

## 🧪 Testing Your Setup

### Test 1: Backend Running
```powershell
curl http://localhost:5000
```
Should show HTML page or API response.

### Test 2: Backend Accessible from Network
```powershell
node test-backend.js
```
Should show ✅ for both localhost and network.

### Test 3: API Endpoint Working
Open browser: `http://localhost:5000/api/auth/login`
Should show: `Cannot GET /api/auth/login` (this is fine - GET not supported)

### Test 4: Mobile App Detects IP
Check mobile terminal for:
```
📍 Using Expo hostUri for API: http://192.168.x.x:5000/api
```

## 📊 System Check

Run all checks at once:

```powershell
# 1. Check Node.js
node --version

# 2. Check if backend is running
curl http://localhost:5000

# 3. Test backend connectivity
node test-backend.js

# 4. Check MongoDB (if local)
mongosh --eval "db.version()"

# 5. Get your IP address
ipconfig | findstr IPv4
```

## 🎯 Success Indicators

You're all set when you see:

- [x] Backend shows: `📱 Mobile access: http://192.168.x.x:5000`
- [x] `test-backend.js` shows: `✅ Everything looks good!`
- [x] Mobile app shows: `📍 Using Expo hostUri for API: http://192.168.x.x:5000/api`
- [x] You can login successfully on your phone
- [x] Console shows: `Login successful for user: Your Name`

## 📚 Need More Help?

- **Detailed Setup:** See `EXPO_SETUP.md`
- **What Was Fixed:** See `LOGIN_FIXES.md`
- **Backend Issues:** Check backend terminal for errors
- **Mobile Issues:** Shake phone → View logs in Expo Go

## 🔧 Common Commands

```powershell
# Start backend
cd backend
npm start

# Start mobile
cd mobile
npm start

# Test connection
node test-backend.js

# Get your IP
ipconfig | findstr IPv4

# Kill process on port 5000 (if stuck)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 💡 Pro Tips

1. **Keep terminals open:** You need both backend and mobile terminals running
2. **Check IP first:** Run `test-backend.js` before starting mobile app
3. **Watch the console:** All important info is logged to the terminal
4. **Firewall:** Most issues are firewall-related on Windows
5. **Same network:** Guest WiFi networks often block device communication

## 🎉 You're Ready!

Once everything is running:
- Backend terminal shows the mobile access URL
- Mobile terminal shows the API URL with your IP
- Expo Go is connected on your phone
- Login works → You're good to go! 🚀
