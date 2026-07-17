import type { ResultSetHeader } from 'mysql2/promise';

import { query } from '../../../database/query';
import { MESSAGES } from '../../../shared/messages';
import type {
  NotificationEventRecord,
  NotificationRecord,
  NotificationPreferenceRecord,
  NotificationDeliveryRecord,
  CreateNotificationEventDTO,
  CreateNotificationDTO,
  CreateNotificationPreferenceDTO,
  UpdateNotificationPreferenceDTO,
  CreateNotificationDeliveryDTO,
  EventType,
  SourceModule,
  NotificationType,
  NotificationStatus,
  DeliveryChannel,
  DeliveryStatus
} from '../types';

const EVENT_COLUMNS = `
  event_id,
  learner_id,
  event_type,
  source_module,
  reference_id,
  payload,
  created_at
`;

const NOTIFICATION_COLUMNS = `
  notification_id,
  learner_id,
  event_id,
  title,
  message,
  notification_type,
  status,
  created_at,
  read_at
`;

const PREFERENCE_COLUMNS = `
  preference_id,
  learner_id,
  in_app_enabled,
  email_enabled,
  push_enabled,
  quiet_hours_enabled,
  version,
  created_at,
  updated_at
`;

const DELIVERY_COLUMNS = `
  delivery_id,
  notification_id,
  channel,
  status,
  attempts,
  sent_at,
  created_at
`;

export class NotificationRepository {
  // ====================================================
  // PRIVATE MAPPERS
  // ====================================================

