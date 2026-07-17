import type { RowDataPacket, ResultSetHeader } from 'mysql2';

import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import type {
  LearningPlanRecord,
  LearningPhaseRecord,
  LearningModuleRecord,
  LearningObjectiveRecord,
  CreatePlanDTO,
  UpdatePlanDTO,
  CreatePhaseDTO,
  UpdatePhaseDTO,
  CreateModuleDTO,
  UpdateModuleDTO,
  CreateObjectiveDTO,
  UpdateObjectiveDTO,
  PlanningProgressRecord,
} from '../types';

const PLAN_COLUMNS = `
  plan_id,
  journey_id,
  learner_id,
  title,
  description,
  status,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const PHASE_COLUMNS = `
  phase_id,
  plan_id,
  title,
  description,
  order_no,
  status,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const MODULE_COLUMNS = `
  module_id,
  phase_id,
  title,
  description,
  order_no,
  estimated_minutes,
  status,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const OBJECTIVE_COLUMNS = `
  objective_id,
  module_id,
  title,
  description,
  order_no,
  status,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

export class PlanningRepository {
  private mapPlanRecord(row: RowDataPacket): LearningPlanRecord {
    return {
      plan_id: row.plan_id,
      journey_id: row.journey_id,
      learner_id: row.learner_id,
      title: row.title,
      description: row.description,
      status: row.status,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapPhaseRecord(row: RowDataPacket): LearningPhaseRecord {
    return {
      phase_id: row.phase_id,
      plan_id: row.plan_id,
      title: row.title,
      description: row.description,
      order_no: row.order_no,
      status: row.status,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapModuleRecord(row: RowDataPacket): LearningModuleRecord {
    return {
      module_id: row.module_id,
      phase_id: row.phase_id,
      title: row.title,
      description: row.description,
      order_no: row.order_no,
      estimated_minutes: row.estimated_minutes,
      status: row.status,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapObjectiveRecord(row: RowDataPacket): LearningObjectiveRecord {
    return {
      objective_id: row.objective_id,
      module_id: row.module_id,
      title: row.title,
      description: row.description,
      order_no: row.order_no,
      status: row.status,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  // ---- Plan Methods ----

  public async findById(planId: string): Promise<LearningPlanRecord | null> {
    const sql = `SELECT ${PLAN_COLUMNS} FROM learning_plans WHERE plan_id = ?`;
    const rows = await query<RowDataPacket[]>(sql, [planId]);
    if (!rows.length) return null;
    return this.mapPlanRecord(rows[0]);
  }

  public async findByJourney(journeyId: string): Promise<LearningPlanRecord | null> {
    const sql = `SELECT ${PLAN_COLUMNS} FROM learning_plans WHERE journey_id = ? LIMIT 1`;
    const rows = await query<RowDataPacket[]>(sql, [journeyId]);
    if (!rows.length) return null;
    return this.mapPlanRecord(rows[0]);
  }

  public async findByLearner(learnerId: string): Promise<LearningPlanRecord[]> {
    const sql = `SELECT ${PLAN_COLUMNS} FROM learning_plans WHERE learner_id = ? ORDER BY created_at DESC`;
    const rows = await query<RowDataPacket[]>(sql, [learnerId]);
    return rows.map(r => this.mapPlanRecord(r));
  }

  public async createPlan(dto: Readonly<CreatePlanDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_plans (
        plan_id, journey_id, learner_id, title, description, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.plan_id,
      dto.journey_id,
      dto.learner_id,
      dto.title,
      dto.description,
      dto.status
    ]);
  }

  public async updatePlan(dto: Readonly<UpdatePlanDTO>): Promise<void> {
    const sql = `
      UPDATE learning_plans
      SET
        title = ?,
        description = ?,
        status = ?,
        updated_at = NOW(),
        version = version + 1
      WHERE plan_id = ? AND learner_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.description,
      dto.status,
      dto.plan_id,
      dto.learner_id,
      dto.version
    ]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async archivePlan(planId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_plans
      SET status = 'archived', updated_at = NOW(), version = version + 1
      WHERE plan_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [planId, version]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async completePlan(planId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_plans
      SET status = 'completed', updated_at = NOW(), version = version + 1
      WHERE plan_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [planId, version]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  // ---- Phase Methods ----

  public async listPhases(planId: string): Promise<LearningPhaseRecord[]> {
    const sql = `SELECT ${PHASE_COLUMNS} FROM learning_phases WHERE plan_id = ? ORDER BY order_no ASC`;
    const rows = await query<RowDataPacket[]>(sql, [planId]);
    return rows.map(r => this.mapPhaseRecord(r));
  }

  public async findPhase(phaseId: string): Promise<LearningPhaseRecord | null> {
    const sql = `SELECT ${PHASE_COLUMNS} FROM learning_phases WHERE phase_id = ?`;
    const rows = await query<RowDataPacket[]>(sql, [phaseId]);
    if (!rows.length) return null;
    return this.mapPhaseRecord(rows[0]);
  }

  public async createPhase(dto: Readonly<CreatePhaseDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_phases (
        phase_id, plan_id, title, description, order_no, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.phase_id,
      dto.plan_id,
      dto.title,
      dto.description,
      dto.order_no,
      dto.status
    ]);
  }

  public async updatePhase(dto: Readonly<UpdatePhaseDTO>): Promise<void> {
    const sql = `
      UPDATE learning_phases
      SET
        title = ?,
        description = ?,
        order_no = ?,
        status = ?,
        updated_at = NOW(),
        version = version + 1
      WHERE phase_id = ? AND plan_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.description,
      dto.order_no,
      dto.status,
      dto.phase_id,
      dto.plan_id,
      dto.version
    ]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async completePhase(phaseId: string, planId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_phases
      SET status = 'completed', updated_at = NOW(), version = version + 1
      WHERE phase_id = ? AND plan_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [phaseId, planId, version]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async deletePhase(phaseId: string, planId: string): Promise<void> {
    const sql = `DELETE FROM learning_phases WHERE phase_id = ? AND plan_id = ?`;
    const result = await query<ResultSetHeader>(sql, [phaseId, planId]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  // ---- Module Methods ----

  public async listModules(phaseId: string): Promise<LearningModuleRecord[]> {
    const sql = `SELECT ${MODULE_COLUMNS} FROM learning_modules WHERE phase_id = ? ORDER BY order_no ASC`;
    const rows = await query<RowDataPacket[]>(sql, [phaseId]);
    return rows.map(r => this.mapModuleRecord(r));
  }

  public async findModule(moduleId: string): Promise<LearningModuleRecord | null> {
    const sql = `SELECT ${MODULE_COLUMNS} FROM learning_modules WHERE module_id = ?`;
    const rows = await query<RowDataPacket[]>(sql, [moduleId]);
    if (!rows.length) return null;
    return this.mapModuleRecord(rows[0]);
  }

  public async createModule(dto: Readonly<CreateModuleDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_modules (
        module_id, phase_id, title, description, order_no, estimated_minutes, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.module_id,
      dto.phase_id,
      dto.title,
      dto.description,
      dto.order_no,
      dto.estimated_minutes,
      dto.status
    ]);
  }

  public async updateModule(dto: Readonly<UpdateModuleDTO>): Promise<void> {
    const sql = `
      UPDATE learning_modules
      SET
        title = ?,
        description = ?,
        order_no = ?,
        estimated_minutes = ?,
        status = ?,
        updated_at = NOW(),
        version = version + 1
      WHERE module_id = ? AND phase_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.description,
      dto.order_no,
      dto.estimated_minutes,
      dto.status,
      dto.module_id,
      dto.phase_id,
      dto.version
    ]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async completeModule(moduleId: string, phaseId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_modules
      SET status = 'completed', updated_at = NOW(), version = version + 1
      WHERE module_id = ? AND phase_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [moduleId, phaseId, version]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async deleteModule(moduleId: string, phaseId: string): Promise<void> {
    const sql = `DELETE FROM learning_modules WHERE module_id = ? AND phase_id = ?`;
    const result = await query<ResultSetHeader>(sql, [moduleId, phaseId]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  // ---- Objective Methods ----

  public async listObjectives(moduleId: string): Promise<LearningObjectiveRecord[]> {
    const sql = `SELECT ${OBJECTIVE_COLUMNS} FROM learning_objectives WHERE module_id = ? ORDER BY order_no ASC`;
    const rows = await query<RowDataPacket[]>(sql, [moduleId]);
    return rows.map(r => this.mapObjectiveRecord(r));
  }

  public async findObjective(objectiveId: string): Promise<LearningObjectiveRecord | null> {
    const sql = `SELECT ${OBJECTIVE_COLUMNS} FROM learning_objectives WHERE objective_id = ?`;
    const rows = await query<RowDataPacket[]>(sql, [objectiveId]);
    if (!rows.length) return null;
    return this.mapObjectiveRecord(rows[0]);
  }

  public async createObjective(dto: Readonly<CreateObjectiveDTO>): Promise<void> {
    const sql = `
      INSERT INTO learning_objectives (
        objective_id, module_id, title, description, order_no, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    await query<ResultSetHeader>(sql, [
      dto.objective_id,
      dto.module_id,
      dto.title,
      dto.description,
      dto.order_no,
      dto.status
    ]);
  }

  public async updateObjective(dto: Readonly<UpdateObjectiveDTO>): Promise<void> {
    const sql = `
      UPDATE learning_objectives
      SET
        title = ?,
        description = ?,
        order_no = ?,
        status = ?,
        updated_at = NOW(),
        version = version + 1
      WHERE objective_id = ? AND module_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [
      dto.title,
      dto.description,
      dto.order_no,
      dto.status,
      dto.objective_id,
      dto.module_id,
      dto.version
    ]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async completeObjective(objectiveId: string, moduleId: string, version: number): Promise<void> {
    const sql = `
      UPDATE learning_objectives
      SET status = 'completed', updated_at = NOW(), version = version + 1
      WHERE objective_id = ? AND module_id = ? AND version = ?
    `;
    const result = await query<ResultSetHeader>(sql, [objectiveId, moduleId, version]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  public async deleteObjective(objectiveId: string, moduleId: string): Promise<void> {
    const sql = `DELETE FROM learning_objectives WHERE objective_id = ? AND module_id = ?`;
    const result = await query<ResultSetHeader>(sql, [objectiveId, moduleId]);
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update failed');
  }

  // ---- Progress ----

  public async calculateProgress(planId: string): Promise<PlanningProgressRecord> {
    const sql = `
      SELECT
        COUNT(DISTINCT ph.phase_id) AS total_phases,
        COUNT(DISTINCT CASE WHEN ph.status = 'completed' THEN ph.phase_id END) AS completed_phases,
        COUNT(DISTINCT m.module_id) AS total_modules,
        COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.module_id END) AS completed_modules,
        COUNT(DISTINCT o.objective_id) AS total_objectives,
        COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.objective_id END) AS completed_objectives
      FROM learning_phases ph
      LEFT JOIN learning_modules m ON ph.phase_id = m.phase_id
      LEFT JOIN learning_objectives o ON m.module_id = o.module_id
      WHERE ph.plan_id = ?
    `;
    
    const rows = await query<RowDataPacket[]>(sql, [planId]);
    const row = rows[0];

    return {
      total_phases: Number(row?.total_phases ?? 0),
      completed_phases: Number(row?.completed_phases ?? 0),
      total_modules: Number(row?.total_modules ?? 0),
      completed_modules: Number(row?.completed_modules ?? 0),
      total_objectives: Number(row?.total_objectives ?? 0),
      completed_objectives: Number(row?.completed_objectives ?? 0)
    };
  }
}
