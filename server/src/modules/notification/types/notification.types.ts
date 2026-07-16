import { BaseEntity } from '../../../shared/types';

// ====================================================
// Reusable Union Types
// ====================================================

export type EventType =
  | 'plan_created'
  | 'plan_completed'
  | 'phase_completed'
  | 'module_completed'
  | 'objective_completed'
  | 'session_started'
  | 'session_paused'
  | 'session_completed'
  | 'assessment_completed'
  | 'recommendation_generated'
  | 'dashboard_export_completed';

export type SourceModule =
  | 'planning'
  | 'session'
  | 'adaptive'
  | 'assessment'
  | 'intelligence'
  | 'dashboard';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type NotificationStatus =
  | 'unread'
  | 'read'
  | 'archived';

export type DeliveryChannel =
  | 'in_app'
  | 'email'
  | 'push';

export type DeliveryStatus =
  | 'pending'
  | 'sent'
  | 'failed';

export type EventPayload = Record<string, unknown>;

// ====================================================
// Database Records
// ====================================================

export interface NotificationEventRecord extends BaseEntity {
  event_id: string;
  learner_id: string;
  event_type: EventType;
  source_module: SourceModule;
  reference_id: string;
  payload: EventPayload | null;
}

export interface NotificationRecord extends BaseEntity {
  notification_id: string;
  learner_id: string;
  event_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  status: NotificationStatus;
  read_at: Date | null;
}

export interface NotificationPreferenceRecord extends BaseEntity {
  preference_id: string;
  learner_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  quiet_hours_enabled: boolean;
  version: number;
}

export interface NotificationDeliveryRecord extends BaseEntity {
  delivery_id: string;
  notification_id: string;
  channel: DeliveryChannel;
  status: DeliveryStatus;
  attempts: number;
  sent_at: Date | null;
}

// ====================================================
// Repository DTOs
// ====================================================

export interface CreateNotificationEventDTO {
  readonly event_id: string;
  readonly learner_id: string;
  readonly event_type: EventType;
  readonly source_module: SourceModule;
  readonly reference_id: string;
  readonly payload: EventPayload | null;
}

export interface CreateNotificationDTO {
  readonly notification_id: string;
  readonly learner_id: string;
  readonly event_id: string;
  readonly title: string;
  readonly message: string;
  readonly notification_type: NotificationType;
}

export interface UpdateNotificationDTO {
  readonly status?: NotificationStatus;
  readonly read_at?: Date | null;
}

export interface CreateNotificationPreferenceDTO {
  readonly preference_id: string;
  readonly learner_id: string;
  readonly in_app_enabled: boolean;
  readonly email_enabled: boolean;
  readonly push_enabled: boolean;
  readonly quiet_hours_enabled: boolean;
}

export interface UpdateNotificationPreferenceDTO {
  readonly in_app_enabled?: boolean;
  readonly email_enabled?: boolean;
  readonly push_enabled?: boolean;
  readonly quiet_hours_enabled?: boolean;
}

export interface CreateNotificationDeliveryDTO {
  readonly delivery_id: string;
  readonly notification_id: string;
  readonly channel: DeliveryChannel;
  readonly status: DeliveryStatus;
}

export interface UpdateNotificationDeliveryDTO {
  readonly status?: DeliveryStatus;
  readonly attempts?: number;
  readonly sent_at?: Date | null;
}

// ====================================================
// Request DTOs
// ====================================================

export interface UpdateNotificationPreferencesRequestDTO {
  readonly in_app_enabled?: boolean;
  readonly email_enabled?: boolean;
  readonly push_enabled?: boolean;
  readonly quiet_hours_enabled?: boolean;
}

export interface MarkNotificationReadRequestDTO {
  readonly status: NotificationStatus;
}

export interface BulkMarkReadRequestDTO {
  readonly notification_ids: ReadonlyArray<string>;
  readonly status: NotificationStatus;
}

// ====================================================
// Response DTOs
// ====================================================

export interface NotificationDTO {
  readonly notification_id: string;
  readonly title: string;
  readonly message: string;
  readonly notification_type: NotificationType;
  readonly status: NotificationStatus;
  readonly created_at: string;
  readonly read_at: string | null;
}

export interface NotificationPreferenceDTO {
  readonly preference_id: string;
  readonly in_app_enabled: boolean;
  readonly email_enabled: boolean;
  readonly push_enabled: boolean;
  readonly quiet_hours_enabled: boolean;
}

export interface DashboardNotificationSummaryDTO {
  readonly unread_count: number;
  readonly recent_notifications: ReadonlyArray<NotificationDTO>;
}
