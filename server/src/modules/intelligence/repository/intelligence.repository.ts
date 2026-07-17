import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import type {
  LearningAnalyticsRecord,
  LearnerMasteryRecord,
  RecommendationHistoryRecord,
  KnowledgeGapRecord,
  CreateAnalyticsDTO,
  UpdateAnalyticsDTO,
  CreateMasteryDTO,
  UpdateMasteryDTO,
  CreateRecommendationDTO,
  UpdateRecommendationDTO,
  CreateKnowledgeGapDTO,
  UpdateKnowledgeGapDTO
} from '../types';

const ANALYTICS_COLUMNS = `
  analytics_id, learner_id, total_learning_minutes, completed_plans, 
  completed_modules, completed_objectives, average_assessment_score, 
  mastery_percentage, learning_velocity, last_calculated_at, version, 
  created_at, updated_at
`;

const MASTERY_COLUMNS = `
  mastery_id, learner_id, module_id, mastery_score, attempts, last_score, 
  status, last_assessed_at, version, created_at, updated_at
`;

const RECOMMENDATION_COLUMNS = `
  recommendation_id, learner_id, session_id, recommendation_type, reason, 
  status, generated_at, completed_at, created_at
`;

const KNOWLEDGE_GAP_COLUMNS = `
  gap_id, learner_id, module_id, objective_id, severity, confidence_score, 
  reason, resolved, identified_at, resolved_at, created_at
`;

export class IntelligenceRepository {

  // ---- Private Mappers ----

  private mapAnalyticsRecord(row: RowDataPacket): LearningAnalyticsRecord {
    return {
      analytics_id: row.analytics_id,
      learner_id: row.learner_id,
      total_learning_minutes: Number(row.total_learning_minutes),
      completed_plans: Number(row.completed_plans),
      completed_modules: Number(row.completed_modules),
      completed_objectives: Number(row.completed_objectives),
      average_assessment_score: Number(row.average_assessment_score),
      mastery_percentage: Number(row.mastery_percentage),
      learning_velocity: Number(row.learning_velocity),
      last_calculated_at: new Date(row.last_calculated_at),
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapMasteryRecord(row: RowDataPacket): LearnerMasteryRecord {
    return {
      mastery_id: row.mastery_id,
      learner_id: row.learner_id,
      module_id: row.module_id,
      mastery_score: Number(row.mastery_score),
      attempts: Number(row.attempts),
      last_score: Number(row.last_score),
      status: row.status,
      last_assessed_at: new Date(row.last_assessed_at),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapRecommendationRecord(row: RowDataPacket): RecommendationHistoryRecord {
    return {
      recommendation_id: row.recommendation_id,
      learner_id: row.learner_id,
      session_id: row.session_id || null,
      recommendation_type: row.recommendation_type,
      reason: row.reason,
      status: row.status,
      generated_at: new Date(row.generated_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // No updated_at in schema, fallback to created_at
    };
  }

  private mapKnowledgeGapRecord(row: RowDataPacket): KnowledgeGapRecord {
    return {
      gap_id: row.gap_id,
      learner_id: row.learner_id,
      module_id: row.module_id,
      objective_id: row.objective_id || null,
      severity: row.severity,
      confidence_score: Number(row.confidence_score),
      reason: row.reason,
      resolved: Boolean(row.resolved),
      identified_at: new Date(row.identified_at),
      resolved_at: row.resolved_at ? new Date(row.resolved_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // No updated_at in schema, fallback to created_at
    };
  }

  // ---- Analytics ----

  public async createAnalytics(dto: CreateAnalyticsDTO): Promise<LearningAnalyticsRecord> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO learning_analytics (
        analytics_id, learner_id, total_learning_minutes, completed_plans, 
        completed_modules, completed_objectives, average_assessment_score, 
        mastery_percentage, learning_velocity, last_calculated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.analytics_id,
        dto.learner_id,
        dto.total_learning_minutes,
        dto.completed_plans,
        dto.completed_modules,
        dto.completed_objectives,
        dto.average_assessment_score,
        dto.mastery_percentage,
        dto.learning_velocity,
        dto.last_calculated_at
      ]
    );

    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Insert failed');
    const rows = await query<RowDataPacket[]>(
      `SELECT ${ANALYTICS_COLUMNS} FROM learning_analytics WHERE analytics_id = ? LIMIT 1`,
      [dto.analytics_id]
    );
    return this.mapAnalyticsRecord(rows[0]);
  }

  public async findAnalytics(learnerId: string): Promise<LearningAnalyticsRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${ANALYTICS_COLUMNS} FROM learning_analytics WHERE learner_id = ? LIMIT 1`,
      [learnerId]
    );
    if (rows.length === 0) return null;
    return this.mapAnalyticsRecord(rows[0]);
  }

  public async updateAnalytics(analyticsId: string, dto: UpdateAnalyticsDTO): Promise<LearningAnalyticsRecord> {
    const updates: string[] = [];
    const values: (string | number | Date)[] = [];

    if (dto.total_learning_minutes !== undefined) {
      updates.push('total_learning_minutes = ?');
      values.push(dto.total_learning_minutes);
    }
    if (dto.completed_plans !== undefined) {
      updates.push('completed_plans = ?');
      values.push(dto.completed_plans);
    }
    if (dto.completed_modules !== undefined) {
      updates.push('completed_modules = ?');
      values.push(dto.completed_modules);
    }
    if (dto.completed_objectives !== undefined) {
      updates.push('completed_objectives = ?');
      values.push(dto.completed_objectives);
    }
    if (dto.average_assessment_score !== undefined) {
      updates.push('average_assessment_score = ?');
      values.push(dto.average_assessment_score);
    }
    if (dto.mastery_percentage !== undefined) {
      updates.push('mastery_percentage = ?');
      values.push(dto.mastery_percentage);
    }
    if (dto.learning_velocity !== undefined) {
      updates.push('learning_velocity = ?');
      values.push(dto.learning_velocity);
    }
    if (dto.last_calculated_at !== undefined) {
      updates.push('last_calculated_at = ?');
      values.push(dto.last_calculated_at);
    }

    if (updates.length === 0) {
      const rows = await query<RowDataPacket[]>(
        `SELECT ${ANALYTICS_COLUMNS} FROM learning_analytics WHERE analytics_id = ? LIMIT 1`,
        [analyticsId]
      );
      if (rows.length === 0) throw new Error(MESSAGES.NOT_FOUND || 'Analytics not found');
      return this.mapAnalyticsRecord(rows[0]);
    }

    updates.push('version = version + 1');
    values.push(analyticsId);
    values.push(dto.version);

    const result = await query<ResultSetHeader>(
      `UPDATE learning_analytics SET ${updates.join(', ')} WHERE analytics_id = ? AND version = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrency conflict or record not found');
    }

    const rows = await query<RowDataPacket[]>(
      `SELECT ${ANALYTICS_COLUMNS} FROM learning_analytics WHERE analytics_id = ? LIMIT 1`,
      [analyticsId]
    );
    return this.mapAnalyticsRecord(rows[0]);
  }

  // ---- Mastery ----

  public async createMastery(dto: CreateMasteryDTO): Promise<LearnerMasteryRecord> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO learner_mastery (
        mastery_id, learner_id, module_id, mastery_score, attempts, last_score, status, last_assessed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.mastery_id, dto.learner_id, dto.module_id, dto.mastery_score,
        dto.attempts, dto.last_score, dto.status, dto.last_assessed_at
      ]
    );

    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Insert failed');
    const rows = await query<RowDataPacket[]>(
      `SELECT ${MASTERY_COLUMNS} FROM learner_mastery WHERE mastery_id = ? LIMIT 1`,
      [dto.mastery_id]
    );
    return this.mapMasteryRecord(rows[0]);
  }

