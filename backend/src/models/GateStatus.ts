import mongoose, { Schema } from 'mongoose';
import { IGateStatusDocument } from '../types';

const gateStatusSchema = new Schema<IGateStatusDocument>({
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    required: [true, 'Status is required'],
  },
  waitTime: {
    type: Number,
    default: 0,
    min: 0,
  },
  trainName: {
    type: String,
    trim: true,
  },
  trainNumber: {
    type: String,
    trim: true,
  },
  direction: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  trainsInQueue: {
    type: Number,
    default: 0,
    min: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

gateStatusSchema.index({ updatedAt: -1 });

const GateStatus = mongoose.model<IGateStatusDocument>('GateStatus', gateStatusSchema);
export default GateStatus;
