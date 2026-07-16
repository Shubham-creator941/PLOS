import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import { AdaptiveRuntimeRepository } from '../repository';
import { SessionRepository } from '../../session/repository';
import { PlanningRepository } from '../../planning/repository';
import {
  AdaptiveRuntimeStateRecord,
  AdaptiveRuntimeDecisionRecord,
  AdaptiveReviewQueueRecord,
  CreateRuntimeDTO,
  UpdateRuntimeDTO,
  CreateDecisionDTO,
  CreateReviewQueueDTO,
  CreateUnlockHistoryDTO
} from '../types';

export class AdaptiveRuntimeService {
  private readonly adaptiveRepo = new AdaptiveRuntimeRepository();
  private readonly sessionRepo = new SessionRepository();
  private readonly planningRepo = new PlanningRepository();

  private async getOwnedSession(learnerId: string, sessionId: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new Error(MESSAGES.NOT_FOUND);
    if (session.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN);
    return session;
  }

  private async getOwnedRuntime(learnerId: string, runtimeId: string) {
    const runtime = await this.adaptiveRepo.findRuntimeById(runtimeId);
    if (!runtime) throw new Error(MESSAGES.NOT_FOUND);
    await this.getOwnedSession(learnerId, runtime.session_id);
    return runtime;
  }

  // ---- Public Methods ----

  public async initializeRuntime(learnerId: string, sessionId: string): Promise<AdaptiveRuntimeStateRecord> {
    const session = await this.getOwnedSession(learnerId, sessionId);

    const existing = await this.adaptiveRepo.findRuntimeBySession(sessionId);
    if (existing) throw new Error(MESSAGES.BAD_REQUEST);

    const dto: CreateRuntimeDTO = {
      runtime_id: generateUUID(),
      session_id: sessionId,
      current_state: 'ready',
      recommendation_type: 'continue',
      decision_reason: 'Runtime initialized',
      next_phase_id: session.current_phase_id,
      next_module_id: session.current_module_id,
      next_objective_id: session.current_objective_id
    };

    return this.adaptiveRepo.createRuntime(dto);
  }

  public async getRuntime(learnerId: string, runtimeId: string): Promise<AdaptiveRuntimeStateRecord> {
    return this.getOwnedRuntime(learnerId, runtimeId);
  }

  public async getDecisionHistory(learnerId: string, runtimeId: string): Promise<AdaptiveRuntimeDecisionRecord[]> {
    await this.getOwnedRuntime(learnerId, runtimeId);
    return this.adaptiveRepo.listDecisionHistory(runtimeId);
  }

  public async getPendingReviews(learnerId: string, runtimeId: string): Promise<AdaptiveReviewQueueRecord[]> {
    const runtime = await this.getOwnedRuntime(learnerId, runtimeId);
    return this.adaptiveRepo.listPendingReviews(runtime.session_id);
  }

  public async evaluateRuntime(learnerId: string, runtimeId: string): Promise<AdaptiveRuntimeStateRecord> {
    const runtime = await this.getOwnedRuntime(learnerId, runtimeId);
    const session = await this.sessionRepo.findById(runtime.session_id);

    if (!session) throw new Error(MESSAGES.NOT_FOUND);

    // Rule 1: If session.status != active -> Reject
    if (session.status !== 'active') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    // Rule 2: Read planning progress
    const progress = await this.planningRepo.calculateProgress(session.plan_id);

    let newState = runtime.current_state;
    let newRecommendation = runtime.recommendation_type;
    let reason = 'No state change required';
    let shouldCreateReview = false;
    let shouldCreateUnlock = false;

    const currentObjectiveId = session.current_objective_id;
    let currentObjective = null;
    if (currentObjectiveId) {
      currentObjective = await this.planningRepo.findObjective(currentObjectiveId);
    }

    // Rule 3: If every objective completed
    if (progress.total_objectives > 0 && progress.completed_objectives === progress.total_objectives) {
      newRecommendation = 'complete_session';
      newState = 'completed';
      reason = 'All plan objectives have been completed';
    } 
    else if (currentObjective) {
      // NOTE: Since "failed" status does not exist on LearningObjectiveRecord natively,
      // we mock the deterministic failure logic here.
      const isObjectiveFailed = false; // TODO: Implement failure detection

      if (isObjectiveFailed) {
        // Rule 5: If objective recently failed
        newRecommendation = 'review';
        newState = 'reviewing';
        reason = 'Objective recently failed, review required';
        shouldCreateReview = true;
      } 
      else if (currentObjective.status !== 'completed') {
        // Rule 4: If current objective incomplete
        newRecommendation = 'continue';
        newState = 'learning';
        reason = 'Current objective is incomplete, continue learning';
      } 
      else if (currentObjective.status === 'completed') {
        // Rule 6: If review queue empty AND objective completed
        const pendingReviews = await this.adaptiveRepo.listPendingReviews(session.session_id);
        if (pendingReviews.length === 0) {
          newRecommendation = 'unlock_next';
          newState = 'ready';
          reason = 'Objective completed and no pending reviews, unlock next';
          shouldCreateUnlock = true;
        }
      }
    }

    // Update runtime
    const updateDto: UpdateRuntimeDTO = {
      current_state: newState,
      recommendation_type: newRecommendation,
      decision_reason: reason,
      version: runtime.version
    };

    const updatedRuntime = await this.adaptiveRepo.updateRuntime(runtimeId, updateDto);

    // Create Decision History
    const decisionDto: CreateDecisionDTO = {
      decision_id: generateUUID(),
      runtime_id: runtimeId,
      session_id: session.session_id,
      decision_type: newRecommendation,
      source: 'runtime_rules',
      reason: reason
    };
    await this.adaptiveRepo.createDecision(decisionDto);

    // Enqueue review if needed
    if (shouldCreateReview && currentObjectiveId) {
      const pending = await this.adaptiveRepo.listPendingReviews(session.session_id);
      const isAlreadyPending = pending.some(r => r.objective_id === currentObjectiveId);
      
      if (!isAlreadyPending) {
        const reviewDto: CreateReviewQueueDTO = {
          queue_id: generateUUID(),
          session_id: session.session_id,
          objective_id: currentObjectiveId,
          priority: 'high',
          reason: 'Objective failed during evaluation',
          scheduled_at: new Date()
        };
        await this.adaptiveRepo.enqueueReview(reviewDto);
      }
    }

    // Create unlock history if needed
    if (shouldCreateUnlock && currentObjective) {
      const unlockDto: CreateUnlockHistoryDTO = {
        unlock_id: generateUUID(),
        session_id: session.session_id,
        phase_id: session.current_phase_id,
        module_id: session.current_module_id,
        objective_id: session.current_objective_id,
        unlocked_by: 'runtime_rules'
      };
      await this.adaptiveRepo.createUnlockHistory(unlockDto);
    }

    return updatedRuntime;
  }
}
