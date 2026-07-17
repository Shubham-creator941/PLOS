import { Router } from 'express';

import { PlatformController } from '../controller';
import { authMiddleware }  from '../../../middleware/auth.middleware';
import { roleMiddleware }  from '../../../middleware/role.middleware';
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

const router     = Router();
const controller = new PlatformController();

// Shorthand: every mutating platform route requires authenticated admin
const adminOnly  = [authMiddleware, roleMiddleware(['admin'])];

// ── PLATFORM SETTINGS ────────────────────────────────────────────────────────

router.post(
  '/settings',
  ...adminOnly,
  setSettingValidators,
  validateRequest,
  controller.createSetting
);

router.get(
  '/settings',
  authMiddleware,           // read-only: any authenticated user
  listSettingsValidators,
  validateRequest,
  controller.listSettings
);

router.patch(
  '/settings/:setting_key',
  ...adminOnly,
  settingKeyParamValidator,
  updateSettingValidators,
  validateRequest,
  controller.updateSetting
);

// ── FEATURE FLAGS ─────────────────────────────────────────────────────────────

router.get(
  '/features',
  authMiddleware,           // read-only: any authenticated user
  validateRequest,
  controller.listFeatures
);

router.patch(
  '/features/:feature_name/enable',
  ...adminOnly,
  featureNameParamValidator,
  versionControlValidators,
  validateRequest,
  controller.enableFeature
);

router.patch(
  '/features/:feature_name/disable',
  ...adminOnly,
  featureNameParamValidator,
  versionControlValidators,
  validateRequest,
  controller.disableFeature
);

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────

router.post(
  '/announcements',
  ...adminOnly,
  createAnnouncementValidators,
  validateRequest,
  controller.createAnnouncement
);

router.get(
  '/announcements',
  authMiddleware,           // read-only: any authenticated user
  listAnnouncementsValidators,
  validateRequest,
  controller.listAnnouncements
);

router.patch(
  '/announcements/:announcement_id/publish',
  ...adminOnly,
  announcementIdValidator,
  versionControlValidators,
  validateRequest,
  controller.publishAnnouncement
);

router.patch(
  '/announcements/:announcement_id/archive',
  ...adminOnly,
  announcementIdValidator,
  versionControlValidators,
  validateRequest,
  controller.archiveAnnouncement
);

// ── SYSTEM HEALTH ─────────────────────────────────────────────────────────────

router.post(
  '/health',
  ...adminOnly,
  recordSnapshotValidators,
  validateRequest,
  controller.recordHealthSnapshot
);

router.get(
  '/health/latest',
  authMiddleware,           // read-only: any authenticated user
  validateRequest,
  controller.latestHealthSnapshot
);

export const platformRoutes = router;
