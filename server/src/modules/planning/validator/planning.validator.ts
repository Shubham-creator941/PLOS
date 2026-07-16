import { body, param, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const planIdValidator: ValidationChain[] = [
  param('plan_id')
    .exists()
    .withMessage('plan_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('plan_id must be a valid UUID')
];

export const phaseIdValidator: ValidationChain[] = [
  param('phase_id')
    .exists()
    .withMessage('phase_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('phase_id must be a valid UUID')
];

export const moduleIdValidator: ValidationChain[] = [
  param('module_id')
    .exists()
    .withMessage('module_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('module_id must be a valid UUID')
];

export const objectiveIdValidator: ValidationChain[] = [
  param('objective_id')
    .exists()
    .withMessage('objective_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('objective_id must be a valid UUID')
];

// ---- Plan Validators ----

export const createPlanValidator: ValidationChain[] = [
  body('journey_id')
    .notEmpty()
    .withMessage('journey_id is required')
    .bail()
    .isUUID()
    .withMessage('journey_id must be a valid UUID'),
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('title must be between 3 and 150 characters'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('description must be between 10 and 2000 characters')
];

export const updatePlanValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['title', 'description', 'status'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('title must be between 3 and 150 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('description must be between 10 and 2000 characters'),
  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .trim()
    .isIn(['draft', 'active', 'completed', 'archived'])
    .withMessage('status must be one of: draft, active, completed, archived')
];

// ---- Phase Validators ----

export const createPhaseValidator: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('title must be between 3 and 150 characters'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('description must be between 10 and 1000 characters'),
  body('order_no')
    .notEmpty()
    .withMessage('order_no is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0')
];

export const updatePhaseValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['title', 'description', 'order_no', 'status'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('title must be between 3 and 150 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('description must be between 10 and 1000 characters'),
  body('order_no')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0'),
  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .trim()
    .isIn(['locked', 'active', 'completed'])
    .withMessage('status must be one of: locked, active, completed')
];

// ---- Module Validators ----

export const createModuleValidator: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('title must not be empty'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('description must not be empty'),
  body('order_no')
    .notEmpty()
    .withMessage('order_no is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0'),
  body('estimated_minutes')
    .notEmpty()
    .withMessage('estimated_minutes is required')
    .bail()
    .isInt({ min: 1, max: 1440 })
    .withMessage('estimated_minutes must be an integer between 1 and 1440')
];

export const updateModuleValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['title', 'description', 'order_no', 'estimated_minutes', 'status'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('title must not be empty'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('description must not be empty'),
  body('order_no')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0'),
  body('estimated_minutes')
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage('estimated_minutes must be an integer between 1 and 1440'),
  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .trim()
    .isIn(['locked', 'active', 'completed'])
    .withMessage('status must be one of: locked, active, completed')
];

// ---- Objective Validators ----

export const createObjectiveValidator: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('title must not be empty'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('description must not be empty'),
  body('order_no')
    .notEmpty()
    .withMessage('order_no is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0')
];

export const updateObjectiveValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['title', 'description', 'order_no', 'status'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('title must not be empty'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 1 })
    .withMessage('description must not be empty'),
  body('order_no')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order_no must be an integer greater than or equal to 0'),
  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .trim()
    .isIn(['pending', 'in_progress', 'completed', 'skipped'])
    .withMessage('status must be one of: pending, in_progress, completed, skipped')
];
