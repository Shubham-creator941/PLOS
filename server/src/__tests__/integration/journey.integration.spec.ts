/**
 * journey.integration.spec.ts
 * Integration tests for /api/journey
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/journey/repository/journey.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { JourneyRepository } from '../../modules/journey/repository/journey.repository';
const JourneyRepoMock = JourneyRepository as jest.MockedClass<typeof JourneyRepository>;

const JOURNEY_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const MILESTONE_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const JOURNEY = {
  journey_id: JOURNEY_ID,
  learner_id: TEST_LEARNER_ID,
  title: 'My Journey',
  description: 'Description',
  status: 'active',
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Journey Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from JourneyRepository
    JourneyRepoMock.prototype.findActiveByLearner.mockResolvedValue(JOURNEY as any);
    JourneyRepoMock.prototype.findCurrentByLearner.mockResolvedValue(JOURNEY as any);
    JourneyRepoMock.prototype.findById.mockResolvedValue(JOURNEY as any);
    JourneyRepoMock.prototype.updateJourney.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.pauseJourney.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.resumeJourney.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.completeJourney.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.archiveJourney.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.calculateProgress.mockResolvedValue({ completed: 0, total: 5 } as any);
    JourneyRepoMock.prototype.listMilestones.mockResolvedValue([]);
    JourneyRepoMock.prototype.createMilestone.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.findMilestone.mockResolvedValue({ milestone_id: MILESTONE_ID } as any);
    JourneyRepoMock.prototype.updateMilestone.mockResolvedValue(undefined);
    JourneyRepoMock.prototype.completeMilestone.mockResolvedValue(undefined);
  });

  it('401 – all routes require auth', async () => {
    const res = await request(app).get('/api/journey');
    expect(res.status).toBe(401);
  });

  // ── CRUD ─────────────────────────────────────────────────────
  describe('POST /api/journey', () => {
    it('201 – creates journey', async () => {
      // POST journey creates a new one — stub findActiveByLearner to return null (no existing)
      JourneyRepoMock.prototype.findActiveByLearner.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/journey')
        .set('Authorization', TOKEN)
        .send({ title: 'My Journey', description: 'Desc' });
      expect(res.status).toBe(201);
    });

    it('422 – missing title', async () => {
      const res = await request(app)
        .post('/api/journey')
        .set('Authorization', TOKEN)
        .send({ description: 'No title' });
      expect(res.status).toBe(422);
    });
  });

  describe('PATCH /api/journey', () => {
    it('200 – updates title', async () => {
      const res = await request(app)
        .patch('/api/journey')
        .set('Authorization', TOKEN)
        .send({ title: 'Updated', version: 1 });
      expect(res.status).toBe(200);
    });

    it('409 – optimistic locking: stale version', async () => {
      JourneyRepoMock.prototype.updateJourney.mockRejectedValue(
        new Error('Concurrent update detected')
      );
      const res = await request(app)
        .patch('/api/journey')
        .set('Authorization', TOKEN)
        .send({ title: 'Stale', version: 0 });
      expect(res.status).toBe(409);
    });
  });

  // ── State transitions ─────────────────────────────────────────
  it('200 – pause journey', async () => {
    const res = await request(app).post('/api/journey/pause').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – resume journey', async () => {
    JourneyRepoMock.prototype.findActiveByLearner.mockResolvedValue({ ...JOURNEY, status: 'paused' } as any);
    const res = await request(app).post('/api/journey/resume').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – complete journey', async () => {
    const res = await request(app).post('/api/journey/complete').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – archive journey', async () => {
    const res = await request(app).post('/api/journey/archive').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  // ── Progress & Milestones ─────────────────────────────────────
  it('200 – get progress', async () => {
    const res = await request(app).get('/api/journey/progress').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – list milestones', async () => {
    const res = await request(app).get('/api/journey/milestones').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('201 – create milestone', async () => {
    const res = await request(app)
      .post('/api/journey/milestones')
      .set('Authorization', TOKEN)
      .send({ title: 'Milestone 1', target_date: '2026-12-31' });
    expect(res.status).toBe(201);
  });
});
