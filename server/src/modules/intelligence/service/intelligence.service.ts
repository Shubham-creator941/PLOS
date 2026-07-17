import { IntelligenceRepository } from '../repository';
import { AssessmentRepository } from '../../assessment/repository';
import { PlanningRepository } from '../../planning/repository';
import { SessionRepository } from '../../session/repository';
import { AdaptiveRuntimeRepository } from '../../adaptive/repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  LearningAnalyticsRecord,
  LearnerMasteryRecord,
  MasteryStatus,
  RecommendationHistoryRecord,
  KnowledgeGapRecord,
  GapSeverity,
  RecommendationType,
  RecordAssessmentRequestDTO,
  ResolveKnowledgeGapRequestDTO
} from '../types';

export class IntelligenceService {
  private readonly intelligenceRepo = new IntelligenceRepository();
  private readonly assessmentRepo = new AssessmentRepository();
  private readonly planningRepo = new PlanningRepository();
  private readonly sessionRepo = new SessionRepository();
  private readonly adaptiveRepo = new AdaptiveRuntimeRepository();

  // ---- Private Helpers ----

  private async getOwnedAnalytics(learnerId: string): Promise<LearningAnalyticsRecord> {
    const analytics = await this.intelligenceRepo.findAnalytics(learnerId);
    if (!analytics) {
      // Auto-initialize if missing
      return this.intelligenceRepo.createAnalytics({
        analytics_id: generateUUID(),
        learner_id: learnerId,
        total_learning_minutes: 0,
        completed_plans: 0,
        completed_modules: 0,
        completed_objectives: 0,
        average_assessment_score: 0,
        mastery_percentage: 0,
        learning_velocity: 0,
        last_calculated_at: new Date()
      });
    }
    return analytics;
  }

  private async getOwnedMastery(learnerId: string, moduleId: string): Promise<LearnerMasteryRecord | null> {
    return this.intelligenceRepo.findMastery(learnerId, moduleId);
  }

  private validateLearner(learnerId: string): void {
    if (!learnerId) throw new Error(MESSAGES.UNAUTHORIZED || 'Learner ID is required');
  }

  // ---- Business Rules ----

  public async recalculateAnalytics(learnerId: string): Promise<LearningAnalyticsRecord> {
    this.validateLearner(learnerId);
    const analytics = await this.getOwnedAnalytics(learnerId);

    // Business Logic: Compute analytics from raw data
    // Fetch user's plans to calculate progress
    const plans = await this.planningRepo.findByLearner(learnerId);
    
    let completedPlans = 0;
    let completedModules = 0;
    let completedObjectives = 0;

    for (const plan of plans) {
      if (plan.status === 'completed') completedPlans++;
      const progress = await this.planningRepo.calculateProgress(plan.plan_id);
      completedModules += progress.completed_modules;
      completedObjectives += progress.completed_objectives;
    }

    // Compute average mastery
    const masteries = await this.intelligenceRepo.listMasteryByLearner(learnerId);
    let totalScore = 0;
    let masteryPercentage = 0;

    if (masteries.length > 0) {
      totalScore = masteries.reduce((sum, m) => sum + m.last_score, 0);
      const averageScore = totalScore / masteries.length;
      masteryPercentage = averageScore; // Simple 1:1 mapping for mastery percentage
    }

    return this.intelligenceRepo.updateAnalytics(analytics.analytics_id, {
      completed_plans: completedPlans,
      completed_modules: completedModules,
      completed_objectives: completedObjectives,
      average_assessment_score: masteries.length > 0 ? totalScore / masteries.length : 0,
      mastery_percentage: masteryPercentage,
      last_calculated_at: new Date(),
      version: analytics.version
    });
  }

  public async getAnalytics(learnerId: string): Promise<LearningAnalyticsRecord> {
    this.validateLearner(learnerId);
    return this.getOwnedAnalytics(learnerId);
  }

  public async listMastery(learnerId: string): Promise<LearnerMasteryRecord[]> {
    this.validateLearner(learnerId);
    return this.intelligenceRepo.listMasteryByLearner(learnerId);
  }

  public async listRecommendations(learnerId: string): Promise<RecommendationHistoryRecord[]> {
    this.validateLearner(learnerId);
    return this.intelligenceRepo.listRecommendations(learnerId);
  }

  public async listKnowledgeGaps(learnerId: string): Promise<KnowledgeGapRecord[]> {
    this.validateLearner(learnerId);
    return this.intelligenceRepo.listKnowledgeGaps(learnerId);
  }

