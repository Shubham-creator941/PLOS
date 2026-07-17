import type { ResultSetHeader } from 'mysql2/promise';

import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import type {
  DashboardPreferenceRecord,
  DashboardSnapshotRecord,
  DashboardWidgetRecord,
  DashboardExportRecord,
  CreatePreferenceDTO,
  UpdatePreferenceDTO,
  CreateSnapshotDTO,
  UpdateSnapshotDTO,
  CreateWidgetDTO,
  UpdateWidgetDTO,
  CreateExportDTO,
  UpdateExportDTO,
  DashboardView,
  DashboardTheme,
  ExportType,
  ExportStatus
} from '../types';

const PREFERENCE_COLUMNS = `
  preference_id,
  learner_id,
  default_view,
  show_activity,
  show_mastery,
  show_recommendations,
  theme,
  version,
  created_at,
  updated_at
`;

const SNAPSHOT_COLUMNS = `
  snapshot_id,
  learner_id,
  generated_at,
  summary_json,
  version,
  created_at,
  updated_at
`;

const WIDGET_COLUMNS = `
  widget_state_id,
  learner_id,
  widget_name,
  position_no,
  visible,
  created_at,
  updated_at
`;

const EXPORT_COLUMNS = `
  export_id,
  learner_id,
  export_type,
  status,
  generated_at,
  file_name,
  created_at
`;

export class DashboardRepository {
  // ====================================================
  // PRIVATE MAPPERS
  // ====================================================

