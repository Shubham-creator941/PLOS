import type { Response, NextFunction } from 'express';

import { forbidden } from '../shared/response';
import type { AuthenticatedRequest } from '../shared/types';
import { MESSAGES } from '../shared/messages';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      forbidden(res, MESSAGES.FORBIDDEN);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      forbidden(res, MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
};
