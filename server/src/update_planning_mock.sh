sed -i '' -e '/jest.mock('\''..\/..\/modules\/planning\/repository\/planning.repository'\'');/a\
jest.mock('\''../../modules/journey/repository/journey.repository'\'');
' src/__tests__/integration/planning.integration.spec.ts

sed -i '' -e '/const PlanningRepoMock = /a\
import { JourneyRepository } from '\'../../modules/journey/repository/journey.repository\'';\
const JourneyRepoMock = JourneyRepository as jest.MockedClass<typeof JourneyRepository>;\
' src/__tests__/integration/planning.integration.spec.ts

sed -i '' -e '/PlanningRepoMock.prototype.createObjective.mockResolvedValue(undefined);/a\
    JourneyRepoMock.prototype.findById.mockResolvedValue({ journey_id: '\'11111111-1111-4111-a111-111111111111\'', learner_id: TEST_LEARNER_ID } as any);\
' src/__tests__/integration/planning.integration.spec.ts
