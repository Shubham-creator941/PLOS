/**
 * src/routes/health.routes.ts
 * Production health, readiness, and liveness endpoints.
 *
 * GET /health          – lightweight liveness probe (no DB call)
 * GET /health/ready    – readiness probe (checks DB connectivity)
 * GET /health/live     – kubernetes liveness probe (process is alive)
 *
 * Convention:
 *   200 → healthy / ready
 *   503 → unhealthy / not ready (orchestrators will restart or stop traffic)
 */

import type { Request, Response } from 'express';
import { Router } from 'express';

import { checkDatabaseHealth } from '../database/health';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const router = Router();

const STARTED_AT = new Date().toISOString();
const VERSION    = process.env.npm_package_version ?? '1.0.0';

// ── GET /health  (liveness — fast, no I/O) ────────────────────────────────────
router.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    service: 'plos-api',
    version: VERSION,
    environment: env.NODE_ENV,
    uptime_seconds: Math.floor(process.uptime()),
    started_at: STARTED_AT,
    timestamp: new Date().toISOString()
  });
});

// ── GET /health/live  (kubernetes liveness probe) ─────────────────────────────
router.get('/live', (_req: Request, res: Response): void => {
  // If this responds the process is alive.
  // If it doesn't respond the orchestrator restarts the pod.
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

// ── GET /health/ready  (kubernetes readiness probe) ───────────────────────────
router.get('/ready', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await checkDatabaseHealth();

    if (!db.connected) {
      logger.warn('Readiness check failed — database not connected');
      res.status(503).json({
        status: 'not_ready',
        checks: {
          database: {
            status: 'unhealthy',
            latency_ms: db.latency
          }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.status(200).json({
      status: 'ready',
      checks: {
        database: {
          status: 'healthy',
          latency_ms: db.latency,
          version: db.databaseVersion,
          name: db.databaseName
        }
      },
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.exception('Readiness probe threw an unexpected error', err);
    res.status(503).json({
      status: 'not_ready',
      checks: { database: { status: 'error' } },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as healthRoutes };
