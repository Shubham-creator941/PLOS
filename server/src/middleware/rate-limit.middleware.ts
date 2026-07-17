/**
 * src/middleware/rate-limit.middleware.ts
 * Reusable rate limiters.
 *
 *   apiLimiter  – general API limiter applied to all /api/* routes
 *   authLimiter – tight limiter applied only to /api/auth routes
 */

import rateLimit from 'express-rate-limit';

import { env } from '../config/env';

/** General API limiter — 100 req / 15 min by default (configurable via env). */
export const apiLimiter = rateLimit({
  windowMs:        env.RATE_LIMIT_WINDOW_MS,   // default 900_000 ms (15 min)
  max:             env.RATE_LIMIT_MAX,          // default 200
  standardHeaders: true,    // Return rate limit info in `RateLimit-*` headers
  legacyHeaders:   false,   // Disable deprecated `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  skip: () => env.NODE_ENV === 'test'  // never rate-limit during tests
});

/** Auth-route limiter — 10 req / 15 min (brute-force protection). */
export const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,   // 15 minutes
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please wait 15 minutes before trying again.'
  },
  skip: () => env.NODE_ENV === 'test'
});
