import type { ResultSetHeader } from 'mysql2/promise';

import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import type {
  PlatformSettingRecord,
  FeatureFlagRecord,
  PlatformAnnouncementRecord,
  SystemHealthSnapshotRecord,
  CreatePlatformSettingDTO,
  UpdatePlatformSettingDTO,
  CreateFeatureFlagDTO,
  UpdateFeatureFlagDTO,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
  CreateSystemHealthSnapshotDTO,
  AnnouncementStatus,
  SystemStatus
} from '../types';

const SETTING_COLUMNS = `
  setting_id,
  setting_key,
  setting_value,
  description,
  is_public,
  version,
  created_at,
  updated_at
`;

const FEATURE_FLAG_COLUMNS = `
  feature_flag_id,
  feature_name,
  enabled,
  description,
  version,
  created_at,
  updated_at
`;

const ANNOUNCEMENT_COLUMNS = `
  announcement_id,
  title,
  message,
  status,
  starts_at,
  expires_at,
  created_by,
  version,
  created_at,
  updated_at
`;

const HEALTH_SNAPSHOT_COLUMNS = `
  snapshot_id,
  active_sessions,
  active_learners,
  running_plans,
  pending_notifications,
  failed_logins,
  system_status,
  recorded_at,
  created_at
`;

export class PlatformRepository {
  // ====================================================
  // PRIVATE MAPPERS
  // ====================================================

