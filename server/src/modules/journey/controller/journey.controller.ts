import type { NextFunction, Response } from 'express';

import type { AuthenticatedRequest } from '../../../shared/types';
import { JourneyService } from '../service/journey.service';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';

export class JourneyController {
  private readonly journeyService = new JourneyService();

  private getAuthenticatedLearnerId(req: AuthenticatedRequest): string {
    if (!req.user || !req.user.id) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }
    return req.user.id;
  }

  public getActiveJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.getActiveJourney(learnerId);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public updateJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.updateJourney(learnerId, req.body);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public pauseJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.pauseJourney(learnerId);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public resumeJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.resumeJourney(learnerId);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public completeJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.completeJourney(learnerId);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public archiveJourney = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const journey = await this.journeyService.archiveJourney(learnerId);
      success(res, journey, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public getProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const progress = await this.journeyService.getProgress(learnerId);
      success(res, progress, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public listMilestones = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const milestones = await this.journeyService.listMilestones(learnerId);
      success(res, milestones, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public createMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const milestones = await this.journeyService.createMilestone(learnerId, req.body);
      created(res, milestones, MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public updateMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const milestone = await this.journeyService.updateMilestone(learnerId, req.params.milestone_id, req.body);
      success(res, milestone, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public completeMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = this.getAuthenticatedLearnerId(req);
      const milestone = await this.journeyService.completeMilestone(learnerId, req.params.milestone_id);
      success(res, milestone, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };
}
