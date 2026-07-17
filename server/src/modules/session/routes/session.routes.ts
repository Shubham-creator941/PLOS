import { Router } from 'express';

import { SessionController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  sessionIdValidator,
  startSessionValidator,
  completeObjectiveValidator,
  saveCheckpointValidator
} from '../validator';

const router = Router();
const controller = new SessionController();

// ---- Session Routes ----

router.post(
  '/',
  authMiddleware,
  startSessionValidator,
  validateRequest,
  controller.startSession
);

router.get(
  '/:session_id',
  authMiddleware,
  sessionIdValidator,
  validateRequest,
  controller.getSessionSummary
);

router.post(
  '/:session_id/pause',
  authMiddleware,
  sessionIdValidator,
  validateRequest,
  controller.pauseSession
);

router.post(
  '/:session_id/resume',
  authMiddleware,
  sessionIdValidator,
  validateRequest,
  controller.resumeSession
);

router.post(
  '/:session_id/objectives/complete',
  authMiddleware,
  sessionIdValidator,
  completeObjectiveValidator,
  validateRequest,
  controller.completeObjective
);

router.post(
  '/:session_id/checkpoint',
  authMiddleware,
  sessionIdValidator,
  saveCheckpointValidator,
  validateRequest,
  controller.saveCheckpoint
);

export const sessionRoutes = router;
