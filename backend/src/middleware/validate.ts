import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join(', '),
    });
    return;
  }
  next();
};

export const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  handleValidationErrors,
];

export const gateStatusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['OPEN', 'CLOSED'])
    .withMessage('Status must be OPEN or CLOSED'),
  body('waitTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Wait time must be a non-negative integer'),
  body('trainName')
    .optional()
    .trim()
    .isString()
    .withMessage('Train name must be a string'),
  body('trainNumber')
    .optional()
    .trim()
    .isString()
    .withMessage('Train number must be a string'),
  body('direction')
    .optional()
    .trim()
    .isString()
    .withMessage('Direction must be a string'),
  body('notes')
    .optional()
    .trim()
    .isString()
    .withMessage('Notes must be a string'),
  handleValidationErrors,
];

export const createTrainValidation = [
  body('trainName')
    .trim()
    .notEmpty()
    .withMessage('Train name is required'),
  body('trainNumber')
    .trim()
    .notEmpty()
    .withMessage('Train number is required'),
  body('route')
    .trim()
    .notEmpty()
    .withMessage('Route is required'),
  body('direction')
    .trim()
    .notEmpty()
    .withMessage('Direction is required'),
  handleValidationErrors,
];

export const createRouteValidation = [
  body('routeName')
    .trim()
    .notEmpty()
    .withMessage('Route name is required'),
  body('distance')
    .trim()
    .notEmpty()
    .withMessage('Distance is required'),
  handleValidationErrors,
];

export const feedbackValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
  handleValidationErrors,
];
