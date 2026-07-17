import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { unprocessable } from '../shared/response';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    unprocessable(res, 'Validation failed', errors.array());
    return;
  }
  next();
};
