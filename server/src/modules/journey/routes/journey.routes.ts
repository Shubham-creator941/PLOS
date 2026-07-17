import { Router } from 'express';

import { JourneyController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  updateJourneyValidator,
  createMilestoneValidator,
  updateMilestoneValidator,
  milestoneIdValidator
} from '../validator';

const journeyRoutes = Router();
const journeyController = new JourneyController();

journeyRoutes.get(
  '/',
  authMiddleware,
  journeyController.getActiveJourney
);

journeyRoutes.patch(
  '/',
  authMiddleware,
  updateJourneyValidator,
  validateRequest,
  journeyController.updateJourney
);

journeyRoutes.post(
  '/pause',
  authMiddleware,
  journeyController.pauseJourney
);

journeyRoutes.post(
  '/resume',
  authMiddleware,
  journeyController.resumeJourney
);

journeyRoutes.post(
  '/complete',
  authMiddleware,
  journeyController.completeJourney
);

journeyRoutes.post(
  '/archive',
  authMiddleware,
  journeyController.archiveJourney
);

journeyRoutes.get(
  '/progress',
  authMiddleware,
  journeyController.getProgress
);

journeyRoutes.get(
  '/milestones',
  authMiddleware,
  journeyController.listMilestones
);

journeyRoutes.post(
  '/milestones',
  authMiddleware,
  createMilestoneValidator,
  validateRequest,
  journeyController.createMilestone
);

journeyRoutes.patch(
  '/milestones/:milestone_id',
  authMiddleware,
  milestoneIdValidator,
  updateMilestoneValidator,
  validateRequest,
  journeyController.updateMilestone
);

journeyRoutes.post(
  '/milestones/:milestone_id/complete',
  authMiddleware,
  milestoneIdValidator,
  validateRequest,
  journeyController.completeMilestone
);

export { journeyRoutes };
