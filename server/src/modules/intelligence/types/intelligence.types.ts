import { BaseEntity } from '../../../shared/types';

// ---- String Unions ----

export type MasteryStatus = 'beginner' | 'developing' | 'proficient' | 'mastered';

export type RecommendationType = 
  | 'review' 
  | 'repeat_module' 
  | 'continue_learning' 
  | 'unlock_next' 
  | 'practice_assessment';

export type RecommendationStatus = 'pending' | 'accepted' | 'dismissed' | 'completed';

export type GapSeverity = 'low' | 'medium' | 'high';

// ---- Database Records ----

export interface LearningAnalyticsRecord extends BaseEntity {
  analytics_id: string;
  learner_id: string;
  total_learning_minutes: number;
  completed_plans: number;
  completed_modules: number;
  completed_objectives: number;
  average_assessment_score: number;
  mastery_percentage: number;
  learning_velocity: number;
  last_calculated_at: Date;
  version: number;
}

export interface LearnerMasteryRecord extends BaseEntity {
  mastery_id: string;
  learner_id: string;
  module_id: string;
  mastery_score: number;
  attempts: number;
  last_score: number;
  status: MasteryStatus;
  last_assessed_at: Date;
}

export interface RecommendationHistoryRecord extends BaseEntity {
  recommendation_id: string;
  learner_id: string;
  session_id: string | null;
  recommendation_type: RecommendationType;
  reason: string;
  status: RecommendationStatus;
  generated_at: Date;
  completed_at: Date | null;
}

export interface KnowledgeGapRecord extends BaseEntity {
  gap_id: string;
  learner_id: string;
  module_id: string;
  objective_id: string | null;
  severity: GapSeverity;
  confidence_score: number;
  reason: string;
  resolved: boolean;
  identified_at: Date;
  resolved_at: Date | null;
}

// ---- Repository DTOs ----

export interface CreateAnalyticsDTO {
  readonly analytics_id: string;
  readonly learner_id: string;
  readonly total_learning_minutes: number;
  readonly completed_plans: number;
  readonly completed_modules: number;
  readonly completed_objectives: number;
  readonly average_assessment_score: number;
  readonly mastery_percentage: number;
  readonly learning_velocity: number;
  readonly last_calculated_at: Date;
}

export interface UpdateAnalyticsDTO {
  readonly total_learning_minutes?: number;
  readonly completed_plans?: number;
  readonly completed_modules?: number;
  readonly completed_objectives?: number;
  readonly average_assessment_score?: number;
  readonly mastery_percentage?: number;
  readonly learning_velocity?: number;
  readonly last_calculated_at?: Date;
  readonly version: number;
}

export interface CreateMasteryDTO {
  readonly mastery_id: string;
  readonly learner_id: string;
  readonly module_id: string;
  readonly mastery_score: number;
  readonly attempts: number;
  readonly last_score: number;
  readonly status: MasteryStatus;
  readonly last_assessed_at: Date;
}

export interface UpdateMasteryDTO {
  readonly version:          number;   // required for optimistic locking
  readonly mastery_score?:   number;
  readonly attempts?:        number;
  readonly last_score?:      number;
  readonly status?:          MasteryStatus;
  readonly last_assessed_at?: Date;
}

export interface CreateRecommendationDTO {
  readonly recommendation_id: string;
  readonly learner_id: string;
  readonly session_id?: string | null;
  readonly recommendation_type: RecommendationType;
  readonly reason: string;
  readonly generated_at: Date;
}

export interface UpdateRecommendationDTO {
  readonly status?: RecommendationStatus;
  readonly completed_at?: Date | null;
}

export interface CreateKnowledgeGapDTO {
  readonly gap_id: string;
  readonly learner_id: string;
  readonly module_id: string;
  readonly objective_id?: string | null;
  readonly severity: GapSeverity;
  readonly confidence_score: number;
  readonly reason: string;
  readonly identified_at: Date;
}

export interface UpdateKnowledgeGapDTO {
  readonly severity?: GapSeverity;
  readonly confidence_score?: number;
  readonly reason?: string;
  readonly resolved?: boolean;
  readonly resolved_at?: Date | null;
}

// ---- Request DTOs ----

export interface RecalculateAnalyticsRequestDTO {
  readonly learner_id: string;
}

export interface RecordAssessmentRequestDTO {
  readonly module_id: string;
  readonly score: number;
}

export interface GenerateRecommendationsRequestDTO {
  readonly session_id?: string;
}

export interface ResolveKnowledgeGapRequestDTO {
  readonly gap_id: string;
  readonly resolution_notes?: string;
}

// ---- Response DTOs ----

export interface LearningDashboardDTO {
  readonly analytics: LearningAnalyticsRecord;
  readonly active_recommendations: RecommendationHistoryRecord[];
  readonly knowledge_gaps: KnowledgeGapRecord[];
}

export interface LearningInsightDTO {
  readonly module_id: string;
  readonly mastery_status: MasteryStatus;
  readonly score: number;
  readonly suggested_actions: string[];
}

export interface MasterySummaryDTO {
  readonly module_id: string;
  readonly mastery_score: number;
  readonly status: MasteryStatus;
  readonly assessed_at: Date;
}

export interface KnowledgeGapSummaryDTO {
  readonly gap_id: string;
  readonly module_id: string;
  readonly severity: GapSeverity;
  readonly resolved: boolean;
  readonly identified_at: Date;
}

export interface RecommendationSummaryDTO {
  readonly recommendation_id: string;
  readonly recommendation_type: RecommendationType;
  readonly reason: string;
  readonly status: RecommendationStatus;
  readonly generated_at: Date;
}
