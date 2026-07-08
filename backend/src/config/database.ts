import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from './env';

const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.error('MongoDB connection error:', error);
    } else {
      console.error('MongoDB connection error');
    }
    process.exit(1);
  }
};

export default connectDatabase;
