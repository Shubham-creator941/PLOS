import { query } from '../../../database/query';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { MESSAGES } from '../../../shared/messages';
import {
  AdaptiveRuntimeStateRecord,
  AdaptiveRuntimeDecisionRecord,
  AdaptiveReviewQueueRecord,
  AdaptiveUnlockHistoryRecord,
  CreateRuntimeDTO,
  UpdateRuntimeDTO,
  CreateDecisionDTO,
  CreateReviewQueueDTO,
  CreateUnlockHistoryDTO,
  RuntimeMetadata
} from '../types';

const RUNTIME_COLUMNS = `
  runtime_id,
  session_id,
  current_state,
  next_phase_id,
  next_module_id,
  next_objective_id,
  recommendation_type,
  decision_reason,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const DECISION_COLUMNS = `
  decision_id,
  runtime_id,
  session_id,
  decision_type,
  source,
  reason,
  metadata,
  created_at AS createdAt
`;

const REVIEW_QUEUE_COLUMNS = `
  queue_id,
  session_id,
  objective_id,
  priority,
  reason,
  scheduled_at AS scheduledAt,
  completed,
  created_at AS createdAt
`;

const UNLOCK_HISTORY_COLUMNS = `
  unlock_id,
  session_id,
  phase_id,
  module_id,
  objective_id,
  unlocked_by,
  created_at AS createdAt
