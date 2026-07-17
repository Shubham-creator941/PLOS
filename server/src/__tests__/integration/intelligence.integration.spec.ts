/**
 * intelligence.integration.spec.ts
 * Integration tests for /api/intelligence — Learning Intelligence.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/intelligence/repository/intelligence.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));

import { IntelligenceRepository } from '../../modules/intelligence/repository/intelligence.repository';
const IntelRepoMock = IntelligenceRepository as jest.MockedClass<typeof IntelligenceRepository>;

const GAP_ID     = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const MODULE_ID  = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

describe('Learning Intelligence Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from IntelligenceRepository
    IntelRepoMock.prototype.findAnalytics.mockResolvedValue(null);
    IntelRepoMock.prototype.createAnalytics.mockResolvedValue({} as any);
    IntelRepoMock.prototype.updateAnalytics.mockResolvedValue({} as any);
    IntelRepoMock.prototype.listMasteryByLearner.mockResolvedValue([]);
    IntelRepoMock.prototype.findMastery.mockResolvedValue(null);
    IntelRepoMock.prototype.createMastery.mockResolvedValue({} as any);
    IntelRepoMock.prototype.updateMastery.mockResolvedValue({} as any);
    IntelRepoMock.prototype.createRecommendation.mockResolvedValue({} as any);
    IntelRepoMock.prototype.listRecommendations.mockResolvedValue([]);
    IntelRepoMock.prototype.listKnowledgeGaps.mockResolvedValue([]);
    IntelRepoMock.prototype.findKnowledgeGap.mockResolvedValue({ gap_id: GAP_ID, learner_id: TEST_LEARNER_ID, version: 1 } as any);
    IntelRepoMock.prototype.updateKnowledgeGap.mockResolvedValue({} as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/intelligence/analytics');
    expect(res.status).toBe(401);
  });

  describe('POST /api/intelligence/analytics/recalculate', () => {
    it('200 – triggers recalculation', async () => {
      const res = await request(app)
        .post('/api/intelligence/analytics/recalculate')
        .set('Authorization', TOKEN)
        .send({ learner_id: TEST_LEARNER_ID });
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/intelligence/analytics', () => {
    it('200 – returns analytics', async () => {
      IntelRepoMock.prototype.findAnalytics.mockResolvedValue({ analytics_id: 'a1' } as any);
      const res = await request(app)
        .get('/api/intelligence/analytics')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/intelligence/assessment', () => {
    it('201 – records assessment result', async () => {
      const res = await request(app)
        .post('/api/intelligence/assessment')
        .set('Authorization', TOKEN)
        .send({ module_id: MODULE_ID, assessment_score: 85 });
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/intelligence/mastery', () => {
    it('200 – lists mastery records', async () => {
      const res = await request(app)
        .get('/api/intelligence/mastery')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/intelligence/recommendations', () => {
    it('201 – generates recommendations', async () => {
      const res = await request(app)
        .post('/api/intelligence/recommendations')
        .set('Authorization', TOKEN)
        .send({ learner_id: TEST_LEARNER_ID });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/intelligence/recommendations', () => {
    it('200 – lists recommendations', async () => {
      const res = await request(app)
        .get('/api/intelligence/recommendations')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/intelligence/knowledge-gaps', () => {
    it('200 – lists knowledge gaps', async () => {
      const res = await request(app)
        .get('/api/intelligence/knowledge-gaps')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/intelligence/knowledge-gaps/:gap_id', () => {
    it('200 – resolves a gap', async () => {
      const res = await request(app)
        .patch(`/api/intelligence/knowledge-gaps/${GAP_ID}`)
        .set('Authorization', TOKEN)
        .send({ resolved: true });
      expect(res.status).toBe(200);
    });
  });
});
