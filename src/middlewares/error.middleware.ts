// middleware/error.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.js';

export const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let status = 'error';
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else {
    // Log unexpected errors for developers
    console.error('UNEXPECTED ERROR 💥', err);
    
    // In production, do not leak error details
    if (process.env.NODE_ENV === 'production') {
        message = 'Something went wrong!';
    } else {
        message = err.message;
    }
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};