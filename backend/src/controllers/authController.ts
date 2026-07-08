import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

interface LoginBody {
  username: string;
  password: string;
}

const generateToken = (admin: any): string => {
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as LoginBody;

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminData = (req as any).admin;

    if (!adminData) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const admin = await Admin.findById(adminData._id).select('-passwordHash');

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin',
    });
  }
};
