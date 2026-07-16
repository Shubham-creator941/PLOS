import { BaseEntity } from '../../../shared/types';

// ====================================================
// Reusable Union Types
// ====================================================

export type AnnouncementStatus =
  | 'draft'
  | 'published'
  | 'archived';

export type SystemStatus =
  | 'healthy'
  | 'warning'
  | 'critical';

// ====================================================
// Database Records
// ====================================================

export interface PlatformSettingRecord extends BaseEntity {
  setting_id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  is_public: boolean;
  version: number;
}

export interface FeatureFlagRecord extends BaseEntity {
  feature_flag_id: string;
  feature_name: string;
  enabled: boolean;
  description: string | null;
  version: number;
}

export interface PlatformAnnouncementRecord extends BaseEntity {
  announcement_id: string;
  title: string;
  message: string;
  status: AnnouncementStatus;
  starts_at: Date | null;
  expires_at: Date | null;
  created_by: string;
  version: number;
}

export interface SystemHealthSnapshotRecord {
  snapshot_id: string;
  active_sessions: number;
  active_learners: number;
  running_plans: number;
  pending_notifications: number;
  failed_logins: number;
  system_status: SystemStatus;
  recorded_at: Date;
  created_at: Date;
  // Immutable table, no updated_at
}

// ====================================================
// Repository DTOs
// ====================================================

export interface CreatePlatformSettingDTO {
  readonly setting_id: string;
  readonly setting_key: string;
  readonly setting_value: string;
  readonly description?: string | null;
  readonly is_public?: boolean;
}

export interface UpdatePlatformSettingDTO {
  readonly setting_value?: string;
  readonly description?: string | null;
  readonly is_public?: boolean;
}

export interface CreateFeatureFlagDTO {
  readonly feature_flag_id: string;
  readonly feature_name: string;
  readonly enabled?: boolean;
  readonly description?: string | null;
}

export interface UpdateFeatureFlagDTO {
  readonly enabled?: boolean;
  readonly description?: string | null;
}

export interface CreateAnnouncementDTO {
  readonly announcement_id: string;
  readonly title: string;
  readonly message: string;
  readonly status?: AnnouncementStatus;
  readonly starts_at?: Date | null;
  readonly expires_at?: Date | null;
  readonly created_by: string;
}

export interface UpdateAnnouncementDTO {
  readonly title?: string;
  readonly message?: string;
  readonly status?: AnnouncementStatus;
  readonly starts_at?: Date | null;
  readonly expires_at?: Date | null;
}

export interface CreateSystemHealthSnapshotDTO {
  readonly snapshot_id: string;
  readonly active_sessions: number;
  readonly active_learners: number;
  readonly running_plans: number;
  readonly pending_notifications: number;
  readonly failed_logins: number;
  readonly system_status: SystemStatus;
  readonly recorded_at: Date;
}

// ====================================================
// Request DTOs
// ====================================================

export interface SetPlatformSettingRequestDTO {
  readonly setting_key: string;
  readonly setting_value: string;
  readonly description?: string;
  readonly is_public?: boolean;
}

export interface SetFeatureFlagRequestDTO {
  readonly feature_name: string;
  readonly enabled: boolean;
  readonly description?: string;
}

export interface CreateAnnouncementRequestDTO {
  readonly title: string;
  readonly message: string;
  readonly status?: AnnouncementStatus;
  readonly starts_at?: string;
  readonly expires_at?: string;
}

export interface UpdateAnnouncementRequestDTO {
  readonly title?: string;
  readonly message?: string;
  readonly status?: AnnouncementStatus;
  readonly starts_at?: string | null;
  readonly expires_at?: string | null;
}

// ====================================================
// Response DTOs
// ====================================================

export interface PlatformSettingDTO {
  readonly setting_id: string;
  readonly setting_key: string;
  readonly setting_value: string;
  readonly description: string | null;
  readonly is_public: boolean;
  readonly version: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface FeatureFlagDTO {
  readonly feature_flag_id: string;
  readonly feature_name: string;
  readonly enabled: boolean;
  readonly description: string | null;
  readonly version: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface PlatformAnnouncementDTO {
  readonly announcement_id: string;
  readonly title: string;
  readonly message: string;
  readonly status: AnnouncementStatus;
  readonly starts_at: string | null;
  readonly expires_at: string | null;
  readonly created_by: string;
  readonly version: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface SystemHealthSnapshotDTO {
  readonly snapshot_id: string;
  readonly active_sessions: number;
  readonly active_learners: number;
  readonly running_plans: number;
  readonly pending_notifications: number;
  readonly failed_logins: number;
  readonly system_status: SystemStatus;
  readonly recorded_at: string;
  readonly created_at: string;
}
