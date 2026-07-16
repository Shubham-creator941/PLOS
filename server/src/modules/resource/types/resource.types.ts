import { BaseEntity } from '../../../shared/types';

// ====================================================
// Reusable Union Types
// ====================================================

export type ResourceType =
  | 'video'
  | 'pdf'
  | 'article'
  | 'link'
  | 'image'
  | 'code'
  | 'attachment';

export type StorageType =
  | 'local'
  | 'external';

export type VisibilityStatus =
  | 'draft'
  | 'published'
  | 'archived';

export type ResourceProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed';

// ====================================================
// Database Records
// ====================================================

export interface LearningResourceRecord extends BaseEntity {
  resource_id: string;
  module_id: string;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  storage_type: StorageType;
  resource_url: string;
  estimated_minutes: number;
  visibility: VisibilityStatus;
  version: number;
}

export interface ResourceVersionRecord extends BaseEntity {
  resource_version_id: string;
  resource_id: string;
  version_no: number;
  resource_url: string;
  change_summary: string | null;
  // Note: No updated_at for immutable history tables
}

export interface LearnerResourceProgressRecord extends BaseEntity {
  progress_id: string;
  learner_id: string;
  resource_id: string;
  status: ResourceProgressStatus;
  progress_percentage: number;
  last_accessed_at: Date | null;
  completed_at: Date | null;
  version: number;
}

export interface ResourceTagRecord extends BaseEntity {
  tag_id: string;
  resource_id: string;
  tag_name: string;
  // Note: No updated_at for immutable tag tables
}

// ====================================================
// Repository DTOs
// ====================================================

export interface CreateLearningResourceDTO {
  readonly resource_id: string;
  readonly module_id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly resource_type: ResourceType;
  readonly storage_type: StorageType;
  readonly resource_url: string;
  readonly estimated_minutes?: number;
  readonly visibility?: VisibilityStatus;
}

export interface UpdateLearningResourceDTO {
  readonly title?: string;
  readonly description?: string | null;
  readonly resource_type?: ResourceType;
  readonly storage_type?: StorageType;
  readonly resource_url?: string;
  readonly estimated_minutes?: number;
  readonly visibility?: VisibilityStatus;
}

export interface CreateResourceVersionDTO {
  readonly resource_version_id: string;
  readonly resource_id: string;
  readonly version_no: number;
  readonly resource_url: string;
  readonly change_summary?: string | null;
}

export interface CreateLearnerResourceProgressDTO {
  readonly progress_id: string;
  readonly learner_id: string;
  readonly resource_id: string;
  readonly status?: ResourceProgressStatus;
  readonly progress_percentage?: number;
}

export interface UpdateLearnerResourceProgressDTO {
  readonly status?: ResourceProgressStatus;
  readonly progress_percentage?: number;
  readonly last_accessed_at?: Date | null;
  readonly completed_at?: Date | null;
}

export interface CreateResourceTagDTO {
  readonly tag_id: string;
  readonly resource_id: string;
  readonly tag_name: string;
}

// ====================================================
// Request DTOs
// ====================================================

export interface CreateResourceRequestDTO {
  readonly module_id: string;
  readonly title: string;
  readonly description?: string;
  readonly resource_type: ResourceType;
  readonly storage_type: StorageType;
  readonly resource_url: string;
  readonly estimated_minutes?: number;
  readonly tags?: ReadonlyArray<string>;
}

export interface UpdateResourceRequestDTO {
  readonly title?: string;
  readonly description?: string;
  readonly resource_type?: ResourceType;
  readonly storage_type?: StorageType;
  readonly resource_url?: string;
  readonly estimated_minutes?: number;
  readonly visibility?: VisibilityStatus;
  readonly change_summary?: string;
  readonly tags?: ReadonlyArray<string>;
}

export interface UpdateProgressRequestDTO {
  readonly status?: ResourceProgressStatus;
  readonly progress_percentage?: number;
}

// ====================================================
// Response DTOs
// ====================================================

export interface ResourceTagDTO {
  readonly tag_id: string;
  readonly tag_name: string;
}

export interface LearningResourceDTO {
  readonly resource_id: string;
  readonly module_id: string;
  readonly title: string;
  readonly description: string | null;
  readonly resource_type: ResourceType;
  readonly storage_type: StorageType;
  readonly resource_url: string;
  readonly estimated_minutes: number;
  readonly visibility: VisibilityStatus;
  readonly version: number;
  readonly tags: ReadonlyArray<ResourceTagDTO>;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ResourceVersionDTO {
  readonly resource_version_id: string;
  readonly version_no: number;
  readonly resource_url: string;
  readonly change_summary: string | null;
  readonly created_at: string;
}

export interface LearnerResourceProgressDTO {
  readonly progress_id: string;
  readonly resource_id: string;
  readonly status: ResourceProgressStatus;
  readonly progress_percentage: number;
  readonly last_accessed_at: string | null;
  readonly completed_at: string | null;
}
