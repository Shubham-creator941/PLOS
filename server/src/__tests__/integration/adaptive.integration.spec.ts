/**
 * adaptive.integration.spec.ts
 * Integration tests for /api/adaptive — Adaptive Runtime.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/adaptive/repository/runtime.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { AdaptiveRuntimeRepository } from '../../modules/adaptive/repository/runtime.repository';
const AdaptiveRepoMock = AdaptiveRuntimeRepository as jest.MockedClass<typeof AdaptiveRuntimeRepository>;

const RUNTIME_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const SESSION_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const RUNTIME = {
  runtime_id: RUNTIME_ID,
  session_id: SESSION_ID,
  learner_id: TEST_LEARNER_ID,
  status: 'active',
  current_difficulty: 0.5,
  context_data: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Adaptive Runtime Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from AdaptiveRuntimeRepository
    AdaptiveRepoMock.prototype.createRuntime.mockResolvedValue(RUNTIME as any);
    AdaptiveRepoMock.prototype.findRuntimeById.mockResolvedValue(RUNTIME as any);
    AdaptiveRepoMock.prototype.findRuntimeBySession.mockResolvedValue(RUNTIME as any);
    AdaptiveRepoMock.prototype.updateRuntime.mockResolvedValue({ ...RUNTIME } as any);
    AdaptiveRepoMock.prototype.createDecision.mockResolvedValue({} as any);
    AdaptiveRepoMock.prototype.listDecisionHistory.mockResolvedValue([]);
    AdaptiveRepoMock.prototype.listPendingReviews.mockResolvedValue([]);
    AdaptiveRepoMock.prototype.enqueueReview.mockResolvedValue({} as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).post('/api/adaptive');
    expect(res.status).toBe(401);
  });

  describe('POST /api/adaptive', () => {
    it('201 – initializes runtime', async () => {
      AdaptiveRepoMock.prototype.findRuntimeBySession.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/adaptive')
        .set('Authorization', TOKEN)
        .send({ session_id: SESSION_ID });
      expect(res.status).toBe(201);
    });

    it('422 – missing session_id', async () => {
      const res = await request(app)
        .post('/api/adaptive')
        .set('Authorization', TOKEN)
        .send({});
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/adaptive/:runtime_id', () => {
    it('200 – returns runtime', async () => {
      const res = await request(app)
        .get(`/api/adaptive/${RUNTIME_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });

    it('404 – runtime not found', async () => {
      AdaptiveRepoMock.prototype.findRuntimeById.mockResolvedValue(null);
      const res = await request(app)
        .get(`/api/adaptive/${RUNTIME_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/adaptive/:runtime_id/evaluate', () => {
    it('200 – evaluates runtime', async () => {
      const res = await request(app)
        .post(`/api/adaptive/${RUNTIME_ID}/evaluate`)
        .set('Authorization', TOKEN)
        .send({ performance_score: 0.75, completion_rate: 0.9, time_on_task_seconds: 300 });
      expect(res.status).toBe(200);
    });

    it('422 – missing required fields', async () => {
      const res = await request(app)
        .post(`/api/adaptive/${RUNTIME_ID}/evaluate`)
        .set('Authorization', TOKEN)
        .send({});
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/adaptive/:runtime_id/decisions', () => {
    it('200 – returns decision history', async () => {
      const res = await request(app)
        .get(`/api/adaptive/${RUNTIME_ID}/decisions`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/adaptive/:runtime_id/reviews', () => {
    it('200 – returns pending reviews', async () => {
      const res = await request(app)
        .get(`/api/adaptive/${RUNTIME_ID}/reviews`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });
});
