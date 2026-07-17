import type { Response, NextFunction } from 'express';

import { AuditService } from '../service';
import type { AuthenticatedRequest } from '../../../shared/types';
import { success } from '../../../shared/response';

export class AuditController {
  private readonly auditService = new AuditService();

  // ====================================================
  // AUDIT LOGS
  // ====================================================

  public listAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const logs = await this.auditService.listAuditLogs(limit);
      success(res, logs);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // ACTIVITY TIMELINE
  // ====================================================

  public listActivities = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const activities = await this.auditService.listActivities(learnerId, limit);
      success(res, activities);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // LOGIN HISTORY
  // ====================================================

  public listLoginHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const history = await this.auditService.listLoginHistory(learnerId, limit);
      success(res, history);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // SYSTEM ACTIVITY
  // ====================================================

  public listSystemActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const activities = await this.auditService.listSystemActivity(limit);
      success(res, activities);
    } catch (error) {
      next(error);
    }
  };
}
