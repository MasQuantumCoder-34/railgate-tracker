import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD } from '../config/env';
import Admin from '../models/Admin';

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase().trim() });

    if (existingAdmin) {
      console.log(`Admin user '${ADMIN_USERNAME}' already exists.`);
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await Admin.create({
      username: ADMIN_USERNAME.toLowerCase().trim(),
      passwordHash,
      role: 'superadmin',
    });

    console.log(`Admin user '${ADMIN_USERNAME}' created successfully.`);
    console.log('You can now login with the credentials from .env');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
