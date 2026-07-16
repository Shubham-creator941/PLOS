import { env } from '../config/env';

export const logger = {
  info: (message: string, meta?: unknown): void => {
    if (env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, meta ? meta : '');
    }
  },
  warn: (message: string, meta?: unknown): void => {
    if (env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, meta ? meta : '');
    }
  },
  error: (message: string, error?: unknown): void => {
    if (env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error ? error : '');
    }
  }
};
