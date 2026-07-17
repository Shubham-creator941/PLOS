sed -i '' -e '/jest.mock('\''..\/..\/modules\/session\/repository\/session.repository'\'');/a\
jest.mock('\''../../modules/planning/repository/planning.repository'\'');\
' src/__tests__/integration/session.integration.spec.ts

sed -i '' -e '/const SessionRepoMock = /a\
import { PlanningRepository } from '\'../../modules/planning/repository/planning.repository\'';\
const PlanningRepoMock = PlanningRepository as jest.MockedClass<typeof PlanningRepository>;\
' src/__tests__/integration/session.integration.spec.ts

sed -i '' -e '/SessionRepoMock.prototype.createEvent.mockResolvedValue(undefined);/a\
    PlanningRepoMock.prototype.findById.mockResolvedValue({ plan_id: MODULE_ID, learner_id: TEST_LEARNER_ID, status: '\''active'\'' } as any);\
    PlanningRepoMock.prototype.listObjectives.mockResolvedValue([{ objective_id: OBJ_ID } as any]);\
    PlanningRepoMock.prototype.completeObjective.mockResolvedValue(undefined);\
' src/__tests__/integration/session.integration.spec.ts
