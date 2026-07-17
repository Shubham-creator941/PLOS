const request = require('supertest');
const { buildApp } = require('./src/__tests__/integration/helpers/testApp');
const { makeAuthToken, TEST_LEARNER_ID } = require('./src/__tests__/integration/helpers/auth.helper');

const app = buildApp();
const token = makeAuthToken(TEST_LEARNER_ID);

request(app)
  .post('/api/planning')
  .set('Authorization', token)
  .send({ title: 'My Plan' })
  .end((err, res) => {
    console.log(res.status, res.body);
  });
