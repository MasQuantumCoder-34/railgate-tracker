import { Request, Response } from 'express';
import TrainSchedule from '../models/TrainSchedule.js';

export const getUpcoming = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMin = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHour}:${currentMin}`;
    const todayDay = now.getDay() || 7; // Convert Sunday=0 to 7 for easier matching

    const schedules = await TrainSchedule.find({
      active: true,
      daysOfWeek: todayDay,
      scheduledTime: { $gte: currentTimeStr },
    })
      .sort({ scheduledTime: 1 })
      .limit(5);

    const upcoming = schedules.map((s) => ({
      _id: s._id,
      trainName: s.trainName,
      trainNumber: s.trainNumber,
      direction: s.direction,
      scheduledTime: s.scheduledTime,
      estimatedWait: s.estimatedWait,
      minutesUntil: getMinutesUntil(s.scheduledTime),
    }));

    res.status(200).json({
      success: true,
      data: upcoming,
      count: upcoming.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming trains',
    });
  }
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const schedules = await TrainSchedule.find().sort({ scheduledTime: 1 });
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching schedules' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await TrainSchedule.create(req.body);
    res.status(201).json({ success: true, data: schedule, message: 'Schedule created' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create schedule' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await TrainSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) {
      res.status(404).json({ success: false, message: 'Schedule not found' });
      return;
    }
    res.status(200).json({ success: true, data: schedule, message: 'Schedule updated' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update schedule' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await TrainSchedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      res.status(404).json({ success: false, message: 'Schedule not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting schedule' });
  }
};

function getMinutesUntil(scheduledTime: string): number {
  const [h, m] = scheduledTime.split(':').map(Number);
  const now = new Date();
  const scheduled = new Date(now);
  scheduled.setHours(h, m, 0, 0);
  return Math.round((scheduled.getTime() - now.getTime()) / 60000);
}
