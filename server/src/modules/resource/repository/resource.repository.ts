import { ResultSetHeader } from 'mysql2/promise';
import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import {
  LearningResourceRecord,
  ResourceVersionRecord,
  LearnerResourceProgressRecord,
  ResourceTagRecord,
  CreateLearningResourceDTO,
  UpdateLearningResourceDTO,
  CreateResourceVersionDTO,
  CreateLearnerResourceProgressDTO,
  UpdateLearnerResourceProgressDTO,
  CreateResourceTagDTO,
  ResourceType,
  StorageType,
  VisibilityStatus,
  ResourceProgressStatus
} from '../types';

const RESOURCE_COLUMNS = `
  resource_id,
  module_id,
  title,
  description,
  resource_type,
  storage_type,
  resource_url,
  estimated_minutes,
  visibility,
  version,
  created_at,
  updated_at
`;

const VERSION_COLUMNS = `
  resource_version_id,
  resource_id,
  version_no,
  resource_url,
  change_summary,
  created_at
`;

const PROGRESS_COLUMNS = `
  progress_id,
  learner_id,
  resource_id,
  status,
  progress_percentage,
  last_accessed_at,
  completed_at,
  version,
  created_at,
  updated_at
`;

const TAG_COLUMNS = `
  tag_id,
  resource_id,
  tag_name,
  created_at
`;

export class ResourceRepository {
  // ====================================================
  // PRIVATE MAPPERS
  // ====================================================

