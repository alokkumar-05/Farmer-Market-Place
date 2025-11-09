// Quick test script to verify backend is running
// Run with: node test-backend.js

const http = require('http');

const testEndpoint = (host, port, path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    console.log(`Testing: http://${host}:${port}${path}`);
    
    const req = http.request(options, (res) => {
      console.log(`✅ Backend is reachable! Status: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.log(`❌ Backend not reachable: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log(`❌ Request timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

const getLocalIP = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

async function main() {
  console.log('\n🔍 Farmer Marketplace Backend Connection Test\n');
  console.log('=' .repeat(50));
  
  const localIP = getLocalIP();
  console.log(`\n📍 Your computer's IP address: ${localIP}`);
  console.log(`   Use this IP in your mobile app if needed\n`);
  
  console.log('Testing localhost connection...');
  try {
    await testEndpoint('localhost', 5000, '/api/auth/login');
    console.log('✅ Backend is running on localhost:5000\n');
  } catch (error) {
    console.log('❌ Backend is NOT running on localhost:5000');
    console.log('   Please start the backend with: cd backend && npm start\n');
    process.exit(1);
  }
  
  if (localIP !== 'localhost') {
    console.log(`Testing network connection (${localIP})...`);
    try {
      await testEndpoint(localIP, 5000, '/api/auth/login');
      console.log(`✅ Backend is accessible from network at ${localIP}:5000\n`);
      console.log('=' .repeat(50));
      console.log(`\n✨ Everything looks good! Your mobile app should connect to:`);
      console.log(`   http://${localIP}:5000/api\n`);
    } catch (error) {
      console.log(`❌ Backend is NOT accessible from network at ${localIP}:5000`);
      console.log('   This might be a firewall issue. Check EXPO_SETUP.md for help\n');
    }
  }
  
  console.log('\n📱 Next steps:');
  console.log('   1. Start mobile app: cd mobile && npm start');
  console.log('   2. Scan QR code with Expo Go');
  console.log('   3. Check Expo console for API URL');
  console.log('   4. Try logging in with your credentials\n');
}

main().catch(console.error);
