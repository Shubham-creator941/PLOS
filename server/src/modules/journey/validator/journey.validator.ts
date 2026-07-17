import type { ValidationChain } from 'express-validator';
import { body, param } from 'express-validator';

const buildPurposeProfileValidators = (): ValidationChain[] => {
  const prefix = body('purpose_profile')
    .optional()
    .isObject().withMessage('purpose_profile must be an object')
    .bail();
  
  const validateStringField = (field: string, options: { min?: number, max: number }) => {
    const chain = body(`purpose_profile.${field}`)
      .optional()
      .notEmpty().withMessage(`purpose_profile.${field} cannot be empty`).bail()
      .isString().withMessage(`purpose_profile.${field} must be a string`).bail()
      .trim();

    if (options.min !== undefined) {
      return chain.isLength(options).withMessage(`purpose_profile.${field} must be between ${options.min} and ${options.max} characters`);
    } else {
      return chain.isLength(options).withMessage(`purpose_profile.${field} must not exceed ${options.max} characters`);
    }
  };

  return [
    prefix,
    validateStringField('why', { min: 10, max: 500 }),
    validateStringField('expectedOutcome', { min: 10, max: 500 }),
    validateStringField('motivationType', { max: 100 })
  ];
};

const buildMemoryProfileValidators = (): ValidationChain[] => {
  const prefix = body('memory_profile')
    .optional()
    .isObject().withMessage('memory_profile must be an object')
    .bail();
  
  const validateStringField = (field: string, options: { min?: number, max: number }) => {
    const chain = body(`memory_profile.${field}`)
      .optional()
      .notEmpty().withMessage(`memory_profile.${field} cannot be empty`).bail()
      .isString().withMessage(`memory_profile.${field} must be a string`).bail()
      .trim();
    return chain.isLength(options).withMessage(
      options.min !== undefined 
        ? `memory_profile.${field} must be between ${options.min} and ${options.max} characters` 
        : `memory_profile.${field} must not exceed ${options.max} characters`
    );
  };

  const validateIntField = (field: string, options: { min: number, max: number }) => {
    return body(`memory_profile.${field}`)
      .optional()
      .isInt(options).withMessage(`memory_profile.${field} must be an integer between ${options.min} and ${options.max}`)
      .bail();
  };

  const validateBoolField = (field: string) => {
    return body(`memory_profile.${field}`)
      .optional()
      .isBoolean().withMessage(`memory_profile.${field} must be a boolean`);
  };

  const validateArrayField = (field: string) => {
    return body(`memory_profile.${field}`)
      .optional()
      .isArray({ min: 1 }).withMessage(`memory_profile.${field} must be a non-empty array`);
  };

  const validateArrayElements = (field: string, max: number) => {
    return body(`memory_profile.${field}.*`)
      .optional()
      .notEmpty().withMessage(`Elements in memory_profile.${field} cannot be empty`).bail()
      .isString().withMessage(`Elements in memory_profile.${field} must be strings`).bail()
      .trim()
      .isLength({ max }).withMessage(`Elements in memory_profile.${field} must not exceed ${max} characters`);
  };

  return [
    prefix,
    validateIntField('availableDailyMinutes', { min: 10, max: 720 }),
    validateStringField('preferredLearningStyle', { max: 100 }),
    validateBoolField('teachBackEnabled'),
    validateArrayField('habitTriggers'),
    validateArrayElements('habitTriggers', 100),
    validateStringField('preferredLearningTime', { max: 100 }),
    validateIntField('weeklyCommitment', { min: 1, max: 168 })
  ];
};

export const updateJourneyValidator: ValidationChain[] = [
  body()
    .custom((value) => {
      if (!value || typeof value !== 'object') {
        throw new Error('At least one field must be provided for update.');
      }
      const allowedUpdates = ['title', 'domain', 'target_date', 'purpose_profile', 'memory_profile'];
      const hasUpdate = allowedUpdates.some(field => value[field] !== undefined);
      if (!hasUpdate) {
        throw new Error('At least one field must be provided for update.');
      }
      return true;
    }),

  body('title')
    .optional()
    .isString().withMessage('title must be a string').bail()
    .trim()
    .notEmpty().withMessage('title must not be empty').bail()
    .isLength({ min: 3, max: 150 }).withMessage('title must be between 3 and 150 characters'),

  body('domain')
    .optional()
    .isString().withMessage('domain must be a string').bail()
    .trim()
    .notEmpty().withMessage('domain must not be empty').bail()
    .isLength({ min: 2, max: 100 }).withMessage('domain must be between 2 and 100 characters'),

  body('target_date')
    .optional()
    .isISO8601().withMessage('target_date must be a valid ISO8601 date'),

  ...buildPurposeProfileValidators(),
  ...buildMemoryProfileValidators()
];

export const createMilestoneValidator: ValidationChain[] = [
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string').bail()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage('title must be between 3 and 150 characters'),

  body('description')
    .notEmpty().withMessage('description is required').bail()
    .isString().withMessage('description must be a string').bail()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('description must be between 10 and 1000 characters'),

  body('deadline')
    .notEmpty().withMessage('deadline is required').bail()
    .isISO8601().withMessage('deadline must be a valid ISO8601 date'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert']).withMessage('difficulty must be one of easy, medium, hard, expert')
    .bail(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('priority must be one of low, medium, high, critical')
    .bail()
];

export const updateMilestoneValidator: ValidationChain[] = [
  body()
    .custom((value) => {
      if (!value || typeof value !== 'object') {
        throw new Error('At least one field must be provided for update.');
      }
      const allowedUpdates = ['title', 'description', 'deadline', 'difficulty', 'priority', 'status', 'order_no'];
      const hasUpdate = allowedUpdates.some(field => value[field] !== undefined);
      if (!hasUpdate) {
        throw new Error('At least one field must be provided for update.');
      }
      return true;
    }),

  body('title')
    .optional()
    .isString().withMessage('title must be a string').bail()
    .trim()
    .notEmpty().withMessage('title must not be empty').bail()
    .isLength({ min: 3, max: 150 }).withMessage('title must be between 3 and 150 characters'),

  body('description')
    .optional()
    .isString().withMessage('description must be a string').bail()
    .trim()
    .notEmpty().withMessage('description must not be empty').bail()
    .isLength({ min: 10, max: 1000 }).withMessage('description must be between 10 and 1000 characters'),

  body('deadline')
    .optional()
    .isISO8601().withMessage('deadline must be a valid ISO8601 date'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert']).withMessage('difficulty must be one of easy, medium, hard, expert')
    .bail(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('priority must be one of low, medium, high, critical')
    .bail(),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'skipped']).withMessage('status must be one of pending, in_progress, completed, skipped')
    .bail(),

  body('order_no')
    .optional()
    .isInt({ min: 0 }).withMessage('order_no must be an integer greater than or equal to 0')
    .bail()
];

export const milestoneIdValidator: ValidationChain[] = [
  param('milestone_id')
    .notEmpty().withMessage('milestone_id is required').bail()
    .isUUID().withMessage('milestone_id must be a valid UUID')
];
