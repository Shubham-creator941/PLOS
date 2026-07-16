import { BaseEntity } from '../../../shared/types';

export interface PurposeProfile {
  why: string;
  expectedOutcome: string;
  motivationType: string;
}

export interface MemoryProfile {
  availableDailyMinutes: number;
  preferredLearningStyle: string;
  teachBackEnabled: boolean;
  habitTriggers: string[];
  preferredLearningTime: string;
  weeklyCommitment: number;
}

export interface LearnerProfile {
  learner_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  timezone: string;
  current_journey_id: string | null;
  journey_title: string | null;
  journey_domain: string | null;
  journey_status: 'active' | 'completed' | 'paused' | 'abandoned' | null;
}

export interface UpdateLearnerDTO {
  learner_id: string;
  full_name: string;
  avatar_url: string | null;
  timezone: string;
}

export interface JourneyRecord extends BaseEntity {
  journey_id: string;
  learner_id: string;
  title: string;
  domain: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
  started_at: Date;
  target_date: Date;
  completed_at: Date | null;
  version: number;
}

export interface CreateJourneyDTO {
  journey_id: string;
  learner_id: string;
  title: string;
  domain: string;
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
  target_date: Date;
}

export interface UpdateJourneyDTO {
  journey_id: string;
  learner_id: string;
  title: string;
  domain: string;
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
  target_date: Date;
}

export interface OnboardLearnerDTO {
  learner_id: string;
  title: string;
  domain: string;
  target_date: Date;
  purpose_profile: PurposeProfile;
  memory_profile: MemoryProfile;
}

export interface UpdateProfileRequestDTO {
  learner_id: string;
  full_name?: string;
  avatar_url?: string | null;
  timezone?: string;
  purpose_profile?: Partial<PurposeProfile>;
  memory_profile?: Partial<MemoryProfile>;
}

export interface OnboardResponse {
  learner: LearnerProfile;
  journey: JourneyRecord;
}
