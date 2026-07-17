/**
 * learner.integration.spec.ts
 * Integration tests for GET/PATCH /api/learner/profile, /onboarding
 *
 * Mocks: LearnerRepository (no database)
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/learner/repository/learner.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { LearnerRepository } from '../../modules/learner/repository/learner.repository';
const LearnerRepoMock = LearnerRepository as jest.MockedClass<typeof LearnerRepository>;

const PROFILE = {
  learner_id: TEST_LEARNER_ID,
  full_name: 'Test Learner',
  email: 'learner@example.com',
  bio: null,
  avatar_url: null,
  timezone: 'UTC',
  language_preference: 'en',
  notification_email: true,
  notification_push: false,
  theme: 'light',
  is_onboarded: false,
  learning_goal: null,
  experience_level: null,
  weekly_target_hours: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1
};

describe('Learner Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
    // Use actual method names from LearnerRepository
    LearnerRepoMock.prototype.findProfile.mockResolvedValue(PROFILE as any);
    LearnerRepoMock.prototype.updateProfile.mockResolvedValue(undefined);
  });

  describe('GET /api/learner/profile', () => {
    it('401 – no token', async () => {
      const res = await request(app).get('/api/learner/profile');
      expect(res.status).toBe(401);
    });

    it('200 – returns learner profile', async () => {
      const res = await request(app)
        .get('/api/learner/profile')
        .set('Authorization', TOKEN);

      expect(res.status).toBe(200);
    });

    it('404 – learner not found', async () => {
      LearnerRepoMock.prototype.findProfile.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/learner/profile')
        .set('Authorization', TOKEN);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/learner/profile', () => {
    it('200 – updates profile', async () => {
      const res = await request(app)
        .patch('/api/learner/profile')
        .set('Authorization', TOKEN)
        .send({ full_name: 'Updated' });

      expect(res.status).toBe(200);
    });

    it('422 – validation: empty body rejected', async () => {
      const res = await request(app)
        .patch('/api/learner/profile')
        .set('Authorization', TOKEN)
        .send({});

      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/learner/onboarding', () => {
    it('200 – completes onboarding', async () => {
      LearnerRepoMock.prototype.createJourney.mockResolvedValue('journey-id');
      const res = await request(app)
        .post('/api/learner/onboarding')
        .set('Authorization', TOKEN)
        .send({
          learning_goal: 'Become a senior engineer',
          experience_level: 'intermediate',
          weekly_target_hours: 10
        });

      expect(res.status).toBe(200);
    });

    it('422 – missing required onboarding fields', async () => {
      const res = await request(app)
        .post('/api/learner/onboarding')
        .set('Authorization', TOKEN)
        .send({});

      expect(res.status).toBe(422);
    });
  });
});
