import { query } from '../../../database/query';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { MESSAGES } from '../../../shared/messages';
import {
  AssessmentTemplateRecord,
  AssessmentQuestionRecord,
  AssessmentAttemptRecord,
  AssessmentAnswerRecord,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  CreateQuestionDTO,
  CreateAttemptDTO,
  UpdateAttemptDTO,
  CreateAnswerDTO,
  UpdateAnswerDTO,
  QuestionOptions,
  AnswerPayload
} from '../types';

const TEMPLATE_COLUMNS = `
  template_id,
  module_id,
  title,
  description,
  passing_score,
  max_score,
  status,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const QUESTION_COLUMNS = `
  question_id,
  template_id,
  question_text,
  question_type,
  options,
  correct_answer,
  points,
  order_no,
  created_at AS createdAt
`;

const ATTEMPT_COLUMNS = `
  attempt_id,
  template_id,
  session_id,
  learner_id,
  score,
  percentage,
  status,
  started_at,
  submitted_at,
  evaluated_at,
  version,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const ANSWER_COLUMNS = `
  answer_id,
  attempt_id,
  question_id,
  submitted_answer,
  awarded_points,
  is_correct,
  created_at AS createdAt
`;

export class AssessmentRepository {

  // ---- Mappers ----

  private mapTemplateRecord(row: RowDataPacket): AssessmentTemplateRecord {
    return {
      template_id: row.template_id,
      module_id: row.module_id,
      title: row.title,
      description: row.description,
      passing_score: row.passing_score,
      max_score: row.max_score,
      status: row.status,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapQuestionRecord(row: RowDataPacket): AssessmentQuestionRecord {
    return {
      question_id: row.question_id,
      template_id: row.template_id,
      question_text: row.question_text,
      question_type: row.question_type,
      options: typeof row.options === 'string' ? JSON.parse(row.options) as QuestionOptions : (row.options as QuestionOptions | null),
      correct_answer: typeof row.correct_answer === 'string' ? JSON.parse(row.correct_answer) as AnswerPayload : (row.correct_answer as AnswerPayload),
      points: row.points,
      order_no: row.order_no,
      createdAt: row.createdAt,
      updatedAt: row.createdAt // DB schema doesn't have updated_at for questions
    };
  }

  private mapAttemptRecord(row: RowDataPacket): AssessmentAttemptRecord {
    return {
      attempt_id: row.attempt_id,
      template_id: row.template_id,
      session_id: row.session_id,
      learner_id: row.learner_id,
      score: row.score,
      percentage: Number(row.percentage),
      status: row.status,
      started_at: row.started_at,
      submitted_at: row.submitted_at,
      evaluated_at: row.evaluated_at,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private mapAnswerRecord(row: RowDataPacket): AssessmentAnswerRecord {
    return {
      answer_id: row.answer_id,
      attempt_id: row.attempt_id,
      question_id: row.question_id,
      submitted_answer: typeof row.submitted_answer === 'string' ? JSON.parse(row.submitted_answer) as AnswerPayload : (row.submitted_answer as AnswerPayload),
      awarded_points: row.awarded_points,
      is_correct: Boolean(row.is_correct),
      createdAt: row.createdAt,
      updatedAt: row.createdAt // DB schema doesn't have updated_at for answers
    };
  }

  // ---- Templates ----

  public async createTemplate(dto: CreateTemplateDTO): Promise<AssessmentTemplateRecord> {
    await query<ResultSetHeader>(
      `INSERT INTO assessment_templates (
        template_id, module_id, title, description, passing_score, max_score, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.template_id,
        dto.module_id,
        dto.title,
        dto.description || null,
        dto.passing_score,
        dto.max_score,
        dto.status || 'draft'
      ]
    );

    const created = await this.findTemplate(dto.template_id);
    if (!created) throw new Error(MESSAGES.SERVER_ERROR);
    return created;
  }

  public async findTemplate(templateId: string): Promise<AssessmentTemplateRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${TEMPLATE_COLUMNS} FROM assessment_templates WHERE template_id = ? LIMIT 1`,
      [templateId]
    );
    if (rows.length === 0) return null;
    return this.mapTemplateRecord(rows[0]);
  }

  public async listTemplates(moduleId: string): Promise<AssessmentTemplateRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${TEMPLATE_COLUMNS} FROM assessment_templates WHERE module_id = ? ORDER BY created_at ASC`,
      [moduleId]
    );
    return rows.map(r => this.mapTemplateRecord(r));
  }

  public async updateTemplate(templateId: string, dto: UpdateTemplateDTO): Promise<AssessmentTemplateRecord> {
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (dto.title !== undefined) {
      updates.push('title = ?');
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      updates.push('description = ?');
      values.push(dto.description);
    }
    if (dto.passing_score !== undefined) {
      updates.push('passing_score = ?');
      values.push(dto.passing_score);
    }
    if (dto.max_score !== undefined) {
      updates.push('max_score = ?');
      values.push(dto.max_score);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }

    if (updates.length === 0) {
      const existing = await this.findTemplate(templateId);
      if (!existing) throw new Error(MESSAGES.NOT_FOUND);
      return existing;
    }

    updates.push('version = version + 1');
    updates.push('updated_at = NOW()');

    values.push(templateId);
    values.push(dto.version);

    const result = await query<ResultSetHeader>(
      `UPDATE assessment_templates SET ${updates.join(', ')} WHERE template_id = ? AND version = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Update failed or version conflict');
    }

    const updated = await this.findTemplate(templateId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  public async publishTemplate(templateId: string, version: number): Promise<AssessmentTemplateRecord> {
    const result = await query<ResultSetHeader>(
      `UPDATE assessment_templates SET status = 'published', version = version + 1, updated_at = NOW() WHERE template_id = ? AND version = ?`,
      [templateId, version]
    );
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    
    const updated = await this.findTemplate(templateId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  public async archiveTemplate(templateId: string, version: number): Promise<AssessmentTemplateRecord> {
    const result = await query<ResultSetHeader>(
      `UPDATE assessment_templates SET status = 'archived', version = version + 1, updated_at = NOW() WHERE template_id = ? AND version = ?`,
      [templateId, version]
    );
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    
    const updated = await this.findTemplate(templateId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  // ---- Questions ----

  public async createQuestion(dto: CreateQuestionDTO): Promise<AssessmentQuestionRecord> {
    const optionsJson = dto.options ? JSON.stringify(dto.options) : null;
    const answerJson = JSON.stringify(dto.correct_answer);

    await query<ResultSetHeader>(
      `INSERT INTO assessment_questions (
        question_id, template_id, question_text, question_type, options, correct_answer, points, order_no
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.question_id,
        dto.template_id,
        dto.question_text,
        dto.question_type,
        optionsJson,
        answerJson,
        dto.points,
        dto.order_no
      ]
    );

    const created = await this.findQuestion(dto.question_id);
    if (!created) throw new Error(MESSAGES.SERVER_ERROR);
    return created;
  }

  public async findQuestion(questionId: string): Promise<AssessmentQuestionRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${QUESTION_COLUMNS} FROM assessment_questions WHERE question_id = ? LIMIT 1`,
      [questionId]
    );
    if (rows.length === 0) return null;
    return this.mapQuestionRecord(rows[0]);
  }

  public async listQuestions(templateId: string): Promise<AssessmentQuestionRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${QUESTION_COLUMNS} FROM assessment_questions WHERE template_id = ? ORDER BY order_no ASC`,
      [templateId]
    );
    return rows.map(r => this.mapQuestionRecord(r));
  }

  public async updateQuestion(questionId: string, dto: Partial<CreateQuestionDTO>): Promise<void> {
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (dto.question_text !== undefined) {
      updates.push('question_text = ?');
      values.push(dto.question_text);
    }
    if (dto.question_type !== undefined) {
      updates.push('question_type = ?');
      values.push(dto.question_type);
    }
    if (dto.options !== undefined) {
      updates.push('options = ?');
      values.push(dto.options ? JSON.stringify(dto.options) : null);
    }
    if (dto.correct_answer !== undefined) {
      updates.push('correct_answer = ?');
      values.push(JSON.stringify(dto.correct_answer));
    }
    if (dto.points !== undefined) {
      updates.push('points = ?');
      values.push(dto.points);
    }
    if (dto.order_no !== undefined) {
      updates.push('order_no = ?');
      values.push(dto.order_no);
    }

    if (updates.length === 0) return;

    values.push(questionId);

    const result = await query<ResultSetHeader>(
      `UPDATE assessment_questions SET ${updates.join(', ')} WHERE question_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    }
  }

  public async deleteQuestion(questionId: string): Promise<void> {
    const result = await query<ResultSetHeader>(
      `DELETE FROM assessment_questions WHERE question_id = ?`,
      [questionId]
    );
    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Delete failed');
    }
  }

  // ---- Attempts ----

  public async createAttempt(dto: CreateAttemptDTO): Promise<AssessmentAttemptRecord> {
    await query<ResultSetHeader>(
      `INSERT INTO assessment_attempts (
        attempt_id, template_id, session_id, learner_id, started_at
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        dto.attempt_id,
        dto.template_id,
        dto.session_id,
        dto.learner_id,
        dto.started_at
      ]
    );

    const created = await this.findAttempt(dto.attempt_id);
    if (!created) throw new Error(MESSAGES.SERVER_ERROR);
    return created;
  }

  public async findAttempt(attemptId: string): Promise<AssessmentAttemptRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${ATTEMPT_COLUMNS} FROM assessment_attempts WHERE attempt_id = ? LIMIT 1`,
      [attemptId]
    );
    if (rows.length === 0) return null;
    return this.mapAttemptRecord(rows[0]);
  }

  public async findActiveAttempt(sessionId: string): Promise<AssessmentAttemptRecord | null> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${ATTEMPT_COLUMNS} FROM assessment_attempts WHERE session_id = ? AND status = 'in_progress' ORDER BY created_at DESC LIMIT 1`,
      [sessionId]
    );
    if (rows.length === 0) return null;
    return this.mapAttemptRecord(rows[0]);
  }

  public async updateAttempt(attemptId: string, dto: UpdateAttemptDTO): Promise<AssessmentAttemptRecord> {
    const updates: string[] = [];
    const values: (string | number | null | Date)[] = [];

    if (dto.score !== undefined) {
      updates.push('score = ?');
      values.push(dto.score);
    }
    if (dto.percentage !== undefined) {
      updates.push('percentage = ?');
      values.push(dto.percentage);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }
    if (dto.submitted_at !== undefined) {
      updates.push('submitted_at = ?');
      values.push(dto.submitted_at);
    }
    if (dto.evaluated_at !== undefined) {
      updates.push('evaluated_at = ?');
      values.push(dto.evaluated_at);
    }

    if (updates.length === 0) {
      const existing = await this.findAttempt(attemptId);
      if (!existing) throw new Error(MESSAGES.NOT_FOUND);
      return existing;
    }

    updates.push('version = version + 1');
    updates.push('updated_at = NOW()');

    values.push(attemptId);
    values.push(dto.version);

    const result = await query<ResultSetHeader>(
      `UPDATE assessment_attempts SET ${updates.join(', ')} WHERE attempt_id = ? AND version = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Update failed or version conflict');
    }

    const updated = await this.findAttempt(attemptId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  public async submitAttempt(attemptId: string, version: number): Promise<AssessmentAttemptRecord> {
    const result = await query<ResultSetHeader>(
      `UPDATE assessment_attempts SET status = 'submitted', submitted_at = NOW(), version = version + 1, updated_at = NOW() WHERE attempt_id = ? AND version = ?`,
      [attemptId, version]
    );
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    
    const updated = await this.findAttempt(attemptId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  public async evaluateAttempt(attemptId: string, score: number, percentage: number, version: number): Promise<AssessmentAttemptRecord> {
    const result = await query<ResultSetHeader>(
      `UPDATE assessment_attempts SET status = 'evaluated', score = ?, percentage = ?, evaluated_at = NOW(), version = version + 1, updated_at = NOW() WHERE attempt_id = ? AND version = ?`,
      [score, percentage, attemptId, version]
    );
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    
    const updated = await this.findAttempt(attemptId);
    if (!updated) throw new Error(MESSAGES.SERVER_ERROR);
    return updated;
  }

  // ---- Answers ----

  public async createAnswer(dto: CreateAnswerDTO): Promise<AssessmentAnswerRecord> {
    const answerJson = JSON.stringify(dto.submitted_answer);

    await query<ResultSetHeader>(
      `INSERT INTO assessment_answers (
        answer_id, attempt_id, question_id, submitted_answer, awarded_points, is_correct
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.answer_id,
        dto.attempt_id,
        dto.question_id,
        answerJson,
        dto.awarded_points || 0,
        dto.is_correct || false
      ]
    );

    const rows = await query<RowDataPacket[]>(
      `SELECT ${ANSWER_COLUMNS} FROM assessment_answers WHERE answer_id = ? LIMIT 1`,
      [dto.answer_id]
    );
    if (rows.length === 0) throw new Error(MESSAGES.SERVER_ERROR);
    return this.mapAnswerRecord(rows[0]);
  }

  public async listAnswers(attemptId: string): Promise<AssessmentAnswerRecord[]> {
    const rows = await query<RowDataPacket[]>(
      `SELECT ${ANSWER_COLUMNS} FROM assessment_answers WHERE attempt_id = ? ORDER BY created_at ASC`,
      [attemptId]
    );
    return rows.map(r => this.mapAnswerRecord(r));
  }

  public async updateAnswer(answerId: string, dto: UpdateAnswerDTO): Promise<void> {
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (dto.awarded_points !== undefined) {
      updates.push('awarded_points = ?');
      values.push(dto.awarded_points);
    }
    if (dto.is_correct !== undefined) {
      updates.push('is_correct = ?');
      values.push(dto.is_correct);
    }

    if (updates.length === 0) return;

    values.push(answerId);

    const result = await query<ResultSetHeader>(
      `UPDATE assessment_answers SET ${updates.join(', ')} WHERE answer_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
    }
  }

  public async updateSubmittedAnswer(answerId: string, submittedAnswer: AnswerPayload): Promise<void> {
    const result = await query<ResultSetHeader>(
      `UPDATE assessment_answers SET submitted_answer = ? WHERE answer_id = ?`,
      [JSON.stringify(submittedAnswer), answerId]
    );
    if (result.affectedRows === 0) throw new Error(MESSAGES.SERVER_ERROR || 'Update failed');
  }
}
