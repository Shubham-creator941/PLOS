/**
 * resource.integration.spec.ts
 * Integration tests for /api/resources — Resource & Content Engine.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/resource/repository/resource.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { ResourceRepository } from '../../modules/resource/repository/resource.repository';
const ResourceRepoMock = ResourceRepository as jest.MockedClass<typeof ResourceRepository>;

const RESOURCE_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';
const MODULE_ID   = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

const RESOURCE = {
  resource_id: RESOURCE_ID,
  learner_id: TEST_LEARNER_ID,
  module_id: MODULE_ID,
  title: 'Node.js Basics',
  description: 'Learn Node',
  resource_type: 'article',
  storage_type: 'external',
  resource_url: 'https://example.com/node',
  file_size_bytes: null,
  mime_type: null,
  estimated_minutes: 30,
  status: 'draft',
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const PROGRESS = {
  progress_id: 'pg-001',
  learner_id: TEST_LEARNER_ID,
  resource_id: RESOURCE_ID,
  progress_percentage: 0,
  completed_at: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Resource Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from ResourceRepository
    ResourceRepoMock.prototype.createLearningResource.mockResolvedValue(RESOURCE as any);
    ResourceRepoMock.prototype.listLearningResources.mockResolvedValue([RESOURCE] as any);
    ResourceRepoMock.prototype.findLearningResource.mockResolvedValue(RESOURCE as any);
    ResourceRepoMock.prototype.updateLearningResource.mockResolvedValue({ ...RESOURCE, title: 'Updated' } as any);
    ResourceRepoMock.prototype.createResourceVersion.mockResolvedValue({ version_id: 'v1' } as any);
    ResourceRepoMock.prototype.listResourceVersions.mockResolvedValue([]);
    ResourceRepoMock.prototype.findLearnerProgress.mockResolvedValue(null);
    ResourceRepoMock.prototype.createLearnerProgress.mockResolvedValue(PROGRESS as any);
    ResourceRepoMock.prototype.updateLearnerProgress.mockResolvedValue({ ...PROGRESS, progress_percentage: 60.5 } as any);
    ResourceRepoMock.prototype.listResourceTags.mockResolvedValue([]);
    ResourceRepoMock.prototype.createResourceTag.mockResolvedValue({} as any);
  });

  // ── Auth guard ────────────────────────────────────────────────
  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(401);
  });

  // ── CRUD ─────────────────────────────────────────────────────
  describe('POST /api/resources', () => {
    it('201 – creates resource', async () => {
      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', TOKEN)
        .send({
          module_id: MODULE_ID,
          title: 'Node.js Basics',
          resource_type: 'article',
          storage_type: 'external',
          resource_url: 'https://example.com/node',
          estimated_minutes: 30
        });
      expect(res.status).toBe(201);
    });

    it('422 – missing title', async () => {
      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', TOKEN)
        .send({ module_id: MODULE_ID, resource_type: 'article' });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/resources', () => {
    it('200 – lists resources', async () => {
      const res = await request(app).get('/api/resources').set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/resources/:resource_id', () => {
    it('200 – returns resource', async () => {
      const res = await request(app)
        .get(`/api/resources/${RESOURCE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });

    it('422 – invalid UUID', async () => {
      const res = await request(app)
        .get('/api/resources/not-a-uuid')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(422);
    });

    it('404 – not found', async () => {
      ResourceRepoMock.prototype.findLearningResource.mockResolvedValue(null);
      const res = await request(app)
        .get(`/api/resources/${RESOURCE_ID}`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/resources/:resource_id', () => {
    it('200 – updates resource', async () => {
      const res = await request(app)
        .patch(`/api/resources/${RESOURCE_ID}`)
        .set('Authorization', TOKEN)
        .send({ title: 'Updated Title', version: 1 });
      expect(res.status).toBe(200);
    });

    it('409 – optimistic locking conflict', async () => {
      ResourceRepoMock.prototype.updateLearningResource.mockRejectedValue(
        new Error('Concurrent update detected')
      );
      const res = await request(app)
        .patch(`/api/resources/${RESOURCE_ID}`)
        .set('Authorization', TOKEN)
        .send({ title: 'Stale', version: 0 });
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/resources/:resource_id/publish', () => {
    it('200 – publishes resource', async () => {
      const res = await request(app)
        .post(`/api/resources/${RESOURCE_ID}/publish`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/resources/:resource_id/archive', () => {
    it('200 – archives resource', async () => {
      const res = await request(app)
        .post(`/api/resources/${RESOURCE_ID}/archive`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Version control ───────────────────────────────────────────
  describe('POST /api/resources/:resource_id/version', () => {
    it('201 – creates new version', async () => {
      const res = await request(app)
        .post(`/api/resources/${RESOURCE_ID}/version`)
        .set('Authorization', TOKEN)
        .send({ resource_url: 'https://example.com/node-v2', version_summary: 'Updated content' });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/resources/:resource_id/versions', () => {
    it('200 – lists versions', async () => {
      const res = await request(app)
        .get(`/api/resources/${RESOURCE_ID}/versions`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Progress tracking ─────────────────────────────────────────
  describe('PATCH /api/resources/:resource_id/progress', () => {
    it('200 – updates progress', async () => {
      const res = await request(app)
        .patch(`/api/resources/${RESOURCE_ID}/progress`)
        .set('Authorization', TOKEN)
        .send({ progress_percentage: 60.5 });
      expect(res.status).toBe(200);
    });

    it('422 – invalid progress value above 100', async () => {
      const res = await request(app)
        .patch(`/api/resources/${RESOURCE_ID}/progress`)
        .set('Authorization', TOKEN)
        .send({ progress_percentage: 150 });
      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/resources/:resource_id/complete', () => {
    it('200 – marks complete', async () => {
      ResourceRepoMock.prototype.findLearnerProgress.mockResolvedValue(PROGRESS as any);
      const res = await request(app)
        .post(`/api/resources/${RESOURCE_ID}/complete`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });

  // ── Tags ──────────────────────────────────────────────────────
  describe('GET /api/resources/:resource_id/tags', () => {
    it('200 – lists tags', async () => {
      const res = await request(app)
        .get(`/api/resources/${RESOURCE_ID}/tags`)
        .set('Authorization', TOKEN);
      expect(res.status).toBe(200);
    });
  });
});
