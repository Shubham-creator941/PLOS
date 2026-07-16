import { body, param, ValidationChain } from 'express-validator';

// ---- Parameter Validators ----

export const runtimeIdValidator: ValidationChain[] = [
  param('runtime_id')
    .exists()
    .withMessage('runtime_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('runtime_id must be a valid UUID')
];

export const sessionIdValidator: ValidationChain[] = [
  param('session_id')
    .exists()
    .withMessage('session_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('session_id must be a valid UUID')
];

// ---- Body Rejector ----

const rejectAnyBody: ValidationChain = body()
  .custom((value, { req }) => {
    if (req.body && Object.keys(req.body).length > 0) {
      throw new Error('Request body is not allowed for this endpoint');
    }
    return true;
  });

// ---- Endpoint Validators ----

export const initializeRuntimeValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['session_id'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('session_id')
    .notEmpty()
    .withMessage('session_id is required')
    .bail()
    .isString()
    .withMessage('session_id must be a string')
    .trim()
    .isUUID()
    .withMessage('session_id must be a valid UUID')
];

export const evaluateRuntimeValidator: ValidationChain[] = [
  ...runtimeIdValidator,
  rejectAnyBody
];

export const getDecisionHistoryValidator: ValidationChain[] = [
  ...runtimeIdValidator,
  rejectAnyBody
];

export const getPendingReviewsValidator: ValidationChain[] = [
  ...runtimeIdValidator,
  rejectAnyBody
];
