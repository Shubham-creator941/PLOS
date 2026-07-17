import { Router } from 'express';

import { NotificationController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  updatePreferenceValidator,
  markReadValidator,
  archiveValidator
} from '../validator';

const router = Router();
const controller = new NotificationController();

// ---- Notifications ----

router.get(
  '/',
  authMiddleware,
  validateRequest,
  controller.listNotifications
);

router.patch(
  '/:notification_id/read',
  authMiddleware,
  markReadValidator,
  validateRequest,
  controller.markRead
);

router.patch(
  '/:notification_id/archive',
  authMiddleware,
  archiveValidator,
  validateRequest,
  controller.archive
);

// ---- Events ----

router.get(
  '/events',
  authMiddleware,
  validateRequest,
  controller.listEvents
);

// ---- Preferences ----

router.get(
  '/preferences',
  authMiddleware,
  validateRequest,
  controller.getPreferences
);

router.patch(
  '/preferences',
  authMiddleware,
  updatePreferenceValidator,
  validateRequest,
  controller.updatePreferences
);

export const notificationRoutes = router;
