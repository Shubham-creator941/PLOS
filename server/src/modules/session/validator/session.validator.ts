import { body, param, ValidationChain } from 'express-validator';

// ---- UUID Validators ----

export const sessionIdValidator: ValidationChain[] = [
  param('session_id')
    .exists()
    .withMessage('session_id parameter is required')
    .bail()
    .isUUID()
    .withMessage('session_id must be a valid UUID')
];

// ---- Start Session ----

export const startSessionValidator: ValidationChain[] = [
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['plan_id'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('plan_id')
    .notEmpty()
    .withMessage('plan_id is required')
    .bail()
    .isUUID()
    .withMessage('plan_id must be a valid UUID')
];

// ---- Pause / Resume Session ----

export const pauseSessionValidator: ValidationChain[] = [
  ...sessionIdValidator
];

export const resumeSessionValidator: ValidationChain[] = [
  ...sessionIdValidator
];

// ---- Complete Objective ----

export const completeObjectiveValidator: ValidationChain[] = [
  ...sessionIdValidator,
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['objective_id'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('objective_id')
    .notEmpty()
    .withMessage('objective_id is required')
    .bail()
    .isUUID()
    .withMessage('objective_id must be a valid UUID')
];

// ---- Save Checkpoint ----

export const saveCheckpointValidator: ValidationChain[] = [
  ...sessionIdValidator,
  body()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Request body cannot be empty');
      }
      const allowedFields = ['phase_id', 'module_id', 'objective_id', 'elapsed_minutes'];
      const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
         throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
      return true;
    }),
  body('phase_id')
    .notEmpty()
    .withMessage('phase_id is required')
    .bail()
    .isUUID()
    .withMessage('phase_id must be a valid UUID'),
  body('module_id')
    .notEmpty()
    .withMessage('module_id is required')
    .bail()
    .isUUID()
    .withMessage('module_id must be a valid UUID'),
  body('objective_id')
    .notEmpty()
    .withMessage('objective_id is required')
    .bail()
    .isUUID()
    .withMessage('objective_id must be a valid UUID'),
  body('elapsed_minutes')
    .notEmpty()
    .withMessage('elapsed_minutes is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('elapsed_minutes must be an integer greater than or equal to 0')
];
