import { AssessmentRepository } from '../repository';
import { PlanningRepository } from '../../planning/repository';
import { SessionRepository } from '../../session/repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  AssessmentTemplateRecord,
  AssessmentAttemptRecord,
  AssessmentAnswerRecord,
  CreateTemplateRequestDTO,
  CreateTemplateDTO,
  CreateQuestionRequestDTO,
  CreateQuestionDTO,
  SubmitAnswerRequestDTO,
  CreateAnswerDTO,
  CreateAttemptDTO,
  AssessmentResultDTO
} from '../types';

export class AssessmentService {
  private readonly assessmentRepo = new AssessmentRepository();
  private readonly planningRepo = new PlanningRepository();
  private readonly sessionRepo = new SessionRepository();

  // ---- Private Helpers ----

  private async getOwnedTemplate(templateId: string): Promise<AssessmentTemplateRecord> {
    const template = await this.assessmentRepo.findTemplate(templateId);
    if (!template) throw new Error(MESSAGES.NOT_FOUND);
    return template;
  }

  private async getOwnedAttempt(learnerId: string, attemptId: string): Promise<AssessmentAttemptRecord> {
    const attempt = await this.assessmentRepo.findAttempt(attemptId);
    if (!attempt) throw new Error(MESSAGES.NOT_FOUND);
    if (attempt.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN);
    return attempt;
  }

  private async validatePublishedTemplate(templateId: string): Promise<AssessmentTemplateRecord> {
    const template = await this.getOwnedTemplate(templateId);
    if (template.status !== 'published') throw new Error(MESSAGES.BAD_REQUEST || 'Template is not published');
    return template;
  }

  // ---- Templates ----

  public async createTemplate(dto: CreateTemplateRequestDTO): Promise<AssessmentTemplateRecord> {
    const module = await this.planningRepo.findModule(dto.module_id);
    if (!module) throw new Error(MESSAGES.NOT_FOUND || 'Module not found');

    const createDto: CreateTemplateDTO = {
      template_id: generateUUID(),
      module_id: dto.module_id,
      title: dto.title,
      description: dto.description,
      passing_score: dto.passing_score,
      max_score: dto.max_score,
      status: 'draft'
    };

    return this.assessmentRepo.createTemplate(createDto);
  }

  public async getTemplate(templateId: string): Promise<AssessmentTemplateRecord> {
    const template = await this.assessmentRepo.findTemplate(templateId);
    if (!template) throw new Error(MESSAGES.NOT_FOUND);
    return template;
  }

  public async listTemplates(moduleId: string): Promise<AssessmentTemplateRecord[]> {
    return this.assessmentRepo.listTemplates(moduleId);
  }

  public async updateTemplate(templateId: string, dto: any): Promise<AssessmentTemplateRecord> {
    return this.assessmentRepo.updateTemplate(templateId, dto);
  }

  public async publishTemplate(templateId: string): Promise<AssessmentTemplateRecord> {
    const template = await this.getOwnedTemplate(templateId);
    if (template.status !== 'draft') throw new Error(MESSAGES.BAD_REQUEST || 'Only draft templates can be published');
    
    return this.assessmentRepo.publishTemplate(templateId, template.version);
  }

  public async archiveTemplate(templateId: string): Promise<AssessmentTemplateRecord> {
    const template = await this.getOwnedTemplate(templateId);
    if (template.status !== 'draft' && template.status !== 'published') {
      throw new Error(MESSAGES.BAD_REQUEST || 'Only draft or published templates can be archived');
    }

    return this.assessmentRepo.archiveTemplate(templateId, template.version);
  }

  // ---- Questions ----

  public async createQuestion(templateId: string, dto: CreateQuestionRequestDTO) {
    const template = await this.getOwnedTemplate(templateId);
    if (template.status !== 'draft') throw new Error(MESSAGES.BAD_REQUEST || 'Questions can only be added to draft templates');

    const createDto: CreateQuestionDTO = {
      question_id: generateUUID(),
      template_id: templateId,
      question_text: dto.question_text,
      question_type: dto.question_type,
      options: dto.options,
      correct_answer: dto.correct_answer,
      points: dto.points,
      order_no: dto.order_no
    };

    return this.assessmentRepo.createQuestion(createDto);
  }

  public async listQuestions(templateId: string) {
    return this.assessmentRepo.listQuestions(templateId);
  }

  public async updateQuestion(questionId: string, dto: any) {
    return this.assessmentRepo.updateQuestion(questionId, dto);
  }

  public async deleteQuestion(questionId: string) {
    return this.assessmentRepo.deleteQuestion(questionId);
  }

  // ---- Attempts ----

