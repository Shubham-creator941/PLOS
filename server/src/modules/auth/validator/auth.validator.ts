import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const getEmailValidation = (): ValidationChain => 
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail();

export const registerValidator: ValidationChain[] = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isString().withMessage('Full name must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Full name must be between 3 and 100 characters'),

  getEmailValidation(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters')
    .isStrongPassword({ 
      minLength: 8, 
      minLowercase: 1, 
      minUppercase: 1, 
      minNumbers: 1, 
      minSymbols: 0 
    }).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('avatar_url')
    .optional()
    .isURL().withMessage('Avatar URL must be a valid URL'),

  body('timezone')
    .optional()
    .isString().withMessage('Timezone must be a string')
    .isLength({ max: 100 }).withMessage('Timezone must not exceed 100 characters')
];

export const loginValidator: ValidationChain[] = [
  getEmailValidation(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];
