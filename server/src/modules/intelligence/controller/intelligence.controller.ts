import { Response, NextFunction } from 'express';
import { IntelligenceService } from '../service';
import { AuthenticatedRequest } from '../../../shared/types';
import { success, created } from '../../../shared/response';

export class IntelligenceController {
  private readonly intelligenceService = new IntelligenceService();

  // ---- Analytics ----

  public recalculateAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const analytics = await this.intelligenceService.recalculateAnalytics(learnerId);
      success(res, analytics, 'Analytics recalculated successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const analytics = await this.intelligenceService.getAnalytics(learnerId);
      success(res, analytics);
    } catch (error) {
      next(error);
    }
  };

  // ---- Mastery & Assessment ----

  public recordAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const mastery = await this.intelligenceService.recordAssessment(learnerId, req.body);
      success(res, mastery, 'Assessment recorded successfully');
    } catch (error) {
      next(error);
    }
  };

  public listMastery = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const masteryList = await this.intelligenceService.listMastery(learnerId);
      success(res, masteryList);
    } catch (error) {
      next(error);
    }
  };

  // ---- Recommendations ----

  public generateRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { session_id } = req.body;
      const recommendation = await this.intelligenceService.generateRecommendations(learnerId, session_id);
      created(res, recommendation, 'Recommendation generated successfully');
    } catch (error) {
      next(error);
    }
  };

  public listRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const recommendations = await this.intelligenceService.listRecommendations(learnerId);
      success(res, recommendations);
    } catch (error) {
      next(error);
    }
  };

  // ---- Knowledge Gaps ----

  public listKnowledgeGaps = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const gaps = await this.intelligenceService.listKnowledgeGaps(learnerId);
      success(res, gaps);
    } catch (error) {
      next(error);
    }
  };

  public resolveKnowledgeGap = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const gap = await this.intelligenceService.resolveKnowledgeGap(learnerId, {
        gap_id: req.params.gap_id,
        ...req.body
      });
      success(res, gap, 'Knowledge gap resolved successfully');
    } catch (error) {
      next(error);
    }
  };
}
