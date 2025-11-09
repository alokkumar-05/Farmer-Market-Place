const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
console.log('\n🌐 Your Local IP Address:', ip);
console.log('\n📱 For Expo Go to work:');
console.log('   1. Make sure your phone and computer are on the same WiFi network');
console.log('   2. Backend should be running at: http://' + ip + ':5000');
console.log('   3. Expo will automatically use this IP when you scan the QR code\n');
