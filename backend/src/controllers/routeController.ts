import { Request, Response } from 'express';
import Route from '../models/Route';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: routes,
      count: routes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching routes',
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeName, distance, status } = req.body;

    const existing = await Route.findOne({ routeName: routeName.trim() });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'A route with this name already exists',
      });
      return;
    }

    const route = await Route.create({
      routeName: routeName.trim(),
      distance: distance.trim(),
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      data: route,
      message: 'Route created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating route',
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { routeName, distance, status } = req.body;

    const route = await Route.findById(id);
    if (!route) {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
      return;
    }

    if (routeName && routeName.trim() !== route.routeName) {
      const existing = await Route.findOne({ routeName: routeName.trim() });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'A route with this name already exists',
        });
        return;
      }
    }

    if (routeName) route.routeName = routeName.trim();
    if (distance) route.distance = distance.trim();
    if (status) route.status = status;

    await route.save();

    res.status(200).json({
      success: true,
      data: route,
      message: 'Route updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating route',
    });
  }
};

export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const route = await Route.findByIdAndDelete(id);

    if (!route) {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Route deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting route',
    });
  }
};
