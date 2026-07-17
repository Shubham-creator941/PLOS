import { Router } from 'express';

import { DashboardController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  updatePreferencesValidator,
  generateDashboardValidator,
  updateWidgetLayoutValidator,
  generateExportValidator
} from '../validator';

const router = Router();
const controller = new DashboardController();

// ---- Overview & Metrics ----

router.get(
  '/',
  authMiddleware,
  validateRequest,
  controller.getDashboard
);

router.get(
  '/statistics',
  authMiddleware,
  validateRequest,
  controller.getStatistics
);

router.get(
  '/timeline',
  authMiddleware,
  validateRequest,
  controller.getTimeline
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
  updatePreferencesValidator,
  validateRequest,
  controller.updatePreferences
);

// ---- Widget Layout ----

router.get(
  '/widgets',
  authMiddleware,
  validateRequest,
  controller.listWidgets
);

router.patch(
  '/widgets',
  authMiddleware,
  updateWidgetLayoutValidator,
  validateRequest,
  controller.updateWidgets
);

// ---- Snapshots ----

router.post(
  '/snapshot',
  authMiddleware,
  generateDashboardValidator,
  validateRequest,
  controller.generateSnapshot
);

// ---- Exports ----

router.post(
  '/exports',
  authMiddleware,
  generateExportValidator,
  validateRequest,
  controller.generateExport
);

router.get(
  '/exports',
  authMiddleware,
  validateRequest,
  controller.listExports
);

export const dashboardRoutes = router;
