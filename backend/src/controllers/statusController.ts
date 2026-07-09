import { Request, Response } from 'express';
import GateStatus from '../models/GateStatus.js';
import GateClosure from '../models/GateClosure.js';
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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayClosures = await GateClosure.countDocuments({
      closedAt: { $gte: todayStart },
    });

    let activeClosure = null;
    if (latestStatus.status === 'CLOSED') {
      activeClosure = await GateClosure.findOne({ isActive: true }).sort({ closedAt: -1 });
    }

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
        activeClosure,
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

    const now = new Date();

    if (status === 'CLOSED') {
      const expectedMinutes = waitTime || 10;
      await GateClosure.create({
        trainName: trainName || 'Train',
        trainNumber: trainNumber || '',
        direction: direction || 'up',
        closedAt: now,
        durationMinutes: expectedMinutes,
        isActive: true,
      });
      checkAndAutoOpen();
    } else {
      await GateClosure.findOneAndUpdate(
        { isActive: true },
        {
          openedAt: now,
          isActive: false,
        },
        { sort: { closedAt: -1 } }
      );
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

export const getRecentClosures = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const closures = await GateClosure.find()
      .sort({ closedAt: -1 })
      .limit(Math.min(limit, 50));

    res.status(200).json({
      success: true,
      data: closures,
      count: closures.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent closures',
    });
  }
};