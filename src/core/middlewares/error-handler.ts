import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const serverError = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

export const notFoundError = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Resource not found',
    path: req.originalUrl, // Helpful for debugging
  });
};
