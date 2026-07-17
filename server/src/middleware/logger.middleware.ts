/**
 * src/middleware/logger.middleware.ts
 * Request logger middleware — superseded by the inline logging in app.ts.
 * Kept for compatibility; delegates to the structured logger.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  logger.debug('Incoming request', { method: req.method, url: req.url });
  next();
};
