process.env.JWT_SECRET = 'test-secret';
import request from 'supertest';
import { buildApp } from './helpers/testApp';
import { makeAuthToken, TEST_LEARNER_ID } from './helpers/auth.helper';

describe('Debug 500', () => {
  it('debug', async () => {
    const app = buildApp();
    const token = makeAuthToken(TEST_LEARNER_ID);
    const res = await request(app).get('/api/dashboard/timeline').set('Authorization', token);
    console.log("STATUS:", res.status);
    console.log("BODY:", res.body);
  });
});
