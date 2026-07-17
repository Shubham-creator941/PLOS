import type { BaseEntity } from '../../../shared/types';

// ====================================================
// Reusable Union Types
// ====================================================

export type ResourceType =
  | 'auth'
  | 'learner'
  | 'journey'
  | 'planning'
  | 'session'
  | 'adaptive'
  | 'assessment'
  | 'intelligence'
  | 'dashboard'
  | 'notification'
  | 'system';

export type AuditStatus = 'success' | 'failure';
export type LoginStatus = 'success' | 'failed';

export type ActivityType =
  | 'learning'
  | 'assessment'
  | 'session'
  | 'planning'
  | 'recommendation'
  | 'dashboard';

export type Severity = 'info' | 'warning' | 'critical';

export type AuditMetadata = Record<string, unknown>;

// ====================================================
// Database Records
// ====================================================

export interface AuditLogRecord extends BaseEntity {
  audit_id: string;
  learner_id: string | null;
  action: string;
  resource_type: ResourceType;
  resource_id: string | null;
  status: AuditStatus;
  ip_address: string | null;
  user_agent: string | null;
  metadata: AuditMetadata | null;
}

export interface ActivityRecord extends BaseEntity {
  activity_id: string;
  learner_id: string;
  activity_type: ActivityType;
  title: string;
  description: string;
  reference_id: string | null;
}

export interface LoginHistoryRecord extends BaseEntity {
  login_id: string;
  learner_id: string;
  login_at: Date;
  logout_at: Date | null;
  ip_address: string | null;
  user_agent: string | null;
  status: LoginStatus;
}

export interface SystemActivityRecord extends BaseEntity {
  system_activity_id: string;
  module_name: ResourceType; // Enums overlap enough
  activity: string;
  severity: Severity;
  metadata: AuditMetadata | null;
}

// ====================================================
// Repository DTOs
// ====================================================

export interface CreateAuditLogDTO {
  readonly audit_id: string;
  readonly learner_id?: string | null;
  readonly action: string;
  readonly resource_type: ResourceType;
  readonly resource_id?: string | null;
  readonly status: AuditStatus;
  readonly ip_address?: string | null;
  readonly user_agent?: string | null;
  readonly metadata?: AuditMetadata | null;
}

export interface CreateActivityDTO {
  readonly activity_id: string;
  readonly learner_id: string;
  readonly activity_type: ActivityType;
  readonly title: string;
  readonly description: string;
  readonly reference_id?: string | null;
}

export interface CreateLoginHistoryDTO {
  readonly login_id: string;
  readonly learner_id: string;
  readonly login_at: Date;
  readonly ip_address?: string | null;
  readonly user_agent?: string | null;
  readonly status: LoginStatus;
}

export interface UpdateLoginHistoryDTO {
  readonly logout_at: Date;
}

export interface CreateSystemActivityDTO {
  readonly system_activity_id: string;
  readonly module_name: ResourceType;
  readonly activity: string;
  readonly severity: Severity;
  readonly metadata?: AuditMetadata | null;
}

// ====================================================
// Request DTOs
// ====================================================

export interface GetAuditLogsRequestDTO {
  readonly resource_type?: ResourceType;
  readonly status?: AuditStatus;
  readonly limit?: number;
}

export interface GetActivityTimelineRequestDTO {
  readonly activity_type?: ActivityType;
  readonly limit?: number;
}

// ====================================================
// Response DTOs
// ====================================================

export interface AuditLogDTO {
  readonly audit_id: string;
  readonly action: string;
  readonly resource_type: ResourceType;
  readonly status: AuditStatus;
  readonly created_at: string;
}

export interface ActivityDTO {
  readonly activity_id: string;
  readonly activity_type: ActivityType;
  readonly title: string;
  readonly description: string;
  readonly created_at: string;
}

export interface LoginHistoryDTO {
  readonly login_id: string;
  readonly login_at: string;
  readonly logout_at: string | null;
  readonly status: LoginStatus;
}
