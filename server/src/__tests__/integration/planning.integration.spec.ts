/**
 * planning.integration.spec.ts
 * Integration tests for /api/planning — Plans, Phases, Modules, Objectives.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/planning/repository/planning.repository');
jest.mock('../../modules/journey/repository/journey.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));

import { PlanningRepository } from '../../modules/planning/repository/planning.repository';
const PlanRepoMock = PlanningRepository as jest.MockedClass<typeof PlanningRepository>;

import { JourneyRepository } from '../../modules/journey/repository/journey.repository';
const JourneyRepoMock = JourneyRepository as jest.MockedClass<typeof JourneyRepository>;

const PLAN_ID   = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const PHASE_ID  = 'ffffffff-ffff-4fff-afff-ffffffffffff';
const MODULE_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const OBJ_ID    = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const PLAN = {
  plan_id: PLAN_ID,
  learner_id: TEST_LEARNER_ID,
  title: 'My Plan',
  description: null,
  status: 'active',
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Planning Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from PlanningRepository
    PlanRepoMock.prototype.createPlan.mockResolvedValue(undefined);
    PlanRepoMock.prototype.findById.mockResolvedValue(PLAN as any);
    PlanRepoMock.prototype.updatePlan.mockResolvedValue(undefined);
    PlanRepoMock.prototype.archivePlan.mockResolvedValue(undefined);
    PlanRepoMock.prototype.completePlan.mockResolvedValue(undefined);
    PlanRepoMock.prototype.calculateProgress.mockResolvedValue({ completed: 0, total: 0 } as any);
    PlanRepoMock.prototype.listPhases.mockResolvedValue([]);
    PlanRepoMock.prototype.createPhase.mockResolvedValue(undefined);
    PlanRepoMock.prototype.findPhase.mockResolvedValue({ phase_id: PHASE_ID } as any);
    PlanRepoMock.prototype.updatePhase.mockResolvedValue(undefined);
    PlanRepoMock.prototype.completePhase.mockResolvedValue(undefined);
    PlanRepoMock.prototype.deletePhase.mockResolvedValue(undefined);
    PlanRepoMock.prototype.listModules.mockResolvedValue([]);
    PlanRepoMock.prototype.createModule.mockResolvedValue(undefined);
    PlanRepoMock.prototype.findModule.mockResolvedValue({ module_id: MODULE_ID } as any);
    PlanRepoMock.prototype.updateModule.mockResolvedValue(undefined);
    PlanRepoMock.prototype.completeModule.mockResolvedValue(undefined);
    PlanRepoMock.prototype.deleteModule.mockResolvedValue(undefined);
    PlanRepoMock.prototype.listObjectives.mockResolvedValue([]);
    PlanRepoMock.prototype.createObjective.mockResolvedValue(undefined);
    PlanRepoMock.prototype.findObjective.mockResolvedValue({ objective_id: OBJ_ID } as any);
    PlanRepoMock.prototype.updateObjective.mockResolvedValue(undefined);
    PlanRepoMock.prototype.completeObjective.mockResolvedValue(undefined);
    PlanRepoMock.prototype.deleteObjective.mockResolvedValue(undefined);
    PlanRepoMock.prototype.deleteObjective.mockResolvedValue(undefined);

    JourneyRepoMock.prototype.findById.mockResolvedValue({ journey_id: '11111111-1111-4111-a111-111111111111', learner_id: TEST_LEARNER_ID } as any);
  });

  // ── Auth guard ────────────────────────────────────────────────
  it('401 – unauthenticated', async () => {
    const res = await request(app).get(`/api/planning/${PLAN_ID}`);
    expect(res.status).toBe(401);
  });

  // ── Plan CRUD ─────────────────────────────────────────────────
  describe('POST /api/planning', () => {
    it('201 – creates plan', async () => {
      const res = await request(app)
        .post('/api/planning')
        .set('Authorization', TOKEN)
        .send({ title: 'My Plan', journey_id: '11111111-1111-4111-a111-111111111111', description: 'Description of my new plan' });
      expect(res.status).toBe(201);
    });

    it('422 – missing title', async () => {
      const res = await request(app)
        .post('/api/planning')
        .set('Authorization', TOKEN)
        .send({ title: '', journey_id: '', description: '' });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/planning/:plan_id', () => {
    it('200 – returns plan', async () => {
      const res = await request(app)
        .get(`/api/planning/${PLAN_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });

    it('422 – invalid UUID', async () => {
      const res = await request(app)
        .get('/api/planning/not-a-uuid')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(422);
    });

    it('404 – plan not found', async () => {
      PlanRepoMock.prototype.findById.mockResolvedValue(null);
      const res = await request(app)
        .get(`/api/planning/${PLAN_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/planning/:plan_id', () => {
    it('200 – updates plan', async () => {
      const res = await request(app)
        .patch(`/api/planning/${PLAN_ID}`)
        .set('Authorization', TOKEN)
        .send({ title: 'Updated' });
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/planning/:plan_id/archive', () => {
    it('200 – archives plan', async () => {
      const res = await request(app)
        .post(`/api/planning/${PLAN_ID}/archive`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/planning/:plan_id/complete', () => {
    it('200 – completes plan', async () => {
      const res = await request(app)
        .post(`/api/planning/${PLAN_ID}/complete`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Phases ────────────────────────────────────────────────────
  describe('GET /api/planning/:plan_id/phases', () => {
    it('200 – lists phases', async () => {
      const res = await request(app)
        .get(`/api/planning/${PLAN_ID}/phases`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/planning/:plan_id/phases', () => {
    it('201 – creates phase', async () => {
      const res = await request(app)
        .post(`/api/planning/${PLAN_ID}/phases`)
        .set('Authorization', TOKEN)
        .send({ title: 'Phase 1', description: 'Phase description', order_no: 1 });
      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /api/planning/phases/:phase_id', () => {
    it('200 – deletes phase', async () => {
      const res = await request(app)
        .delete(`/api/planning/phases/${PHASE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Modules ───────────────────────────────────────────────────
  describe('POST /api/planning/phases/:phase_id/modules', () => {
    it('201 – creates module', async () => {
      const res = await request(app)
        .post(`/api/planning/phases/${PHASE_ID}/modules`)
        .set('Authorization', TOKEN)
        .send({ title: 'Module 1', description: 'Module description', order_no: 1, estimated_minutes: 30 });
      expect(res.status).toBe(201);
    });
  });

  // ── Objectives ────────────────────────────────────────────────
  describe('POST /api/planning/modules/:module_id/objectives', () => {
    it('201 – creates objective', async () => {
      const res = await request(app)
        .post(`/api/planning/modules/${MODULE_ID}/objectives`)
        .set('Authorization', TOKEN)
        .send({ title: 'Objective 1', description: 'Objective description', order_no: 1 });
      expect(res.status).toBe(201);
    });
  });
});
