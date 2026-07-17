/**
 * Global Jest setup file.
 * Runs once before all test suites.
 * Sets required environment variables so no test file needs to repeat them.
 */

// ── Environment ──────────────────────────────────────────────────
process.env.NODE_ENV  = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-for-jest';
process.env.DB_HOST   = 'localhost';
process.env.DB_PORT   = '3306';
process.env.DB_NAME   = 'plos_test';
process.env.DB_USER   = 'test';
process.env.DB_PASS   = 'test';
