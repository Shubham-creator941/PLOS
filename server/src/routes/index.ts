import { Router } from 'express';
import { authRoutes } from '../modules/auth/routes';
// import { learnerRoutes } from '../learner';
// import { journeyRoutes } from '../journey';
// import { planningRoutes } from '../planning';
// import { dashboardRoutes } from '../dashboard';

export const router = Router();

router.use('/auth', authRoutes);
// router.use('/learners', learnerRoutes);
// router.use('/journeys', journeyRoutes);
// router.use('/planning', planningRoutes);
// router.use('/dashboard', dashboardRoutes);

export default router;
