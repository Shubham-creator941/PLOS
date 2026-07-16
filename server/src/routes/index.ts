import { Router } from 'express';
import { authRoutes } from '../modules/auth/routes';
import { learnerRoutes } from '../modules/learner/routes';
import { journeyRoutes } from '../modules/journey/routes';
import { planningRoutes } from '../modules/planning/routes';
import { sessionRoutes } from '../modules/session/routes';
import { adaptiveRoutes } from '../modules/adaptive/routes';
import { assessmentRoutes } from '../modules/assessment/routes';
// import { dashboardRoutes } from '../dashboard';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/learner', learnerRoutes);
router.use('/journey', journeyRoutes);
router.use('/planning', planningRoutes);
router.use('/session', sessionRoutes);
router.use('/adaptive', adaptiveRoutes);
router.use('/assessment', assessmentRoutes);
// router.use('/dashboard', dashboardRoutes);

export default router;
