import { Router } from 'express';
import { AssessmentController } from '../controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate.middleware';
import { param } from 'express-validator';
import {
  templateIdValidator,
  questionIdValidator,
  attemptIdValidator,
  answerIdValidator,
  createTemplateValidator,
  updateTemplateValidator,
  createQuestionValidator,
  updateQuestionValidator,
  startAttemptValidator,
  submitAnswerValidator
} from '../validator';

const router = Router();
const controller = new AssessmentController();

const moduleIdValidator = [
  param('module_id').exists().isUUID().withMessage('module_id must be a valid UUID')
];

// ---- Templates ----

router.post(
  '/',
  authMiddleware,
  createTemplateValidator,
  validateRequest,
  controller.createTemplate
);

router.get(
  '/:template_id',
  authMiddleware,
  templateIdValidator,
  validateRequest,
  controller.getTemplate
);

router.get(
  '/module/:module_id',
  authMiddleware,
  moduleIdValidator,
  validateRequest,
  controller.listTemplates
);

router.patch(
  '/:template_id',
  authMiddleware,
  updateTemplateValidator,
  validateRequest,
  controller.updateTemplate
);

router.post(
  '/:template_id/publish',
  authMiddleware,
  templateIdValidator,
  validateRequest,
  controller.publishTemplate
);

router.post(
  '/:template_id/archive',
  authMiddleware,
  templateIdValidator,
  validateRequest,
  controller.archiveTemplate
);

// ---- Questions ----

router.post(
  '/:template_id/questions',
  authMiddleware,
  createQuestionValidator,
  validateRequest,
  controller.createQuestion
);

router.get(
  '/:template_id/questions',
  authMiddleware,
  templateIdValidator,
  validateRequest,
  controller.listQuestions
);

router.patch(
  '/questions/:question_id',
  authMiddleware,
  updateQuestionValidator,
  validateRequest,
  controller.updateQuestion
);

router.delete(
  '/questions/:question_id',
  authMiddleware,
  questionIdValidator,
  validateRequest,
  controller.deleteQuestion
);

// ---- Attempts ----

router.post(
  '/attempts',
  authMiddleware,
  startAttemptValidator,
  validateRequest,
  controller.startAttempt
);

router.get(
  '/attempts/:attempt_id',
  authMiddleware,
  attemptIdValidator,
  validateRequest,
  controller.getAttempt
);

router.post(
  '/attempts/:attempt_id/answers',
  authMiddleware,
  submitAnswerValidator,
  validateRequest,
  controller.submitAnswer
);

router.get(
  '/attempts/:attempt_id/answers',
  authMiddleware,
  attemptIdValidator,
  validateRequest,
  controller.listAnswers
);

router.post(
  '/attempts/:attempt_id/submit',
  authMiddleware,
  attemptIdValidator,
  validateRequest,
  controller.submitAttempt
);

router.post(
  '/attempts/:attempt_id/evaluate',
  authMiddleware,
  attemptIdValidator,
  validateRequest,
  controller.evaluateAttempt
);

export const assessmentRoutes = router;
