import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types';
import { LearnerService } from '../service/learner.service';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';

export class LearnerController {
  private readonly learnerService = new LearnerService();

  public onboardLearner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }
      
      const dto = {
        ...req.body,
        learner_id: req.user.id
      };

      const result = await this.learnerService.onboardLearner(dto);
      
      created(res, result, MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const profile = await this.learnerService.getProfile(req.user.id);
      
      success(res, profile, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const dto = {
        ...req.body,
        learner_id: req.user.id
      };

      const updatedProfile = await this.learnerService.updateProfile(dto);
      
      success(res, updatedProfile, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };
}
