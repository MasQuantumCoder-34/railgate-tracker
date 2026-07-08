import mongoose, { Schema } from 'mongoose';
import { IRouteDocument } from '../types';

const routeSchema = new Schema<IRouteDocument>({
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    unique: true,
    trim: true,
  },
  distance: {
    type: String,
    required: [true, 'Distance is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Route = mongoose.model<IRouteDocument>('Route', routeSchema);
export default Route;
