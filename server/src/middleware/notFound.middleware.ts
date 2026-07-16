import { Request, Response } from 'express';
import { notFound } from '../shared/response';
import { MESSAGES } from '../shared/messages';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  notFound(res, MESSAGES.NOT_FOUND);
};
