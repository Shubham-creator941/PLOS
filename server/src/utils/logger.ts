/**
 * src/utils/logger.ts
 * Structured JSON logger for production.
 *
 * In production:   each log line is a compact JSON object — ingestible by
 *                  CloudWatch, Datadog, Loki, etc.
 * In development:  human-readable prefixed output.
 * In test:         all output suppressed (LOG_LEVEL=silent).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

// Numeric severity for comparison
const SEVERITY: Record<LogLevel, number> = {
  debug:  0,
  info:   1,
  warn:   2,
  error:  3,
  silent: 99
};

const currentLevel = (): LogLevel => {
  const raw = (process.env.LOG_LEVEL ?? 'info').toLowerCase() as LogLevel;
  return SEVERITY[raw] !== undefined ? raw : 'info';
};

const isEnabled = (level: LogLevel): boolean =>
  SEVERITY[level] >= SEVERITY[currentLevel()];

const isProd = (): boolean => process.env.NODE_ENV === 'production';

// ── Formatters ────────────────────────────────────────────────────────────────

function formatProd(level: LogLevel, message: string, meta?: unknown): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta !== undefined ? { meta } : {})
  });
}

function formatDev(level: LogLevel, message: string, meta?: unknown): string {
  const ts  = new Date().toISOString();
  const tag = `[${level.toUpperCase().padEnd(5)}]`;
  const base = `${ts} ${tag} ${message}`;
  return meta !== undefined ? `${base} ${JSON.stringify(meta)}` : base;
}

// ── Core emit ─────────────────────────────────────────────────────────────────

function emit(level: LogLevel, message: string, meta?: unknown): void {
  if (!isEnabled(level)) return;

  const line = isProd()
    ? formatProd(level, message, meta)
    : formatDev(level, message, meta);

  if (level === 'error' || level === 'warn') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export const logger = {
  debug: (message: string, meta?: unknown): void => emit('debug', message, meta),
  info:  (message: string, meta?: unknown): void => emit('info',  message, meta),
  warn:  (message: string, meta?: unknown): void => emit('warn',  message, meta),
  error: (message: string, meta?: unknown): void => emit('error', message, meta),

  /** Log an Error instance with stack trace in development */
  exception: (message: string, err: unknown): void => {
    const meta = err instanceof Error
      ? { name: err.name, message: err.message, stack: isProd() ? undefined : err.stack }
      : { raw: String(err) };
    emit('error', message, meta);
  }
};
