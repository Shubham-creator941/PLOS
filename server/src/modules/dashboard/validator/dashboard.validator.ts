import { body, param, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const preferenceIdValidator: ValidationChain[] = [
  param('preference_id')
    .exists()
    .withMessage('preference_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('preference_id must be a valid UUID')
];

export const widgetStateIdValidator: ValidationChain[] = [
  param('widget_state_id')
    .exists()
    .withMessage('widget_state_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('widget_state_id must be a valid UUID')
];

export const exportIdValidator: ValidationChain[] = [
  param('export_id')
    .exists()
    .withMessage('export_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('export_id must be a valid UUID')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('Request body cannot be empty');
  }
  return true;
});

// ---- Action Validators ----

export const updatePreferencesValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('default_view')
    .optional()
    .trim()
    .isIn(['overview', 'progress', 'assessments', 'mastery', 'recommendations'])
    .withMessage('Invalid default_view value'),
  body('show_activity')
    .optional()
    .isBoolean()
    .withMessage('show_activity must be a boolean'),
  body('show_mastery')
    .optional()
    .isBoolean()
    .withMessage('show_mastery must be a boolean'),
  body('show_recommendations')
    .optional()
    .isBoolean()
    .withMessage('show_recommendations must be a boolean'),
  body('theme')
    .optional()
    .trim()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Invalid theme value')
];

export const generateDashboardValidator: ValidationChain[] = [
  body('force_refresh')
    .optional()
    .isBoolean()
    .withMessage('force_refresh must be a boolean')
];

export const updateWidgetLayoutValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('widgets')
    .isArray({ min: 1 })
    .withMessage('widgets must be a non-empty array'),
  body('widgets.*.widget_name')
    .notEmpty()
    .withMessage('widget_name is required')
    .trim(),
  body('widgets.*.position_no')
    .notEmpty()
    .withMessage('position_no is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('position_no must be a positive integer'),
  body('widgets.*.visible')
    .notEmpty()
    .withMessage('visible is required')
    .bail()
    .isBoolean()
    .withMessage('visible must be a boolean')
];

export const generateExportValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('export_type')
    .notEmpty()
    .withMessage('export_type is required')
    .bail()
    .trim()
    .isIn(['pdf', 'csv', 'json'])
    .withMessage('export_type must be pdf, csv, or json')
];
