import { BaseEntity } from '../../../shared/types';

// ====================================================
// Reusable Union Types
// ====================================================

export type DashboardView =
  | 'overview'
  | 'progress'
  | 'assessments'
  | 'mastery'
  | 'recommendations';

export type DashboardTheme =
  | 'light'
  | 'dark'
  | 'system';

export type ExportType =
  | 'pdf'
  | 'csv'
  | 'json';

export type ExportStatus =
  | 'pending'
  | 'completed'
  | 'failed';

export type DashboardSummary = Record<string, unknown>;

// ====================================================
// Database Records
// ====================================================

export interface DashboardPreferenceRecord extends BaseEntity {
  preference_id: string;
  learner_id: string;
  default_view: DashboardView;
  show_activity: boolean;
  show_mastery: boolean;
  show_recommendations: boolean;
  theme: DashboardTheme;
}

export interface DashboardSnapshotRecord extends BaseEntity {
  snapshot_id: string;
  learner_id: string;
  generated_at: Date;
  summary_json: DashboardSummary;
}

export interface DashboardWidgetRecord extends BaseEntity {
  widget_state_id: string;
  learner_id: string;
  widget_name: string;
  position_no: number;
  visible: boolean;
}

export interface DashboardExportRecord extends BaseEntity {
  export_id: string;
  learner_id: string;
  export_type: ExportType;
  status: ExportStatus;
  generated_at: Date | null;
  file_name: string | null;
}

// ====================================================
// Repository DTOs
// ====================================================

export interface CreatePreferenceDTO {
  readonly preference_id: string;
  readonly learner_id: string;
  readonly default_view: DashboardView;
  readonly show_activity: boolean;
  readonly show_mastery: boolean;
  readonly show_recommendations: boolean;
  readonly theme: DashboardTheme;
}

export interface UpdatePreferenceDTO {
  readonly default_view?: DashboardView;
  readonly show_activity?: boolean;
  readonly show_mastery?: boolean;
  readonly show_recommendations?: boolean;
  readonly theme?: DashboardTheme;
}

export interface CreateSnapshotDTO {
  readonly snapshot_id: string;
  readonly learner_id: string;
  readonly generated_at: Date;
  readonly summary_json: DashboardSummary;
}

export interface UpdateSnapshotDTO {
  readonly summary_json: DashboardSummary;
  readonly generated_at: Date;
}

export interface CreateWidgetDTO {
  readonly widget_state_id: string;
  readonly learner_id: string;
  readonly widget_name: string;
  readonly position_no: number;
  readonly visible: boolean;
}

export interface UpdateWidgetDTO {
  readonly position_no?: number;
  readonly visible?: boolean;
}

export interface CreateExportDTO {
  readonly export_id: string;
  readonly learner_id: string;
  readonly export_type: ExportType;
  readonly status: ExportStatus;
}

export interface UpdateExportDTO {
  readonly status?: ExportStatus;
  readonly generated_at?: Date;
  readonly file_name?: string;
}

// ====================================================
// Request DTOs
// ====================================================

export interface UpdatePreferenceRequestDTO {
  readonly default_view?: DashboardView;
  readonly show_activity?: boolean;
  readonly show_mastery?: boolean;
  readonly show_recommendations?: boolean;
  readonly theme?: DashboardTheme;
}

export interface UpdateWidgetLayoutRequestDTO {
  readonly widgets: ReadonlyArray<{
    readonly widget_name: string;
    readonly position_no: number;
    readonly visible: boolean;
  }>;
}

export interface GenerateDashboardRequestDTO {
  readonly force_refresh?: boolean;
}

export interface GenerateExportRequestDTO {
  readonly export_type: ExportType;
}

// ====================================================
// Response DTOs
// ====================================================

export interface DashboardOverviewDTO {
  readonly total_learning_minutes: number;
  readonly completed_modules: number;
  readonly mastery_percentage: number;
  readonly active_streak_days?: number;
}

export interface DashboardStatisticsDTO {
  readonly metric_name: string;
  readonly metric_value: number;
  readonly trend: 'up' | 'down' | 'flat';
}

export interface DashboardTimelineDTO {
  readonly event_date: string;
  readonly event_type: string;
  readonly description: string;
}

export interface DashboardRecommendationDTO {
  readonly recommendation_id: string;
  readonly recommendation_type: string;
  readonly reason: string;
}

export interface DashboardKnowledgeGapDTO {
  readonly gap_id: string;
  readonly module_name: string;
  readonly severity: string;
}

export interface DashboardExportDTO {
  readonly export_id: string;
  readonly status: ExportStatus;
  readonly file_url?: string;
}
