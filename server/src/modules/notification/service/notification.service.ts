import { NotificationRepository } from '../repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import type {
  NotificationRecord,
  NotificationPreferenceRecord,
  NotificationDeliveryRecord,
  NotificationEventRecord,
  UpdateNotificationPreferenceDTO,
  EventType,
  SourceModule,
  NotificationType,
  EventPayload
} from '../types';

export class NotificationService {
  private readonly notificationRepo = new NotificationRepository();

  // ====================================================
  // PRIVATE HELPERS
  // ====================================================

  private async getOwnedNotification(notificationId: string, learnerId: string): Promise<NotificationRecord> {
    const notif = await this.notificationRepo.findNotification(notificationId);
    if (!notif) throw new Error(MESSAGES.NOT_FOUND || 'Notification not found');
    if (notif.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN || 'Access denied');
    return notif;
  }

  private validateLearner(learnerId: string): void {
    if (!learnerId) throw new Error(MESSAGES.UNAUTHORIZED || 'Learner ID is required');
  }

  private mapEventToNotificationContext(eventType: EventType, payload: EventPayload | null): { title: string; message: string; type: NotificationType } {
    switch (eventType) {
      case 'plan_created':
        return { title: 'New Learning Plan', message: 'Your customized learning plan is ready.', type: 'info' };
      case 'plan_completed':
        return { title: 'Plan Completed!', message: 'Congratulations on finishing your learning plan.', type: 'success' };
      case 'module_completed':
        return { title: 'Module Mastered', message: 'You have successfully completed a module.', type: 'success' };
      case 'assessment_completed':
        return { title: 'Assessment Results', message: 'You scored ' + (payload?.score || 0) + '%', type: 'info' };
      case 'recommendation_generated':
        return { title: 'New Recommendation', message: 'We have a new learning recommendation for you.', type: 'info' };
      case 'dashboard_export_completed':
        return { title: 'Export Ready', message: 'Your dashboard data export is complete.', type: 'success' };
      default:
        return { title: 'Platform Update', message: 'A new event occurred on your account.', type: 'info' };
    }
  }

  // ====================================================
  // BUSINESS EVENTS & NOTIFICATION GENERATION
  // ====================================================

  public async emitPlatformEvent(
    learnerId: string,
    eventType: EventType,
    sourceModule: SourceModule,
    referenceId: string,
    payload: EventPayload | null = null
  ): Promise<NotificationEventRecord> {
    this.validateLearner(learnerId);

    // 1. Log Immutable Business Event
    const event = await this.notificationRepo.createEvent({
      event_id: generateUUID(),
      learner_id: learnerId,
      event_type: eventType,
      source_module: sourceModule,
      reference_id: referenceId,
      payload
    });

    // 2. Format UI Notification
    const context = this.mapEventToNotificationContext(eventType, payload);

    const notification = await this.notificationRepo.createNotification({
      notification_id: generateUUID(),
      learner_id: learnerId,
      event_id: event.event_id,
      title: context.title,
      message: context.message,
      notification_type: context.type
    });

    // 3. Queue Delivery Routes
    const prefs = await this.getPreferences(learnerId);
    
    if (prefs.in_app_enabled) {
      await this.notificationRepo.createDelivery({
        delivery_id: generateUUID(),
        notification_id: notification.notification_id,
        channel: 'in_app',
        status: 'pending'
      });
    }

    if (prefs.email_enabled) {
      await this.notificationRepo.createDelivery({
        delivery_id: generateUUID(),
        notification_id: notification.notification_id,
        channel: 'email',
        status: 'pending'
      });
    }

    return event;
  }

  // ====================================================
  // NOTIFICATION MANAGEMENT
  // ====================================================

  public async listNotifications(learnerId: string): Promise<NotificationRecord[]> {
    this.validateLearner(learnerId);
    return this.notificationRepo.listNotifications(learnerId);
  }

  public async listEvents(learnerId: string): Promise<NotificationEventRecord[]> {
    this.validateLearner(learnerId);
    return this.notificationRepo.listEvents(learnerId);
  }

  public async markNotificationRead(learnerId: string, notificationId: string): Promise<NotificationRecord> {
    this.validateLearner(learnerId);
    await this.getOwnedNotification(notificationId, learnerId);
    return this.notificationRepo.markRead(notificationId);
  }

  public async bulkMarkNotificationsRead(learnerId: string, notificationIds: string[]): Promise<void> {
    this.validateLearner(learnerId);
    for (const id of notificationIds) {
      const notif = await this.notificationRepo.findNotification(id);
      if (notif && notif.learner_id === learnerId && notif.status === 'unread') {
        await this.notificationRepo.markRead(id);
      }
    }
  }

  public async archiveNotification(learnerId: string, notificationId: string): Promise<NotificationRecord> {
    this.validateLearner(learnerId);
    await this.getOwnedNotification(notificationId, learnerId);
    return this.notificationRepo.archive(notificationId);
  }

  // ====================================================
  // PREFERENCES
  // ====================================================

  public async getPreferences(learnerId: string): Promise<NotificationPreferenceRecord> {
    this.validateLearner(learnerId);
    const prefs = await this.notificationRepo.findPreference(learnerId);
    if (!prefs) {
      return this.notificationRepo.createPreference({
        preference_id: generateUUID(),
        learner_id: learnerId,
        in_app_enabled: true,
        email_enabled: false,
        push_enabled: false,
        quiet_hours_enabled: false
      });
    }
    return prefs;
  }

  public async updatePreferences(learnerId: string, version: number, dto: UpdateNotificationPreferenceDTO): Promise<NotificationPreferenceRecord> {
    this.validateLearner(learnerId);
    const prefs = await this.getPreferences(learnerId);
    return this.notificationRepo.updatePreference(learnerId, prefs.version || version, dto);
  }

  // ====================================================
  // DELIVERIES
  // ====================================================

  public async listDeliveries(learnerId: string, notificationId: string): Promise<NotificationDeliveryRecord[]> {
    this.validateLearner(learnerId);
    await this.getOwnedNotification(notificationId, learnerId);
    return this.notificationRepo.listDeliveries(notificationId);
  }
}
