const request = require('supertest');
const { buildApp } = require('./src/__tests__/integration/helpers/testApp');
const { makeAuthToken, TEST_LEARNER_ID } = require('./src/__tests__/integration/helpers/auth.helper');

const run = async () => {
  const app = buildApp();
  const token = await makeAuthToken(app, TEST_LEARNER_ID);
  const res = await request(app).get('/api/dashboard/timeline').set('Authorization', token);
  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);
  process.exit(0);
};
run();
