import mongoose from 'mongoose';

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

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      codeName: error.codeName,
    });
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
