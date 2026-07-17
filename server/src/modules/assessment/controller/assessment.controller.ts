import type { Response, NextFunction } from 'express';

import { AssessmentService } from '../service';
import type { AuthenticatedRequest } from '../../../shared/types';
import { success, created } from '../../../shared/response';
import { MESSAGES } from '../../../shared/messages';

export class AssessmentController {
  private readonly assessmentService = new AssessmentService();

  // ---- Templates ----

  public createTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await this.assessmentService.createTemplate(req.body);
      created(res, template, 'Template created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const template = await this.assessmentService.getTemplate(template_id);
      success(res, template);
    } catch (error) {
      next(error);
    }
  };

  public listTemplates = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { module_id } = req.params;
      if (!module_id) throw new Error(MESSAGES.BAD_REQUEST || 'module_id parameter is required');
      const templates = await this.assessmentService.listTemplates(module_id);
      success(res, templates);
    } catch (error) {
      next(error);
    }
  };

  public updateTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const template = await this.assessmentService.updateTemplate(template_id, req.body);
      success(res, template, 'Template updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public publishTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const template = await this.assessmentService.publishTemplate(template_id);
      success(res, template, 'Template published successfully');
    } catch (error) {
      next(error);
    }
  };

  public archiveTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const template = await this.assessmentService.archiveTemplate(template_id);
      success(res, template, 'Template archived successfully');
    } catch (error) {
      next(error);
    }
  };

  // ---- Questions ----

  public createQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const question = await this.assessmentService.createQuestion(template_id, req.body);
      created(res, question, 'Question created successfully');
    } catch (error) {
      next(error);
    }
  };

  public listQuestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { template_id } = req.params;
      const questions = await this.assessmentService.listQuestions(template_id);
      success(res, questions);
    } catch (error) {
      next(error);
    }
  };

  public updateQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { question_id } = req.params;
      const question = await this.assessmentService.updateQuestion(question_id, req.body);
      success(res, question, 'Question updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { question_id } = req.params;
      await this.assessmentService.deleteQuestion(question_id);
      success(res, null, 'Question deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  // ---- Attempts ----

  public startAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { template_id } = req.params;
      const { session_id } = req.body;
      const attempt = await this.assessmentService.startAttempt(learnerId, template_id, session_id);
      created(res, attempt, 'Assessment attempt started');
    } catch (error) {
      next(error);
    }
  };

  public getAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { attempt_id } = req.params;
      const attempt = await this.assessmentService.getAttempt(learnerId, attempt_id);
      success(res, attempt);
    } catch (error) {
      next(error);
    }
  };

  public submitAnswer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { attempt_id } = req.params;
      const answer = await this.assessmentService.submitAnswer(learnerId, attempt_id, req.body);
      success(res, answer, 'Answer submitted successfully');
    } catch (error) {
      next(error);
    }
  };

  public listAnswers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { attempt_id } = req.params;
      const answers = await this.assessmentService.listAnswers(learnerId, attempt_id);
      success(res, answers);
    } catch (error) {
      next(error);
    }
  };

  public submitAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learnerId = req.user!.id;
      const { attempt_id } = req.params;
      const attempt = await this.assessmentService.submitAttempt(learnerId, attempt_id);
      success(res, attempt, 'Attempt submitted successfully');
    } catch (error) {
      next(error);
    }
  };

  public evaluateAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { attempt_id } = req.params;
      const result = await this.assessmentService.evaluateAttempt(attempt_id);
      success(res, result, 'Attempt evaluated successfully');
    } catch (error) {
      next(error);
    }
  };
}
