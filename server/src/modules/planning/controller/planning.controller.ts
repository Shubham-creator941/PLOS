import type { Response, NextFunction } from 'express';

import { PlanningService } from '../service';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';
import type { AuthenticatedRequest } from '../../../shared/types';

export class PlanningController {
  private readonly service = new PlanningService();

  private getAuthenticatedLearnerId(req: AuthenticatedRequest): string {
    const learnerId = req.user?.id;
    if (!learnerId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }
    return learnerId;
  }

  // ---- Plan Endpoints ----

  public createPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.createPlan(learnerId, req.body);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.getPlan(learnerId, req.params.plan_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public updatePlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.updatePlan(learnerId, req.params.plan_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public archivePlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.archivePlan(learnerId, req.params.plan_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public completePlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.completePlan(learnerId, req.params.plan_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.getProgress(learnerId, req.params.plan_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  // ---- Phase Endpoints ----

  public listPhases = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.listPhases(learnerId, req.params.plan_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public createPhase = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.createPhase(learnerId, req.params.plan_id, req.body);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public updatePhase = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.updatePhase(learnerId, req.params.phase_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public completePhase = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.completePhase(learnerId, req.params.phase_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public deletePhase = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      await this.service.deletePhase(learnerId, req.params.phase_id);
      success(res, { message: MESSAGES.SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  // ---- Module Endpoints ----

  public listModules = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.listModules(learnerId, req.params.phase_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public createModule = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.createModule(learnerId, req.params.phase_id, req.body);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public updateModule = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.updateModule(learnerId, req.params.module_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public completeModule = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.completeModule(learnerId, req.params.module_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public deleteModule = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      await this.service.deleteModule(learnerId, req.params.module_id);
      success(res, { message: MESSAGES.SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  // ---- Objective Endpoints ----

  public listObjectives = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.listObjectives(learnerId, req.params.module_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public createObjective = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.createObjective(learnerId, req.params.module_id, req.body);
      created(res, result);
    } catch (error) {
      next(error);
    }
  };

  public updateObjective = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.updateObjective(learnerId, req.params.objective_id, req.body);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public completeObjective = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const result = await this.service.completeObjective(learnerId, req.params.objective_id);
      success(res, result);
    } catch (error) {
      next(error);
    }
  };

  public deleteObjective = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      await this.service.deleteObjective(learnerId, req.params.objective_id);
      success(res, { message: MESSAGES.SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}
