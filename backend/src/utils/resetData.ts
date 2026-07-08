import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI } from '../config/env.js';
import GateStatus from '../models/GateStatus.js';
import GateEvent from '../models/GateEvent.js';

const resetData = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for reset...');

    const statusCount = await GateStatus.countDocuments();
    const eventCount = await GateEvent.countDocuments();

    await GateStatus.deleteMany({});
    await GateEvent.deleteMany({});

    console.log(`Deleted ${statusCount} status records and ${eventCount} event records.`);
    console.log('Gate history cleared. System is ready for fresh data.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetData();
