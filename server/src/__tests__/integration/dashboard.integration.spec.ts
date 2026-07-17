/**
 * dashboard.integration.spec.ts
 * Integration tests for /api/dashboard.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/dashboard/repository/dashboard.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));

import { DashboardRepository } from '../../modules/dashboard/repository/dashboard.repository';
const DashboardRepoMock = DashboardRepository as jest.MockedClass<typeof DashboardRepository>;

describe('Dashboard Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from DashboardRepository
    DashboardRepoMock.prototype.findPreference.mockResolvedValue({ preference_id: 'p1', version: 1 } as any);
    DashboardRepoMock.prototype.createPreference.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.updatePreference.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.findLatestSnapshot.mockResolvedValue(null);
    DashboardRepoMock.prototype.createSnapshot.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.listSnapshots.mockResolvedValue([]);
    DashboardRepoMock.prototype.listWidgets.mockResolvedValue([]);
    DashboardRepoMock.prototype.createWidget.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.updateWidget.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.createExport.mockResolvedValue({} as any);
    DashboardRepoMock.prototype.listExports.mockResolvedValue([]);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });

  it('200 – GET / returns dashboard overview', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /statistics', async () => {
    const res = await request(app).get('/api/dashboard/statistics').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /timeline', async () => {
    const res = await request(app).get('/api/dashboard/timeline').set('Authorization', TOKEN);
    if (res.status === 500) console.log("TIMELINE 500 BODY:", res.body);
    expect(res.status).toBe(200);
  });

  it('200 – GET /preferences', async () => {
    const res = await request(app).get('/api/dashboard/preferences').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – PATCH /preferences', async () => {
    const res = await request(app)
      .patch('/api/dashboard/preferences')
      .set('Authorization', TOKEN)
      .send({ theme: 'dark', layout: 'grid' });
    expect(res.status).toBe(200);
  });

  it('200 – GET /widgets', async () => {
    const res = await request(app).get('/api/dashboard/widgets').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('201 – POST /snapshot generates snapshot', async () => {
    const res = await request(app)
      .post('/api/dashboard/snapshot')
      .set('Authorization', TOKEN)
      .send({ period: 'weekly' });
    expect(res.status).toBe(201);
  });

  it('200 – GET /exports lists exports', async () => {
    const res = await request(app).get('/api/dashboard/exports').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('201 – POST /exports generates export', async () => {
    const res = await request(app)
      .post('/api/dashboard/exports')
      .set('Authorization', TOKEN)
      .send({ export_type: 'pdf', period: 'monthly' });
    expect(res.status).toBe(201);
  });
});
