import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Placeholder error handler logic
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};
