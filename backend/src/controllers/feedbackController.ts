import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resolved } = req.query;
    const filter: Record<string, unknown> = {};

    if (resolved === 'true') {
      filter.resolved = true;
    } else if (resolved === 'false') {
      filter.resolved = false;
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
      count: feedbacks.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching feedback',
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating feedback',
    });
  }
};

export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting feedback',
    });
  }
};

export const markResolved = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
      return;
    }

    feedback.resolved = !feedback.resolved;
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
      message: `Feedback marked as ${feedback.resolved ? 'resolved' : 'unresolved'}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating feedback',
    });
  }
};
