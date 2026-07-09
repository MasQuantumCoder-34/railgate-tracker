import { Request, Response } from 'express';
import TrainSchedule from '../models/TrainSchedule.js';

export const getUpcoming = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const todayDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Support both 0..6 (new) and 1..7 (legacy seed) day formats
    const todayDayAlt = todayDay === 0 ? 7 : todayDay;

    let schedules = await TrainSchedule.find({
      active: true,
      daysOfWeek: { $in: [todayDay, todayDayAlt] },
      scheduledTime: { $gte: currentTimeStr },
    })
      .sort({ scheduledTime: 1 })
      .limit(5);

    let dayOffset = 0;
    if (schedules.length === 0) {
      for (let offset = 1; offset <= 7; offset++) {
        const nextDay = (todayDay + offset) % 7;
        const nextDayAlt = nextDay === 0 ? 7 : nextDay;
        schedules = await TrainSchedule.find({
          active: true,
          daysOfWeek: { $in: [nextDay, nextDayAlt] },
        })
          .sort({ scheduledTime: 1 })
          .limit(5);
        if (schedules.length > 0) {
          dayOffset = offset;
          break;
        }
      }
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const upcoming = schedules.map((s) => ({
      _id: s._id,
      trainName: s.trainName,
      trainNumber: s.trainNumber,
      direction: s.direction,
      scheduledTime: s.scheduledTime,
      estimatedWait: s.estimatedWait,
      minutesUntil: getMinutesUntil(s.scheduledTime, dayOffset),
      day: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : dayNames[(todayDay + dayOffset) % 7],
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

function getMinutesUntil(scheduledTime: string, daysAhead: number = 0): number {
  const [h, m] = scheduledTime.split(':').map(Number);
  const scheduled = new Date();
  scheduled.setDate(scheduled.getDate() + daysAhead);
  scheduled.setHours(h, m, 0, 0);
  return Math.round((scheduled.getTime() - Date.now()) / 60000);
}
