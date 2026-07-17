import { Router } from 'express';

import { AuthController } from '../controller/auth.controller';
import { registerValidator, loginValidator } from '../validator/auth.validator';
import { validateRequest } from '../../../middleware/validate.middleware';
import { authMiddleware } from '../../../middleware/auth.middleware';

export const authRoutes = Router();
const authController = new AuthController();

// Public Routes
authRoutes.post('/register', registerValidator, validateRequest, authController.register);
authRoutes.post('/login', loginValidator, validateRequest, authController.login);

// Private Routes
authRoutes.get('/profile', authMiddleware, authController.getProfile);
authRoutes.post('/logout', authMiddleware, authController.logout);
