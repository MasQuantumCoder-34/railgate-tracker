import { Request, Response } from 'express';
import GateStatus from '../models/GateStatus.js';
import GateEvent from '../models/GateEvent.js';
import { checkAndAutoOpen, cancelAutoOpen } from '../utils/autoGate.js';

export const updateFromSensor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, waitTime, trainName, trainNumber, direction, notes } = req.body;

    if (!status || !['OPEN', 'CLOSED'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Status must be OPEN or CLOSED',
      });
      return;
    }

    const entry = await GateStatus.create({
      status,
      waitTime: status === 'CLOSED' ? (waitTime || 0) : 0,
      trainName: status === 'CLOSED' ? trainName : undefined,
      trainNumber: status === 'CLOSED' ? trainNumber : undefined,
      direction: status === 'CLOSED' ? direction : undefined,
      notes: notes || `IoT sensor update`,
      updatedAt: new Date(),
    });

    await GateEvent.create({
      status,
      waitTime: status === 'CLOSED' ? (waitTime || 0) : 0,
      trainName: status === 'CLOSED' ? trainName : undefined,
      trainNumber: status === 'CLOSED' ? trainNumber : undefined,
      direction: status === 'CLOSED' ? direction : undefined,
      notes: notes || undefined,
      timestamp: new Date(),
    });

    if (status === 'CLOSED') {
      checkAndAutoOpen();
    } else {
      cancelAutoOpen();
    }

    res.status(201).json({
      success: true,
      data: entry,
      message: `IoT sensor: gate ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'IoT sensor update failed',
    });
  }
};

export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  const latest = await GateStatus.findOne().sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      device: 'GateWatch IoT Sensor',
      version: '1.0.0',
      currentStatus: latest?.status || 'UNKNOWN',
      lastUpdated: latest?.updatedAt || null,
      apiEndpoint: '/api/iot/status',
      authMethod: 'x-api-key header',
    },
  });
};
