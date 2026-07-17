import type { Response, NextFunction } from 'express';

import { SessionService } from '../service';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';
import type { AuthenticatedRequest } from '../../../shared/types';

export class SessionController {
  private readonly service = new SessionService();

  private getAuthenticatedLearnerId(req: AuthenticatedRequest): string {
    const learnerId = req.user?.id;
    if (!learnerId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }
    return learnerId;
  }

  public startSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.startSession(learnerId, req.body);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public pauseSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const { session_id } = req.params;
      const result = await this.service.pauseSession(learnerId, session_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public resumeSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const { session_id } = req.params;
      const result = await this.service.resumeSession(learnerId, session_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public completeObjective = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const { session_id } = req.params;
      const result = await this.service.completeObjective(learnerId, session_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public saveCheckpoint = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const { session_id } = req.params;
      const result = await this.service.saveCheckpoint(learnerId, session_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getSessionSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const { session_id } = req.params;
      const result = await this.service.getSessionSummary(learnerId, session_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
