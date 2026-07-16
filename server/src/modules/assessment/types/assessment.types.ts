import { BaseEntity } from '../../../shared/types';

// ---- String Unions ----

export type AssessmentStatus = 'draft' | 'published' | 'archived';

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export type AttemptStatus = 'in_progress' | 'submitted' | 'evaluated';

// ---- JSON Aliases ----

export type QuestionOptions = Record<string, unknown>;

export type AnswerPayload = Record<string, unknown>;

// ---- Database Records ----

export interface AssessmentTemplateRecord extends BaseEntity {
  template_id: string;
  module_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  max_score: number;
  status: AssessmentStatus;
  version: number;
}

export interface AssessmentQuestionRecord extends BaseEntity {
  question_id: string;
  template_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOptions | null;
  correct_answer: AnswerPayload;
  points: number;
  order_no: number;
}

export interface AssessmentAttemptRecord extends BaseEntity {
  attempt_id: string;
  template_id: string;
  session_id: string;
  learner_id: string;
  score: number;
  percentage: number;
  status: AttemptStatus;
  started_at: Date;
  submitted_at: Date | null;
  evaluated_at: Date | null;
  version: number;
}

export interface AssessmentAnswerRecord extends BaseEntity {
  answer_id: string;
  attempt_id: string;
  question_id: string;
  submitted_answer: AnswerPayload;
  awarded_points: number;
  is_correct: boolean;
}

// ---- Repository DTOs ----

export interface CreateTemplateDTO {
  readonly template_id: string;
  readonly module_id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly passing_score: number;
  readonly max_score: number;
  readonly status?: AssessmentStatus;
}

export interface UpdateTemplateDTO {
  readonly title?: string;
  readonly description?: string | null;
  readonly passing_score?: number;
  readonly max_score?: number;
  readonly status?: AssessmentStatus;
  readonly version: number;
}

export interface CreateQuestionDTO {
  readonly question_id: string;
  readonly template_id: string;
  readonly question_text: string;
  readonly question_type: QuestionType;
  readonly options?: QuestionOptions | null;
  readonly correct_answer: AnswerPayload;
  readonly points: number;
  readonly order_no: number;
}

export interface CreateAttemptDTO {
  readonly attempt_id: string;
  readonly template_id: string;
  readonly session_id: string;
  readonly learner_id: string;
  readonly started_at: Date;
}

export interface UpdateAttemptDTO {
  readonly score?: number;
  readonly percentage?: number;
  readonly status?: AttemptStatus;
  readonly submitted_at?: Date | null;
  readonly evaluated_at?: Date | null;
  readonly version: number;
}

export interface CreateAnswerDTO {
  readonly answer_id: string;
  readonly attempt_id: string;
  readonly question_id: string;
  readonly submitted_answer: AnswerPayload;
  readonly awarded_points?: number;
  readonly is_correct?: boolean;
}

export interface UpdateAnswerDTO {
  readonly awarded_points?: number;
  readonly is_correct?: boolean;
}

// ---- HTTP Request DTOs ----

export interface CreateTemplateRequestDTO {
  readonly module_id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly passing_score: number;
  readonly max_score: number;
}

export interface UpdateTemplateRequestDTO {
  readonly title?: string;
  readonly description?: string | null;
  readonly passing_score?: number;
  readonly max_score?: number;
  readonly status?: AssessmentStatus;
  readonly version: number;
}

export interface CreateQuestionRequestDTO {
  readonly question_text: string;
  readonly question_type: QuestionType;
  readonly options?: QuestionOptions | null;
  readonly correct_answer: AnswerPayload;
  readonly points: number;
  readonly order_no: number;
}

export interface CreateAttemptRequestDTO {
  readonly session_id: string;
}

export interface SubmitAnswerRequestDTO {
  readonly question_id: string;
  readonly submitted_answer: AnswerPayload;
}

export interface UpdateAttemptRequestDTO {
  readonly status: AttemptStatus;
  readonly version: number;
}

// ---- Result DTO ----

export interface AssessmentResultDTO {
  readonly attempt_id: string;
  readonly score: number;
  readonly percentage: number;
  readonly passed: boolean;
  readonly correct_answers: number;
  readonly total_questions: number;
}
