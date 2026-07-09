import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainSchedule extends Document {
  trainName: string;
  trainNumber: string;
  direction: string;
  scheduledTime: string; // "HH:mm" format
  daysOfWeek: number[];
  estimatedWait: number; // estimated gate closure minutes
  active: boolean;
  createdAt: Date;
}

const trainScheduleSchema = new Schema<ITrainSchedule>({
  trainName: {
    type: String,
    required: [true, 'Train name is required'],
    trim: true,
  },
  trainNumber: {
    type: String,
    required: [true, 'Train number is required'],
    trim: true,
  },
  direction: {
    type: String,
    required: [true, 'Direction is required'],
    enum: ['up', 'down'],
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
  },
  daysOfWeek: {
    type: [Number],
    default: [0, 1, 2, 3, 4, 5, 6],
  },
  estimatedWait: {
    type: Number,
    default: 15,
    min: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

trainScheduleSchema.index({ active: 1, scheduledTime: 1 });

const TrainSchedule = mongoose.model<ITrainSchedule>('TrainSchedule', trainScheduleSchema);
export default TrainSchedule;
