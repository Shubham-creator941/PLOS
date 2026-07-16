import { query } from '../../../database/query';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { MESSAGES } from '../../../shared/messages';
import {
  LearningSessionRecord,
  LearningSessionEventRecord,
  LearningSessionCheckpointRecord,
  SessionSummaryRecord,
  CreateSessionDTO,
  UpdateSessionDTO,
  CreateSessionEventDTO,
  CreateCheckpointDTO,
} from '../types';

const SESSION_COLUMNS = `
  session_id,
  plan_id,
  learner_id,
  current_phase_id,
  current_module_id,
  current_objective_id,
  status,
  started_at AS startedAt,
  last_activity_at AS lastActivityAt,
  completed_at AS completedAt,
  total_minutes,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const EVENT_COLUMNS = `
  event_id,
  session_id,
  event_type,
  payload,
  created_at AS createdAt
`;

const CHECKPOINT_COLUMNS = `
  checkpoint_id,
  session_id,
  phase_id,
  module_id,
  objective_id,
  elapsed_minutes,
  created_at AS createdAt
`;

const SUMMARY_COLUMNS = `
  session_id,
  plan_id,
  status,
  current_phase_id,
  current_module_id,
  current_objective_id,
  total_minutes,
  started_at AS startedAt,
  last_activity_at AS lastActivityAt
`;

export class SessionRepository {
  private mapSessionRecord(row: RowDataPacket): LearningSessionRecord {
    return {
      session_id: row.session_id,
      plan_id: row.plan_id,
      learner_id: row.learner_id,
      current_phase_id: row.current_phase_id,
      current_module_id: row.current_module_id,
      current_objective_id: row.current_objective_id,
      status: row.status,
      started_at: row.startedAt,
      last_activity_at: row.lastActivityAt,
      completed_at: row.completedAt,
      total_minutes: row.total_minutes,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapEventRecord(row: RowDataPacket): LearningSessionEventRecord {
    return {
      event_id: row.event_id,
      session_id: row.session_id,
      event_type: row.event_type,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      createdAt: row.createdAt,
      updatedAt: row.createdAt
    };
  }

  private mapCheckpointRecord(row: RowDataPacket): LearningSessionCheckpointRecord {
    return {
      checkpoint_id: row.checkpoint_id,
      session_id: row.session_id,
      phase_id: row.phase_id,
      module_id: row.module_id,
      objective_id: row.objective_id,
      elapsed_minutes: row.elapsed_minutes,
      createdAt: row.createdAt,
      updatedAt: row.createdAt
    };
  }

  private mapSummaryRecord(row: RowDataPacket): SessionSummaryRecord {
    return {
      session_id: row.session_id,
      plan_id: row.plan_id,
      status: row.status,
      current_phase_id: row.current_phase_id,
      current_module_id: row.current_module_id,
      current_objective_id: row.current_objective_id,
      total_minutes: row.total_minutes,
      started_at: row.startedAt,
      last_activity_at: row.lastActivityAt
    };
  }

  // ---- Session Methods ----

  public async findById(sessionId: string): Promise<LearningSessionRecord | null> {
    const sql = `SELECT ${SESSION_COLUMNS} FROM learning_sessions WHERE session_id = ? LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [sessionId]);
    if (!rows.length) return null;
    return this.mapSessionRecord(rows[0]);
  }

  public async findByPlan(planId: string): Promise<LearningSessionRecord | null> {
    const sql = `SELECT ${SESSION_COLUMNS} FROM learning_sessions WHERE plan_id = ? LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [planId]);
    if (!rows.length) return null;
    return this.mapSessionRecord(rows[0]);
  }

  public async findActiveByLearner(learnerId: string): Promise<LearningSessionRecord | null> {
    const sql = `SELECT ${SESSION_COLUMNS} FROM learning_sessions WHERE learner_id = ? AND status NOT IN ('completed', 'abandoned') LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    if (!rows.length) return null;
    return this.mapSessionRecord(rows[0]);
  }

  public async createSession(dto: Readonly<CreateSessionDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_sessions (
        session_id, plan_id, learner_id, current_phase_id, current_module_id, current_objective_id,
        status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.session_id,
      dto.plan_id,
      dto.learner_id,
      dto.current_phase_id,
      dto.current_module_id,
      dto.current_objective_id,
      dto.status
    ]);
  }

  public async updateSession(dto: Readonly<UpdateSessionDTO>): Promise<void> {
    const sql = `
      UPDATE learning_sessions
      SET
        current_phase_id = ?,
        current_module_id = ?,
        current_objective_id = ?,
        status = ?,
        started_at = ?,
        last_activity_at = ?,
        completed_at = ?,
        total_minutes = ?,
        version = version + 1,
        updated_at = NOW()
      WHERE session_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [
      dto.current_phase_id,
      dto.current_module_id,
      dto.current_objective_id,
      dto.status,
      dto.started_at,
      dto.last_activity_at,
      dto.completed_at,
      dto.total_minutes,
      dto.session_id,
      dto.version
    ]);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
    }
  }

  // ---- Events Methods ----

  public async createEvent(dto: Readonly<CreateSessionEventDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_session_events (
        event_id, session_id, event_type, payload, created_at
      ) VALUES (?, ?, ?, ?, NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.event_id,
      dto.session_id,
      dto.event_type,
      dto.payload ? JSON.stringify(dto.payload) : null
    ]);
  }

  public async listEvents(sessionId: string): Promise<LearningSessionEventRecord[]> {
    const sql = `SELECT ${EVENT_COLUMNS} FROM learning_session_events WHERE session_id = ? ORDER BY created_at ASC`;
    const rows = await query<RowDataPacket[]>(sql, [sessionId]);
    return rows.map(r => this.mapEventRecord(r));
  }

  // ---- Checkpoints Methods ----

  public async saveCheckpoint(dto: Readonly<CreateCheckpointDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_session_checkpoints (
        checkpoint_id, session_id, phase_id, module_id, objective_id, elapsed_minutes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.checkpoint_id,
      dto.session_id,
      dto.phase_id,
      dto.module_id,
      dto.objective_id,
      dto.elapsed_minutes
    ]);
  }

  public async getLatestCheckpoint(sessionId: string): Promise<LearningSessionCheckpointRecord | null> {
    const sql = `SELECT ${CHECKPOINT_COLUMNS} FROM learning_session_checkpoints WHERE session_id = ? ORDER BY created_at DESC LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [sessionId]);
    if (!rows.length) return null;
    return this.mapCheckpointRecord(rows[0]);
  }

  // ---- Session Summary ----

  public async getSessionSummary(sessionId: string): Promise<SessionSummaryRecord | null> {
    const sql = `SELECT ${SUMMARY_COLUMNS} FROM learning_sessions WHERE session_id = ? LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [sessionId]);
    if (!rows.length) return null;
    return this.mapSummaryRecord(rows[0]);
  }
}
