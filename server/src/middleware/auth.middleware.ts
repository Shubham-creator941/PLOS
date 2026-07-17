import type { Response, NextFunction } from 'express';

import { verifyToken } from '../utils/jwt';
import { unauthorized } from '../shared/response';
import type { AuthenticatedRequest } from '../shared/types';
import { MESSAGES } from '../shared/messages';
import { logger } from '../utils/logger';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorized(res, MESSAGES.UNAUTHORIZED);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.error('Token verification failed', error);
    unauthorized(res, MESSAGES.UNAUTHORIZED);
  }
};