  private mapSettingRecord(row: any): PlatformSettingRecord {
    return {
      setting_id: row.setting_id,
      setting_key: row.setting_key,
      setting_value: row.setting_value,
      description: row.description,
      is_public: Boolean(row.is_public),
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapFeatureFlagRecord(row: any): FeatureFlagRecord {
    return {
      feature_flag_id: row.feature_flag_id,
      feature_name: row.feature_name,
      enabled: Boolean(row.enabled),
      description: row.description,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapAnnouncementRecord(row: any): PlatformAnnouncementRecord {
    return {
      announcement_id: row.announcement_id,
      title: row.title,
      message: row.message,
      status: row.status as AnnouncementStatus,
      starts_at: row.starts_at ? new Date(row.starts_at) : null,
      expires_at: row.expires_at ? new Date(row.expires_at) : null,
      created_by: row.created_by,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapHealthSnapshotRecord(row: any): SystemHealthSnapshotRecord {
    return {
      snapshot_id: row.snapshot_id,
      active_sessions: Number(row.active_sessions),
      active_learners: Number(row.active_learners),
      running_plans: Number(row.running_plans),
      pending_notifications: Number(row.pending_notifications),
      failed_logins: Number(row.failed_logins),
      system_status: row.system_status as SystemStatus,
      recorded_at: new Date(row.recorded_at),
      created_at: new Date(row.created_at)
    };
  }

  // ====================================================
  // PLATFORM SETTINGS
  // ====================================================

  public async createSetting(dto: CreatePlatformSettingDTO): Promise<PlatformSettingRecord> {
    const sql = `
      INSERT INTO platform_settings (
        setting_id,
        setting_key,
        setting_value,
        description,
        is_public
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      dto.setting_id,
      dto.setting_key,
      dto.setting_value,
      dto.description || null,
      dto.is_public !== undefined ? dto.is_public : false
    ];

    await query<ResultSetHeader>(sql, values);
    const setting = await this.findSettingByKey(dto.setting_key);
    if (!setting) throw new Error(MESSAGES.SERVER_ERROR);
    return setting;
  }

  public async findSettingByKey(settingKey: string): Promise<PlatformSettingRecord | null> {
    const sql = `SELECT ${SETTING_COLUMNS} FROM platform_settings WHERE setting_key = ? LIMIT 1`;
    const rows = await query<any[]>(sql, [settingKey]);
    if (rows.length === 0) return null;
    return this.mapSettingRecord(rows[0]);
  }

  public async updateSetting(settingKey: string, currentVersion: number, dto: UpdatePlatformSettingDTO): Promise<PlatformSettingRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.setting_value !== undefined) {
      fields.push('setting_value = ?');
      values.push(dto.setting_value);
    }
    if (dto.description !== undefined) {
      fields.push('description = ?');
      values.push(dto.description);
    }
    if (dto.is_public !== undefined) {
      fields.push('is_public = ?');
      values.push(dto.is_public);
    }

    if (fields.length === 0) {
      const setting = await this.findSettingByKey(settingKey);
      if (!setting) throw new Error(MESSAGES.NOT_FOUND);
      return setting;
    }

    fields.push('version = version + 1');
    values.push(settingKey, currentVersion);

    const sql = `
      UPDATE platform_settings
      SET ${fields.join(', ')}
      WHERE setting_key = ? AND version = ?
    `;

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const setting = await this.findSettingByKey(settingKey);
    if (!setting) throw new Error(MESSAGES.SERVER_ERROR);
    return setting;
  }

  public async deleteSetting(settingKey: string): Promise<void> {
    const sql = `DELETE FROM platform_settings WHERE setting_key = ?`;
    await query<ResultSetHeader>(sql, [settingKey]);
  }

  public async listSettings(publicOnly: boolean = false): Promise<PlatformSettingRecord[]> {
    let sql = `SELECT ${SETTING_COLUMNS} FROM platform_settings`;
    const values: any[] = [];

    if (publicOnly) {
      sql += ` WHERE is_public = ?`;
      values.push(true);
    }

    sql += ` ORDER BY setting_key ASC`;
    const rows = await query<any[]>(sql, values);
    return rows.map(r => this.mapSettingRecord(r));
  }

  // ====================================================
  // FEATURE FLAGS
  // ====================================================

  public async createFeatureFlag(dto: CreateFeatureFlagDTO): Promise<FeatureFlagRecord> {
    const sql = `
      INSERT INTO feature_flags (
        feature_flag_id,
        feature_name,
        enabled,
        description
      ) VALUES (?, ?, ?, ?)
    `;

    const values = [
      dto.feature_flag_id,
      dto.feature_name,
      dto.enabled !== undefined ? dto.enabled : true,
      dto.description || null
    ];

    await query<ResultSetHeader>(sql, values);
    const flag = await this.findFeatureFlagByName(dto.feature_name);
    if (!flag) throw new Error(MESSAGES.SERVER_ERROR);
    return flag;
  }

  public async findFeatureFlagByName(featureName: string): Promise<FeatureFlagRecord | null> {
    const sql = `SELECT ${FEATURE_FLAG_COLUMNS} FROM feature_flags WHERE feature_name = ? LIMIT 1`;
    const rows = await query<any[]>(sql, [featureName]);
    if (rows.length === 0) return null;
    return this.mapFeatureFlagRecord(rows[0]);
  }

  public async updateFeatureFlag(featureName: string, currentVersion: number, dto: UpdateFeatureFlagDTO): Promise<FeatureFlagRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.enabled !== undefined) {
      fields.push('enabled = ?');
      values.push(dto.enabled);
    }
    if (dto.description !== undefined) {
      fields.push('description = ?');
      values.push(dto.description);
    }

    if (fields.length === 0) {
      const flag = await this.findFeatureFlagByName(featureName);
      if (!flag) throw new Error(MESSAGES.NOT_FOUND);
      return flag;
    }

    fields.push('version = version + 1');
    values.push(featureName, currentVersion);

    const sql = `
      UPDATE feature_flags
      SET ${fields.join(', ')}
      WHERE feature_name = ? AND version = ?
    `;

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const flag = await this.findFeatureFlagByName(featureName);
    if (!flag) throw new Error(MESSAGES.SERVER_ERROR);
    return flag;
  }

  public async deleteFeatureFlag(featureName: string): Promise<void> {
    const sql = `DELETE FROM feature_flags WHERE feature_name = ?`;
    await query<ResultSetHeader>(sql, [featureName]);
  }

  public async listFeatureFlags(): Promise<FeatureFlagRecord[]> {
    const sql = `SELECT ${FEATURE_FLAG_COLUMNS} FROM feature_flags ORDER BY feature_name ASC`;
    const rows = await query<any[]>(sql);
    return rows.map(r => this.mapFeatureFlagRecord(r));
  }

  // ====================================================
  // ANNOUNCEMENTS
  // ====================================================

  public async createAnnouncement(dto: CreateAnnouncementDTO): Promise<PlatformAnnouncementRecord> {
    const sql = `
      INSERT INTO platform_announcements (
        announcement_id,
        title,
        message,
        status,
        starts_at,
        expires_at,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.announcement_id,
      dto.title,
      dto.message,
      dto.status || 'draft',
      dto.starts_at || null,
      dto.expires_at || null,
      dto.created_by
    ];

    await query<ResultSetHeader>(sql, values);
    const announcement = await this.findAnnouncement(dto.announcement_id);
    if (!announcement) throw new Error(MESSAGES.SERVER_ERROR);
    return announcement;
  }

  public async findAnnouncement(announcementId: string): Promise<PlatformAnnouncementRecord | null> {
    const sql = `SELECT ${ANNOUNCEMENT_COLUMNS} FROM platform_announcements WHERE announcement_id = ? LIMIT 1`;
    const rows = await query<any[]>(sql, [announcementId]);
    if (rows.length === 0) return null;
    return this.mapAnnouncementRecord(rows[0]);
  }

  public async updateAnnouncement(announcementId: string, currentVersion: number, dto: UpdateAnnouncementDTO): Promise<PlatformAnnouncementRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      fields.push('title = ?');
      values.push(dto.title);
    }
    if (dto.message !== undefined) {
      fields.push('message = ?');
      values.push(dto.message);
    }
    if (dto.status !== undefined) {
      fields.push('status = ?');
      values.push(dto.status);
    }
    if (dto.starts_at !== undefined) {
      fields.push('starts_at = ?');
      values.push(dto.starts_at);
    }
    if (dto.expires_at !== undefined) {
      fields.push('expires_at = ?');
      values.push(dto.expires_at);
    }

    if (fields.length === 0) {
      const announcement = await this.findAnnouncement(announcementId);
      if (!announcement) throw new Error(MESSAGES.NOT_FOUND);
      return announcement;
    }

    fields.push('version = version + 1');
    values.push(announcementId, currentVersion);

    const sql = `
      UPDATE platform_announcements
      SET ${fields.join(', ')}
      WHERE announcement_id = ? AND version = ?
    `;

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const announcement = await this.findAnnouncement(announcementId);
    if (!announcement) throw new Error(MESSAGES.SERVER_ERROR);
    return announcement;
  }

  public async deleteAnnouncement(announcementId: string): Promise<void> {
    const sql = `DELETE FROM platform_announcements WHERE announcement_id = ?`;
    await query<ResultSetHeader>(sql, [announcementId]);
  }

  public async listAnnouncements(activeOnly: boolean = false): Promise<PlatformAnnouncementRecord[]> {
    let sql = `SELECT ${ANNOUNCEMENT_COLUMNS} FROM platform_announcements`;
    const values: any[] = [];

    if (activeOnly) {
      sql += ` WHERE status = 'published' AND (starts_at IS NULL OR starts_at <= NOW()) AND (expires_at IS NULL OR expires_at >= NOW())`;
    }

    sql += ` ORDER BY created_at DESC`;
    const rows = await query<any[]>(sql, values);
    return rows.map(r => this.mapAnnouncementRecord(r));
  }

  // ====================================================
  // SYSTEM HEALTH SNAPSHOTS
  // ====================================================

  public async createSystemHealthSnapshot(dto: CreateSystemHealthSnapshotDTO): Promise<SystemHealthSnapshotRecord> {
    const sql = `
      INSERT INTO system_health_snapshots (
        snapshot_id,
        active_sessions,
        active_learners,
        running_plans,
        pending_notifications,
        failed_logins,
        system_status,
        recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.snapshot_id,
      dto.active_sessions,
      dto.active_learners,
      dto.running_plans,
      dto.pending_notifications,
      dto.failed_logins,
      dto.system_status,
      dto.recorded_at
    ];

    await query<ResultSetHeader>(sql, values);
    
    const fetchSql = `SELECT ${HEALTH_SNAPSHOT_COLUMNS} FROM system_health_snapshots WHERE snapshot_id = ? LIMIT 1`;
    const rows = await query<any[]>(fetchSql, [dto.snapshot_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapHealthSnapshotRecord(rows[0]);
  }

  public async getLatestSystemHealthSnapshot(): Promise<SystemHealthSnapshotRecord | null> {
    const sql = `
      SELECT ${HEALTH_SNAPSHOT_COLUMNS}
      FROM system_health_snapshots
      ORDER BY recorded_at DESC
      LIMIT 1
    `;
    const rows = await query<any[]>(sql);
    if (rows.length === 0) return null;
    return this.mapHealthSnapshotRecord(rows[0]);
  }
}