  private mapPreferenceRecord(row: any): DashboardPreferenceRecord {
    return {
      preference_id: row.preference_id,
      learner_id: row.learner_id,
      default_view: row.default_view as DashboardView,
      show_activity: Boolean(row.show_activity),
      show_mastery: Boolean(row.show_mastery),
      show_recommendations: Boolean(row.show_recommendations),
      theme: row.theme as DashboardTheme,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapSnapshotRecord(row: any): DashboardSnapshotRecord {
    return {
      snapshot_id: row.snapshot_id,
      learner_id: row.learner_id,
      generated_at: new Date(row.generated_at),
      summary_json: typeof row.summary_json === 'string' ? JSON.parse(row.summary_json) : row.summary_json,
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapWidgetRecord(row: any): DashboardWidgetRecord {
    return {
      widget_state_id: row.widget_state_id,
      learner_id: row.learner_id,
      widget_name: row.widget_name,
      position_no: Number(row.position_no),
      visible: Boolean(row.visible),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapExportRecord(row: any): DashboardExportRecord {
    return {
      export_id: row.export_id,
      learner_id: row.learner_id,
      export_type: row.export_type as ExportType,
      status: row.status as ExportStatus,
      generated_at: row.generated_at ? new Date(row.generated_at) : null,
      file_name: row.file_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Table has no updated_at column
    };
  }

  // ====================================================
  // METHODS
  // ====================================================

  // ---- Dashboard Preferences ----

  public async createPreference(dto: CreatePreferenceDTO): Promise<DashboardPreferenceRecord> {
    const sql = `
      INSERT INTO dashboard_preferences (
        preference_id,
        learner_id,
        default_view,
        show_activity,
        show_mastery,
        show_recommendations,
        theme
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.preference_id,
      dto.learner_id,
      dto.default_view,
      dto.show_activity,
      dto.show_mastery,
      dto.show_recommendations,
      dto.theme
    ];

    await query<ResultSetHeader>(sql, values);
    const pref = await this.findPreference(dto.learner_id);
    if (!pref) throw new Error(MESSAGES.SERVER_ERROR);
    return pref;
  }

  public async findPreference(learnerId: string): Promise<DashboardPreferenceRecord | null> {
    const sql = `
      SELECT ${PREFERENCE_COLUMNS}
      FROM dashboard_preferences
      WHERE learner_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    if (rows.length === 0) return null;
    return this.mapPreferenceRecord(rows[0]);
  }

  public async updatePreference(learnerId: string, version: number, dto: UpdatePreferenceDTO): Promise<DashboardPreferenceRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.default_view !== undefined) {
      fields.push('default_view = ?');
      values.push(dto.default_view);
    }
    if (dto.show_activity !== undefined) {
      fields.push('show_activity = ?');
      values.push(dto.show_activity);
    }
    if (dto.show_mastery !== undefined) {
      fields.push('show_mastery = ?');
      values.push(dto.show_mastery);
    }
    if (dto.show_recommendations !== undefined) {
      fields.push('show_recommendations = ?');
      values.push(dto.show_recommendations);
    }
    if (dto.theme !== undefined) {
      fields.push('theme = ?');
      values.push(dto.theme);
    }

    if (fields.length === 0) {
      const pref = await this.findPreference(learnerId);
      if (!pref) throw new Error(MESSAGES.NOT_FOUND);
      return pref;
    }

    fields.push('version = version + 1');

    const sql = `
      UPDATE dashboard_preferences
      SET ${fields.join(', ')}
      WHERE learner_id = ? AND version = ?
    `;

    values.push(learnerId, version);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected or preference not found');
    }

    const pref = await this.findPreference(learnerId);
    if (!pref) throw new Error(MESSAGES.SERVER_ERROR);
    return pref;
  }

  // ---- Dashboard Snapshots ----

  public async createSnapshot(dto: CreateSnapshotDTO): Promise<DashboardSnapshotRecord> {
    const sql = `
      INSERT INTO dashboard_snapshots (
        snapshot_id,
        learner_id,
        generated_at,
        summary_json
      ) VALUES (?, ?, ?, ?)
    `;

    const values = [
      dto.snapshot_id,
      dto.learner_id,
      dto.generated_at,
      JSON.stringify(dto.summary_json)
    ];

    await query<ResultSetHeader>(sql, values);
    
    // We can just fetch it
    const rows = await query<any[]>(`SELECT ${SNAPSHOT_COLUMNS} FROM dashboard_snapshots WHERE snapshot_id = ? LIMIT 1`, [dto.snapshot_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapSnapshotRecord(rows[0]);
  }

  public async findLatestSnapshot(learnerId: string): Promise<DashboardSnapshotRecord | null> {
    const sql = `
      SELECT ${SNAPSHOT_COLUMNS}
      FROM dashboard_snapshots
      WHERE learner_id = ?
      ORDER BY generated_at DESC
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    if (rows.length === 0) return null;
    return this.mapSnapshotRecord(rows[0]);
  }

  public async listSnapshots(learnerId: string): Promise<DashboardSnapshotRecord[]> {
    const sql = `
      SELECT ${SNAPSHOT_COLUMNS}
      FROM dashboard_snapshots
      WHERE learner_id = ?
      ORDER BY generated_at DESC
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    return rows.map(r => this.mapSnapshotRecord(r));
  }

  public async updateSnapshot(snapshotId: string, version: number, dto: UpdateSnapshotDTO): Promise<DashboardSnapshotRecord> {
    const sql = `
      UPDATE dashboard_snapshots
      SET summary_json = ?, generated_at = ?, version = version + 1
      WHERE snapshot_id = ? AND version = ?
    `;
    const values = [
      JSON.stringify(dto.summary_json),
      dto.generated_at,
      snapshotId,
      version
    ];

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected or snapshot not found');
    }

    const rows = await query<any[]>(`SELECT ${SNAPSHOT_COLUMNS} FROM dashboard_snapshots WHERE snapshot_id = ? LIMIT 1`, [snapshotId]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapSnapshotRecord(rows[0]);
  }

  // ---- Dashboard Widgets ----

  public async createWidget(dto: CreateWidgetDTO): Promise<DashboardWidgetRecord> {
    const sql = `
      INSERT INTO dashboard_widget_state (
        widget_state_id,
        learner_id,
        widget_name,
        position_no,
        visible
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      dto.widget_state_id,
      dto.learner_id,
      dto.widget_name,
      dto.position_no,
      dto.visible
    ];

    await query<ResultSetHeader>(sql, values);
    const widget = await this.findWidget(dto.widget_state_id);
    if (!widget) throw new Error(MESSAGES.SERVER_ERROR);
    return widget;
  }

  public async findWidget(widgetStateId: string): Promise<DashboardWidgetRecord | null> {
    const sql = `
      SELECT ${WIDGET_COLUMNS}
      FROM dashboard_widget_state
      WHERE widget_state_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [widgetStateId]);
    if (rows.length === 0) return null;
    return this.mapWidgetRecord(rows[0]);
  }

  public async listWidgets(learnerId: string): Promise<DashboardWidgetRecord[]> {
    const sql = `
      SELECT ${WIDGET_COLUMNS}
      FROM dashboard_widget_state
      WHERE learner_id = ?
      ORDER BY position_no ASC
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    return rows.map(r => this.mapWidgetRecord(r));
  }

  public async updateWidget(widgetStateId: string, dto: UpdateWidgetDTO): Promise<DashboardWidgetRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.position_no !== undefined) {
      fields.push('position_no = ?');
      values.push(dto.position_no);
    }
    if (dto.visible !== undefined) {
      fields.push('visible = ?');
      values.push(dto.visible);
    }

    if (fields.length === 0) {
      const widget = await this.findWidget(widgetStateId);
      if (!widget) throw new Error(MESSAGES.NOT_FOUND);
      return widget;
    }

    const sql = `
      UPDATE dashboard_widget_state
      SET ${fields.join(', ')}
      WHERE widget_state_id = ?
    `;
    
    values.push(widgetStateId);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR);
    }

    const widget = await this.findWidget(widgetStateId);
    if (!widget) throw new Error(MESSAGES.SERVER_ERROR);
    return widget;
  }

  // ---- Dashboard Exports ----

  public async createExport(dto: CreateExportDTO): Promise<DashboardExportRecord> {
    const sql = `
      INSERT INTO dashboard_exports (
        export_id,
        learner_id,
        export_type,
        status
      ) VALUES (?, ?, ?, ?)
    `;

    const values = [
      dto.export_id,
      dto.learner_id,
      dto.export_type,
      dto.status
    ];

    await query<ResultSetHeader>(sql, values);
    const exp = await this.findExport(dto.export_id);
    if (!exp) throw new Error(MESSAGES.SERVER_ERROR);
    return exp;
  }

  public async findExport(exportId: string): Promise<DashboardExportRecord | null> {
    const sql = `
      SELECT ${EXPORT_COLUMNS}
      FROM dashboard_exports
      WHERE export_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [exportId]);
    if (rows.length === 0) return null;
    return this.mapExportRecord(rows[0]);
  }

  public async listExports(learnerId: string): Promise<DashboardExportRecord[]> {
    const sql = `
      SELECT ${EXPORT_COLUMNS}
      FROM dashboard_exports
      WHERE learner_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    return rows.map(r => this.mapExportRecord(r));
  }

  public async updateExport(exportId: string, dto: UpdateExportDTO): Promise<DashboardExportRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.status !== undefined) {
      fields.push('status = ?');
      values.push(dto.status);
    }
    if (dto.generated_at !== undefined) {
      fields.push('generated_at = ?');
      values.push(dto.generated_at);
    }
    if (dto.file_name !== undefined) {
      fields.push('file_name = ?');
      values.push(dto.file_name);
    }

    if (fields.length === 0) {
      const exp = await this.findExport(exportId);
      if (!exp) throw new Error(MESSAGES.NOT_FOUND);
      return exp;
    }

    const sql = `
      UPDATE dashboard_exports
      SET ${fields.join(', ')}
      WHERE export_id = ?
    `;

    values.push(exportId);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR);
    }

    const exp = await this.findExport(exportId);
    if (!exp) throw new Error(MESSAGES.SERVER_ERROR);
    return exp;
  }
}
