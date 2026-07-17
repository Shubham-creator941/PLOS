/**
 * src/server.ts
 * Application entry point — production-hardened.
 *
 * Responsibilities:
 *   1. Load and validate environment variables (throws on missing keys)
 *   2. Start the HTTP server
 *   3. Graceful shutdown: SIGTERM / SIGINT → drain in-flight requests → close DB pool
 */

import dotenv from 'dotenv';
dotenv.config();                  // must be first — env.ts reads process.env on import

import { env }    from './config/env';
import { logger } from './utils/logger';
import app         from './app';
import { pool }    from './database/mysql';

import http        from 'http';

const server = http.createServer(app);

// ── Graceful shutdown ─────────────────────────────────────────────────────────

const SHUTDOWN_TIMEOUT_MS = 10_000;  // 10 s max to drain requests

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal} — initiating graceful shutdown`);

  // Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      logger.exception('Error closing HTTP server', err);
    } else {
      logger.info('HTTP server closed — no more incoming requests');
    }

    // Close MySQL connection pool
    try {
      await pool.end();
      logger.info('Database connection pool closed');
    } catch (dbErr) {
      logger.exception('Error closing database pool', dbErr);
    }

    logger.info('Graceful shutdown complete');
    process.exit(err ? 1 : 0);
  });

  // Force-exit if shutdown takes too long
  setTimeout(() => {
    logger.error(`Graceful shutdown timed out after ${SHUTDOWN_TIMEOUT_MS}ms — forcing exit`);
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

// ── Unhandled rejections / exceptions ─────────────────────────────────────────

process.on('unhandledRejection', (reason) => {
  logger.exception('Unhandled Promise Rejection', reason);
  // In production we exit so the orchestrator can restart us in a clean state.
  // unref() allows the shutdown timer not to prevent clean exit.
  shutdown('unhandledRejection').catch(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.exception('Uncaught Exception', err);
  shutdown('uncaughtException').catch(() => process.exit(1));
});

// ── Signal handlers ───────────────────────────────────────────────────────────

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── Start ─────────────────────────────────────────────────────────────────────

server.listen(env.PORT, () => {
  logger.info('PLOS API server started', {
    port:        env.PORT,
    environment: env.NODE_ENV,
    pid:         process.pid,
    node:        process.version
  });
});
