import type { BaseEntity } from '../../../shared/types';
import type { PurposeProfile, MemoryProfile } from '../../learner/types/learner.types';

export type JourneyStatus = 'active' | 'completed' | 'paused' | 'abandoned';
export type MilestoneDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type MilestonePriority = 'low' | 'medium' | 'high' | 'critical';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface JourneyRecord extends BaseEntity {
  journey_id: string;
  learner_id: string;
  title: string;
  domain: string;
  status: JourneyStatus;
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
  started_at: Date;
  target_date: Date;
  completed_at: Date | null;
  version: number;
}

export interface MilestoneRecord extends BaseEntity {
  milestone_id: string;
  plan_id: string;
  title: string;
  description: string;
  deadline: Date;
  difficulty: MilestoneDifficulty;
  priority: MilestonePriority;
  status: MilestoneStatus;
  order_no: number;
}

export interface CreateMilestoneDTO {
  milestone_id: string;
  plan_id: string;
  title: string;
  description: string;
  deadline: Date;
  difficulty?: MilestoneDifficulty;
  priority?: MilestonePriority;
  order_no: number;
}

export interface UpdateMilestoneDTO {
  milestone_id: string;
  plan_id: string;
  title: string;
  description: string;
  deadline: Date;
  difficulty: MilestoneDifficulty;
  priority: MilestonePriority;
  status: MilestoneStatus;
  order_no: number;
}

export interface UpdateJourneyDTO {
  journey_id: string;
  learner_id: string;
  title: string;
  domain: string;
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
  target_date: Date;
  version: number;
}

export interface JourneyProgressRecord {
  total_milestones: number;
  completed_milestones: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface UpdateJourneyRequestDTO {
  title?: string;
  domain?: string;
  purpose_profile?: PurposeProfile;
  memory_profile?: MemoryProfile;
  target_date?: Date;
}

export interface CreateMilestoneRequestDTO {
  title: string;
  description: string;
  deadline: Date;
  difficulty?: MilestoneDifficulty;
  priority?: MilestonePriority;
}

export interface UpdateMilestoneRequestDTO {
  title?: string;
  description?: string;
  deadline?: Date;
  difficulty?: MilestoneDifficulty;
  priority?: MilestonePriority;
  status?: MilestoneStatus;
  order_no?: number;
}
