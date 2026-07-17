import type { Response } from 'express';

import type { ApiResponse } from './types';

export const success = <T>(res: Response, data: T, message?: string, statusCode = 200): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const created = <T>(res: Response, data: T, message?: string): Response => {
  return success(res, data, message, 201);
};

export const badRequest = (res: Response, message = 'Bad Request', errors?: unknown): Response => {
  const errorsArray = errors !== undefined ? (Array.isArray(errors) ? errors : [errors]) : undefined;
  const response: ApiResponse = { success: false, message, errors: errorsArray };
  return res.status(400).json(response);
};

export const unprocessable = (res: Response, message = 'Unprocessable Entity', errors?: unknown): Response => {
  const errorsArray = errors !== undefined ? (Array.isArray(errors) ? errors : [errors]) : undefined;
  const response: ApiResponse = { success: false, message, errors: errorsArray };
  return res.status(422).json(response);
};

export const unauthorized = (res: Response, message = 'Unauthorized'): Response => {
  const response: ApiResponse = { success: false, message };
  return res.status(401).json(response);
};

export const forbidden = (res: Response, message = 'Forbidden'): Response => {
  const response: ApiResponse = { success: false, message };
  return res.status(403).json(response);
};

export const notFound = (res: Response, message = 'Not Found'): Response => {
  const response: ApiResponse = { success: false, message };
  return res.status(404).json(response);
};

export const serverError = (res: Response, message = 'Internal Server Error', errors?: unknown): Response => {
  const errorsArray = errors !== undefined ? (Array.isArray(errors) ? errors : [errors]) : undefined;
  const response: ApiResponse = { success: false, message, errors: errorsArray };
  return res.status(500).json(response);
};
