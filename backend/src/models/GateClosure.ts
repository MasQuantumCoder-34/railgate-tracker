import mongoose, { Schema, Document } from 'mongoose';

export interface IGateClosure extends Document {
  trainName: string;
  trainNumber: string;
  direction: string;
  closedAt: Date;
  openedAt?: Date;
  durationMinutes: number;
  isActive: boolean;
}

const gateClosureSchema = new Schema<IGateClosure>({
  trainName: {
    type: String,
    default: '',
    trim: true,
  },
  trainNumber: {
    type: String,
    default: '',
    trim: true,
  },
  direction: {
    type: String,
    default: 'up',
    trim: true,
  },
  closedAt: {
    type: Date,
    required: [true, 'closedAt is required'],
  },
  openedAt: {
    type: Date,
  },
  durationMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

gateClosureSchema.index({ closedAt: -1 });
gateClosureSchema.index({ isActive: 1 });

const GateClosure = mongoose.model<IGateClosure>('GateClosure', gateClosureSchema);
export default GateClosure;