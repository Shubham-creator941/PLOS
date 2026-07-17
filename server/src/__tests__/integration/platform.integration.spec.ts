/**
 * platform.integration.spec.ts
 * Integration tests for /api/platform — Settings, Feature Flags, Announcements, Health.
 *
 * Verifies: Authentication, RBAC (admin-only mutations), Validation, CRUD,
 *           Optimistic locking, HTTP status codes.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/platform/repository/platform.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { PlatformRepository } from '../../modules/platform/repository/platform.repository';
const PlatformRepoMock = PlatformRepository as jest.MockedClass<typeof PlatformRepository>;

const ANNOUNCEMENT_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

const SETTING = {
  setting_id: 'cccccccc-cccc-4ccc-accc-cccccccccccc',
  setting_key: 'THEME_COLOR',
  setting_value: '#000000',
  description: 'Primary brand color',
  is_public: true,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const FLAG = {
  feature_flag_id: 'ffffffff-ffff-4fff-afff-ffffffffffff',
  feature_name: 'BETA_UI',
  enabled: false,
  description: 'Beta UI toggle',
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const ANNOUNCEMENT = {
  announcement_id: ANNOUNCEMENT_ID,
  title: 'Maintenance',
  message: 'Server will be down.',
  status: 'draft',
  starts_at: null,
  expires_at: null,
  created_by: TEST_LEARNER_ID,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const SNAPSHOT = {
  snapshot_id: 'cccccccc-cccc-4ccc-accc-cccccccccccc',
  active_sessions: 100,
  active_learners: 80,
  running_plans: 50,
  pending_notifications: 5,
  failed_logins: 0,
  system_status: 'healthy',
  recorded_at: new Date(),
  created_at: new Date()
};

describe('Platform Administration Integration', () => {
  let app: ReturnType<typeof buildApp>;

  // Admin token for mutating routes
  const ADMIN_TOKEN   = makeAuthToken(TEST_LEARNER_ID, 'admin');
  // Learner token — must receive 403 on admin-only routes
  const LEARNER_TOKEN = makeAuthToken(TEST_LEARNER_ID, 'learner');

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    PlatformRepoMock.prototype.createSetting.mockResolvedValue(SETTING as any);
    PlatformRepoMock.prototype.findSettingByKey.mockResolvedValue(null);
    PlatformRepoMock.prototype.listSettings.mockResolvedValue([SETTING] as any);
    PlatformRepoMock.prototype.updateSetting.mockResolvedValue({ ...SETTING, setting_value: '#ffffff' } as any);
    PlatformRepoMock.prototype.createFeatureFlag.mockResolvedValue(FLAG as any);
    PlatformRepoMock.prototype.findFeatureFlagByName.mockResolvedValue(FLAG as any);
    PlatformRepoMock.prototype.listFeatureFlags.mockResolvedValue([FLAG] as any);
    PlatformRepoMock.prototype.updateFeatureFlag.mockResolvedValue({ ...FLAG, enabled: true } as any);
    PlatformRepoMock.prototype.createAnnouncement.mockResolvedValue(ANNOUNCEMENT as any);
    PlatformRepoMock.prototype.findAnnouncement.mockResolvedValue(ANNOUNCEMENT as any);
    PlatformRepoMock.prototype.listAnnouncements.mockResolvedValue([ANNOUNCEMENT] as any);
    PlatformRepoMock.prototype.updateAnnouncement.mockResolvedValue({ ...ANNOUNCEMENT, status: 'published' } as any);
    PlatformRepoMock.prototype.createSystemHealthSnapshot.mockResolvedValue(SNAPSHOT as any);
    PlatformRepoMock.prototype.getLatestSystemHealthSnapshot.mockResolvedValue(SNAPSHOT as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/platform/settings');
    expect(res.status).toBe(401);
  });

  it('403 – learner role cannot access admin-only mutations', async () => {
    const res = await request(app)
      .post('/api/platform/settings')
      .set('Authorization', LEARNER_TOKEN)
      .send({ setting_key: 'THEME_COLOR', setting_value: '#000000', is_public: true });
    expect(res.status).toBe(403);
  });

  // ── Platform Settings ─────────────────────────────────────────
  describe('POST /api/platform/settings', () => {
    it('201 – creates setting (admin)', async () => {
      const res = await request(app)
        .post('/api/platform/settings')
        .set('Authorization', ADMIN_TOKEN)
        .send({ setting_key: 'THEME_COLOR', setting_value: '#000000', is_public: true });
      expect(res.status).toBe(201);
    });

    it('422 – missing setting_key', async () => {
      const res = await request(app)
        .post('/api/platform/settings')
        .set('Authorization', ADMIN_TOKEN)
        .send({ setting_value: '#000000' });
      expect(res.status).toBe(422);
    });

    it('409 – duplicate key', async () => {
      PlatformRepoMock.prototype.findSettingByKey.mockResolvedValue(SETTING as any);
      const res = await request(app)
        .post('/api/platform/settings')
        .set('Authorization', ADMIN_TOKEN)
        .send({ setting_key: 'THEME_COLOR', setting_value: '#000000', is_public: true });
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/platform/settings', () => {
    it('200 – lists settings (any authenticated user)', async () => {
      const res = await request(app).get('/api/platform/settings').set('Authorization', LEARNER_TOKEN);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PATCH /api/platform/settings/:setting_key', () => {
    it('200 – updates setting (admin)', async () => {
      PlatformRepoMock.prototype.findSettingByKey.mockResolvedValue(SETTING as any);
      const res = await request(app)
        .patch('/api/platform/settings/THEME_COLOR')
        .set('Authorization', ADMIN_TOKEN)
        .send({ setting_value: '#ffffff', version: 1 });
      expect(res.status).toBe(200);
    });

    it('409 – optimistic locking conflict', async () => {
      PlatformRepoMock.prototype.findSettingByKey.mockResolvedValue(SETTING as any);
      PlatformRepoMock.prototype.updateSetting.mockRejectedValue(
        new Error('Concurrent update detected')
      );
      const res = await request(app)
        .patch('/api/platform/settings/THEME_COLOR')
        .set('Authorization', ADMIN_TOKEN)
        .send({ setting_value: '#aaaaaa', version: 0 });
      expect(res.status).toBe(409);
    });
  });

  // ── Feature Flags ─────────────────────────────────────────────
  describe('GET /api/platform/features', () => {
    it('200 – lists feature flags (any authenticated user)', async () => {
      const res = await request(app).get('/api/platform/features').set('Authorization', LEARNER_TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/platform/features/:feature_name/enable', () => {
    it('200 – enables feature (admin)', async () => {
      const res = await request(app)
        .patch('/api/platform/features/BETA_UI/enable')
        .set('Authorization', ADMIN_TOKEN)
        .send({ version: 1 });
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/platform/features/:feature_name/disable', () => {
    it('200 – disables feature (admin)', async () => {
      const res = await request(app)
        .patch('/api/platform/features/BETA_UI/disable')
        .set('Authorization', ADMIN_TOKEN)
        .send({ version: 1 });
      expect(res.status).toBe(200);
    });
  });

  // ── Announcements ─────────────────────────────────────────────
  describe('POST /api/platform/announcements', () => {
    it('201 – creates announcement (admin)', async () => {
      const res = await request(app)
        .post('/api/platform/announcements')
        .set('Authorization', ADMIN_TOKEN)
        .send({ title: 'Maintenance', message: 'Server will be down.' });
      expect(res.status).toBe(201);
    });

    it('422 – missing title', async () => {
      const res = await request(app)
        .post('/api/platform/announcements')
        .set('Authorization', ADMIN_TOKEN)
        .send({ message: 'No title here' });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/platform/announcements', () => {
    it('200 – lists announcements (any authenticated user)', async () => {
      const res = await request(app).get('/api/platform/announcements').set('Authorization', LEARNER_TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/platform/announcements/:id/publish', () => {
    it('200 – publishes announcement (admin)', async () => {
      const res = await request(app)
        .patch(`/api/platform/announcements/${ANNOUNCEMENT_ID}/publish`)
        .set('Authorization', ADMIN_TOKEN)
        .send({ version: 1 });
      expect(res.status).toBe(200);
    });

    it('409 – optimistic locking conflict', async () => {
      PlatformRepoMock.prototype.updateAnnouncement.mockRejectedValue(
        new Error('Concurrent update detected')
      );
      const res = await request(app)
        .patch(`/api/platform/announcements/${ANNOUNCEMENT_ID}/publish`)
        .set('Authorization', ADMIN_TOKEN)
        .send({ version: 0 });
      expect(res.status).toBe(409);
    });
  });

  describe('PATCH /api/platform/announcements/:id/archive', () => {
    it('200 – archives announcement (admin)', async () => {
      const res = await request(app)
        .patch(`/api/platform/announcements/${ANNOUNCEMENT_ID}/archive`)
        .set('Authorization', ADMIN_TOKEN)
        .send({ version: 1 });
      expect(res.status).toBe(200);
    });
  });

  // ── System Health ─────────────────────────────────────────────
  describe('POST /api/platform/health', () => {
    it('201 – records health snapshot (admin)', async () => {
      const res = await request(app)
        .post('/api/platform/health')
        .set('Authorization', ADMIN_TOKEN)
        .send({
          active_sessions: 100,
          active_learners: 80,
          running_plans: 50,
          pending_notifications: 5,
          failed_logins: 0,
          system_status: 'healthy',
          recorded_at: new Date().toISOString()
        });
      expect(res.status).toBe(201);
    });

    it('422 – missing required health fields', async () => {
      const res = await request(app)
        .post('/api/platform/health')
        .set('Authorization', ADMIN_TOKEN)
        .send({ system_status: 'healthy' });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/platform/health/latest', () => {
    it('200 – returns latest snapshot (any authenticated user)', async () => {
      const res = await request(app)
        .get('/api/platform/health/latest')
        .set('Authorization', LEARNER_TOKEN);
      expect(res.status).toBe(200);
    });

    it('404 – no snapshot found', async () => {
      PlatformRepoMock.prototype.getLatestSystemHealthSnapshot.mockResolvedValue(null);
      const res = await request(app)
        .get('/api/platform/health/latest')
        .set('Authorization', LEARNER_TOKEN);
      expect(res.status).toBe(404);
    });
  });
});
