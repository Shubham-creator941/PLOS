sed -i '' -e '/jest.mock('\''..\/..\/modules\/assessment\/repository\/assessment.repository'\'');/a\
jest.mock('\''../../modules/session/repository/session.repository'\'');\
jest.mock('\''../../modules/planning/repository/planning.repository'\'');\
' src/__tests__/integration/assessment.integration.spec.ts

sed -i '' -e '/const AssessmentRepoMock = /a\
import { SessionRepository } from '\'../../modules/session/repository/session.repository\'';\
const SessionRepoMock = SessionRepository as jest.MockedClass<typeof SessionRepository>;\
import { PlanningRepository } from '\'../../modules/planning/repository/planning.repository\'';\
const PlanningRepoMock = PlanningRepository as jest.MockedClass<typeof PlanningRepository>;\
' src/__tests__/integration/assessment.integration.spec.ts

sed -i '' -e '/AssessmentRepoMock.prototype.getAttemptSummary.mockResolvedValue({} as any);/a\
    SessionRepoMock.prototype.findById.mockResolvedValue({ session_id: SESSION_ID, learner_id: TEST_LEARNER_ID, status: '\''active'\'' } as any);\
    PlanningRepoMock.prototype.findModule.mockResolvedValue({ module_id: MODULE_ID } as any);\
' src/__tests__/integration/assessment.integration.spec.ts
