/**
 * session.integration.spec.ts
 * Integration tests for /api/session — Learning Sessions.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/session/repository/session.repository');
jest.mock('../../modules/planning/repository/planning.repository');
jest.mock('../../modules/planning/service/planning.service');


jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));

import { SessionRepository } from '../../modules/session/repository/session.repository';
const SessionRepoMock = SessionRepository as jest.MockedClass<typeof SessionRepository>;
import { PlanningRepository } from '../../modules/planning/repository/planning.repository';
const PlanningRepoMock = PlanningRepository as jest.MockedClass<typeof PlanningRepository>;
import { PlanningService } from '../../modules/planning/service/planning.service';
const PlanningServiceMock = PlanningService as jest.MockedClass<typeof PlanningService>;


const SESSION_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const MODULE_ID  = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const OBJ_ID     = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const SESSION = {
  session_id: SESSION_ID,
  learner_id: TEST_LEARNER_ID,
  plan_id: MODULE_ID,
  current_objective_id: OBJ_ID,
  status: 'active',
  started_at: new Date(),
  paused_at: null,
  completed_at: null,
  checkpoint_data: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const SESSION_SUMMARY = {
  ...SESSION,
  events: [],
  checkpoints: []
};

describe('Learning Session Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from SessionRepository
    SessionRepoMock.prototype.createSession.mockResolvedValue(undefined);
    SessionRepoMock.prototype.findById.mockResolvedValue(SESSION as any);
    SessionRepoMock.prototype.getSessionSummary.mockResolvedValue(SESSION_SUMMARY as any);
    SessionRepoMock.prototype.findActiveByLearner.mockResolvedValue(null);
    // updateSession is used by service for pause/resume/complete
    SessionRepoMock.prototype.updateSession.mockResolvedValue(undefined);
    SessionRepoMock.prototype.saveCheckpoint.mockResolvedValue(undefined);
    SessionRepoMock.prototype.createEvent.mockResolvedValue(undefined);
    PlanningRepoMock.prototype.findById.mockResolvedValue({ plan_id: MODULE_ID, learner_id: TEST_LEARNER_ID, status: 'active' } as any);
    PlanningRepoMock.prototype.listObjectives.mockResolvedValue([{ objective_id: OBJ_ID } as any]);
    PlanningRepoMock.prototype.listPhases.mockResolvedValue([{ phase_id: 'phase1' } as any]);
    PlanningRepoMock.prototype.listModules.mockResolvedValue([{ module_id: MODULE_ID } as any]);
    PlanningRepoMock.prototype.completeObjective.mockResolvedValue(undefined);
    PlanningServiceMock.prototype.completeObjective.mockResolvedValue(undefined as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).post('/api/session');
    expect(res.status).toBe(401);
  });

  describe('POST /api/session', () => {
    it('201 – starts a session', async () => {
      const res = await request(app)
        .post('/api/session')
        .set('Authorization', TOKEN)
        .send({ plan_id: MODULE_ID });
      expect(res.status).toBe(201);
    });

    it('422 – missing plan_id', async () => {
      const res = await request(app)
        .post('/api/session')
        .set('Authorization', TOKEN)
        .send({});
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/session/:session_id', () => {
    it('200 – returns session summary', async () => {
      const res = await request(app)
        .get(`/api/session/${SESSION_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });

    it('422 – invalid UUID', async () => {
      const res = await request(app)
        .get('/api/session/not-a-uuid')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(422);
    });

    it('404 – session not found', async () => {
      SessionRepoMock.prototype.findById.mockResolvedValue(null);
      SessionRepoMock.prototype.getSessionSummary.mockResolvedValue(null);
      const res = await request(app)
        .get(`/api/session/${SESSION_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/session/:session_id/pause', () => {
    it('200 – pauses session', async () => {
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/pause`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/session/:session_id/resume', () => {
    it('200 – resumes session', async () => {
      SessionRepoMock.prototype.findById.mockResolvedValue({ ...SESSION, status: 'paused' } as any);
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/resume`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/session/:session_id/objectives/complete', () => {
    it('200 – marks objective complete', async () => {
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/objectives/complete`)
        .set('Authorization', TOKEN)
        .send({ objective_id: OBJ_ID });
      expect(res.status).toBe(200);
    });

    it('422 – missing objective_id', async () => {
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/objectives/complete`)
        .set('Authorization', TOKEN)
        .send({});
      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/session/:session_id/checkpoint', () => {
    it('200 – saves checkpoint', async () => {
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/checkpoint`)
        .set('Authorization', TOKEN)
        .send({ phase_id: MODULE_ID, module_id: MODULE_ID, objective_id: OBJ_ID, elapsed_minutes: 30 });
      expect(res.status).toBe(200);
    });

    it('422 – missing phase_id', async () => {
      const res = await request(app)
        .post(`/api/session/${SESSION_ID}/checkpoint`)
        .set('Authorization', TOKEN)
        .send({});
      expect(res.status).toBe(422);
    });
  });
});
