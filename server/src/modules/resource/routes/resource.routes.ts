import { Router } from 'express';
import { ResourceController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  createResourceValidators,
  updateResourceValidators,
  resourceIdValidator,
  versionControlValidators,
  trackProgressValidators,
  manageTagsValidators
} from '../validator';

const router = Router();
const controller = new ResourceController();

// ====================================================
// RESOURCE MANAGEMENT
// ====================================================

router.post(
  '/',
  authMiddleware,
  createResourceValidators,
  validateRequest,
  controller.createResource
);

router.get(
  '/',
  authMiddleware,
  validateRequest,
  controller.listResources
);

router.get(
  '/:resource_id',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.getResource
);

router.patch(
  '/:resource_id',
  authMiddleware,
  updateResourceValidators,
  validateRequest,
  controller.updateResource
);

router.post(
  '/:resource_id/publish',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.publishResource
);

router.post(
  '/:resource_id/archive',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.archiveResource
);

// ====================================================
// VERSIONS
// ====================================================

router.post(
  '/:resource_id/version',
  authMiddleware,
  versionControlValidators,
  validateRequest,
  controller.createVersion
);

router.get(
  '/:resource_id/versions',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.listVersions
);

// ====================================================
// PROGRESS
// ====================================================

// Note: Using :resource_id aligned with architecture for implicit UPSERT mapping
router.patch(
  '/:resource_id/progress',
  authMiddleware,
  trackProgressValidators,
  validateRequest,
  controller.updateProgress
);

router.post(
  '/:resource_id/complete',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.completeResource
);

// ====================================================
// TAGS
// ====================================================

router.get(
  '/:resource_id/tags',
  authMiddleware,
  resourceIdValidator,
  validateRequest,
  controller.listTags
);

export const resourceRoutes = router;
