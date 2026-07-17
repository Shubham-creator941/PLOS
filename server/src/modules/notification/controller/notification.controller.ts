import type { Response, NextFunction } from 'express';

import { NotificationService } from '../service';
import type { AuthenticatedRequest } from '../../../shared/types';
import { success } from '../../../shared/response';

export class NotificationController {
  private readonly notificationService = new NotificationService();

  // ---- Notifications ----

  public listNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const notifications = await this.notificationService.listNotifications(learnerId);
      success(res, notifications);
    } catch (error) {
      next(error);
    }
  };

  public markRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const notificationId = req.params.notification_id;
      const notification = await this.notificationService.markNotificationRead(learnerId, notificationId);
      success(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  };

  public archive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const notificationId = req.params.notification_id;
      const notification = await this.notificationService.archiveNotification(learnerId, notificationId);
      success(res, notification, 'Notification archived successfully');
    } catch (error) {
      next(error);
    }
  };

  // ---- Events ----

  public listEvents = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const events = await this.notificationService.listEvents(learnerId);
      success(res, events);
    } catch (error) {
      next(error);
    }
  };

  // ---- Preferences ----

  public getPreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const preferences = await this.notificationService.getPreferences(learnerId);
      success(res, preferences);
    } catch (error) {
      next(error);
    }
  };

  public updatePreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const version = Number(req.body.version) || 1;
      const preferences = await this.notificationService.updatePreferences(learnerId, version, req.body);
      success(res, preferences, 'Notification preferences updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
