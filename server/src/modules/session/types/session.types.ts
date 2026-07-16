import { BaseEntity } from '../../../shared/types';

export type SessionStatus =
  | 'not_started'
  | 'active'
  | 'paused'
  | 'completed'
  | 'abandoned';

export type SessionEventType =
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'objective_started'
  | 'objective_completed'
  | 'module_completed'
  | 'phase_completed'
  | 'session_completed'
  | 'session_abandoned';

type EventPayload = Record<string, string | number | boolean | object | null>;

// ---- Database Records ----

export interface LearningSessionRecord extends BaseEntity {
  session_id: string;
  plan_id: string;
  learner_id: string;
  current_phase_id: string | null;
  current_module_id: string | null;
  current_objective_id: string | null;
  status: SessionStatus;
  started_at: Date | null;
  last_activity_at: Date | null;
  completed_at: Date | null;
  total_minutes: number;
  version: number;
}

export interface LearningSessionEventRecord extends BaseEntity {
  event_id: string;
  session_id: string;
  event_type: SessionEventType;
  payload: EventPayload | null;
}

export interface LearningSessionCheckpointRecord extends BaseEntity {
  checkpoint_id: string;
  session_id: string;
  phase_id: string;
  module_id: string;
  objective_id: string;
  elapsed_minutes: number;
}

// ---- Repository DTOs ----

export interface CreateSessionDTO {
  session_id: string;
  plan_id: string;
  learner_id: string;
  current_phase_id: string | null;
  current_module_id: string | null;
  current_objective_id: string | null;
  status: SessionStatus;
}

export interface UpdateSessionDTO {
  session_id: string;
  current_phase_id: string | null;
  current_module_id: string | null;
  current_objective_id: string | null;
  status: SessionStatus;
  started_at: Date | null;
  last_activity_at: Date | null;
  completed_at: Date | null;
  total_minutes: number;
  version: number;
}

export interface CreateSessionEventDTO {
  event_id: string;
  session_id: string;
  event_type: SessionEventType;
  payload: EventPayload | null;
}

export interface CreateCheckpointDTO {
  checkpoint_id: string;
  session_id: string;
  phase_id: string;
  module_id: string;
  objective_id: string;
  elapsed_minutes: number;
}

// ---- Service Request DTOs ----

export interface StartSessionRequestDTO {
  plan_id: string;
}

export interface PauseSessionRequestDTO {
}

export interface ResumeSessionRequestDTO {
}

export interface CompleteObjectiveRequestDTO {
  objective_id: string;
}

export interface SaveCheckpointRequestDTO {
  phase_id: string;
  module_id: string;
  objective_id: string;
  elapsed_minutes: number;
}

// ---- Session Summary ----

export interface SessionSummaryRecord {
  session_id: string;
  plan_id: string;
  status: SessionStatus;
  current_phase_id: string | null;
  current_module_id: string | null;
  current_objective_id: string | null;
  total_minutes: number;
  started_at: Date | null;
  last_activity_at: Date | null;
}
