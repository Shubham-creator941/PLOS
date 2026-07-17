/**
 * src/database/query.ts
 * Parameterised query helper.
 * Errors logged via structured logger; params redacted in production.
 */

import type { RowDataPacket, ResultSetHeader, ExecuteValues } from 'mysql2';

import { logger } from '../utils/logger';
import { env } from '../config/env';

import { pool } from './mysql';

export const query = async <T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params?: ExecuteValues
): Promise<T> => {
  try {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error) {
    logger.exception('SQL execution error', {
      message: error instanceof Error ? error.message : String(error),
      sql,
      // Redact bound values in production — schema structure (sql) is safe to log
      params: env.NODE_ENV === 'production' ? '[REDACTED]' : params
    });
    throw error;
  }
};
