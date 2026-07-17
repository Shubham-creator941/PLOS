import type { RowDataPacket, ResultSetHeader } from 'mysql2';

import { query } from '../../../database/query';
import type {
  JourneyRecord,
  MilestoneRecord,
  CreateMilestoneDTO,
  UpdateMilestoneDTO,
  UpdateJourneyDTO,
  JourneyProgressRecord
} from '../types/journey.types';
import type { PurposeProfile, MemoryProfile } from '../../learner/types';
import { MESSAGES } from '../../../shared/messages';

const JOURNEY_COLUMNS = `
  journey_id,
  learner_id,
  title,
  domain,
  status,
  purpose_profile,
  memory_profile,
  started_at,
  target_date,
  completed_at,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const MILESTONE_COLUMNS = `
  milestone_id,
  plan_id,
  title,
  description,
  deadline,
  difficulty,
  priority,
  status,
  order_no,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

export class JourneyRepository {
  private parseJson<T>(value: unknown): T {
    if (typeof value !== 'string') {
      return value as T;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      throw new Error('Invalid JSON stored in database.');
    }
  }

  private mapJourneyRecord(row: RowDataPacket): JourneyRecord {
    return {
      ...row,
      purpose_profile: this.parseJson<PurposeProfile>(row.purpose_profile),
      memory_profile: this.parseJson<MemoryProfile>(row.memory_profile)
    } as JourneyRecord;
  }

  private mapMilestoneRecord(row: RowDataPacket): MilestoneRecord {
    return {
      ...row
    } as MilestoneRecord;
  }

  public async findById(journeyId: string): Promise<JourneyRecord | null> {
    const sql = `
      SELECT ${JOURNEY_COLUMNS}
      FROM learning_journeys
      WHERE journey_id = ?
    `;
    const rows = await query<RowDataPacket[]>(sql, [journeyId]);
    if (rows.length === 0) return null;
    return this.mapJourneyRecord(rows[0]);
  }

  public async findActiveByLearner(learnerId: string): Promise<JourneyRecord | null> {
    const sql = `
      SELECT ${JOURNEY_COLUMNS}
      FROM learning_journeys
      WHERE learner_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    if (rows.length === 0) return null;
    return this.mapJourneyRecord(rows[0]);
  }

  public async findCurrentByLearner(learnerId: string): Promise<JourneyRecord | null> {
    const sql = `
      SELECT ${JOURNEY_COLUMNS}
      FROM learning_journeys
      WHERE learner_id = ? AND status NOT IN ('completed', 'abandoned')
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    if (rows.length === 0) return null;
    return this.mapJourneyRecord(rows[0]);
  }

