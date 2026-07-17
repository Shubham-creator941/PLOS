/**
 * notification.integration.spec.ts
 * Integration tests for /api/notifications.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

jest.mock('../../modules/notification/repository/notification.repository');
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));

import { NotificationRepository } from '../../modules/notification/repository/notification.repository';
const NotifRepoMock = NotificationRepository as jest.MockedClass<typeof NotificationRepository>;

const NOTIF_ID = 'cccccccc-cccc-4ccc-accc-cccccccccccc';

describe('Notification Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const TOKEN = makeAuthToken(TEST_LEARNER_ID);

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Actual method names from NotificationRepository
    NotifRepoMock.prototype.listNotifications.mockResolvedValue([]);
    NotifRepoMock.prototype.findNotification.mockResolvedValue({ notification_id: NOTIF_ID, learner_id: TEST_LEARNER_ID } as any);
    NotifRepoMock.prototype.markRead.mockResolvedValue({} as any);
    NotifRepoMock.prototype.archive.mockResolvedValue({} as any);
    NotifRepoMock.prototype.listEvents.mockResolvedValue([]);
    // findPreference → null triggers createPreference path; returning object skips create
    NotifRepoMock.prototype.findPreference.mockResolvedValue({ preference_id: 'p1', version: 1 } as any);
    NotifRepoMock.prototype.updatePreference.mockResolvedValue({} as any);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(401);
  });

  it('200 – GET / lists notifications', async () => {
    const res = await request(app).get('/api/notifications').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – PATCH /:id/read marks as read', async () => {
    const res = await request(app)
      .patch(`/api/notifications/${NOTIF_ID}/read`)
      .set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('422 – PATCH /invalid-uuid/read', async () => {
    const res = await request(app)
      .patch('/api/notifications/not-a-uuid/read')
      .set('Authorization', TOKEN);
    expect(res.status).toBe(422);
  });

  it('200 – PATCH /:id/archive archives notification', async () => {
    const res = await request(app)
      .patch(`/api/notifications/${NOTIF_ID}/archive`)
      .set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /events lists events', async () => {
    const res = await request(app).get('/api/notifications/events').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – GET /preferences', async () => {
    const res = await request(app).get('/api/notifications/preferences').set('Authorization', TOKEN);
    expect(res.status).toBe(200);
  });

  it('200 – PATCH /preferences updates notification settings', async () => {
    const res = await request(app)
      .patch('/api/notifications/preferences')
      .set('Authorization', TOKEN)
      .send({ email_enabled: true, push_enabled: false, in_app_enabled: true });
    expect(res.status).toBe(200);
  });
});
