import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types';
import { AdaptiveRuntimeService } from '../service';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';

export class AdaptiveRuntimeController {
  private readonly service = new AdaptiveRuntimeService();

  private getAuthenticatedLearnerId(req: AuthenticatedRequest): string {
    if (!req.user || !req.user.id) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }
    return req.user.id;
  }

  public initializeRuntime = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const sessionId = req.body.session_id;
      const result = await this.service.initializeRuntime(learnerId, sessionId);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getRuntime = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const runtimeId = req.params.runtime_id;
      const result = await this.service.getRuntime(learnerId, runtimeId);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public evaluateRuntime = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const runtimeId = req.params.runtime_id;
      const result = await this.service.evaluateRuntime(learnerId, runtimeId);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getDecisionHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const runtimeId = req.params.runtime_id;
      const result = await this.service.getDecisionHistory(learnerId, runtimeId);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getPendingReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const runtimeId = req.params.runtime_id;
      const result = await this.service.getPendingReviews(learnerId, runtimeId);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
