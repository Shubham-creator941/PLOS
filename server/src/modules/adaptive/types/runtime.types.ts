import { BaseEntity } from '../../../shared/types';

// ---- Status Union Types ----

export type RuntimeState =
  | 'ready'
  | 'learning'
  | 'reviewing'
  | 'remediation'
  | 'waiting'
  | 'completed';

export type RecommendationType =
  | 'continue'
  | 'review'
  | 'repeat'
  | 'unlock_next'
  | 'complete_session';

export type DecisionSource =
  | 'progress_engine'
  | 'runtime_rules';

export type ReviewPriority =
  | 'low'
  | 'medium'
  | 'high';

export type UnlockSource =
  | 'runtime_rules'
  | 'learner_action';

export type RuntimeMetadata = Record<string, unknown>;

// ---- Database Records ----

export interface AdaptiveRuntimeStateRecord extends BaseEntity {
  readonly runtime_id: string;
  readonly session_id: string;
  readonly current_state: RuntimeState;
  readonly next_phase_id: string | null;
  readonly next_module_id: string | null;
  readonly next_objective_id: string | null;
  readonly recommendation_type: RecommendationType;
  readonly decision_reason: string;
  readonly version: number;
}

export interface AdaptiveRuntimeDecisionRecord extends BaseEntity {
  readonly decision_id: string;
  readonly runtime_id: string;
  readonly session_id: string;
  readonly decision_type: RecommendationType;
  readonly source: DecisionSource;
  readonly reason: string;
  readonly metadata: RuntimeMetadata | null;
}

export interface AdaptiveReviewQueueRecord extends BaseEntity {
  readonly queue_id: string;
  readonly session_id: string;
  readonly objective_id: string;
  readonly priority: ReviewPriority;
  readonly reason: string;
  readonly scheduled_at: Date;
  readonly completed: boolean;
}

export interface AdaptiveUnlockHistoryRecord extends BaseEntity {
  readonly unlock_id: string;
  readonly session_id: string;
  readonly phase_id: string | null;
  readonly module_id: string | null;
  readonly objective_id: string | null;
  readonly unlocked_by: UnlockSource;
}

// ---- Repository DTOs ----

export interface CreateRuntimeDTO {
  readonly runtime_id: string;
  readonly session_id: string;
  readonly current_state: RuntimeState;
  readonly recommendation_type: RecommendationType;
  readonly decision_reason: string;
  readonly next_phase_id?: string | null;
  readonly next_module_id?: string | null;
  readonly next_objective_id?: string | null;
}

export interface UpdateRuntimeDTO {
  readonly current_state?: RuntimeState;
  readonly recommendation_type?: RecommendationType;
  readonly decision_reason?: string;
  readonly next_phase_id?: string | null;
  readonly next_module_id?: string | null;
  readonly next_objective_id?: string | null;
  readonly version: number;
}

export interface CreateDecisionDTO {
  readonly decision_id: string;
  readonly runtime_id: string;
  readonly session_id: string;
  readonly decision_type: RecommendationType;
  readonly source: DecisionSource;
  readonly reason: string;
  readonly metadata?: RuntimeMetadata | null;
}

export interface CreateReviewQueueDTO {
  readonly queue_id: string;
  readonly session_id: string;
  readonly objective_id: string;
  readonly priority: ReviewPriority;
  readonly reason: string;
  readonly scheduled_at: Date;
  readonly completed?: boolean;
}

export interface UpdateReviewQueueDTO {
  readonly priority?: ReviewPriority;
  readonly reason?: string;
  readonly scheduled_at?: Date;
  readonly completed?: boolean;
}

export interface CreateUnlockHistoryDTO {
  readonly unlock_id: string;
  readonly session_id: string;
  readonly unlocked_by: UnlockSource;
  readonly phase_id?: string | null;
  readonly module_id?: string | null;
  readonly objective_id?: string | null;
}

// ---- HTTP Request DTOs ----

export interface CreateRuntimeRequestDTO {
  readonly session_id: string;
  readonly current_state: RuntimeState;
  readonly recommendation_type: RecommendationType;
  readonly decision_reason: string;
  readonly next_phase_id?: string | null;
  readonly next_module_id?: string | null;
  readonly next_objective_id?: string | null;
}

export interface UpdateRuntimeRequestDTO {
  readonly current_state?: RuntimeState;
  readonly recommendation_type?: RecommendationType;
  readonly decision_reason?: string;
  readonly next_phase_id?: string | null;
  readonly next_module_id?: string | null;
  readonly next_objective_id?: string | null;
}

export interface CreateReviewRequestDTO {
  readonly session_id: string;
  readonly objective_id: string;
  readonly priority: ReviewPriority;
  readonly reason: string;
  readonly scheduled_at: Date;
}

export interface CompleteReviewRequestDTO {
  readonly completed: boolean;
}
