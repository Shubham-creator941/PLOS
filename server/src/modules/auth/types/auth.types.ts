import type { BaseEntity } from '../../../shared/types';

export interface UserRecord extends BaseEntity {
  learner_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  timezone: string;
  deleted_at: Date | null;
}

export interface CreateUserDTO {
  learner_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  timezone?: string;
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface RegisterDTO {
  full_name: string;
  email: string;
  password: string;
  avatar_url?: string;
  timezone?: string;
}

export type AuthenticatedLearner = Omit<UserRecord, 'password_hash' | 'deleted_at' | 'version'>;

export interface AuthResponse {
  learner: AuthenticatedLearner;
  token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}
