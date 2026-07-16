import { pool } from './mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
// We don't import ExecuteValues if it causes an error, let's see. Wait, I'll import it.
import { ExecuteValues } from 'mysql2';

export const query = async <T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params?: ExecuteValues
): Promise<T> => {
  try {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error('SQL Execution Error:', { message: error.message, sql, params });
    } else {
      console.error('Unexpected SQL Error:', error);
    }
    throw error;
  }
};
