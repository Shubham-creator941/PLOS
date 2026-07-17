import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const buildPurposeProfileValidators = (isOptional: boolean = false): ValidationChain[] => {
  const prefix = isOptional 
    ? body('purpose_profile').optional().isObject().withMessage('purpose_profile must be an object')
    : body('purpose_profile')
        .notEmpty().withMessage('purpose_profile is required').bail()
        .isObject().withMessage('purpose_profile must be an object').bail();
  
  const validateStringField = (field: string, options: { min?: number, max: number }) => {
    let chain = body(`purpose_profile.${field}`);
    if (isOptional) {
      chain = chain.optional();
    } else {
      chain = chain.notEmpty().withMessage(`purpose_profile.${field} is required`).bail();
    }
    
    chain = chain
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

const buildMemoryProfileValidators = (isOptional: boolean = false): ValidationChain[] => {
  const prefix = isOptional 
    ? body('memory_profile').optional().isObject().withMessage('memory_profile must be an object')
    : body('memory_profile')
        .notEmpty().withMessage('memory_profile is required').bail()
        .isObject().withMessage('memory_profile must be an object').bail();
  
  const validateStringField = (field: string, options: { min?: number, max: number }) => {
    let chain = body(`memory_profile.${field}`);
    if (isOptional) {
      chain = chain.optional();
    } else {
      chain = chain.notEmpty().withMessage(`memory_profile.${field} is required`).bail();
    }
    chain = chain.isString().withMessage(`memory_profile.${field} must be a string`).bail().trim();
    return chain.isLength(options).withMessage(
      options.min !== undefined 
        ? `memory_profile.${field} must be between ${options.min} and ${options.max} characters` 
        : `memory_profile.${field} must not exceed ${options.max} characters`
    );
  };

  const validateIntField = (field: string, options: { min: number, max: number }) => {
    let chain = body(`memory_profile.${field}`);
    if (isOptional) {
      chain = chain.optional();
    } else {
      chain = chain.notEmpty().withMessage(`memory_profile.${field} is required`).bail();
    }
    return chain.isInt(options).withMessage(`memory_profile.${field} must be an integer between ${options.min} and ${options.max}`);
  };

  const validateBoolField = (field: string) => {
    let chain = body(`memory_profile.${field}`);
    if (isOptional) {
      chain = chain.optional();
    } else {
      chain = chain.notEmpty().withMessage(`memory_profile.${field} is required`).bail();
    }
    return chain.isBoolean().withMessage(`memory_profile.${field} must be a boolean`);
  };

  const validateArrayField = (field: string) => {
    let chain = body(`memory_profile.${field}`);
    if (isOptional) {
      chain = chain.optional();
    } else {
      chain = chain.notEmpty().withMessage(`memory_profile.${field} is required`).bail();
    }
    return chain.isArray({ min: 1 }).withMessage(`memory_profile.${field} must be a non-empty array`);
  };

  const validateArrayElements = (field: string, max: number) => {
    let chain = body(`memory_profile.${field}.*`);
    if (isOptional) {
      chain = chain.optional();
    }
    return chain
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

export const onboardLearnerValidator: ValidationChain[] = [
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string').bail()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage('title must be between 3 and 150 characters'),
    
  body('domain')
    .notEmpty().withMessage('domain is required').bail()
    .isString().withMessage('domain must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('domain must be between 2 and 100 characters'),
    
  body('target_date')
    .notEmpty().withMessage('target_date is required').bail()
    .isISO8601().withMessage('target_date must be a valid ISO8601 date'),

  ...buildPurposeProfileValidators(false),
  ...buildMemoryProfileValidators(false)
];

export const updateProfileValidator: ValidationChain[] = [
  body()
    .custom((value) => {
      if (!value || typeof value !== 'object') {
        throw new Error('At least one field must be provided for update.');
      }
      const allowedUpdates = ['full_name', 'avatar_url', 'timezone', 'purpose_profile', 'memory_profile'];
      const hasUpdate = allowedUpdates.some(field => value[field] !== undefined);
      if (!hasUpdate) {
        throw new Error('At least one field must be provided for update.');
      }
      return true;
    }),
    
  body('full_name')
    .optional()
    .isString().withMessage('full_name must be a string').bail()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('full_name must be between 3 and 100 characters'),
    
  body('avatar_url')
    .optional({ nullable: true })
    .isURL().withMessage('avatar_url must be a valid URL'),
    
  body('timezone')
    .optional()
    .isString().withMessage('timezone must be a string').bail()
    .trim()
    .isLength({ max: 100 }).withMessage('timezone must not exceed 100 characters'),

  ...buildPurposeProfileValidators(true),
  ...buildMemoryProfileValidators(true)
];
