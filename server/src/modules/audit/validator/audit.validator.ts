import { query, param, body, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const auditIdValidator: ValidationChain[] = [
  param('audit_id')
    .exists()
    .withMessage('audit_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('audit_id must be a valid UUID')
];

export const activityIdValidator: ValidationChain[] = [
  param('activity_id')
    .exists()
    .withMessage('activity_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('activity_id must be a valid UUID')
];

export const loginIdValidator: ValidationChain[] = [
  param('login_id')
    .exists()
    .withMessage('login_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('login_id must be a valid UUID')
];

export const systemActivityIdValidator: ValidationChain[] = [
  param('system_activity_id')
    .exists()
    .withMessage('system_activity_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('system_activity_id must be a valid UUID')
];

// ---- Custom Body Rejector ----

const rejectEmptyBody = body().custom((value, { req }) => {
  if (req.method === 'PATCH' && (!req.body || Object.keys(req.body).length === 0)) {
    throw new Error('Request body cannot be empty for PATCH');
  }
  return true;
});

// ---- List Filters Validators ----

export const listFilterValidators: ValidationChain[] = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('start_date must be a valid ISO8601 date'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('end_date must be a valid ISO8601 date'),

  query('resource_type')
    .optional()
    .trim()
    .isString()
    .withMessage('resource_type must be a string'),

  query('severity')
    .optional()
    .trim()
    .isIn(['info', 'warning', 'critical'])
    .withMessage('severity must be info, warning, or critical'),

  query('status')
    .optional()
    .trim()
    .isString()
    .withMessage('status must be a string'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('limit must be an integer between 1 and 1000')
    .toInt(),

  rejectEmptyBody
];
