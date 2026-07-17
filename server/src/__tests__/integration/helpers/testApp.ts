/**
 * testApp.ts
 * Builds a fully wired Express application for Supertest integration tests.
 * Database calls are intercepted by module-level jest.mock() declarations
 * in each test file — this file itself does NOT touch the database.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import { router } from '../../../routes';

export function buildApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'OK' });
  });

  app.use('/api', router);

  // 404
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route Not Found' });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  });

  return app;
}
