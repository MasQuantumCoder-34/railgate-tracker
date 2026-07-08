import mongoose, { Schema } from 'mongoose';
import { IFeedbackDocument } from '../types/index.js';

const feedbackSchema = new Schema<IFeedbackDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model<IFeedbackDocument>('Feedback', feedbackSchema);
export default Feedback;
