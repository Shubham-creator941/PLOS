import type { Response, NextFunction } from 'express';

import { ResourceService } from '../service';
import type { AuthenticatedRequest } from '../../../shared/types';
import { success, created } from '../../../shared/response';

export class ResourceController {
  private readonly resourceService = new ResourceService();

  // ====================================================
  // RESOURCE MANAGEMENT
  // ====================================================

  public createResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await this.resourceService.createResource(req.body);
      created(res, resource);
    } catch (error) {
      next(error);
    }
  };

  public getResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const resource = await this.resourceService.getResource(resource_id);
      success(res, resource);
    } catch (error) {
      next(error);
    }
  };

  public listResources = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { module_id } = req.query;
      const { visibility } = req.query;
      const resources = await this.resourceService.listResources(module_id as string, visibility as any);
      success(res, resources);
    } catch (error) {
      next(error);
    }
  };

  public updateResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const currentVersion = parseInt(req.body.version as string, 10);
      const resource = await this.resourceService.updateResource(resource_id, currentVersion, req.body);
      success(res, resource);
    } catch (error) {
      next(error);
    }
  };

  public publishResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const currentVersion = parseInt(req.body.version as string, 10);
      const resource = await this.resourceService.publishResource(resource_id, currentVersion);
      success(res, resource);
    } catch (error) {
      next(error);
    }
  };

  public archiveResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const currentVersion = parseInt(req.body.version as string, 10);
      const resource = await this.resourceService.archiveResource(resource_id, currentVersion);
      success(res, resource);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // VERSIONS
  // ====================================================

  public createVersion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const { resource_url, change_summary } = req.body;
      const version = await this.resourceService.createNewVersion(resource_id, resource_url, change_summary);
      created(res, version);
    } catch (error) {
      next(error);
    }
  };

  public listVersions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const versions = await this.resourceService.listVersions(resource_id);
      success(res, versions);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // PROGRESS
  // ====================================================

  public updateProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const learnerId = req.user!.id;
      const { progress_percentage } = req.body;
      const progress = await this.resourceService.trackLearnerProgress(learnerId, resource_id, progress_percentage);
      success(res, progress);
    } catch (error) {
      next(error);
    }
  };

  public completeResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const learnerId = req.user!.id;
      const progress = await this.resourceService.completeResource(learnerId, resource_id);
      success(res, progress);
    } catch (error) {
      next(error);
    }
  };

  // ====================================================
  // TAGS
  // ====================================================

  public listTags = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resource_id } = req.params;
      const tags = await this.resourceService.listTags(resource_id);
      success(res, tags);
    } catch (error) {
      next(error);
    }
  };
}
