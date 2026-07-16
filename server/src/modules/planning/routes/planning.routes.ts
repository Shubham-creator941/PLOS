import { Router } from 'express';
import { PlanningController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  planIdValidator,
  phaseIdValidator,
  moduleIdValidator,
  objectiveIdValidator,
  createPlanValidator,
  updatePlanValidator,
  createPhaseValidator,
  updatePhaseValidator,
  createModuleValidator,
  updateModuleValidator,
  createObjectiveValidator,
  updateObjectiveValidator
} from '../validator';

const router = Router();
const controller = new PlanningController();

// ---- PLAN ----

router.post(
  '/',
  authMiddleware,
  createPlanValidator,
  validateRequest,
  controller.createPlan
);

router.get(
  '/:plan_id',
  authMiddleware,
  planIdValidator,
  validateRequest,
  controller.getPlan
);

router.patch(
  '/:plan_id',
  authMiddleware,
  planIdValidator,
  updatePlanValidator,
  validateRequest,
  controller.updatePlan
);

router.post(
  '/:plan_id/archive',
  authMiddleware,
  planIdValidator,
  validateRequest,
  controller.archivePlan
);

router.post(
  '/:plan_id/complete',
  authMiddleware,
  planIdValidator,
  validateRequest,
  controller.completePlan
);

router.get(
  '/:plan_id/progress',
  authMiddleware,
  planIdValidator,
  validateRequest,
  controller.getProgress
);

// ---- PHASES ----

router.get(
  '/:plan_id/phases',
  authMiddleware,
  planIdValidator,
  validateRequest,
  controller.listPhases
);

router.post(
  '/:plan_id/phases',
  authMiddleware,
  planIdValidator,
  createPhaseValidator,
  validateRequest,
  controller.createPhase
);

router.patch(
  '/phases/:phase_id',
  authMiddleware,
  phaseIdValidator,
  updatePhaseValidator,
  validateRequest,
  controller.updatePhase
);

router.post(
  '/phases/:phase_id/complete',
  authMiddleware,
  phaseIdValidator,
  validateRequest,
  controller.completePhase
);

router.delete(
  '/phases/:phase_id',
  authMiddleware,
  phaseIdValidator,
  validateRequest,
  controller.deletePhase
);

// ---- MODULES ----

router.get(
  '/phases/:phase_id/modules',
  authMiddleware,
  phaseIdValidator,
  validateRequest,
  controller.listModules
);

router.post(
  '/phases/:phase_id/modules',
  authMiddleware,
  phaseIdValidator,
  createModuleValidator,
  validateRequest,
  controller.createModule
);

router.patch(
  '/modules/:module_id',
  authMiddleware,
  moduleIdValidator,
  updateModuleValidator,
  validateRequest,
  controller.updateModule
);

router.post(
  '/modules/:module_id/complete',
  authMiddleware,
  moduleIdValidator,
  validateRequest,
  controller.completeModule
);

router.delete(
  '/modules/:module_id',
  authMiddleware,
  moduleIdValidator,
  validateRequest,
  controller.deleteModule
);

// ---- OBJECTIVES ----

router.get(
  '/modules/:module_id/objectives',
  authMiddleware,
  moduleIdValidator,
  validateRequest,
  controller.listObjectives
);

router.post(
  '/modules/:module_id/objectives',
  authMiddleware,
  moduleIdValidator,
  createObjectiveValidator,
  validateRequest,
  controller.createObjective
);

router.patch(
  '/objectives/:objective_id',
  authMiddleware,
  objectiveIdValidator,
  updateObjectiveValidator,
  validateRequest,
  controller.updateObjective
);

router.post(
  '/objectives/:objective_id/complete',
  authMiddleware,
  objectiveIdValidator,
  validateRequest,
  controller.completeObjective
);

router.delete(
  '/objectives/:objective_id',
  authMiddleware,
  objectiveIdValidator,
  validateRequest,
  controller.deleteObjective
);

export const planningRoutes = router;
