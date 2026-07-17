import type { ValidationChain } from 'express-validator';
import { body, param, query } from 'express-validator';

// ====================================================
// SHARED VALIDATORS
// ====================================================

export const resourceIdValidator: ValidationChain[] = [
  param('resource_id')
    .exists()
    .withMessage('resource_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('resource_id must be a valid UUID')
];

export const moduleIdValidator: ValidationChain[] = [
  body('module_id')
    .exists()
    .withMessage('module_id is required')
    .bail()
    .isUUID()
    .withMessage('module_id must be a valid UUID')
];

export const progressIdValidator: ValidationChain[] = [
  param('progress_id')
    .exists()
    .withMessage('progress_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('progress_id must be a valid UUID')
];

export const tagIdValidator: ValidationChain[] = [
  param('tag_id')
    .exists()
    .withMessage('tag_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('tag_id must be a valid UUID')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (req.method === 'PATCH' && (!req.body || Object.keys(req.body).length === 0)) {
    throw new Error('Request body cannot be empty for PATCH');
  }
  return true;
});

// ====================================================
// RESOURCE MANAGEMENT VALIDATORS
// ====================================================

export const createResourceValidators: ValidationChain[] = [
  moduleIdValidator[0],

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

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim(),

  body('resource_type')
    .exists()
    .withMessage('resource_type is required')
    .bail()
    .isString()
    .withMessage('resource_type must be a string')
    .trim()
    .isIn(['video', 'pdf', 'article', 'link', 'image', 'code', 'attachment'])
    .withMessage('Invalid resource_type'),

  body('storage_type')
    .exists()
    .withMessage('storage_type is required')
    .bail()
    .isString()
    .withMessage('storage_type must be a string')
    .trim()
    .isIn(['local', 'external'])
    .withMessage('Invalid storage_type'),

  body('resource_url')
    .exists()
    .withMessage('resource_url is required')
    .bail()
    .isString()
    .withMessage('resource_url must be a string')
    .trim()
    .notEmpty()
    .withMessage('resource_url cannot be empty')
    .isLength({ max: 500 })
    .withMessage('resource_url must not exceed 500 characters'),

  body('estimated_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('estimated_minutes must be a positive integer'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('tags must be an array of strings'),
    
  body('tags.*')
    .isString()
    .withMessage('tag item must be a string')
    .trim()
    .notEmpty()
    .withMessage('tag item cannot be empty')
];

export const updateResourceValidators: ValidationChain[] = [
  ...resourceIdValidator,
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

  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim(),

  body('resource_type')
    .optional()
    .isString()
    .withMessage('resource_type must be a string')
    .trim()
    .isIn(['video', 'pdf', 'article', 'link', 'image', 'code', 'attachment'])
    .withMessage('Invalid resource_type'),

  body('storage_type')
    .optional()
    .isString()
    .withMessage('storage_type must be a string')
    .trim()
    .isIn(['local', 'external'])
    .withMessage('Invalid storage_type'),

  body('resource_url')
    .optional()
    .isString()
    .withMessage('resource_url must be a string')
    .trim()
    .notEmpty()
    .withMessage('resource_url cannot be empty')
    .isLength({ max: 500 })
    .withMessage('resource_url must not exceed 500 characters'),

  body('estimated_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('estimated_minutes must be a positive integer'),

  body('visibility')
    .optional()
    .isString()
    .withMessage('visibility must be a string')
    .trim()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid visibility status'),

  body('change_summary')
    .optional()
    .isString()
    .withMessage('change_summary must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('change_summary must not exceed 255 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('tags must be an array of strings'),
    
  body('tags.*')
    .isString()
    .withMessage('tag item must be a string')
    .trim()
    .notEmpty()
    .withMessage('tag item cannot be empty')
];

export const versionControlValidators: ValidationChain[] = [
  ...resourceIdValidator,

  body('resource_url')
    .exists()
    .withMessage('resource_url is required')
    .bail()
    .isString()
    .withMessage('resource_url must be a string')
    .trim()
    .notEmpty()
    .withMessage('resource_url cannot be empty')
    .isLength({ max: 500 })
    .withMessage('resource_url must not exceed 500 characters'),

  body('change_summary')
    .optional()
    .isString()
    .withMessage('change_summary must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('change_summary must not exceed 255 characters')
];

// ====================================================
// PROGRESS VALIDATORS
// ====================================================

export const trackProgressValidators: ValidationChain[] = [
  ...resourceIdValidator,

  body('progress_percentage')
    .exists()
    .withMessage('progress_percentage is required')
    .bail()
    .isNumeric()
    .withMessage('progress_percentage must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('progress_percentage must be between 0 and 100')
];

// ====================================================
// TAG MANAGEMENT VALIDATORS
// ====================================================

export const manageTagsValidators: ValidationChain[] = [
  ...resourceIdValidator,

  body('tags')
    .exists()
    .withMessage('tags array is required')
    .bail()
    .isArray()
    .withMessage('tags must be an array of strings'),
    
  body('tags.*')
    .isString()
    .withMessage('tag item must be a string')
    .trim()
    .notEmpty()
    .withMessage('tag item cannot be empty')
];
