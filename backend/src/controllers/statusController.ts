import { Request, Response } from 'express';
import GateStatus from '../models/GateStatus.js';
import GateEvent from '../models/GateEvent.js';
import { checkAndAutoOpen, cancelAutoOpen } from '../utils/autoGate.js';

export const getCurrentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestStatus = await GateStatus.findOne().sort({ updatedAt: -1 });

    if (!latestStatus) {
      res.status(200).json({
        success: true,
        data: {
          status: 'OPEN',
          waitTime: 0,
          updatedAt: new Date(),
          message: 'No status records found',
        },
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayClosures = await GateEvent.countDocuments({
      status: 'CLOSED',
      timestamp: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        _id: latestStatus._id,
        status: latestStatus.status,
        waitTime: latestStatus.waitTime,
        trainName: latestStatus.trainName,
        trainNumber: latestStatus.trainNumber,
        direction: latestStatus.direction,
        notes: latestStatus.notes,
        updatedAt: latestStatus.updatedAt,
        todayClosures,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching current status',
    });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, waitTime, trainName, trainNumber, direction, notes, trainsInQueue } = req.body;

    const newStatus = await GateStatus.create({
      status,
      waitTime: status === 'CLOSED' ? (waitTime || 0) : 0,
      trainName: status === 'CLOSED' ? trainName : undefined,
      trainNumber: status === 'CLOSED' ? trainNumber : undefined,
      direction: status === 'CLOSED' ? direction : undefined,
      notes: notes || undefined,
      trainsInQueue: status === 'CLOSED' ? (trainsInQueue ?? 1) : 0,
      updatedAt: new Date(),
    });

    await GateEvent.create({
      status,
      waitTime: status === 'CLOSED' ? (waitTime || 0) : 0,
      trainName: status === 'CLOSED' ? trainName : undefined,
      trainNumber: status === 'CLOSED' ? trainNumber : undefined,
      direction: status === 'CLOSED' ? direction : undefined,
      notes: notes || undefined,
      trainsInQueue: status === 'CLOSED' ? (trainsInQueue ?? 1) : 0,
      timestamp: new Date(),
    });

    if (status === 'CLOSED') {
      checkAndAutoOpen();
    } else {
      cancelAutoOpen();
    }

    res.status(201).json({
      success: true,
      data: newStatus,
      message: `Gate status updated to ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating gate status',
    });
  }
};

export const getRecentUpdates = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const events = await GateEvent.find()
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 100));

    res.status(200).json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent updates',
    });
  }
};
