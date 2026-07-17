/**
 * src/database/mysql.ts
 * MySQL connection pool.
 * Pool size driven by env config (DB_POOL_MAX) — not hardcoded.
 */

import mysql from 'mysql2/promise';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const pool = mysql.createPool({
  host:               env.DB_HOST,
  port:               env.DB_PORT,
  user:               env.DB_USER,
  password:           env.DB_PASSWORD,
  database:           env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    env.DB_POOL_MAX,   // ← driven by env; default 10
  queueLimit:         0,
  charset:            'utf8mb4',
  timezone:           'Z',
  namedPlaceholders:  true,
  decimalNumbers:     true,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    logger.info('Database connected', {
      host: env.DB_HOST,
      port: env.DB_PORT,
      name: env.DB_NAME,
      pool: env.DB_POOL_MAX
    });
  } catch (error) {
    logger.exception('Database connection failed', error);
    throw error;
  }
};
