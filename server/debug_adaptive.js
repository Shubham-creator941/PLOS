process.env.JWT_SECRET = 'test-secret';
const request = require('supertest');
const { buildApp } = require('./dist/__tests__/integration/helpers/testApp.js');
const { makeAuthToken, TEST_LEARNER_ID } = require('./dist/__tests__/integration/helpers/auth.helper.js');
const { AdaptiveRuntimeRepository } = require('./dist/modules/adaptive/repository/runtime.repository.js');

jest = require('jest-mock');
const repoProto = AdaptiveRuntimeRepository.prototype;
repoProto.createRuntime = jest.fn();
repoProto.findRuntimeById = jest.fn();
repoProto.findRuntimeBySession = jest.fn();
repoProto.updateRuntime = jest.fn();
repoProto.createDecision = jest.fn();
repoProto.listDecisionHistory = jest.fn();
repoProto.listPendingReviews = jest.fn();
repoProto.enqueueReview = jest.fn();

async function run() {
  const app = buildApp();
  const token = makeAuthToken(TEST_LEARNER_ID);
  
  repoProto.findRuntimeById.mockResolvedValue({ learner_id: TEST_LEARNER_ID });
  repoProto.listDecisionHistory.mockResolvedValue([]);
  
  const res = await request(app).get('/api/adaptive/cccccccc-cccc-4ccc-accc-cccccccccccc/decisions').set('Authorization', token);
  console.log("DECISIONS 500:", res.status, res.body);
  
  const res2 = await request(app).post('/api/adaptive/cccccccc-cccc-4ccc-accc-cccccccccccc/evaluate').set('Authorization', token).send({});
  console.log("EVALUATE 500:", res2.status, res2.body);
}
run();
