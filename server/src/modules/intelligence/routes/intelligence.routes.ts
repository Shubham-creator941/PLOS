import { Router } from 'express';

import { IntelligenceController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import {
  recalculateAnalyticsValidator,
  recordAssessmentValidator,
  generateRecommendationsValidator,
  resolveGapValidator
} from '../validator';

const router = Router();
const controller = new IntelligenceController();

// ---- Analytics ----

router.post(
  '/analytics/recalculate',
  authMiddleware,
  recalculateAnalyticsValidator,
  validateRequest,
  controller.recalculateAnalytics
);

router.get(
  '/analytics',
  authMiddleware,
  validateRequest,
  controller.getAnalytics
);

// ---- Mastery & Assessment ----

router.post(
  '/assessment',
  authMiddleware,
  recordAssessmentValidator,
  validateRequest,
  controller.recordAssessment
);

router.get(
  '/mastery',
  authMiddleware,
  validateRequest,
  controller.listMastery
);

// ---- Recommendations ----

router.post(
  '/recommendations',
  authMiddleware,
  generateRecommendationsValidator,
  validateRequest,
  controller.generateRecommendations
);

router.get(
  '/recommendations',
  authMiddleware,
  validateRequest,
  controller.listRecommendations
);

// ---- Knowledge Gaps ----

router.get(
  '/knowledge-gaps',
  authMiddleware,
  validateRequest,
  controller.listKnowledgeGaps
);

router.patch(
  '/knowledge-gaps/:gap_id',
  authMiddleware,
  resolveGapValidator,
  validateRequest,
  controller.resolveKnowledgeGap
);

export const intelligenceRoutes = router;
