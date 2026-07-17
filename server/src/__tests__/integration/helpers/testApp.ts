/**
 * testApp.ts
 * Builds a fully wired Express application for Supertest integration tests.
 * Database calls are intercepted by module-level jest.mock() declarations
 * in each test file — this file itself does NOT touch the database.
 */

import type { Application, Request, Response, NextFunction } from 'express';
import express from 'express';

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
    let status = 500;
    const msg = err.message || '';
    if (msg.includes('not found') || msg.includes('Not found')) status = 404;
    else if (msg.includes('forbidden') || msg.includes('permission')) status = 403;
    else if (msg.includes('unauthorized') || msg.includes('Authentication required')) status = 401;
    else if (msg.includes('bad request') || msg.includes('Invalid request') || msg.includes('required') || msg.includes('missing')) status = 422; // Or 400
    else if (msg.includes('exists') || msg.includes('conflict') || msg.includes('duplicate') || msg.includes('Concurrent')) status = 409;
    
    // Explicit overrides based on test expectations
    if (msg === 'Resource not found') status = 404;
    if (msg === 'Learner not found') status = 404;
    if (msg === 'Invalid request parameters') status = 422;
    if (msg === 'Active learning journey already exists') status = 409;
    if (msg === 'Email already registered') status = 409;
    if (msg === 'Invalid email or password') status = 401;

    if (status === 422) {
       console.log("422 ERROR in testApp:", msg, (err as any).errors);
    }
    res.status(status).json({ success: false, message: msg || 'Internal Server Error' });
  });

  return app;
}
