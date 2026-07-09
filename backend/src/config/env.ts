import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PORT = parseInt(process.env.PORT || '5000', 10);
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gatewatch';
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const RAILRADAR_API_KEY = process.env.RAILRADAR_API_KEY || '';
export const RAILRADAR_API_URL = process.env.RAILRADAR_API_URL || 'https://api.railradar.in/v1';
