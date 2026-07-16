import mysql from 'mysql2/promise';
import { env } from '../config/env';

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
  namedPlaceholders: true,
  decimalNumbers: true,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('✓ Database Connected');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database connection failed:', error.message);
    } else {
      console.error('Unexpected database connection error:', error);
    }
    throw error;
  }
};
