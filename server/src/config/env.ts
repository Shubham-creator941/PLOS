/**
 * src/config/env.ts
 * Environment validation and configuration.
 *
 * Validates all required variables at startup — the process exits immediately
 * with a descriptive error if any are missing, preventing silent misconfiguration.
 */

import dotenv from 'dotenv';

dotenv.config();

// ── Validation helpers ────────────────────────────────────────────────────────

function required(key: string): string {
  const v = process.env[key];
  if (v === undefined || v === '') {
    throw new Error(`[ENV] Missing required environment variable: ${key}`);
  }
  return v;
}

function optional(key: string, fallback: string): string {
  const v = process.env[key];
  return v !== undefined && v !== '' ? v : fallback;
}

function requiredInt(key: string): number {
  const raw = required(key);
  const n   = parseInt(raw, 10);
  if (isNaN(n)) throw new Error(`[ENV] ${key} must be an integer, got: "${raw}"`);
  return n;
}

function optionalInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (v === undefined || v === '') return fallback;
  const n = parseInt(v, 10);
  if (isNaN(n)) throw new Error(`[ENV] ${key} must be an integer, got: "${v}"`);
  return n;
}

function requiredMinLength(key: string, minLen: number): string {
  const v = required(key);
  if (v.length < minLen) {
    throw new Error(`[ENV] ${key} must be at least ${minLen} characters long`);
  }
  return v;
}

// ── Config shape ──────────────────────────────────────────────────────────────

export interface EnvConfig {
  // Server
  PORT:     number;
  NODE_ENV: string;
  LOG_LEVEL: string;

  // Database
  DB_HOST:     string;
  DB_PORT:     number;
  DB_USER:     string;
  DB_PASSWORD: string;
  DB_NAME:     string;
  DB_POOL_MIN: number;
  DB_POOL_MAX: number;

  // Auth
  JWT_SECRET:     string;
  JWT_EXPIRES_IN: string;

  // Uploads
  UPLOAD_DIR:           string;
  UPLOAD_MAX_SIZE_BYTES: number;

  // CORS
  CORS_ORIGIN: string[];

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX:       number;
}

// ── Build and freeze ──────────────────────────────────────────────────────────

function buildConfig(): EnvConfig {
  // Skip full validation in test environment to allow jest mocks
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    return {
      PORT:                 optionalInt('PORT', 3000),
      NODE_ENV:             'test',
      LOG_LEVEL:            optional('LOG_LEVEL', 'silent'),
      DB_HOST:              optional('DB_HOST', 'localhost'),
      DB_PORT:              optionalInt('DB_PORT', 3306),
      DB_USER:              optional('DB_USER', 'test'),
      DB_PASSWORD:          optional('DB_PASSWORD', 'test'),
      DB_NAME:              optional('DB_NAME', 'plos_test'),
      DB_POOL_MIN:          optionalInt('DB_POOL_MIN', 1),
      DB_POOL_MAX:          optionalInt('DB_POOL_MAX', 2),
      JWT_SECRET:           optional('JWT_SECRET', 'test-secret'),
      JWT_EXPIRES_IN:       optional('JWT_EXPIRES_IN', '1h'),
      UPLOAD_DIR:           optional('UPLOAD_DIR', '/tmp/uploads'),
      UPLOAD_MAX_SIZE_BYTES: optionalInt('UPLOAD_MAX_SIZE_BYTES', 10485760),
      CORS_ORIGIN:          ['*'],
      RATE_LIMIT_WINDOW_MS: 900000,
      RATE_LIMIT_MAX:       1000,
    };
  }

  return {
    PORT:     optionalInt('PORT', 3000),
    NODE_ENV: optional('NODE_ENV', 'development'),
    LOG_LEVEL: optional('LOG_LEVEL', 'info'),

    DB_HOST:     required('DB_HOST'),
    DB_PORT:     optionalInt('DB_PORT', 3306),
    DB_USER:     required('DB_USER'),
    DB_PASSWORD: required('DB_PASSWORD'),
    DB_NAME:     required('DB_NAME'),
    DB_POOL_MIN: optionalInt('DB_POOL_MIN', 2),
    DB_POOL_MAX: optionalInt('DB_POOL_MAX', 10),

    // JWT secret must be at least 32 chars for HS256 security
    JWT_SECRET:     requiredMinLength('JWT_SECRET', 32),
    JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),

    UPLOAD_DIR:           optional('UPLOAD_DIR', '/app/uploads'),
    UPLOAD_MAX_SIZE_BYTES: optionalInt('UPLOAD_MAX_SIZE_BYTES', 10485760),

    CORS_ORIGIN: optional('CORS_ORIGIN', 'http://localhost:5173')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),

    RATE_LIMIT_WINDOW_MS: optionalInt('RATE_LIMIT_WINDOW_MS', 900000),
    RATE_LIMIT_MAX:       optionalInt('RATE_LIMIT_MAX', 200),
  };
}

export const env: EnvConfig = Object.freeze(buildConfig());
