import { BaseEntity } from '../../../shared/types';

export type PlanStatus = 'draft' | 'active' | 'completed' | 'archived';
export type PhaseStatus = 'locked' | 'active' | 'completed';
export type ModuleStatus = 'locked' | 'active' | 'completed';
export type ObjectiveStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface LearningPlanRecord extends BaseEntity {
  plan_id: string;
  journey_id: string;
  learner_id: string;
  title: string;
  description: string;
  status: PlanStatus;
  version: number;
}

export interface LearningPhaseRecord extends BaseEntity {
  phase_id: string;
  plan_id: string;
  title: string;
  description: string;
  order_no: number;
  status: PhaseStatus;
  version: number;
}

export interface LearningModuleRecord extends BaseEntity {
  module_id: string;
  phase_id: string;
  title: string;
  description: string;
  order_no: number;
  estimated_minutes: number;
  status: ModuleStatus;
  version: number;
}

export interface LearningObjectiveRecord extends BaseEntity {
  objective_id: string;
  module_id: string;
  title: string;
  description: string;
  order_no: number;
  status: ObjectiveStatus;
  version: number;
}

export interface CreatePlanDTO {
  plan_id: string;
  journey_id: string;
  learner_id: string;
  title: string;
  description: string;
  status: PlanStatus;
}

export interface UpdatePlanDTO {
  plan_id: string;
  learner_id: string;
  title: string;
  description: string;
  status: PlanStatus;
  version: number;
}

export interface CreatePhaseDTO {
  phase_id: string;
  plan_id: string;
  title: string;
  description: string;
  order_no: number;
  status: PhaseStatus;
}

export interface UpdatePhaseDTO {
  phase_id: string;
  plan_id: string;
  title: string;
  description: string;
  order_no: number;
  status: PhaseStatus;
  version: number;
}

export interface CreateModuleDTO {
  module_id: string;
  phase_id: string;
  title: string;
  description: string;
  order_no: number;
  estimated_minutes: number;
  status: ModuleStatus;
}

export interface UpdateModuleDTO {
  module_id: string;
  phase_id: string;
  title: string;
  description: string;
  order_no: number;
  estimated_minutes: number;
  status: ModuleStatus;
  version: number;
}

export interface CreateObjectiveDTO {
  objective_id: string;
  module_id: string;
  title: string;
  description: string;
  order_no: number;
  status: ObjectiveStatus;
}

export interface UpdateObjectiveDTO {
  objective_id: string;
  module_id: string;
  title: string;
  description: string;
  order_no: number;
  status: ObjectiveStatus;
  version: number;
}

export interface CreatePlanRequestDTO {
  journey_id: string;
  title: string;
  description: string;
}

export interface UpdatePlanRequestDTO {
  title?: string;
  description?: string;
  status?: PlanStatus;
}

export interface CreatePhaseRequestDTO {
  title: string;
  description: string;
  order_no: number;
}

export interface UpdatePhaseRequestDTO {
  title?: string;
  description?: string;
  order_no?: number;
  status?: PhaseStatus;
}

export interface CreateModuleRequestDTO {
  title: string;
  description: string;
  order_no: number;
  estimated_minutes: number;
}

export interface UpdateModuleRequestDTO {
  title?: string;
  description?: string;
  order_no?: number;
  estimated_minutes?: number;
  status?: ModuleStatus;
}

export interface CreateObjectiveRequestDTO {
  title: string;
  description: string;
  order_no: number;
}

export interface UpdateObjectiveRequestDTO {
  title?: string;
  description?: string;
  order_no?: number;
  status?: ObjectiveStatus;
}

export interface PlanningProgressRecord {
  total_phases: number;
  completed_phases: number;
  total_modules: number;
  completed_modules: number;
  total_objectives: number;
  completed_objectives: number;
}
