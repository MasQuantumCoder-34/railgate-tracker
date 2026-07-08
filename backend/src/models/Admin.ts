import mongoose, { Schema } from 'mongoose';
import { IAdminDocument } from '../types/index.js';

const adminSchema = new Schema<IAdminDocument>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model<IAdminDocument>('Admin', adminSchema);
export default Admin;
