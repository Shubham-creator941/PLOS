import { Router } from 'express';
import { authRoutes } from '../modules/auth/routes';
import { learnerRoutes } from '../modules/learner/routes';
import { journeyRoutes } from '../modules/journey/routes';
import { planningRoutes } from '../modules/planning/routes';
import { sessionRoutes } from '../modules/session/routes';
import { adaptiveRoutes } from '../modules/adaptive/routes';
import { assessmentRoutes } from '../modules/assessment/routes';
import { intelligenceRoutes } from '../modules/intelligence/routes';
import { dashboardRoutes } from '../modules/dashboard/routes';
import { notificationRoutes } from '../modules/notification/routes';
import { auditRoutes } from '../modules/audit/routes';
import { resourceRoutes } from '../modules/resource/routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/learner', learnerRoutes);
router.use('/journey', journeyRoutes);
router.use('/planning', planningRoutes);
router.use('/session', sessionRoutes);
router.use('/adaptive', adaptiveRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);
router.use('/resources', resourceRoutes);

export default router;
