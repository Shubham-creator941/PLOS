import type { RowDataPacket, ResultSetHeader } from 'mysql2';

import { query } from '../../../database/query';
import type { UserRecord, CreateUserDTO } from '../types/auth.types';

export class AuthRepository {
  private readonly USER_COLUMNS = `
    learner_id, 
    full_name, 
    email, 
    password_hash, 
    avatar_url, 
    timezone, 
    created_at AS createdAt, 
    updated_at AS updatedAt, 
    deleted_at
  `;

  public async findByEmail(email: string): Promise<UserRecord | null> {
    const sql = `
      SELECT ${this.USER_COLUMNS}
      FROM learners 
      WHERE email = ? AND deleted_at IS NULL
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as UserRecord;
  }

  public async findById(userId: string): Promise<UserRecord | null> {
    const sql = `
      SELECT ${this.USER_COLUMNS}
      FROM learners 
      WHERE learner_id = ? AND deleted_at IS NULL
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [userId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as UserRecord;
  }

  public async createUser(user: CreateUserDTO): Promise<string> {
    const sql = `
      INSERT INTO learners (
        learner_id, 
        full_name, 
        email, 
        password_hash, 
        avatar_url, 
        timezone
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    await query<ResultSetHeader>(sql, [
      user.learner_id,
      user.full_name,
      user.email,
      user.password_hash,
      user.avatar_url || null,
      user.timezone || 'UTC'
    ]);
    
    return user.learner_id;
  }

  /**
   * Updates updated_at only to track activity
   */
  public async touchUser(userId: string): Promise<void> {
    const sql = `
      UPDATE learners 
      SET updated_at = NOW() 
      WHERE learner_id = ?
    `;
    await query<ResultSetHeader>(sql, [userId]);
  }

  public async emailExists(email: string): Promise<boolean> {
    const sql = `
      SELECT 1 
      FROM learners 
      WHERE email = ? AND deleted_at IS NULL
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [email]);
    return rows.length > 0;
  }
}