  public async startAttempt(learnerId: string, templateId: string, sessionId: string): Promise<AssessmentAttemptRecord> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new Error(MESSAGES.NOT_FOUND);
    if (session.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN);
    if (session.status !== 'active') throw new Error(MESSAGES.BAD_REQUEST || 'Session is not active');

    await this.validatePublishedTemplate(templateId);

    const existingActive = await this.assessmentRepo.findActiveAttempt(sessionId);
    if (existingActive) throw new Error(MESSAGES.BAD_REQUEST || 'An active attempt already exists for this session');

    const createDto: CreateAttemptDTO = {
      attempt_id: generateUUID(),
      template_id: templateId,
      session_id: sessionId,
      learner_id: learnerId,
      started_at: new Date()
    };

    return this.assessmentRepo.createAttempt(createDto);
  }

  public async getAttempt(learnerId: string, attemptId: string): Promise<AssessmentAttemptRecord> {
    return this.getOwnedAttempt(learnerId, attemptId);
  }

  // ---- Answers ----

  public async submitAnswer(learnerId: string, attemptId: string, dto: SubmitAnswerRequestDTO): Promise<AssessmentAnswerRecord | void> {
    const attempt = await this.getOwnedAttempt(learnerId, attemptId);
    if (attempt.status !== 'in_progress') throw new Error(MESSAGES.BAD_REQUEST || 'Attempt is not in progress');

    const question = await this.assessmentRepo.findQuestion(dto.question_id);
    if (!question) throw new Error(MESSAGES.NOT_FOUND);

    const answers = await this.assessmentRepo.listAnswers(attemptId);
    const existing = answers.find(a => a.question_id === dto.question_id);

    if (existing) {
      return this.assessmentRepo.updateSubmittedAnswer(existing.answer_id, dto.submitted_answer);
    }

    const answerDto: CreateAnswerDTO = {
      answer_id: generateUUID(),
      attempt_id: attemptId,
      question_id: dto.question_id,
      submitted_answer: dto.submitted_answer,
      awarded_points: 0,
      is_correct: false
    };

    return this.assessmentRepo.createAnswer(answerDto);
  }

  public async listAnswers(learnerId: string, attemptId: string): Promise<AssessmentAnswerRecord[]> {
    await this.getOwnedAttempt(learnerId, attemptId);
    return this.assessmentRepo.listAnswers(attemptId);
  }

  // ---- Submission & Evaluation ----

  public async submitAttempt(learnerId: string, attemptId: string): Promise<AssessmentAttemptRecord> {
    const attempt = await this.getOwnedAttempt(learnerId, attemptId);
    if (attempt.status !== 'in_progress') throw new Error(MESSAGES.BAD_REQUEST || 'Attempt is not in progress');

    const answers = await this.assessmentRepo.listAnswers(attemptId);
    const questions = await this.assessmentRepo.listQuestions(attempt.template_id);
    
    let rawScore = 0;

    for (const answer of answers) {
      const question = questions.find(q => q.question_id === answer.question_id);
      if (question) {
        // Very basic matching for raw score calculation
        const isCorrect = JSON.stringify(answer.submitted_answer) === JSON.stringify(question.correct_answer);
        const awarded = isCorrect ? question.points : 0;
        
        await this.assessmentRepo.updateAnswer(answer.answer_id, {
          awarded_points: awarded,
          is_correct: isCorrect
        });
        
        rawScore += awarded;
      }
    }

    await this.assessmentRepo.updateAttempt(attemptId, {
      score: rawScore,
      version: attempt.version
    });

    return this.assessmentRepo.submitAttempt(attemptId, attempt.version + 1);
  }

  public async evaluateAttempt(attemptId: string): Promise<AssessmentResultDTO> {
    const attempt = await this.assessmentRepo.findAttempt(attemptId);
    if (!attempt) throw new Error(MESSAGES.NOT_FOUND);
    if (attempt.status !== 'submitted') throw new Error(MESSAGES.BAD_REQUEST || 'Attempt must be submitted to be evaluated');

    const template = await this.assessmentRepo.findTemplate(attempt.template_id);
    if (!template) throw new Error(MESSAGES.SERVER_ERROR);

    const maxScore = template.max_score > 0 ? template.max_score : 1;
    const percentage = Number(((attempt.score / maxScore) * 100).toFixed(2));
    const passed = percentage >= template.passing_score;

    const evaluated = await this.assessmentRepo.evaluateAttempt(attemptId, attempt.score, percentage, attempt.version);

    const answers = await this.assessmentRepo.listAnswers(attemptId);
    const correctAnswersCount = answers.filter(a => a.is_correct).length;
    const questions = await this.assessmentRepo.listQuestions(attempt.template_id);

    return {
      attempt_id: evaluated.attempt_id,
      score: evaluated.score,
      percentage: evaluated.percentage,
      passed,
      correct_answers: correctAnswersCount,
      total_questions: questions.length
    };
  }
}
