import { Request, Response } from 'express';
import GateEvent from '../models/GateEvent';
import GateStatus from '../models/GateStatus';
import Feedback from '../models/Feedback';

export const getPublicStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayClosures = await GateEvent.countDocuments({
      status: 'CLOSED',
      timestamp: { $gte: todayStart },
    });

    const todayEvents = await GateEvent.find({
      status: 'CLOSED',
      timestamp: { $gte: todayStart },
    });

    let avgWaitToday = 0;
    let longestWaitToday = 0;
    let shortestWaitToday = 0;

    if (todayEvents.length > 0) {
      const waitTimes = todayEvents.map((e) => e.waitTime || 0);
      const totalWait = waitTimes.reduce((sum, w) => sum + w, 0);
      avgWaitToday = Math.round(totalWait / waitTimes.length);
      longestWaitToday = Math.max(...waitTimes);
      shortestWaitToday = Math.min(...waitTimes);
    }

    const weeklyClosures = await GateEvent.countDocuments({
      status: 'CLOSED',
      timestamp: { $gte: weekStart },
    });

    const monthlyClosures = await GateEvent.countDocuments({
      status: 'CLOSED',
      timestamp: { $gte: monthStart },
    });

    const dailyAggregation = await GateEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: todayStart },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          closures: { $sum: { $cond: [{ $eq: ['$status', 'CLOSED'] }, 1, 0] } },
          openings: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
          avgWait: { $avg: '$waitTime' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayClosures,
        avgWaitToday,
        longestWaitToday,
        shortestWaitToday,
        weeklyClosures,
        monthlyClosures,
        dailyAggregation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching public stats',
    });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayTotalUpdates = await GateEvent.countDocuments({
      timestamp: { $gte: todayStart },
    });

    const todayClosures = await GateEvent.countDocuments({
      status: 'CLOSED',
      timestamp: { $gte: todayStart },
    });

    const todayOpenings = await GateEvent.countDocuments({
      status: 'OPEN',
      timestamp: { $gte: todayStart },
    });

    const todayClosedEvents = await GateEvent.find({
      status: 'CLOSED',
      timestamp: { $gte: todayStart },
    });

    let avgWaitToday = 0;
    if (todayClosedEvents.length > 0) {
      const totalWait = todayClosedEvents.reduce((sum, e) => sum + (e.waitTime || 0), 0);
      avgWaitToday = Math.round(totalWait / todayClosedEvents.length);
    }

    const totalClosuresAllTime = await GateEvent.countDocuments({ status: 'CLOSED' });
    const totalOpeningsAllTime = await GateEvent.countDocuments({ status: 'OPEN' });
    const totalFeedbacks = await Feedback.countDocuments();
    const unresolvedFeedbacks = await Feedback.countDocuments({ resolved: false });

    res.status(200).json({
      success: true,
      data: {
        today: {
          totalUpdates: todayTotalUpdates,
          closures: todayClosures,
          openings: todayOpenings,
          avgWait: avgWaitToday,
        },
        allTime: {
          totalClosures: totalClosuresAllTime,
          totalOpenings: totalOpeningsAllTime,
          totalFeedbacks,
          unresolvedFeedbacks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin stats',
    });
  }
};
