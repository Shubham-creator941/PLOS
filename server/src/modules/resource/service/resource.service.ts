import { ResourceRepository } from '../repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  LearningResourceRecord,
  ResourceVersionRecord,
  LearnerResourceProgressRecord,
  ResourceTagRecord,
  CreateResourceRequestDTO,
  UpdateResourceRequestDTO,
  VisibilityStatus
} from '../types';

export class ResourceService {
  private readonly resourceRepo = new ResourceRepository();

  // ====================================================
  // PRIVATE HELPERS
  // ====================================================

  public async getResource(resourceId: string): Promise<LearningResourceRecord> {
    const resource = await this.resourceRepo.findLearningResource(resourceId);
    if (!resource) throw new Error(MESSAGES.NOT_FOUND || 'Resource not found');
    return resource;
  }

  private validateLearner(learnerId: string): void {
    if (!learnerId) throw new Error(MESSAGES.UNAUTHORIZED || 'Learner ID is required');
  }

  // ====================================================
  // RESOURCE MANAGEMENT
  // ====================================================

  public async createResource(dto: CreateResourceRequestDTO): Promise<LearningResourceRecord> {
    const resourceId = generateUUID();
    
    const resource = await this.resourceRepo.createLearningResource({
      resource_id: resourceId,
      module_id: dto.module_id,
      title: dto.title,
      description: dto.description,
      resource_type: dto.resource_type,
      storage_type: dto.storage_type,
      resource_url: dto.resource_url,
      estimated_minutes: dto.estimated_minutes,
      visibility: 'draft'
    });

    await this.resourceRepo.createResourceVersion({
      resource_version_id: generateUUID(),
      resource_id: resourceId,
      version_no: 1,
      resource_url: dto.resource_url,
      change_summary: 'Initial creation'
    });

    if (dto.tags && dto.tags.length > 0) {
      for (const tag of dto.tags) {
        await this.resourceRepo.createResourceTag({
          tag_id: generateUUID(),
          resource_id: resourceId,
          tag_name: tag
        });
      }
    }

    return resource;
  }

  public async updateResource(resourceId: string, currentVersion: number, dto: UpdateResourceRequestDTO): Promise<LearningResourceRecord> {
    const resource = await this.getResource(resourceId);

    const updated = await this.resourceRepo.updateLearningResource(resourceId, currentVersion || resource.version, {
      title: dto.title,
      description: dto.description,
      resource_type: dto.resource_type,
      storage_type: dto.storage_type,
      resource_url: dto.resource_url,
      estimated_minutes: dto.estimated_minutes,
      visibility: dto.visibility
    });

    if (dto.resource_url && dto.resource_url !== resource.resource_url) {
      const versions = await this.resourceRepo.listResourceVersions(resourceId);
      const nextVersionNo = versions.length > 0 ? versions[0].version_no + 1 : 1;

      await this.resourceRepo.createResourceVersion({
        resource_version_id: generateUUID(),
        resource_id: resourceId,
        version_no: nextVersionNo,
        resource_url: dto.resource_url,
        change_summary: dto.change_summary || 'URL updated'
      });
    }

    if (dto.tags) {
      await this.manageTags(resourceId, dto.tags);
    }

    return updated;
  }

  public async publishResource(resourceId: string, currentVersion: number): Promise<LearningResourceRecord> {
    return this.resourceRepo.updateLearningResource(resourceId, currentVersion, {
      visibility: 'published'
    });
  }

  public async archiveResource(resourceId: string, currentVersion: number): Promise<LearningResourceRecord> {
    return this.resourceRepo.updateLearningResource(resourceId, currentVersion, {
      visibility: 'archived'
    });
  }

  public async listResources(moduleId: string, visibility?: VisibilityStatus): Promise<LearningResourceRecord[]> {
    return this.resourceRepo.listLearningResources(moduleId, visibility);
  }

  // ====================================================
  // RESOURCE VERSIONS
  // ====================================================

  public async createNewVersion(resourceId: string, resourceUrl: string, summary?: string): Promise<ResourceVersionRecord> {
    await this.getResource(resourceId);
    
    const versions = await this.resourceRepo.listResourceVersions(resourceId);
    const nextVersionNo = versions.length > 0 ? versions[0].version_no + 1 : 1;

    return this.resourceRepo.createResourceVersion({
      resource_version_id: generateUUID(),
      resource_id: resourceId,
      version_no: nextVersionNo,
      resource_url: resourceUrl,
      change_summary: summary
    });
  }

  public async listVersions(resourceId: string): Promise<ResourceVersionRecord[]> {
    await this.getResource(resourceId);
    return this.resourceRepo.listResourceVersions(resourceId);
  }

  // ====================================================
  // TAGS
  // ====================================================

  public async manageTags(resourceId: string, tags: ReadonlyArray<string>): Promise<void> {
    await this.getResource(resourceId);
    // In a real system we'd delete old tags here, but since Repository has NO DELETE,
    // we simply append new tags, or we could just skip duplicates.
    // The prompt explicitly states NO DELETE in repository, so we append unique tags.
    const existing = await this.resourceRepo.listResourceTags(resourceId);
    const existingNames = new Set(existing.map(t => t.tag_name));

    for (const tag of tags) {
      if (!existingNames.has(tag)) {
        await this.resourceRepo.createResourceTag({
          tag_id: generateUUID(),
          resource_id: resourceId,
          tag_name: tag
        });
      }
    }
  }

  public async listTags(resourceId: string): Promise<ResourceTagRecord[]> {
    await this.getResource(resourceId);
    return this.resourceRepo.listResourceTags(resourceId);
  }

  // ====================================================
  // LEARNER PROGRESS
  // ====================================================

  public async trackLearnerProgress(learnerId: string, resourceId: string, percentage: number): Promise<LearnerResourceProgressRecord> {
    this.validateLearner(learnerId);
    await this.getResource(resourceId);

    const existing = await this.resourceRepo.findLearnerProgress(learnerId, resourceId);
    const boundedPercentage = Math.min(Math.max(percentage, 0), 100);
    const status = boundedPercentage === 100 ? 'completed' : 'in_progress';
    const completedAt = boundedPercentage === 100 ? new Date() : null;

    if (!existing) {
      return this.resourceRepo.createLearnerProgress({
        progress_id: generateUUID(),
        learner_id: learnerId,
        resource_id: resourceId,
        status,
        progress_percentage: boundedPercentage
      });
    }

    return this.resourceRepo.updateLearnerProgress(existing.progress_id, existing.version, {
      status,
      progress_percentage: boundedPercentage,
      last_accessed_at: new Date(),
      completed_at: completedAt || existing.completed_at
    });
  }

  public async completeResource(learnerId: string, resourceId: string): Promise<LearnerResourceProgressRecord> {
    return this.trackLearnerProgress(learnerId, resourceId, 100);
  }
}
