import { body, param, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const eventIdValidator: ValidationChain[] = [
  param('event_id')
    .exists()
    .withMessage('event_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('event_id must be a valid UUID')
];

export const notificationIdValidator: ValidationChain[] = [
  param('notification_id')
    .exists()
    .withMessage('notification_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('notification_id must be a valid UUID')
];

export const preferenceIdValidator: ValidationChain[] = [
  param('preference_id')
    .exists()
    .withMessage('preference_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('preference_id must be a valid UUID')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('Request body cannot be empty');
  }
  return true;
});

// ---- Action Validators ----

export const createPreferenceValidator: ValidationChain[] = [
  body('in_app_enabled')
    .isBoolean()
    .withMessage('in_app_enabled must be a boolean'),
  body('email_enabled')
    .isBoolean()
    .withMessage('email_enabled must be a boolean'),
  body('push_enabled')
    .isBoolean()
    .withMessage('push_enabled must be a boolean'),
  body('quiet_hours_enabled')
    .isBoolean()
    .withMessage('quiet_hours_enabled must be a boolean')
];

export const updatePreferenceValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('in_app_enabled')
    .optional()
    .isBoolean()
    .withMessage('in_app_enabled must be a boolean'),
  body('email_enabled')
    .optional()
    .isBoolean()
    .withMessage('email_enabled must be a boolean'),
  body('push_enabled')
    .optional()
    .isBoolean()
    .withMessage('push_enabled must be a boolean'),
  body('quiet_hours_enabled')
    .optional()
    .isBoolean()
    .withMessage('quiet_hours_enabled must be a boolean')
];

export const markReadValidator: ValidationChain[] = [
  ...notificationIdValidator
];

export const archiveValidator: ValidationChain[] = [
  ...notificationIdValidator
];
