import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDatabase from './config/database.js';
import { PORT, NODE_ENV } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { checkAndAutoOpen } from './utils/autoGate.js';
import { seedIfEmpty } from './utils/autoSeed.js';
import { startAutoPilot } from './services/autoPilot.js';

import statusRoutes from './routes/status.js';
import trainRoutes from './routes/trains.js';
import routeRoutes from './routes/routes.js';
import feedbackRoutes from './routes/feedback.js';
import statsRoutes from './routes/stats.js';
import iotRoutes from './routes/iot.js';
import scheduleRoutes from './routes/schedule.js';

const app = express();

connectDatabase();

app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GateWatch Vaniyambadi API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/status', statusRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/schedule', scheduleRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`GateWatch API running on port ${PORT} in ${NODE_ENV} mode`);
  seedIfEmpty();
  checkAndAutoOpen();
  startAutoPilot();
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
