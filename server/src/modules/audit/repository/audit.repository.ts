import { ResultSetHeader } from 'mysql2/promise';
import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import {
  AuditLogRecord,
  ActivityRecord,
  LoginHistoryRecord,
  SystemActivityRecord,
  CreateAuditLogDTO,
  CreateActivityDTO,
  CreateLoginHistoryDTO,
  CreateSystemActivityDTO,
  ResourceType,
  AuditStatus,
  ActivityType,
  LoginStatus,
  Severity
} from '../types';

const AUDIT_LOG_COLUMNS = `
  audit_id,
  learner_id,
  action,
  resource_type,
  resource_id,
  status,
  ip_address,
  user_agent,
  metadata,
  created_at
`;

const ACTIVITY_COLUMNS = `
  activity_id,
  learner_id,
  activity_type,
  title,
  description,
  reference_id,
  created_at
`;

const LOGIN_HISTORY_COLUMNS = `
  login_id,
  learner_id,
  login_at,
  logout_at,
  ip_address,
  user_agent,
  status
`;

const SYSTEM_ACTIVITY_COLUMNS = `
  system_activity_id,
  module_name,
  activity,
  severity,
  metadata,
  created_at
`;

export class AuditRepository {
  // ====================================================
  // PRIVATE MAPPERS
  // ====================================================

  private mapAuditLogRecord(row: any): AuditLogRecord {
    return {
      audit_id: row.audit_id,
      learner_id: row.learner_id,
      action: row.action,
      resource_type: row.resource_type as ResourceType,
      resource_id: row.resource_id,
      status: row.status as AuditStatus,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  private mapActivityRecord(row: any): ActivityRecord {
    return {
      activity_id: row.activity_id,
      learner_id: row.learner_id,
      activity_type: row.activity_type as ActivityType,
      title: row.title,
      description: row.description,
      reference_id: row.reference_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  private mapLoginHistoryRecord(row: any): LoginHistoryRecord {
    return {
      login_id: row.login_id,
      learner_id: row.learner_id,
      login_at: new Date(row.login_at),
      logout_at: row.logout_at ? new Date(row.logout_at) : null,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      status: row.status as LoginStatus,
      createdAt: new Date(row.login_at),
      updatedAt: new Date(row.login_at)
    };
  }

  private mapSystemActivityRecord(row: any): SystemActivityRecord {
    return {
      system_activity_id: row.system_activity_id,
      module_name: row.module_name as ResourceType,
      activity: row.activity,
      severity: row.severity as Severity,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  // ====================================================
  // AUDIT LOGS
  // ====================================================

  public async createAuditLog(dto: CreateAuditLogDTO): Promise<AuditLogRecord> {
    const sql = `
      INSERT INTO audit_logs (
        audit_id,
        learner_id,
        action,
        resource_type,
        resource_id,
        status,
        ip_address,
        user_agent,
        metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.audit_id,
      dto.learner_id || null,
      dto.action,
      dto.resource_type,
      dto.resource_id || null,
      dto.status,
      dto.ip_address || null,
      dto.user_agent || null,
      dto.metadata ? JSON.stringify(dto.metadata) : null
    ];

    await query<ResultSetHeader>(sql, values);
    
    // Fetch newly created
    const fetchSql = `
      SELECT ${AUDIT_LOG_COLUMNS}
      FROM audit_logs
      WHERE audit_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.audit_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapAuditLogRecord(rows[0]);
  }

  public async listAuditLogs(limit: number = 100): Promise<AuditLogRecord[]> {
    const sql = `
      SELECT ${AUDIT_LOG_COLUMNS}
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const rows = await query<any[]>(sql, [limit]);
    return rows.map(r => this.mapAuditLogRecord(r));
  }

  // ====================================================
  // ACTIVITY TIMELINE
  // ====================================================

  public async createActivity(dto: CreateActivityDTO): Promise<ActivityRecord> {
    const sql = `
      INSERT INTO activity_timeline (
        activity_id,
        learner_id,
        activity_type,
        title,
        description,
        reference_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.activity_id,
      dto.learner_id,
      dto.activity_type,
      dto.title,
      dto.description,
      dto.reference_id || null
    ];

    await query<ResultSetHeader>(sql, values);

    const fetchSql = `
      SELECT ${ACTIVITY_COLUMNS}
      FROM activity_timeline
      WHERE activity_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.activity_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapActivityRecord(rows[0]);
  }

  public async listActivities(learnerId: string, limit: number = 50): Promise<ActivityRecord[]> {
    const sql = `
      SELECT ${ACTIVITY_COLUMNS}
      FROM activity_timeline
      WHERE learner_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const rows = await query<any[]>(sql, [learnerId, limit]);
    return rows.map(r => this.mapActivityRecord(r));
  }

  // ====================================================
  // LOGIN HISTORY
  // ====================================================

  public async createLoginHistory(dto: CreateLoginHistoryDTO): Promise<LoginHistoryRecord> {
    const sql = `
      INSERT INTO login_history (
        login_id,
        learner_id,
        login_at,
        ip_address,
        user_agent,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.login_id,
      dto.learner_id,
      dto.login_at,
      dto.ip_address || null,
      dto.user_agent || null,
      dto.status
    ];

    await query<ResultSetHeader>(sql, values);

    const fetchSql = `
      SELECT ${LOGIN_HISTORY_COLUMNS}
      FROM login_history
      WHERE login_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.login_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapLoginHistoryRecord(rows[0]);
  }

  public async listLoginHistory(learnerId: string, limit: number = 50): Promise<LoginHistoryRecord[]> {
    const sql = `
      SELECT ${LOGIN_HISTORY_COLUMNS}
      FROM login_history
      WHERE learner_id = ?
      ORDER BY login_at DESC
      LIMIT ?
    `;
    const rows = await query<any[]>(sql, [learnerId, limit]);
    return rows.map(r => this.mapLoginHistoryRecord(r));
  }

  // ====================================================
  // SYSTEM ACTIVITY
  // ====================================================

  public async createSystemActivity(dto: CreateSystemActivityDTO): Promise<SystemActivityRecord> {
    const sql = `
      INSERT INTO system_activity (
        system_activity_id,
        module_name,
        activity,
        severity,
        metadata
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      dto.system_activity_id,
      dto.module_name,
      dto.activity,
      dto.severity,
      dto.metadata ? JSON.stringify(dto.metadata) : null
    ];

    await query<ResultSetHeader>(sql, values);

    const fetchSql = `
      SELECT ${SYSTEM_ACTIVITY_COLUMNS}
      FROM system_activity
      WHERE system_activity_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.system_activity_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapSystemActivityRecord(rows[0]);
  }

  public async listSystemActivity(limit: number = 100): Promise<SystemActivityRecord[]> {
    const sql = `
      SELECT ${SYSTEM_ACTIVITY_COLUMNS}
      FROM system_activity
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const rows = await query<any[]>(sql, [limit]);
    return rows.map(r => this.mapSystemActivityRecord(r));
  }
}
