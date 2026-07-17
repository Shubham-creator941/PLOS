import type { RowDataPacket, ResultSetHeader } from 'mysql2';

import { query } from '../../../database/query';
import type { 
  LearnerProfile, 
  UpdateLearnerDTO, 
  JourneyRecord, 
  CreateJourneyDTO,
  UpdateJourneyDTO
} from '../types/learner.types';

export class LearnerRepository {
  public async createJourney(dto: CreateJourneyDTO): Promise<string> {
    const sql = `
      INSERT INTO learning_journeys (
        journey_id,
        learner_id,
        title,
        domain,
        purpose_profile,
        memory_profile,
        target_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await query<ResultSetHeader>(sql, [
      dto.journey_id,
      dto.learner_id,
      dto.title,
      dto.domain,
      JSON.stringify(dto.purpose_profile),
      JSON.stringify(dto.memory_profile),
      dto.target_date
    ]);
    
    return dto.journey_id;
  }

  public async findProfile(learnerId: string): Promise<LearnerProfile | null> {
    const sql = `
      SELECT 
        l.learner_id,
        l.full_name,
        l.email,
        l.avatar_url,
        l.timezone,
        j.journey_id AS current_journey_id,
        j.title AS journey_title,
        j.domain AS journey_domain,
        j.status AS journey_status
      FROM learners l
      LEFT JOIN learning_journeys j 
        ON l.learner_id = j.learner_id 
        AND j.status = 'active'
      WHERE l.learner_id = ? AND l.deleted_at IS NULL
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as LearnerProfile;
  }

  public async updateProfile(dto: UpdateLearnerDTO): Promise<void> {
    const sql = `
      UPDATE learners 
      SET 
        full_name = ?,
        avatar_url = ?,
        timezone = ?
      WHERE learner_id = ? AND deleted_at IS NULL
    `;
    await query<ResultSetHeader>(sql, [
      dto.full_name,
      dto.avatar_url,
      dto.timezone,
      dto.learner_id
    ]);
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
      WHERE journey_id = ? AND learner_id = ?
    `;
    await query<ResultSetHeader>(sql, [
      dto.title,
      dto.domain,
      JSON.stringify(dto.purpose_profile),
      JSON.stringify(dto.memory_profile),
      dto.target_date,
      dto.journey_id,
      dto.learner_id
    ]);
  }

  public async findActiveJourney(learnerId: string): Promise<JourneyRecord | null> {
    const sql = `
      SELECT 
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
      FROM learning_journeys
      WHERE learner_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      ...row,
      purpose_profile: this.parseJson<any>(row.purpose_profile),
      memory_profile: this.parseJson<any>(row.memory_profile)
    } as JourneyRecord;
  }

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
}
