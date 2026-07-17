import { Router } from 'express';

import { AuditController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import { listFilterValidators } from '../validator';

const router = Router();
const controller = new AuditController();

// ---- Audit Logs ----

router.get(
  '/',
  authMiddleware,
  listFilterValidators,
  validateRequest,
  controller.listAuditLogs
);

// ---- Activity Timeline ----

router.get(
  '/activity',
  authMiddleware,
  listFilterValidators,
  validateRequest,
  controller.listActivities
);

// ---- Login History ----

router.get(
  '/login-history',
  authMiddleware,
  listFilterValidators,
  validateRequest,
  controller.listLoginHistory
);

// ---- System Activity ----

router.get(
  '/system',
  authMiddleware,
  listFilterValidators,
  validateRequest,
  controller.listSystemActivity
);

export const auditRoutes = router;