  public async findMastery(learnerId: string, moduleId: string): Promise<LearnerMasteryRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${MASTERY_COLUMNS} FROM learner_mastery WHERE learner_id = ? AND module_id = ? LIMIT 1`,
      [learnerId, moduleId]
    );
    if (rows.length === 0) return null;
    return this.mapMasteryRecord(rows[0]);
  }

  public async listMasteryByLearner(learnerId: string): Promise<LearnerMasteryRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${MASTERY_COLUMNS} FROM learner_mastery WHERE learner_id = ? ORDER BY last_assessed_at DESC`,
      [learnerId]
    );
    return rows.map(r => this.mapMasteryRecord(r));
  }

  public async updateMastery(masteryId: string, dto: UpdateMasteryDTO): Promise<LearnerMasteryRecord> {
    const updates: string[] = [];
    const values: (string | number | Date)[] = [];

    if (dto.mastery_score !== undefined) {
      updates.push('mastery_score = ?');
      values.push(dto.mastery_score);
    }
    if (dto.attempts !== undefined) {
      updates.push('attempts = ?');
      values.push(dto.attempts);
    }
    if (dto.last_score !== undefined) {
      updates.push('last_score = ?');
      values.push(dto.last_score);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }
    if (dto.last_assessed_at !== undefined) {
      updates.push('last_assessed_at = ?');
      values.push(dto.last_assessed_at);
    }

    if (updates.length > 0) {
      // Optimistic locking: version must match and is incremented atomically
      updates.push('version = version + 1');
      values.push(masteryId);
      values.push(dto.version);  // ← guard
      const result = await query<ResultSetHeader>(
        `UPDATE learner_mastery SET ${updates.join(', ')} WHERE mastery_id = ? AND version = ?`,
        values
      );
      if (result.affectedRows === 0) {
        throw new Error('Concurrent update detected: learner_mastery version mismatch');
      }
    }

    const rows = await query<RowDataPacket[]>(
      `SELECT ${MASTERY_COLUMNS} FROM learner_mastery WHERE mastery_id = ? LIMIT 1`,
      [masteryId]
    );
    return this.mapMasteryRecord(rows[0]);
  }

  // ---- Recommendations ----

  public async createRecommendation(dto: CreateRecommendationDTO): Promise<RecommendationHistoryRecord> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO recommendation_history (
        recommendation_id, learner_id, session_id, recommendation_type, reason, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.recommendation_id, dto.learner_id, dto.session_id || null,
        dto.recommendation_type, dto.reason, dto.generated_at
      ]
    );

    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Insert failed');
    const rows = await query<RowDataPacket[]>(
      `SELECT ${RECOMMENDATION_COLUMNS} FROM recommendation_history WHERE recommendation_id = ? LIMIT 1`,
      [dto.recommendation_id]
    );
    return this.mapRecommendationRecord(rows[0]);
  }

  public async findRecommendation(recommendationId: string): Promise<RecommendationHistoryRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${RECOMMENDATION_COLUMNS} FROM recommendation_history WHERE recommendation_id = ? LIMIT 1`,
      [recommendationId]
    );
    if (rows.length === 0) return null;
    return this.mapRecommendationRecord(rows[0]);
  }

  public async listRecommendations(learnerId: string): Promise<RecommendationHistoryRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${RECOMMENDATION_COLUMNS} FROM recommendation_history WHERE learner_id = ? ORDER BY generated_at DESC`,
      [learnerId]
    );
    return rows.map(r => this.mapRecommendationRecord(r));
  }

  public async updateRecommendation(recommendationId: string, dto: UpdateRecommendationDTO): Promise<RecommendationHistoryRecord> {
    const updates: string[] = [];
    const values: (string | Date | null)[] = [];

    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }
    if (dto.completed_at !== undefined) {
      updates.push('completed_at = ?');
      values.push(dto.completed_at);
    }

    if (updates.length > 0) {
      values.push(recommendationId);
      const result = await query<ResultSetHeader>(
        `UPDATE recommendation_history SET ${updates.join(', ')} WHERE recommendation_id = ?`,
        values
      );
      if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    }

    const rows = await query<RowDataPacket[]>(
      `SELECT ${RECOMMENDATION_COLUMNS} FROM recommendation_history WHERE recommendation_id = ? LIMIT 1`,
      [recommendationId]
    );
    return this.mapRecommendationRecord(rows[0]);
  }

  // ---- Knowledge Gaps ----

  public async createKnowledgeGap(dto: CreateKnowledgeGapDTO): Promise<KnowledgeGapRecord> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO knowledge_gap_analysis (
        gap_id, learner_id, module_id, objective_id, severity, confidence_score, reason, identified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.gap_id, dto.learner_id, dto.module_id, dto.objective_id || null,
        dto.severity, dto.confidence_score, dto.reason, dto.identified_at
      ]
    );

    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Insert failed');
    const rows = await query<RowDataPacket[]>(
      `SELECT ${KNOWLEDGE_GAP_COLUMNS} FROM knowledge_gap_analysis WHERE gap_id = ? LIMIT 1`,
      [dto.gap_id]
    );
    return this.mapKnowledgeGapRecord(rows[0]);
  }

  public async findKnowledgeGap(gapId: string): Promise<KnowledgeGapRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${KNOWLEDGE_GAP_COLUMNS} FROM knowledge_gap_analysis WHERE gap_id = ? LIMIT 1`,
      [gapId]
    );
    if (rows.length === 0) return null;
    return this.mapKnowledgeGapRecord(rows[0]);
  }

  public async listKnowledgeGaps(learnerId: string): Promise<KnowledgeGapRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${KNOWLEDGE_GAP_COLUMNS} FROM knowledge_gap_analysis WHERE learner_id = ? ORDER BY identified_at DESC`,
      [learnerId]
    );
    return rows.map(r => this.mapKnowledgeGapRecord(r));
  }

  public async updateKnowledgeGap(gapId: string, dto: UpdateKnowledgeGapDTO): Promise<KnowledgeGapRecord> {
    const updates: string[] = [];
    const values: (string | number | boolean | Date | null)[] = [];

    if (dto.severity !== undefined) {
      updates.push('severity = ?');
      values.push(dto.severity);
    }
    if (dto.confidence_score !== undefined) {
      updates.push('confidence_score = ?');
      values.push(dto.confidence_score);
    }
    if (dto.reason !== undefined) {
      updates.push('reason = ?');
      values.push(dto.reason);
    }
    if (dto.resolved !== undefined) {
      updates.push('resolved = ?');
      values.push(dto.resolved);
    }
    if (dto.resolved_at !== undefined) {
      updates.push('resolved_at = ?');
      values.push(dto.resolved_at);
    }

    if (updates.length > 0) {
      values.push(gapId);
      const result = await query<ResultSetHeader>(
        `UPDATE knowledge_gap_analysis SET ${updates.join(', ')} WHERE gap_id = ?`,
        values
      );
      if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    }

    const rows = await query<RowDataPacket[]>(
      `SELECT ${KNOWLEDGE_GAP_COLUMNS} FROM knowledge_gap_analysis WHERE gap_id = ? LIMIT 1`,
      [gapId]
    );
    return this.mapKnowledgeGapRecord(rows[0]);
  }

}
