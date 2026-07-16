import { body, param, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const templateIdValidator: ValidationChain[] = [
  param('template_id')
    .exists()
    .withMessage('template_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('template_id must be a valid UUID')
];

export const questionIdValidator: ValidationChain[] = [
  param('question_id')
    .exists()
    .withMessage('question_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('question_id must be a valid UUID')
];

export const attemptIdValidator: ValidationChain[] = [
  param('attempt_id')
    .exists()
    .withMessage('attempt_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('attempt_id must be a valid UUID')
];

export const answerIdValidator: ValidationChain[] = [
  param('answer_id')
    .exists()
    .withMessage('answer_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('answer_id must be a valid UUID')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('Request body cannot be empty');
  }
  return true;
});

// ---- Create Template ----

export const createTemplateValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('module_id')
    .notEmpty()
    .withMessage('module_id is required')
    .bail()
    .isUUID()
    .withMessage('module_id must be a valid UUID'),
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isString()
    .trim(),
  body('description')
    .optional({ nullable: true, checkFalsy: false })
    .isString()
    .trim(),
  body('passing_score')
    .notEmpty()
    .withMessage('passing_score is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('passing_score must be a positive integer'),
  body('max_score')
    .notEmpty()
    .withMessage('max_score is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('max_score must be at least 1')
];

// ---- Update Template (PATCH) ----

export const updateTemplateValidator: ValidationChain[] = [
  ...templateIdValidator,
  rejectEmptyBody,
  body('title')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('title cannot be empty if provided'),
  body('description')
    .optional({ nullable: true, checkFalsy: false })
    .isString()
    .trim(),
  body('passing_score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('passing_score must be a positive integer'),
  body('max_score')
    .optional()
    .isInt({ min: 1 })
    .withMessage('max_score must be at least 1'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('status must be one of: draft, published, archived'),
  body('version')
    .notEmpty()
    .withMessage('version is required for optimistic locking')
    .bail()
    .isInt({ min: 1 })
    .withMessage('version must be a positive integer')
];

// ---- Create Question ----

export const createQuestionValidator: ValidationChain[] = [
  ...templateIdValidator,
  rejectEmptyBody,
  body('question_text')
    .notEmpty()
    .withMessage('question_text is required')
    .bail()
    .isString()
    .trim(),
  body('question_type')
    .notEmpty()
    .withMessage('question_type is required')
    .bail()
    .isIn(['mcq', 'true_false', 'short_answer'])
    .withMessage('question_type must be mcq, true_false, or short_answer'),
  body('options')
    .optional({ nullable: true, checkFalsy: false })
    .isObject()
    .withMessage('options must be a JSON object'),
  body('correct_answer')
    .notEmpty()
    .withMessage('correct_answer is required')
    .bail()
    .isObject()
    .withMessage('correct_answer must be a JSON object'),
  body('points')
    .notEmpty()
    .withMessage('points is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('points must be a positive integer'),
  body('order_no')
    .notEmpty()
    .withMessage('order_no is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('order_no must be a positive integer')
];

// ---- Update Question (PATCH) ----

export const updateQuestionValidator: ValidationChain[] = [
  ...questionIdValidator,
  rejectEmptyBody,
  body('question_text')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('question_text cannot be empty if provided'),
  body('question_type')
    .optional()
    .isIn(['mcq', 'true_false', 'short_answer'])
    .withMessage('question_type must be mcq, true_false, or short_answer'),
  body('options')
    .optional({ nullable: true, checkFalsy: false })
    .isObject()
    .withMessage('options must be a JSON object'),
  body('correct_answer')
    .optional()
    .isObject()
    .withMessage('correct_answer must be a JSON object'),
  body('points')
    .optional()
    .isInt({ min: 0 })
    .withMessage('points must be a positive integer'),
  body('order_no')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order_no must be a positive integer')
];

// ---- Start Attempt ----

export const startAttemptValidator: ValidationChain[] = [
  ...templateIdValidator,
  rejectEmptyBody,
  body('session_id')
    .notEmpty()
    .withMessage('session_id is required')
    .bail()
    .isUUID()
    .withMessage('session_id must be a valid UUID')
];

// ---- Submit Answer ----

export const submitAnswerValidator: ValidationChain[] = [
  ...attemptIdValidator,
  rejectEmptyBody,
  body('question_id')
    .notEmpty()
    .withMessage('question_id is required')
    .bail()
    .isUUID()
    .withMessage('question_id must be a valid UUID'),
  body('submitted_answer')
    .notEmpty()
    .withMessage('submitted_answer is required')
    .bail()
    .isObject()
    .withMessage('submitted_answer must be a JSON object')
];
