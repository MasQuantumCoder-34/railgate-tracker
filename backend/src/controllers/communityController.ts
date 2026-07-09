import { Request, Response } from 'express';
import crypto from 'crypto';
import CommunityReport from '../models/CommunityReport.js';

const hashIp = (ip: string) =>
  crypto.createHash('sha256').update(ip + 'gw-salt').digest('hex').slice(0, 12);

export const report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['OPEN', 'CLOSED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be OPEN or CLOSED' });
      return;
    }

    const ipHash = hashIp(req.ip || 'unknown');
    const oneMinAgo = new Date(Date.now() - 60_000);
    const recent = await CommunityReport.findOne({
      ipHash,
      reportedAt: { $gte: oneMinAgo },
    });
    if (recent) {
      res.status(429).json({ success: false, message: 'Please wait before reporting again' });
      return;
    }

    await CommunityReport.create({ reportedStatus: status, ipHash, reportedAt: new Date() });
    res.status(201).json({ success: true, message: `Reported gate as ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error submitting report' });
  }
};

export const getRecentReport = async (_req: Request, res: Response): Promise<void> => {
  try {
    const latest = await CommunityReport.findOne().sort({ reportedAt: -1 });
    if (!latest) {
      res.status(200).json({ success: true, data: null });
      return;
    }
    res.status(200).json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching reports' });
  }
};