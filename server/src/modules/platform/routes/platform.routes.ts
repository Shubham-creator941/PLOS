import { Router } from 'express';
import { PlatformController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  setSettingValidators,
  updateSettingValidators,
  listSettingsValidators,
  setFeatureFlagValidators,
  versionControlValidators,
  createAnnouncementValidators,
  updateAnnouncementValidators,
  listAnnouncementsValidators,
  recordSnapshotValidators,
  announcementIdValidator,
  settingKeyParamValidator,
  featureNameParamValidator
} from '../validator';

const router = Router();
const controller = new PlatformController();

// ====================================================
// PLATFORM SETTINGS
// ====================================================

router.post(
  '/settings',
  authMiddleware,
  setSettingValidators,
  validateRequest,
  controller.createSetting
);

router.get(
  '/settings',
  authMiddleware,
  listSettingsValidators,
  validateRequest,
  controller.listSettings
);

router.patch(
  '/settings/:setting_key',
  authMiddleware,
  updateSettingValidators,
  validateRequest,
  controller.updateSetting
);

// ====================================================
// FEATURE FLAGS
// ====================================================

router.get(
  '/features',
  authMiddleware,
  validateRequest,
  controller.listFeatures
);

router.patch(
  '/features/:feature_name/enable',
  authMiddleware,
  featureNameParamValidator,
  versionControlValidators,
  validateRequest,
  controller.enableFeature
);

router.patch(
  '/features/:feature_name/disable',
  authMiddleware,
  featureNameParamValidator,
  versionControlValidators,
  validateRequest,
  controller.disableFeature
);

// ====================================================
// ANNOUNCEMENTS
// ====================================================

router.post(
  '/announcements',
  authMiddleware,
  createAnnouncementValidators,
  validateRequest,
  controller.createAnnouncement
);

router.get(
  '/announcements',
  authMiddleware,
  listAnnouncementsValidators,
  validateRequest,
  controller.listAnnouncements
);

router.patch(
  '/announcements/:announcement_id/publish',
  authMiddleware,
  announcementIdValidator,
  versionControlValidators,
  validateRequest,
  controller.publishAnnouncement
);

router.patch(
  '/announcements/:announcement_id/archive',
  authMiddleware,
  announcementIdValidator,
  versionControlValidators,
  validateRequest,
  controller.archiveAnnouncement
);

// ====================================================
// SYSTEM HEALTH
// ====================================================

router.post(
  '/health',
  authMiddleware,
  recordSnapshotValidators,
  validateRequest,
  controller.recordHealthSnapshot
);

router.get(
  '/health/latest',
  authMiddleware,
  validateRequest,
  controller.latestHealthSnapshot
);

export const platformRoutes = router;
