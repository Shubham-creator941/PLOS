import type { ValidationChain } from 'express-validator';
import { body, param, query } from 'express-validator';

// ====================================================
// SHARED VALIDATORS
// ====================================================

export const settingIdValidator: ValidationChain[] = [
  param('setting_id')
    .exists()
    .withMessage('setting_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('setting_id must be a valid UUID')
];

export const featureFlagIdValidator: ValidationChain[] = [
  param('feature_flag_id')
    .exists()
    .withMessage('feature_flag_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('feature_flag_id must be a valid UUID')
];

export const announcementIdValidator: ValidationChain[] = [
  param('announcement_id')
    .exists()
    .withMessage('announcement_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('announcement_id must be a valid UUID')
];

export const snapshotIdValidator: ValidationChain[] = [
  param('snapshot_id')
    .exists()
    .withMessage('snapshot_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('snapshot_id must be a valid UUID')
];

export const settingKeyParamValidator: ValidationChain[] = [
  param('setting_key')
    .exists()
    .withMessage('setting_key parameter is required')
    .bail()
    .isString()
    .withMessage('setting_key must be a string')
    .trim()
    .notEmpty()
    .withMessage('setting_key cannot be empty')
];

export const featureNameParamValidator: ValidationChain[] = [
  param('feature_name')
    .exists()
    .withMessage('feature_name parameter is required')
    .bail()
    .isString()
    .withMessage('feature_name must be a string')
    .trim()
    .notEmpty()
    .withMessage('feature_name cannot be empty')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (req.method === 'PATCH' && (!req.body || Object.keys(req.body).length === 0)) {
    throw new Error('Request body cannot be empty for PATCH');
  }
  return true;
});

// ====================================================
// PLATFORM SETTINGS VALIDATORS
// ====================================================

export const setSettingValidators: ValidationChain[] = [
  body('setting_key')
    .exists()
    .withMessage('setting_key is required')
    .bail()
    .isString()
    .withMessage('setting_key must be a string')
    .trim()
    .notEmpty()
    .withMessage('setting_key cannot be empty')
    .isLength({ max: 100 })
    .withMessage('setting_key must not exceed 100 characters'),

  body('setting_value')
    .exists()
    .withMessage('setting_value is required')
    .bail()
    .isString()
    .withMessage('setting_value must be a string')
    .trim()
    .notEmpty()
    .withMessage('setting_value cannot be empty'),

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('description must not exceed 255 characters'),

  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be a boolean')
];

export const updateSettingValidators: ValidationChain[] = [
  ...settingKeyParamValidator,
  rejectEmptyBody,

  body('setting_value')
    .optional()
    .isString()
    .withMessage('setting_value must be a string')
    .trim()
    .notEmpty()
    .withMessage('setting_value cannot be empty'),

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('description must not exceed 255 characters'),

  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be a boolean')
];

export const listSettingsValidators: ValidationChain[] = [
  query('publicOnly')
    .optional()
    .isBoolean()
    .withMessage('publicOnly must be a boolean')
    .toBoolean()
];

// ====================================================
// FEATURE FLAGS VALIDATORS
// ====================================================

export const setFeatureFlagValidators: ValidationChain[] = [
  body('feature_name')
    .exists()
    .withMessage('feature_name is required')
    .bail()
    .isString()
    .withMessage('feature_name must be a string')
    .trim()
    .notEmpty()
    .withMessage('feature_name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('feature_name must not exceed 100 characters'),

  body('enabled')
    .exists()
    .withMessage('enabled is required')
    .bail()
    .isBoolean()
    .withMessage('enabled must be a boolean'),

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('description must not exceed 255 characters')
];

export const versionControlValidators: ValidationChain[] = [
  body('version')
    .exists()
    .withMessage('version is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('version must be a positive integer')
    .toInt()
];

// ====================================================
// ANNOUNCEMENTS VALIDATORS
// ====================================================

export const createAnnouncementValidators: ValidationChain[] = [
  body('title')
    .exists()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be a string')
    .trim()
    .notEmpty()
    .withMessage('title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('title must not exceed 150 characters'),

  body('message')
    .exists()
    .withMessage('message is required')
    .bail()
    .isString()
    .withMessage('message must be a string')
    .trim()
    .notEmpty()
    .withMessage('message cannot be empty'),

  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .trim()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('status must be draft, published, or archived'),

  body('starts_at')
    .optional()
    .isISO8601()
    .withMessage('starts_at must be a valid ISO8601 date'),

  body('expires_at')
    .optional()
    .isISO8601()
    .withMessage('expires_at must be a valid ISO8601 date')
];

export const updateAnnouncementValidators: ValidationChain[] = [
  ...announcementIdValidator,
  rejectEmptyBody,

  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .trim()
    .notEmpty()
    .withMessage('title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('title must not exceed 150 characters'),

  body('message')
    .optional()
    .isString()
    .withMessage('message must be a string')
    .trim()
    .notEmpty()
    .withMessage('message cannot be empty'),

  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .trim()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('status must be draft, published, or archived'),

  body('starts_at')
    .optional()
    .isISO8601()
    .withMessage('starts_at must be a valid ISO8601 date'),

  body('expires_at')
    .optional()
    .isISO8601()
    .withMessage('expires_at must be a valid ISO8601 date')
];

export const listAnnouncementsValidators: ValidationChain[] = [
  query('activeOnly')
    .optional()
    .isBoolean()
    .withMessage('activeOnly must be a boolean')
    .toBoolean()
];

// ====================================================
// HEALTH SNAPSHOTS VALIDATORS
// ====================================================

export const recordSnapshotValidators: ValidationChain[] = [
  body('active_sessions')
    .exists()
    .withMessage('active_sessions is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('active_sessions must be a non-negative integer'),

  body('active_learners')
    .exists()
    .withMessage('active_learners is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('active_learners must be a non-negative integer'),

  body('running_plans')
    .exists()
    .withMessage('running_plans is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('running_plans must be a non-negative integer'),

  body('pending_notifications')
    .exists()
    .withMessage('pending_notifications is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('pending_notifications must be a non-negative integer'),

  body('failed_logins')
    .exists()
    .withMessage('failed_logins is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('failed_logins must be a non-negative integer'),

  body('system_status')
    .exists()
    .withMessage('system_status is required')
    .bail()
    .isString()
    .withMessage('system_status must be a string')
    .trim()
    .isIn(['healthy', 'warning', 'critical'])
    .withMessage('system_status must be healthy, warning, or critical'),

  body('recorded_at')
    .exists()
    .withMessage('recorded_at is required')
    .bail()
    .isISO8601()
    .withMessage('recorded_at must be a valid ISO8601 date')
];
