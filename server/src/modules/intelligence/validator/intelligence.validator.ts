import type { ValidationChain } from 'express-validator';
import { body, param } from 'express-validator';

// ---- UUID Validators ----

export const analyticsIdValidator: ValidationChain[] = [
  param('analytics_id')
    .exists()
    .withMessage('analytics_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('analytics_id must be a valid UUID')
];

export const masteryIdValidator: ValidationChain[] = [
  param('mastery_id')
    .exists()
    .withMessage('mastery_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('mastery_id must be a valid UUID')
];

export const recommendationIdValidator: ValidationChain[] = [
  param('recommendation_id')
    .exists()
    .withMessage('recommendation_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('recommendation_id must be a valid UUID')
];

export const gapIdValidator: ValidationChain[] = [
  param('gap_id')
    .exists()
    .withMessage('gap_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('gap_id must be a valid UUID')
];

const rejectEmptyBody = body().custom((value, { req }) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('Request body cannot be empty');
  }
  return true;
});

// ---- Action Validators ----

export const recalculateAnalyticsValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('learner_id')
    .notEmpty()
    .withMessage('learner_id is required')
    .bail()
    .isUUID()
    .withMessage('learner_id must be a valid UUID')
];

export const recordAssessmentValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('module_id')
    .notEmpty()
    .withMessage('module_id is required')
    .bail()
    .isUUID()
    .withMessage('module_id must be a valid UUID'),
  body('assessment_score')
    .notEmpty()
    .withMessage('assessment_score is required')
    .bail()
    .isNumeric()
    .withMessage('assessment_score must be a number'),
  body('attempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('attempts must be a positive integer')
];

export const generateRecommendationsValidator: ValidationChain[] = [
  rejectEmptyBody,
  body('learner_id')
    .notEmpty()
    .withMessage('learner_id is required')
    .bail()
    .isUUID()
    .withMessage('learner_id must be a valid UUID')
];

export const resolveGapValidator: ValidationChain[] = [
  ...gapIdValidator,
  rejectEmptyBody,
  body('resolved')
    .notEmpty()
    .withMessage('resolved is required')
    .bail()
    .isBoolean()
    .withMessage('resolved must be a boolean')
];
