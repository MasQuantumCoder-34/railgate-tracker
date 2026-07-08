import { Request, Response, NextFunction } from 'express';

const IOT_API_KEY = process.env.IOT_API_KEY || 'gatewatch-iot-default-key';

export const validateIotKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string || req.query.apiKey as string;

  if (!apiKey || apiKey !== IOT_API_KEY) {
    res.status(401).json({
      success: false,
      message: 'Invalid or missing IoT API key',
    });
    return;
  }

  next();
};