  private mapResourceRecord(row: any): LearningResourceRecord {
    return {
      resource_id: row.resource_id,
      module_id: row.module_id,
      title: row.title,
      description: row.description,
      resource_type: row.resource_type as ResourceType,
      storage_type: row.storage_type as StorageType,
      resource_url: row.resource_url,
      estimated_minutes: Number(row.estimated_minutes),
      visibility: row.visibility as VisibilityStatus,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapVersionRecord(row: any): ResourceVersionRecord {
    return {
      resource_version_id: row.resource_version_id,
      resource_id: row.resource_id,
      version_no: Number(row.version_no),
      resource_url: row.resource_url,
      change_summary: row.change_summary,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  private mapProgressRecord(row: any): LearnerResourceProgressRecord {
    return {
      progress_id: row.progress_id,
      learner_id: row.learner_id,
      resource_id: row.resource_id,
      status: row.status as ResourceProgressStatus,
      progress_percentage: Number(row.progress_percentage),
      last_accessed_at: row.last_accessed_at ? new Date(row.last_accessed_at) : null,
      completed_at: row.completed_at ? new Date(row.completed_at) : null,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapTagRecord(row: any): ResourceTagRecord {
    return {
      tag_id: row.tag_id,
      resource_id: row.resource_id,
      tag_name: row.tag_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  // ====================================================
  // LEARNING RESOURCES
  // ====================================================

  public async createLearningResource(dto: CreateLearningResourceDTO): Promise<LearningResourceRecord> {
    const sql = `
      INSERT INTO learning_resources (
        resource_id,
        module_id,
        title,
        description,
        resource_type,
        storage_type,
        resource_url,
        estimated_minutes,
        visibility
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.resource_id,
      dto.module_id,
      dto.title,
      dto.description || null,
      dto.resource_type,
      dto.storage_type,
      dto.resource_url,
      dto.estimated_minutes || 0,
      dto.visibility || 'draft'
    ];

    await query<ResultSetHeader>(sql, values);
    const resource = await this.findLearningResource(dto.resource_id);
    if (!resource) throw new Error(MESSAGES.SERVER_ERROR);
    return resource;
  }

  public async findLearningResource(resourceId: string): Promise<LearningResourceRecord | null> {
    const sql = `
      SELECT ${RESOURCE_COLUMNS}
      FROM learning_resources
      WHERE resource_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [resourceId]);
    if (rows.length === 0) return null;
    return this.mapResourceRecord(rows[0]);
  }

  public async updateLearningResource(resourceId: string, currentVersion: number, dto: UpdateLearningResourceDTO): Promise<LearningResourceRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      fields.push('title = ?');
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      fields.push('description = ?');
      values.push(dto.description);
    }
    if (dto.resource_type !== undefined) {
      fields.push('resource_type = ?');
      values.push(dto.resource_type);
    }
    if (dto.storage_type !== undefined) {
      fields.push('storage_type = ?');
      values.push(dto.storage_type);
    }
    if (dto.resource_url !== undefined) {
      fields.push('resource_url = ?');
      values.push(dto.resource_url);
    }
    if (dto.estimated_minutes !== undefined) {
      fields.push('estimated_minutes = ?');
      values.push(dto.estimated_minutes);
    }
    if (dto.visibility !== undefined) {
      fields.push('visibility = ?');
      values.push(dto.visibility);
    }

    if (fields.length === 0) {
      const resource = await this.findLearningResource(resourceId);
      if (!resource) throw new Error(MESSAGES.NOT_FOUND);
      return resource;
    }

    fields.push('version = version + 1');
    const sql = `
      UPDATE learning_resources
      SET ${fields.join(', ')}
      WHERE resource_id = ? AND version = ?
    `;
    
    values.push(resourceId, currentVersion);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const resource = await this.findLearningResource(resourceId);
    if (!resource) throw new Error(MESSAGES.SERVER_ERROR);
    return resource;
  }

  public async listLearningResources(moduleId: string, visibility?: VisibilityStatus): Promise<LearningResourceRecord[]> {
    const values: any[] = [moduleId];
    let sql = `
      SELECT ${RESOURCE_COLUMNS}
      FROM learning_resources
      WHERE module_id = ?
    `;

    if (visibility) {
      sql += ` AND visibility = ?`;
      values.push(visibility);
    }

    sql += ` ORDER BY created_at ASC`;
    const rows = await query<any[]>(sql, values);
    return rows.map(r => this.mapResourceRecord(r));
  }

  // ====================================================
  // RESOURCE VERSIONS
  // ====================================================

  public async createResourceVersion(dto: CreateResourceVersionDTO): Promise<ResourceVersionRecord> {
    const sql = `
      INSERT INTO resource_versions (
        resource_version_id,
        resource_id,
        version_no,
        resource_url,
        change_summary
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      dto.resource_version_id,
      dto.resource_id,
      dto.version_no,
      dto.resource_url,
      dto.change_summary || null
    ];

    await query<ResultSetHeader>(sql, values);
    
    const fetchSql = `
      SELECT ${VERSION_COLUMNS}
      FROM resource_versions
      WHERE resource_version_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.resource_version_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapVersionRecord(rows[0]);
  }

  public async listResourceVersions(resourceId: string): Promise<ResourceVersionRecord[]> {
    const sql = `
      SELECT ${VERSION_COLUMNS}
      FROM resource_versions
      WHERE resource_id = ?
      ORDER BY version_no DESC
    `;
    const rows = await query<any[]>(sql, [resourceId]);
    return rows.map(r => this.mapVersionRecord(r));
  }

  // ====================================================
  // LEARNER PROGRESS
  // ====================================================

  public async createLearnerProgress(dto: CreateLearnerResourceProgressDTO): Promise<LearnerResourceProgressRecord> {
    const sql = `
      INSERT INTO learner_resource_progress (
        progress_id,
        learner_id,
        resource_id,
        status,
        progress_percentage
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      dto.progress_id,
      dto.learner_id,
      dto.resource_id,
      dto.status || 'not_started',
      dto.progress_percentage || 0
    ];

    await query<ResultSetHeader>(sql, values);
    const progress = await this.findLearnerProgress(dto.learner_id, dto.resource_id);
    if (!progress) throw new Error(MESSAGES.SERVER_ERROR);
    return progress;
  }

  public async findLearnerProgress(learnerId: string, resourceId: string): Promise<LearnerResourceProgressRecord | null> {
    const sql = `
      SELECT ${PROGRESS_COLUMNS}
      FROM learner_resource_progress
      WHERE learner_id = ? AND resource_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [learnerId, resourceId]);
    if (rows.length === 0) return null;
    return this.mapProgressRecord(rows[0]);
  }

  public async updateLearnerProgress(progressId: string, currentVersion: number, dto: UpdateLearnerResourceProgressDTO): Promise<LearnerResourceProgressRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.status !== undefined) {
      fields.push('status = ?');
      values.push(dto.status);
    }
    if (dto.progress_percentage !== undefined) {
      fields.push('progress_percentage = ?');
      values.push(dto.progress_percentage);
    }
    if (dto.last_accessed_at !== undefined) {
      fields.push('last_accessed_at = ?');
      values.push(dto.last_accessed_at);
    }
    if (dto.completed_at !== undefined) {
      fields.push('completed_at = ?');
      values.push(dto.completed_at);
    }

    if (fields.length === 0) {
      // Return existing without query
      const sql = `SELECT ${PROGRESS_COLUMNS} FROM learner_resource_progress WHERE progress_id = ? LIMIT 1`;
      const rows = await query<any[]>(sql, [progressId]);
      if (rows.length === 0) throw new Error(MESSAGES.NOT_FOUND);
      return this.mapProgressRecord(rows[0]);
    }

    fields.push('version = version + 1');
    const sql = `
      UPDATE learner_resource_progress
      SET ${fields.join(', ')}
      WHERE progress_id = ? AND version = ?
    `;

    values.push(progressId, currentVersion);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const fetchSql = `SELECT ${PROGRESS_COLUMNS} FROM learner_resource_progress WHERE progress_id = ? LIMIT 1`;
    const rows = await query<any[]>(fetchSql, [progressId]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapProgressRecord(rows[0]);
  }

  // ====================================================
  // TAGS
  // ====================================================

  public async createResourceTag(dto: CreateResourceTagDTO): Promise<ResourceTagRecord> {
    const sql = `
      INSERT INTO resource_tags (
        tag_id,
        resource_id,
        tag_name
      ) VALUES (?, ?, ?)
    `;

    await query<ResultSetHeader>(sql, [dto.tag_id, dto.resource_id, dto.tag_name]);
    
    const fetchSql = `
      SELECT ${TAG_COLUMNS}
      FROM resource_tags
      WHERE tag_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.tag_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapTagRecord(rows[0]);
  }

  public async listResourceTags(resourceId: string): Promise<ResourceTagRecord[]> {
    const sql = `
      SELECT ${TAG_COLUMNS}
      FROM resource_tags
      WHERE resource_id = ?
    `;
    const rows = await query<any[]>(sql, [resourceId]);
    return rows.map(r => this.mapTagRecord(r));
  }
}