  public async updateJourney(dto: UpdateJourneyDTO): Promise<void> {
    const sql = `
      UPDATE learning_journeys 
      SET 
        title = ?,
        domain = ?,
        purpose_profile = ?,
        memory_profile = ?,
        target_date = ?,
        updated_at = NOW(),
        version = version + 1
      WHERE journey_id = ? AND learner_id = ? AND version = ?
    `;

    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.domain,
      JSON.stringify(dto.purpose_profile),
      JSON.stringify(dto.memory_profile),
      dto.target_date,
      dto.journey_id,
      dto.learner_id,
      dto.version
    ]);
    if (result.affectedRows === 0) throw new Error('Concurrent update failed');
  }

  public async pauseJourney(journeyId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_journeys 
      SET status = 'paused', updated_at = NOW(), version = version + 1 
      WHERE journey_id = ? AND status = 'active' AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [journeyId, version]);
    if (result.affectedRows === 0) throw new Error('Concurrent update failed');
  }

  public async resumeJourney(journeyId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_journeys 
      SET status = 'active', updated_at = NOW(), version = version + 1 
      WHERE journey_id = ? AND status = 'paused' AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [journeyId, version]);
    if (result.affectedRows === 0) throw new Error('Concurrent update failed');
  }

  public async completeJourney(journeyId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_journeys 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, updated_at = NOW(), version = version + 1 
      WHERE journey_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [journeyId, version]);
    if (result.affectedRows === 0) throw new Error('Concurrent update failed');
  }

  public async archiveJourney(journeyId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_journeys 
      SET status = 'abandoned', updated_at = NOW(), version = version + 1 
      WHERE journey_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [journeyId, version]);
    if (result.affectedRows === 0) throw new Error('Concurrent update failed');
  }

  public async listMilestones(planId: string): Promise<MilestoneRecord[]> {
    const sql = `
      SELECT ${MILESTONE_COLUMNS}
      FROM milestones
      WHERE plan_id = ?
      ORDER BY order_no ASC
    `;
    const rows = await query<RowDataPacket[]>(sql, [planId]);
    return rows.map(row => this.mapMilestoneRecord(row));
  }

  public async findMilestone(milestoneId: string): Promise<MilestoneRecord | null> {
    const sql = `
      SELECT ${MILESTONE_COLUMNS}
      FROM milestones
      WHERE milestone_id = ?
    `;
    const rows = await query<RowDataPacket[]>(sql, [milestoneId]);
    if (rows.length === 0) return null;
    return this.mapMilestoneRecord(rows[0]);
  }

  public async createMilestone(dto: CreateMilestoneDTO): Promise<void> {
    const sql = `
      INSERT INTO milestones (
        milestone_id,
        plan_id,
        title,
        description,
        deadline,
        difficulty,
        priority,
        order_no
      ) VALUES (?, ?, ?, ?, ?, COALESCE(?, 'medium'), COALESCE(?, 'medium'), ?)
    `;
    await query<ResultSetHeader>(sql, [
      dto.milestone_id,
      dto.plan_id,
      dto.title,
      dto.description,
      dto.deadline,
      dto.difficulty || null,
      dto.priority || null,
      dto.order_no
    ]);
  }

  public async updateMilestone(dto: UpdateMilestoneDTO): Promise<void> {
    const sql = `
      UPDATE milestones 
      SET 
        title = ?,
        description = ?,
        deadline = ?,
        difficulty = ?,
        priority = ?,
        status = ?,
        order_no = ?,
        updated_at = NOW()
      WHERE milestone_id = ? AND plan_id = ?
    `;

    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.description,
      dto.deadline,
      dto.difficulty,
      dto.priority,
      dto.status,
      dto.order_no,
      dto.milestone_id,
      dto.plan_id
    ]);
    if (result.affectedRows === 0) throw new Error('Milestone update failed');
  }

  public async completeMilestone(milestoneId: string, planId: string): Promise<void> {
    const sql = `
      UPDATE milestones 
      SET status = 'completed', updated_at = NOW()
      WHERE milestone_id = ? AND plan_id = ?
    `;
    const result = await query<ResultSetHeader>(sql, [milestoneId, planId]);
    if (result.affectedRows === 0) throw new Error('Milestone update failed');
  }

  public async calculateProgress(journeyId: string): Promise<JourneyProgressRecord> {
    const sql = `
      SELECT 
        COUNT(DISTINCT m.milestone_id) AS total_milestones,
        COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.milestone_id END) AS completed_milestones,
        COUNT(DISTINCT t.task_id) AS total_tasks,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.task_id END) AS completed_tasks
      FROM learning_plans p
      LEFT JOIN milestones m ON p.plan_id = m.plan_id
      LEFT JOIN learning_tasks t ON m.milestone_id = t.milestone_id
      WHERE p.journey_id = ?
    `;
    const rows = await query<RowDataPacket[]>(sql, [journeyId]);
    const row = rows[0];
    
    return {
      total_milestones: Number(row.total_milestones) || 0,
      completed_milestones: Number(row.completed_milestones) || 0,
      total_tasks: Number(row.total_tasks) || 0,
      completed_tasks: Number(row.completed_tasks) || 0
    };
  }
}