`;

export class AdaptiveRuntimeRepository {

  // ---- Mappers ----

  private mapRuntimeRecord(row: RowDataPacket): AdaptiveRuntimeStateRecord {
    return {
      runtime_id: row.runtime_id,
      session_id: row.session_id,
      current_state: row.current_state,
      next_phase_id: row.next_phase_id,
      next_module_id: row.next_module_id,
      next_objective_id: row.next_objective_id,
      recommendation_type: row.recommendation_type,
      decision_reason: row.decision_reason,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapDecisionRecord(row: RowDataPacket): AdaptiveRuntimeDecisionRecord {
    return {
      decision_id: row.decision_id,
      runtime_id: row.runtime_id,
      session_id: row.session_id,
      decision_type: row.decision_type,
      source: row.source,
      reason: row.reason,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) as RuntimeMetadata : (row.metadata as RuntimeMetadata | null),
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
    };
  }

  private mapReviewQueueRecord(row: RowDataPacket): AdaptiveReviewQueueRecord {
    return {
      queue_id: row.queue_id,
      session_id: row.session_id,
      objective_id: row.objective_id,
      priority: row.priority,
      reason: row.reason,
      scheduled_at: row.scheduledAt,
      completed: Boolean(row.completed),
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
    };
  }

  private mapUnlockHistoryRecord(row: RowDataPacket): AdaptiveUnlockHistoryRecord {
    return {
      unlock_id: row.unlock_id,
      session_id: row.session_id,
      phase_id: row.phase_id,
      module_id: row.module_id,
      objective_id: row.objective_id,
      unlocked_by: row.unlocked_by,
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
    };
  }

  // ---- Runtime Methods ----

  public async findRuntimeById(runtimeId: string): Promise<AdaptiveRuntimeStateRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${RUNTIME_COLUMNS} FROM adaptive_runtime_states WHERE runtime_id = ?`,
      [runtimeId]
    );
    if (rows.length === 0) return null;
    return this.mapRuntimeRecord(rows[0]);
  }

  public async findRuntimeBySession(sessionId: string): Promise<AdaptiveRuntimeStateRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${RUNTIME_COLUMNS} FROM adaptive_runtime_states WHERE session_id = ?`,
      [sessionId]
    );
    if (rows.length === 0) return null;
    return this.mapRuntimeRecord(rows[0]);
  }

  public async createRuntime(dto: CreateRuntimeDTO): Promise<AdaptiveRuntimeStateRecord> {
    const {
      runtime_id,
      session_id,
      current_state,
      next_phase_id,
      next_module_id,
      next_objective_id,
      recommendation_type,
      decision_reason
    } = dto;

    await query<ResultSetHeader>(
      `INSERT INTO adaptive_runtime_states (
        runtime_id,
        session_id,
        current_state,
        next_phase_id,
        next_module_id,
        next_objective_id,
        recommendation_type,
        decision_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        runtime_id,
        session_id,
        current_state,
        next_phase_id || null,
        next_module_id || null,
        next_objective_id || null,
        recommendation_type,
        decision_reason
      ]
    );

    const created = await this.findRuntimeById(runtime_id);
    if (!created) throw new Error(MESSAGES.SERVER_ERROR);
    return created;
  }

  public async updateRuntime(runtimeId: string, dto: UpdateRuntimeDTO): Promise<AdaptiveRuntimeStateRecord> {
    const {
      current_state,
      recommendation_type,
      decision_reason,
      next_phase_id,
      next_module_id,
      next_objective_id,
      version
    } = dto;

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (current_state !== undefined) {
      updates.push('current_state = ?');
      values.push(current_state);
    }
    if (recommendation_type !== undefined) {
      updates.push('recommendation_type = ?');
      values.push(recommendation_type);
    }
    if (decision_reason !== undefined) {
      updates.push('decision_reason = ?');
      values.push(decision_reason);
    }
    if (next_phase_id !== undefined) {
      updates.push('next_phase_id = ?');
      values.push(next_phase_id);
    }
    if (next_module_id !== undefined) {
      updates.push('next_module_id = ?');
      values.push(next_module_id);
    }
    if (next_objective_id !== undefined) {
      updates.push('next_objective_id = ?');
      values.push(next_objective_id);
    }

    if (updates.length === 0) {
      const existing = await this.findRuntimeById(runtimeId);
      if (!existing) throw new Error(MESSAGES.NOT_FOUND);
      return existing;
    }

    updates.push('version = version + 1');
    updates.push('updated_at = NOW()');

    values.push(runtimeId);
    values.push(version);

    const setClause = updates.join(', ');

    const result = await query<ResultSetHeader>(
      `UPDATE adaptive_runtime_states SET ${setClause} WHERE runtime_id = ? AND version = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR);
    }

    const updated = await this.findRuntimeById(runtimeId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  // ---- Decision History ----

  public async createDecision(dto: CreateDecisionDTO): Promise<AdaptiveRuntimeDecisionRecord> {
    const {
      decision_id,
      runtime_id,
      session_id,
      decision_type,
      source,
      reason,
      metadata
    } = dto;

    const metadataJson = metadata ? JSON.stringify(metadata) : null;

    await query<ResultSetHeader>(
      `INSERT INTO adaptive_runtime_decisions (
        decision_id,
        runtime_id,
        session_id,
        decision_type,
        source,
        reason,
        metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        decision_id,
        runtime_id,
        session_id,
        decision_type,
        source,
        reason,
        metadataJson
      ]
    );

    const rows = await query<RowDataPacket[]>(
      `SELECT ${DECISION_COLUMNS} FROM adaptive_runtime_decisions WHERE decision_id = ?`,
      [decision_id]
    );

    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapDecisionRecord(rows[0]);
  }

  public async listDecisionHistory(runtimeId: string): Promise<AdaptiveRuntimeDecisionRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${DECISION_COLUMNS} FROM adaptive_runtime_decisions WHERE runtime_id = ? ORDER BY created_at DESC`,
      [runtimeId]
    );
    return rows.map(row => this.mapDecisionRecord(row));
  }

  public async findLatestDecision(sessionId: string): Promise<AdaptiveRuntimeDecisionRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${DECISION_COLUMNS} FROM adaptive_runtime_decisions WHERE session_id = ? ORDER BY created_at DESC LIMIT 1`,
      [sessionId]
    );
    if (rows.length === 0) return null;
    return this.mapDecisionRecord(rows[0]);
  }

  // ---- Review Queue ----

  public async enqueueReview(dto: CreateReviewQueueDTO): Promise<AdaptiveReviewQueueRecord> {
    const {
      queue_id,
      session_id,
      objective_id,
      priority,
      reason,
      scheduled_at,
      completed
    } = dto;

    await query<ResultSetHeader>(
      `INSERT INTO adaptive_review_queue (
        queue_id,
        session_id,
        objective_id,
        priority,
        reason,
        scheduled_at,
        completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        queue_id,
        session_id,
        objective_id,
        priority,
        reason,
        scheduled_at,
        completed || false
      ]
    );

    const rows = await query<RowDataPacket[]>(
      `SELECT ${REVIEW_QUEUE_COLUMNS} FROM adaptive_review_queue WHERE queue_id = ?`,
      [queue_id]
    );

    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapReviewQueueRecord(rows[0]);
  }

  public async listPendingReviews(sessionId: string): Promise<AdaptiveReviewQueueRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${REVIEW_QUEUE_COLUMNS} FROM adaptive_review_queue 
       WHERE session_id = ? AND completed = FALSE 
       ORDER BY priority DESC, scheduled_at ASC`,
      [sessionId]
    );
    return rows.map(row => this.mapReviewQueueRecord(row));
  }

  public async completeReview(queueId: string): Promise<void> {
    const result = await query<ResultSetHeader>(
      `UPDATE adaptive_review_queue SET completed = TRUE WHERE queue_id = ?`,
      [queueId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR);
    }
  }

  // ---- Unlock History ----

  public async createUnlockHistory(dto: CreateUnlockHistoryDTO): Promise<AdaptiveUnlockHistoryRecord> {
    const {
      unlock_id,
      session_id,
      phase_id,
      module_id,
      objective_id,
      unlocked_by
    } = dto;

    await query<ResultSetHeader>(
      `INSERT INTO adaptive_unlock_history (
        unlock_id,
        session_id,
        phase_id,
        module_id,
        objective_id,
        unlocked_by
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        unlock_id,
        session_id,
        phase_id || null,
        module_id || null,
        objective_id || null,
        unlocked_by
      ]
    );

    const rows = await query<RowDataPacket[]>(
      `SELECT ${UNLOCK_HISTORY_COLUMNS} FROM adaptive_unlock_history WHERE unlock_id = ?`,
      [unlock_id]
    );

    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapUnlockHistoryRecord(rows[0]);
  }

  public async listUnlockHistory(sessionId: string): Promise<AdaptiveUnlockHistoryRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${UNLOCK_HISTORY_COLUMNS} FROM adaptive_unlock_history WHERE session_id = ? ORDER BY created_at ASC`,
      [sessionId]
    );
    return rows.map(row => this.mapUnlockHistoryRecord(row));
  }
}
