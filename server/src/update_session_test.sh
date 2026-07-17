sed -i '' -e '/jest.mock('\''..\/..\/modules\/planning\/repository\/planning.repository'\'');/a\
jest.mock('\''../../modules/planning/service/planning.service'\'');\
' src/__tests__/integration/session.integration.spec.ts

sed -i '' -e '/import { PlanningRepository } from '\'..\/..\/modules\/planning\/repository\/planning.repository\'';/a\
import { PlanningService } from '\'../../modules/planning/service/planning.service\'';\
const PlanningServiceMock = PlanningService as jest.MockedClass<typeof PlanningService>;\
' src/__tests__/integration/session.integration.spec.ts

sed -i '' -e '/PlanningRepoMock.prototype.completeObjective.mockResolvedValue(undefined);/a\
    PlanningRepoMock.prototype.listPhases.mockResolvedValue([{ phase_id: '\''phase1'\'' }] as any);\
    PlanningRepoMock.prototype.listModules.mockResolvedValue([{ module_id: MODULE_ID }] as any);\
    PlanningServiceMock.prototype.completeObjective.mockResolvedValue(undefined as any);\
' src/__tests__/integration/session.integration.spec.ts
