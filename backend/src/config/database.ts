import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed — starting without database:', (error as Error).message);
  }
};

export default connectDatabase;
