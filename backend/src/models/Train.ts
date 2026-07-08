import mongoose, { Schema } from 'mongoose';
import { ITrainDocument } from '../types';

const trainSchema = new Schema<ITrainDocument>({
  trainName: {
    type: String,
    required: [true, 'Train name is required'],
    trim: true,
  },
  trainNumber: {
    type: String,
    required: [true, 'Train number is required'],
    unique: true,
    trim: true,
  },
  route: {
    type: String,
    required: [true, 'Route is required'],
    trim: true,
  },
  direction: {
    type: String,
    required: [true, 'Direction is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

trainSchema.index({ trainNumber: 1 });

const Train = mongoose.model<ITrainDocument>('Train', trainSchema);
export default Train;
