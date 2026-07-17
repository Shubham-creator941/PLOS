/**
 * assessment.integration.spec.ts
 * Integration tests for /api/assessment — Templates, Questions, Attempts.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/assessment/repository/assessment.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { AssessmentRepository } from '../../modules/assessment/repository/assessment.repository';
const AssessmentRepoMock = AssessmentRepository as jest.MockedClass<typeof AssessmentRepository>;

const TEMPLATE_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const QUESTION_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const ATTEMPT_ID  = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const MODULE_ID   = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const TEMPLATE = {
  template_id: TEMPLATE_ID,
  learner_id: TEST_LEARNER_ID,
  module_id: MODULE_ID,
  title: 'Node.js Quiz',
  description: 'Test your node skills',
  assessment_type: 'quiz',
  status: 'draft',
  time_limit_minutes: null,
  pass_score: 70,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const ATTEMPT = {
  attempt_id: ATTEMPT_ID,
  template_id: TEMPLATE_ID,
  learner_id: TEST_LEARNER_ID,
  status: 'in_progress',
  score: null,
  passed: null,
  started_at: new Date(),
  submitted_at: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Assessment Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from AssessmentRepository
    AssessmentRepoMock.prototype.createTemplate.mockResolvedValue(TEMPLATE as any);
    AssessmentRepoMock.prototype.findTemplate.mockResolvedValue(TEMPLATE as any);
    AssessmentRepoMock.prototype.listTemplates.mockResolvedValue([TEMPLATE] as any);
    AssessmentRepoMock.prototype.updateTemplate.mockResolvedValue({ ...TEMPLATE, title: 'Updated' } as any);
    AssessmentRepoMock.prototype.publishTemplate.mockResolvedValue({ ...TEMPLATE, status: 'published' } as any);
    AssessmentRepoMock.prototype.archiveTemplate.mockResolvedValue({ ...TEMPLATE, status: 'archived' } as any);
    AssessmentRepoMock.prototype.createQuestion.mockResolvedValue({ question_id: QUESTION_ID } as any);
    AssessmentRepoMock.prototype.listQuestions.mockResolvedValue([]);
    AssessmentRepoMock.prototype.updateQuestion.mockResolvedValue(undefined);
    AssessmentRepoMock.prototype.deleteQuestion.mockResolvedValue(undefined);
    AssessmentRepoMock.prototype.createAttempt.mockResolvedValue(ATTEMPT as any);
    AssessmentRepoMock.prototype.findAttempt.mockResolvedValue(ATTEMPT as any);
    AssessmentRepoMock.prototype.findActiveAttempt.mockResolvedValue(null);
    AssessmentRepoMock.prototype.createAnswer.mockResolvedValue({} as any);
    AssessmentRepoMock.prototype.listAnswers.mockResolvedValue([]);
    AssessmentRepoMock.prototype.submitAttempt.mockResolvedValue({ ...ATTEMPT, status: 'submitted' } as any);
    AssessmentRepoMock.prototype.evaluateAttempt.mockResolvedValue({ ...ATTEMPT, score: 85, passed: true } as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).post('/api/assessment');
    expect(res.status).toBe(401);
  });

  // ── Template CRUD ─────────────────────────────────────────────
  describe('POST /api/assessment', () => {
    it('201 – creates template', async () => {
      const res = await request(app)
        .post('/api/assessment')
        .set('Authorization', TOKEN)
        .send({ module_id: MODULE_ID, title: 'Quiz', assessment_type: 'quiz' });
      expect(res.status).toBe(201);
    });

    it('422 – missing title', async () => {
      const res = await request(app)
        .post('/api/assessment')
        .set('Authorization', TOKEN)
        .send({ module_id: MODULE_ID });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/assessment/:template_id', () => {
    it('200 – returns template', async () => {
      const res = await request(app)
        .get(`/api/assessment/${TEMPLATE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });

    it('404 – not found', async () => {
      AssessmentRepoMock.prototype.findTemplate.mockResolvedValue(null);
      const res = await request(app)
        .get(`/api/assessment/${TEMPLATE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/assessment/module/:module_id', () => {
    it('200 – lists templates by module', async () => {
      const res = await request(app)
        .get(`/api/assessment/module/${MODULE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/assessment/:template_id/publish', () => {
    it('200 – publishes template', async () => {
      const res = await request(app)
        .post(`/api/assessment/${TEMPLATE_ID}/publish`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/assessment/:template_id/archive', () => {
    it('200 – archives template', async () => {
      const res = await request(app)
        .post(`/api/assessment/${TEMPLATE_ID}/archive`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Questions ─────────────────────────────────────────────────
  describe('POST /api/assessment/:template_id/questions', () => {
    it('201 – adds question to draft template', async () => {
      const res = await request(app)
        .post(`/api/assessment/${TEMPLATE_ID}/questions`)
        .set('Authorization', TOKEN)
        .send({ question_text: 'What is Node.js?', question_type: 'multiple_choice', points: 10 });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/assessment/:template_id/questions', () => {
    it('200 – lists questions', async () => {
      const res = await request(app)
        .get(`/api/assessment/${TEMPLATE_ID}/questions`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Attempts ──────────────────────────────────────────────────
  describe('POST /api/assessment/attempts', () => {
    it('201 – starts attempt', async () => {
      const res = await request(app)
        .post('/api/assessment/attempts')
        .set('Authorization', TOKEN)
        .send({ template_id: TEMPLATE_ID });
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/assessment/attempts/:attempt_id/submit', () => {
    it('200 – submits attempt', async () => {
      const res = await request(app)
        .post(`/api/assessment/attempts/${ATTEMPT_ID}/submit`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/assessment/attempts/:attempt_id/evaluate', () => {
    it('200 – evaluates attempt', async () => {
      AssessmentRepoMock.prototype.findAttempt.mockResolvedValue({ ...ATTEMPT, status: 'submitted' } as any);
      const res = await request(app)
        .post(`/api/assessment/attempts/${ATTEMPT_ID}/evaluate`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });
});
