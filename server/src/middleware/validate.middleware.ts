import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { badRequest } from '../shared/response';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return;
  }
  next();
};
