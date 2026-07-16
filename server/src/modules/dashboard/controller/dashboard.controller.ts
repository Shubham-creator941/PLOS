import { Response, NextFunction } from 'express';
import { DashboardService } from '../service';
import { AuthenticatedRequest } from '../../../shared/types';
import { success, created } from '../../../shared/response';

export class DashboardController {
  private readonly dashboardService = new DashboardService();

  // ---- Overview & Metrics ----

  public getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const overview = await this.dashboardService.getDashboardOverview(learnerId);
      success(res, overview);
    } catch (error) {
      next(error);
    }
  };

  public getStatistics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const stats = await this.dashboardService.getStatistics(learnerId);
      success(res, stats);
    } catch (error) {
      next(error);
    }
  };

  public getTimeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const timeline = await this.dashboardService.getTimeline(learnerId);
      success(res, timeline);
    } catch (error) {
      next(error);
    }
  };

  // ---- Preferences ----

  public getPreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const preferences = await this.dashboardService.getPreferences(learnerId);
      success(res, preferences);
    } catch (error) {
      next(error);
    }
  };

  public updatePreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const version = Number(req.body.version) || 1;
      const preferences = await this.dashboardService.updatePreferences(learnerId, version, req.body);
      success(res, preferences, 'Preferences updated successfully');
    } catch (error) {
      next(error);
    }
  };

  // ---- Widget Layout ----

  public listWidgets = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const widgets = await this.dashboardService.listWidgets(learnerId);
      success(res, widgets);
    } catch (error) {
      next(error);
    }
  };

  public updateWidgets = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const widgets = await this.dashboardService.updateWidgetLayout(learnerId, req.body);
      success(res, widgets, 'Widget layout updated successfully');
    } catch (error) {
      next(error);
    }
  };

  // ---- Snapshots & Exports ----

  public generateSnapshot = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const snapshot = await this.dashboardService.generateSnapshot(learnerId);
      created(res, snapshot, 'Snapshot generated successfully');
    } catch (error) {
      next(error);
    }
  };

  public generateExport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const exportJob = await this.dashboardService.createExport(learnerId, req.body);
      created(res, exportJob, 'Export job created successfully');
    } catch (error) {
      next(error);
    }
  };

  public listExports = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const exports = await this.dashboardService.listExports(learnerId);
      success(res, exports);
    } catch (error) {
      next(error);
    }
  };
}
