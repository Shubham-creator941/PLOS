import { Router } from 'express';

import { LearnerController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import { onboardLearnerValidator, updateProfileValidator } from '../validator';

export const learnerRoutes = Router();
const learnerController = new LearnerController();

learnerRoutes.post(
  '/onboarding',
  authMiddleware,
  onboardLearnerValidator,
  validateRequest,
  learnerController.onboardLearner
);

learnerRoutes.get(
  '/profile',
  authMiddleware,
  learnerController.getProfile
);

learnerRoutes.patch(
  '/profile',
  authMiddleware,
  updateProfileValidator,
  validateRequest,
  learnerController.updateProfile
);
