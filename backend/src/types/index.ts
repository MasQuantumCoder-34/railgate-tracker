import { Request } from 'express';
import { Document } from 'mongoose';

export interface IAdminDocument extends Document {
  username: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
}

export interface IGateStatusDocument extends Document {
  status: 'OPEN' | 'CLOSED';
  waitTime: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  trainsInQueue?: number;
  updatedAt: Date;
}

export interface ITrainDocument extends Document {
  trainName: string;
  trainNumber: string;
  route: string;
  direction: string;
  createdAt: Date;
}

export interface IRouteDocument extends Document {
  routeName: string;
  distance: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface IGateEventDocument extends Document {
  status: 'OPEN' | 'CLOSED';
  waitTime?: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  trainsInQueue?: number;
  timestamp: Date;
}

export interface IFeedbackDocument extends Document {
  name: string;
  email: string;
  message: string;
  resolved: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: IAdminDocument;
    }
  }
}
