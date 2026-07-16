import { NextFunction, Response } from 'express';
import { PlatformService } from '../service';
import { AuthenticatedRequest } from '../../../shared/types';
import { created, success } from '../../../shared/response';

export class PlatformController {
  private readonly platformService = new PlatformService();

  // ====================================================
  // PLATFORM SETTINGS
  // ====================================================

  public createSetting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const setting = await this.platformService.createSetting(req.body);
      created(res, setting, 'Platform setting created successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateSetting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { setting_key } = req.params;
      const { version } = req.body;
      const setting = await this.platformService.updateSetting(setting_key, version, req.body);
      success(res, setting, 'Platform setting updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public listSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicOnly = req.query.publicOnly === 'true';
      const settings = await this.platformService.listSettings(publicOnly);
      success(res, settings, 'Platform settings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // FEATURE FLAGS
  // ====================================================

  public listFeatures = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const features = await this.platformService.listFeatureFlags();
      success(res, features, 'Feature flags retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public enableFeature = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { feature_name } = req.params;
      const { version } = req.body;
      const feature = await this.platformService.enableFeature(feature_name, version);
      success(res, feature, 'Feature flag enabled successfully');
    } catch (error) {
      next(error);
    }
  };

  public disableFeature = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { feature_name } = req.params;
      const { version } = req.body;
      const feature = await this.platformService.disableFeature(feature_name, version);
      success(res, feature, 'Feature flag disabled successfully');
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // ANNOUNCEMENTS
  // ====================================================

  public createAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcement = await this.platformService.createAnnouncement(req.user!.id, req.body);
      created(res, announcement, 'Announcement created successfully');
    } catch (error) {
      next(error);
    }
  };

  public publishAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { announcement_id } = req.params;
      const { version } = req.body;
      const announcement = await this.platformService.publishAnnouncement(announcement_id, version);
      success(res, announcement, 'Announcement published successfully');
    } catch (error) {
      next(error);
    }
  };

  public archiveAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { announcement_id } = req.params;
      const { version } = req.body;
      const announcement = await this.platformService.archiveAnnouncement(announcement_id, version);
      success(res, announcement, 'Announcement archived successfully');
    } catch (error) {
      next(error);
    }
  };

  public listAnnouncements = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const announcements = await this.platformService.listAnnouncements(activeOnly);
      success(res, announcements, 'Announcements retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // SYSTEM HEALTH SNAPSHOTS
  // ====================================================

  public recordHealthSnapshot = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const snapshot = await this.platformService.recordSystemSnapshot(req.body);
      created(res, snapshot, 'System health snapshot recorded successfully');
    } catch (error) {
      next(error);
    }
  };

  public latestHealthSnapshot = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const snapshot = await this.platformService.getLatestHealth();
      success(res, snapshot, 'Latest system health snapshot retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
