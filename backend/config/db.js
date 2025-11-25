import mongoose from 'mongoose';
import dns from 'node:dns/promises';

/**
 * Small preflight to check DNS SRV resolution for mongodb+srv URIs.
 * Helps produce actionable errors when local DNS blocks SRV lookups.
 */
async function preflightDNS(uri) {
  try {
    if (!uri.startsWith('mongodb+srv://')) return; // Only relevant for SRV
    const host = uri.split('@')[1]?.split('/')[0];
    if (!host) return;
    const srvName = `_mongodb._tcp.${host}`;
    await dns.resolveSrv(srvName);
  } catch (e) {
    const details = {
      message: e.message,
      code: e.code,
      syscall: e.syscall,
      hostname: e.hostname,
    };
    console.error('DNS SRV resolution failed for MongoDB Atlas host. This is often a local DNS/VPN/firewall issue.', details);
    throw new Error('DNS resolution for MongoDB SRV record failed. Please check your network DNS settings or VPN.');
  }
}

/**
 * Connect to MongoDB database
 * Uses Mongoose to establish connection with MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set. Please define it in your .env file.');
    }

    // Quick DNS preflight to fail fast with clearer guidance
    await preflightDNS(uri);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // faster feedback during dev
      socketTimeoutMS: 20000,
      family: 4, // prefer IPv4 on networks where IPv6 is problematic
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      codeName: error.codeName,
    });
    console.error('Troubleshooting tips:');
    console.error('- Ensure your IP is allowlisted in Atlas (Network Access)');
    console.error('- Verify your DNS can resolve the Atlas host (try switching DNS to 1.1.1.1 / 8.8.8.8)');
    console.error('- Disconnect VPN/Proxy that could block SRV DNS lookups');
    console.error('- Confirm the cluster is running (not paused)');
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
