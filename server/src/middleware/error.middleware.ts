import { Request, Response, NextFunction } from 'express';
import { serverError } from '../shared/response';
import { MESSAGES } from '../shared/messages';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // Express requires 4 parameters for error handling middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error('Unhandled Exception:', err);
  
  const errorDetails = env.NODE_ENV === 'development' ? err.stack : undefined;
  serverError(res, MESSAGES.SERVER_ERROR, errorDetails);
};
