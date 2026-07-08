import { Request, Response } from 'express';
import Train from '../models/Train';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const trains = await Train.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: trains,
      count: trains.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching trains',
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trainName, trainNumber, route, direction } = req.body;

    const existing = await Train.findOne({ trainNumber: trainNumber.trim() });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'A train with this number already exists',
      });
      return;
    }

    const train = await Train.create({
      trainName: trainName.trim(),
      trainNumber: trainNumber.trim(),
      route: route.trim(),
      direction: direction.trim(),
    });

    res.status(201).json({
      success: true,
      data: train,
      message: 'Train created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating train',
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { trainName, trainNumber, route, direction } = req.body;

    const train = await Train.findById(id);
    if (!train) {
      res.status(404).json({
        success: false,
        message: 'Train not found',
      });
      return;
    }

    if (trainNumber && trainNumber.trim() !== train.trainNumber) {
      const existing = await Train.findOne({ trainNumber: trainNumber.trim() });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'A train with this number already exists',
        });
        return;
      }
    }

    if (trainName) train.trainName = trainName.trim();
    if (trainNumber) train.trainNumber = trainNumber.trim();
    if (route) train.route = route.trim();
    if (direction) train.direction = direction.trim();

    await train.save();

    res.status(200).json({
      success: true,
      data: train,
      message: 'Train updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating train',
    });
  }
};

export const deleteTrain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const train = await Train.findByIdAndDelete(id);

    if (!train) {
      res.status(404).json({
        success: false,
        message: 'Train not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Train deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting train',
    });
  }
};
