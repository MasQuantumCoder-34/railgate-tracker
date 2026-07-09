import { Request, Response } from 'express';
import GateClosure from '../models/GateClosure.js';
import Feedback from '../models/Feedback.js';

export const getPublicStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayClosures = await GateClosure.countDocuments({
      closedAt: { $gte: todayStart },
    });

    const todayClosureDocs = await GateClosure.find({
      closedAt: { $gte: todayStart },
    });

    let avgWaitToday = 0;
    let longestWaitToday = 0;
    let shortestWaitToday = 0;

    if (todayClosureDocs.length > 0) {
      const durations = todayClosureDocs.map((c) => c.durationMinutes || 0);
      const total = durations.reduce((sum, d) => sum + d, 0);
      avgWaitToday = Math.round(total / durations.length);
      longestWaitToday = Math.max(...durations);
      shortestWaitToday = Math.min(...durations);
    }

    const weeklyClosures = await GateClosure.countDocuments({
      closedAt: { $gte: weekStart },
    });

    const monthlyClosures = await GateClosure.countDocuments({
      closedAt: { $gte: monthStart },
    });

    const dailyAggregation = await GateClosure.aggregate([
      { $match: { closedAt: { $gte: todayStart } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$closedAt' } },
          closures: { $sum: 1 },
          avgWait: { $avg: '$durationMinutes' },
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

    const todayTotalClosures = await GateClosure.countDocuments({
      closedAt: { $gte: todayStart },
    });

    const todayCompleted = await GateClosure.countDocuments({
      closedAt: { $gte: todayStart },
      isActive: false,
    });

    const todayClosedDocs = await GateClosure.find({
      closedAt: { $gte: todayStart },
      isActive: false,
    });

    let avgWaitToday = 0;
    if (todayClosedDocs.length > 0) {
      const total = todayClosedDocs.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);
      avgWaitToday = Math.round(total / todayClosedDocs.length);
    }

    const totalClosures = await GateClosure.countDocuments({});
    const totalCompleted = await GateClosure.countDocuments({ isActive: false });
    const totalFeedbacks = await Feedback.countDocuments();
    const unresolvedFeedbacks = await Feedback.countDocuments({ resolved: false });

    res.status(200).json({
      success: true,
      data: {
        today: {
          totalClosures: todayTotalClosures,
          completed: todayCompleted,
          avgWait: avgWaitToday,
        },
        allTime: {
          totalClosures,
          totalCompleted,
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