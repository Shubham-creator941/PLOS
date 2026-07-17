import { Router } from 'express';

import { AdaptiveRuntimeController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  initializeRuntimeValidator,
  runtimeIdValidator,
  evaluateRuntimeValidator,
  getDecisionHistoryValidator,
  getPendingReviewsValidator
} from '../validator';

const router = Router();
const controller = new AdaptiveRuntimeController();

router.post(
  '/',
  authMiddleware,
  initializeRuntimeValidator,
  validateRequest,
  controller.initializeRuntime
);

router.get(
  '/:runtime_id',
  authMiddleware,
  runtimeIdValidator,
  validateRequest,
  controller.getRuntime
);

router.post(
  '/:runtime_id/evaluate',
  authMiddleware,
  runtimeIdValidator,
  evaluateRuntimeValidator,
  validateRequest,
  controller.evaluateRuntime
);

router.get(
  '/:runtime_id/decisions',
  authMiddleware,
  runtimeIdValidator,
  validateRequest,
  controller.getDecisionHistory
);

router.get(
  '/:runtime_id/reviews',
  authMiddleware,
  runtimeIdValidator,
  validateRequest,
  controller.getPendingReviews
);

export const adaptiveRoutes = router;
