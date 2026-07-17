/**
 * src/app.ts
 * Express application factory — production-hardened.
 *
 * Security stack (in order):
 *   1. Helmet      — HTTP security headers (OWASP)
 *   2. CORS        — validated origin whitelist
 *   3. Rate limit  — auth routes: 10/15min; API: 200/15min
 *   4. Body parser — 1 MB limit
 *   5. Request log — structured JSON per request
 *   6. Routes      — health probes + API
 *   7. 404 handler
 *   8. Global error handler (typed errors → correct HTTP status)
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env }           from './config/env';
import { logger }        from './utils/logger';
import { AppError }      from './shared/errors';
import { apiLimiter, authLimiter } from './middleware/rate-limit.middleware';
import { healthRoutes }  from './routes/health.routes';
import { router as apiRouter } from './routes';

const app: Application = express();

// ── 1. Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin:         env.CORS_ORIGIN,
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true
}));

// ── 3. Rate limiting ──────────────────────────────────────────────────────────
// Auth routes first (tighter limit), then general API
app.use('/api/auth', authLimiter);
app.use('/api',      apiLimiter);

// ── 4. Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── 5. Structured request logging ─────────────────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level    = res.statusCode >= 500 ? 'error'
                   : res.statusCode >= 400 ? 'warn'
                   : 'info';

    logger[level]('HTTP request', {
      method:      req.method,
      path:        req.path,
      status:      res.statusCode,
      duration_ms: duration,
      ip:          req.ip,
      user_agent:  req.headers['user-agent']
    });
  });

  next();
});

// ── 6. Health probes (orchestrators reach these outside /api) ─────────────────
app.use('/health', healthRoutes);

// ── 6b. API routes ────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── 7. 404 handler ────────────────────────────────────────────────────────────
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// ── 8. Global error handler ───────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.exception('Unhandled application error', err);

  // Typed AppError subclasses (NotFoundError, ForbiddenError, ConflictError …)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Legacy string-match for optimistic-locking errors thrown from repositories
  // (will be removed once all services use ConflictError)
  if (err.message?.toLowerCase().includes('concurrent update')) {
    res.status(409).json({
      success: false,
      message: 'Conflict: resource was modified by another request. Retry with the latest version.'
    });
    return;
  }

  // Generic 500
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production'
      ? 'An internal error occurred'
      : err.message
  });
});

export default app;
