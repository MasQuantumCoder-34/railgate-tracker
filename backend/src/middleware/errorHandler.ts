import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/env';

interface CustomError extends Error {
  statusCode?: number;
  errors?: Array<{ msg: string; param: string }>;
  code?: number;
  keyValue?: Record<string, string>;
  kind?: string;
}

const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction): void => {
  if (NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${(err as any).path}: ${(err as any).value}`;
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for ${field}. This ${field} already exists.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
