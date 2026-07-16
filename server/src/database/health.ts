import { query } from './query';
import { RowDataPacket } from 'mysql2';

export interface DatabaseHealth {
  connected: boolean;
  latency: number;
  databaseVersion: string;
  databaseName: string;
  currentTimestamp: string;
}

export const checkDatabaseHealth = async (): Promise<DatabaseHealth> => {
  const start = Date.now();
  try {
    const rows = await query<RowDataPacket[]>('SELECT VERSION() as version, DATABASE() as db, NOW() as time');
    const latency = Date.now() - start;
    
    if (!rows || rows.length === 0) {
      throw new Error('No health check data returned');
    }
    
    const data = rows[0];
    return {
      connected: true,
      latency,
      databaseVersion: String(data.version),
      databaseName: String(data.db),
      currentTimestamp: String(data.time),
    };
  } catch (error) {
    const latency = Date.now() - start;
    console.error('Database Health Check Failed:', error instanceof Error ? error.message : String(error));
    
    return {
      connected: false,
      latency,
      databaseVersion: 'unknown',
      databaseName: 'unknown',
      currentTimestamp: new Date().toISOString(),
    };
  }
};