  public async recordAssessment(learnerId: string, dto: RecordAssessmentRequestDTO): Promise<LearnerMasteryRecord> {
    this.validateLearner(learnerId);

    // Mastery Classification
    let status: MasteryStatus = 'beginner';
    if (dto.score >= 90) status = 'mastered';
    else if (dto.score >= 75) status = 'proficient';
    else if (dto.score >= 50) status = 'developing';

    const existingMastery = await this.getOwnedMastery(learnerId, dto.module_id);

    let masteryRecord: LearnerMasteryRecord;

    if (existingMastery) {
      masteryRecord = await this.intelligenceRepo.updateMastery(existingMastery.mastery_id, {
        version:          existingMastery.version ?? 0,
        mastery_score:    dto.score,
        attempts:         existingMastery.attempts + 1,
        last_score:       dto.score,
        status,
        last_assessed_at: new Date()
      });
    } else {
      masteryRecord = await this.intelligenceRepo.createMastery({
        mastery_id: generateUUID(),
        learner_id: learnerId,
        module_id: dto.module_id,
        mastery_score: dto.score,
        attempts: 1,
        last_score: dto.score,
        status,
        last_assessed_at: new Date()
      });
    }

    // Knowledge Gap Detection
    // Rule: Assessment score below threshold (assuming < 90 is the gap trigger)
    if (dto.score < 90) {
      let severity: GapSeverity = 'high';
      if (dto.score >= 80) severity = 'low';
      else if (dto.score >= 60) severity = 'medium';

      await this.intelligenceRepo.createKnowledgeGap({
        gap_id: generateUUID(),
        learner_id: learnerId,
        module_id: dto.module_id,
        severity,
        confidence_score: 100 - dto.score, // Simple inverse confidence
        reason: `Assessment score of ${dto.score}% indicates a knowledge gap.`,
        identified_at: new Date()
      });
    }

    return masteryRecord;
  }

  public async generateRecommendations(learnerId: string, sessionId?: string): Promise<RecommendationHistoryRecord> {
    this.validateLearner(learnerId);

    let activeModuleId: string | null = null;
    let recommendationType: RecommendationType = 'continue_learning';
    let reason = 'Continue with your learning path.';

    if (sessionId) {
      const sessionSummary = await this.sessionRepo.getSessionSummary(sessionId);
      if (sessionSummary && sessionSummary.current_module_id) {
        activeModuleId = sessionSummary.current_module_id;
      }
    }

    // Load necessary context for deterministic rules
    const gaps = await this.intelligenceRepo.listKnowledgeGaps(learnerId);
    const outstandingGaps = gaps.filter(g => !g.resolved);

    let currentMastery: LearnerMasteryRecord | null = null;
    if (activeModuleId) {
      currentMastery = await this.getOwnedMastery(learnerId, activeModuleId);
    }

    // Apply Deterministic Rules
    
    // Rule 1: Mastery < 50 -> repeat_module
    if (currentMastery && currentMastery.last_score < 50) {
      recommendationType = 'repeat_module';
      reason = 'Mastery score is below 50. Repeating the module is highly recommended.';
    } 
    // Rule 2: Outstanding knowledge gaps -> review (Wait, rule 2 was Assessment < passing, rule 3 outstanding gaps. If we don't have assessment pass state readily available, we prioritize gaps first or check active gap)
    else if (outstandingGaps.length > 0) {
      // Rule 3: Outstanding knowledge gaps -> review
      recommendationType = 'review';
      reason = 'You have outstanding knowledge gaps to review.';
    }
    // Rule 4: Current module completed -> unlock_next (Assuming mastered status implies completion)
    else if (currentMastery && currentMastery.status === 'mastered') {
      recommendationType = 'unlock_next';
      reason = 'Module mastered. You are ready to unlock the next topic.';
    }

    // Note: Rule 2 (Assessment < passing -> practice_assessment) is difficult to trigger globally without looking at recent failed attempts.
    // We fall back to continue_learning.

    return this.intelligenceRepo.createRecommendation({
      recommendation_id: generateUUID(),
      learner_id: learnerId,
      session_id: sessionId || null,
      recommendation_type: recommendationType,
      reason,
      generated_at: new Date()
    });
  }

  public async resolveKnowledgeGap(learnerId: string, dto: ResolveKnowledgeGapRequestDTO): Promise<KnowledgeGapRecord> {
    this.validateLearner(learnerId);

    const gap = await this.intelligenceRepo.findKnowledgeGap(dto.gap_id);
    if (!gap) throw new Error(MESSAGES.NOT_FOUND || 'Knowledge gap not found');
    if (gap.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN || 'Not authorized to resolve this knowledge gap');
    
    if (gap.resolved) throw new Error(MESSAGES.BAD_REQUEST || 'Gap is already resolved');

    return this.intelligenceRepo.updateKnowledgeGap(gap.gap_id, {
      resolved: true,
      resolved_at: new Date(),
      reason: dto.resolution_notes || gap.reason
    });
  }
}