  private mapEventRecord(row: any): NotificationEventRecord {
    return {
      event_id: row.event_id,
      learner_id: row.learner_id,
      event_type: row.event_type as EventType,
      source_module: row.source_module as SourceModule,
      reference_id: row.reference_id,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  private mapNotificationRecord(row: any): NotificationRecord {
    return {
      notification_id: row.notification_id,
      learner_id: row.learner_id,
      event_id: row.event_id,
      title: row.title,
      message: row.message,
      notification_type: row.notification_type as NotificationType,
      status: row.status as NotificationStatus,
      read_at: row.read_at ? new Date(row.read_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // No updated_at in schema
    };
  }

  private mapPreferenceRecord(row: any): NotificationPreferenceRecord {
    return {
      preference_id: row.preference_id,
      learner_id: row.learner_id,
      in_app_enabled: Boolean(row.in_app_enabled),
      email_enabled: Boolean(row.email_enabled),
      push_enabled: Boolean(row.push_enabled),
      quiet_hours_enabled: Boolean(row.quiet_hours_enabled),
      version: Number(row.version),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapDeliveryRecord(row: any): NotificationDeliveryRecord {
    return {
      delivery_id: row.delivery_id,
      notification_id: row.notification_id,
      channel: row.channel as DeliveryChannel,
      status: row.status as DeliveryStatus,
      attempts: Number(row.attempts),
      sent_at: row.sent_at ? new Date(row.sent_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at) // Immutable
    };
  }

  // ====================================================
  // NOTIFICATION EVENTS
  // ====================================================

  public async createEvent(dto: CreateNotificationEventDTO): Promise<NotificationEventRecord> {
    const sql = `
      INSERT INTO notification_events (
        event_id,
        learner_id,
        event_type,
        source_module,
        reference_id,
        payload
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.event_id,
      dto.learner_id,
      dto.event_type,
      dto.source_module,
      dto.reference_id,
      dto.payload ? JSON.stringify(dto.payload) : null
    ];

    await query<ResultSetHeader>(sql, values);
    const event = await this.findEvent(dto.event_id);
    if (!event) throw new Error(MESSAGES.SERVER_ERROR);
    return event;
  }

  public async findEvent(eventId: string): Promise<NotificationEventRecord | null> {
    const sql = `
      SELECT ${EVENT_COLUMNS}
      FROM notification_events
      WHERE event_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [eventId]);
    if (rows.length === 0) return null;
    return this.mapEventRecord(rows[0]);
  }

  public async listEvents(learnerId: string): Promise<NotificationEventRecord[]> {
    const sql = `
      SELECT ${EVENT_COLUMNS}
      FROM notification_events
      WHERE learner_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    return rows.map(r => this.mapEventRecord(r));
  }

  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  public async createNotification(dto: CreateNotificationDTO): Promise<NotificationRecord> {
    const sql = `
      INSERT INTO notifications (
        notification_id,
        learner_id,
        event_id,
        title,
        message,
        notification_type
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.notification_id,
      dto.learner_id,
      dto.event_id,
      dto.title,
      dto.message,
      dto.notification_type
    ];

    await query<ResultSetHeader>(sql, values);
    const notif = await this.findNotification(dto.notification_id);
    if (!notif) throw new Error(MESSAGES.SERVER_ERROR);
    return notif;
  }

  public async findNotification(notificationId: string): Promise<NotificationRecord | null> {
    const sql = `
      SELECT ${NOTIFICATION_COLUMNS}
      FROM notifications
      WHERE notification_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [notificationId]);
    if (rows.length === 0) return null;
    return this.mapNotificationRecord(rows[0]);
  }

  public async listNotifications(learnerId: string): Promise<NotificationRecord[]> {
    const sql = `
      SELECT ${NOTIFICATION_COLUMNS}
      FROM notifications
      WHERE learner_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    return rows.map(r => this.mapNotificationRecord(r));
  }

  public async markRead(notificationId: string): Promise<NotificationRecord> {
    const sql = `
      UPDATE notifications
      SET status = 'read', read_at = CURRENT_TIMESTAMP
      WHERE notification_id = ? AND status = 'unread'
    `;
    
    await query<ResultSetHeader>(sql, [notificationId]);
    
    // Always return current state even if it was already read
    const notif = await this.findNotification(notificationId);
    if (!notif) throw new Error(MESSAGES.NOT_FOUND);
    return notif;
  }

  public async archive(notificationId: string): Promise<NotificationRecord> {
    const sql = `
      UPDATE notifications
      SET status = 'archived'
      WHERE notification_id = ?
    `;
    
    await query<ResultSetHeader>(sql, [notificationId]);
    
    const notif = await this.findNotification(notificationId);
    if (!notif) throw new Error(MESSAGES.NOT_FOUND);
    return notif;
  }

  // ====================================================
  // NOTIFICATION PREFERENCES
  // ====================================================

  public async createPreference(dto: CreateNotificationPreferenceDTO): Promise<NotificationPreferenceRecord> {
    const sql = `
      INSERT INTO notification_preferences (
        preference_id,
        learner_id,
        in_app_enabled,
        email_enabled,
        push_enabled,
        quiet_hours_enabled
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dto.preference_id,
      dto.learner_id,
      dto.in_app_enabled,
      dto.email_enabled,
      dto.push_enabled,
      dto.quiet_hours_enabled
    ];

    await query<ResultSetHeader>(sql, values);
    const pref = await this.findPreference(dto.learner_id);
    if (!pref) throw new Error(MESSAGES.SERVER_ERROR);
    return pref;
  }

  public async findPreference(learnerId: string): Promise<NotificationPreferenceRecord | null> {
    const sql = `
      SELECT ${PREFERENCE_COLUMNS}
      FROM notification_preferences
      WHERE learner_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(sql, [learnerId]);
    if (rows.length === 0) return null;
    return this.mapPreferenceRecord(rows[0]);
  }

  public async updatePreference(learnerId: string, version: number, dto: UpdateNotificationPreferenceDTO): Promise<NotificationPreferenceRecord> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.in_app_enabled !== undefined) {
      fields.push('in_app_enabled = ?');
      values.push(dto.in_app_enabled);
    }
    if (dto.email_enabled !== undefined) {
      fields.push('email_enabled = ?');
      values.push(dto.email_enabled);
    }
    if (dto.push_enabled !== undefined) {
      fields.push('push_enabled = ?');
      values.push(dto.push_enabled);
    }
    if (dto.quiet_hours_enabled !== undefined) {
      fields.push('quiet_hours_enabled = ?');
      values.push(dto.quiet_hours_enabled);
    }

    if (fields.length === 0) {
      const pref = await this.findPreference(learnerId);
      if (!pref) throw new Error(MESSAGES.NOT_FOUND);
      return pref;
    }

    fields.push('version = version + 1');
    const sql = `
      UPDATE notification_preferences
      SET ${fields.join(', ')}
      WHERE learner_id = ? AND version = ?
    `;
    
    values.push(learnerId, version);

    const result = await query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Concurrent update detected');
    }

    const pref = await this.findPreference(learnerId);
    if (!pref) throw new Error(MESSAGES.SERVER_ERROR);
    return pref;
  }

  // ====================================================
  // NOTIFICATION DELIVERY LOG
  // ====================================================

  public async createDelivery(dto: CreateNotificationDeliveryDTO): Promise<NotificationDeliveryRecord> {
    const sql = `
      INSERT INTO notification_delivery_log (
        delivery_id,
        notification_id,
        channel,
        status
      ) VALUES (?, ?, ?, ?)
    `;

    const values = [
      dto.delivery_id,
      dto.notification_id,
      dto.channel,
      dto.status
    ];

    await query<ResultSetHeader>(sql, values);
    
    // For immutable logs, we simply fetch by ID
    const fetchSql = `
      SELECT ${DELIVERY_COLUMNS}
      FROM notification_delivery_log
      WHERE delivery_id = ?
      LIMIT 1
    `;
    const rows = await query<any[]>(fetchSql, [dto.delivery_id]);
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapDeliveryRecord(rows[0]);
  }

  public async listDeliveries(notificationId: string): Promise<NotificationDeliveryRecord[]> {
    const sql = `
      SELECT ${DELIVERY_COLUMNS}
      FROM notification_delivery_log
      WHERE notification_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await query<any[]>(sql, [notificationId]);
    return rows.map(r => this.mapDeliveryRecord(r));
  }
}
