import mongoose, { Schema } from 'mongoose';
import { IGateEventDocument } from '../types/index.js';

const gateEventSchema = new Schema<IGateEventDocument>({
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    required: [true, 'Status is required'],
  },
  waitTime: {
    type: Number,
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
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

gateEventSchema.index({ timestamp: -1 });
gateEventSchema.index({ status: 1, timestamp: -1 });

const GateEvent = mongoose.model<IGateEventDocument>('GateEvent', gateEventSchema);
export default GateEvent;
