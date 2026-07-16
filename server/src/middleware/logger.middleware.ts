import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder logger logic
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
