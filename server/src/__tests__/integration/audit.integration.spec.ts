/**
 * audit.integration.spec.ts
 * Integration tests for /api/audit — Audit logs, Activity, Login history, System.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/audit/repository/audit.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn() }));

import { AuditRepository } from '../../modules/audit/repository/audit.repository';
const AuditRepoMock = AuditRepository as jest.MockedClass<typeof AuditRepository>;

describe('Audit Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    AuditRepoMock.prototype.listAuditLogs.mockResolvedValue([]);
    AuditRepoMock.prototype.listActivities.mockResolvedValue([]);
    AuditRepoMock.prototype.listLoginHistory.mockResolvedValue([]);
    AuditRepoMock.prototype.listSystemActivity.mockResolvedValue([]);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/audit');
    expect(res.status).toBe(401);
  });

  it('200 – GET / lists audit logs', async () => {
    const res = await request(app).get('/api/audit').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('200 – GET /activity lists activity timeline', async () => {
    const res = await request(app).get('/api/audit/activity').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /login-history lists login history', async () => {
    const res = await request(app).get('/api/audit/login-history').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /system lists system activity', async () => {
    const res = await request(app).get('/api/audit/system').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET / accepts date range query params', async () => {
    const res = await request(app)
      .get('/api/audit')
      .query({ startDate: '2026-01-01', endDate: '2026-12-31' })
      .set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });
});
