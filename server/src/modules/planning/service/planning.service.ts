import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import { PlanningRepository } from '../repository';
import { JourneyRepository } from '../../journey/repository/journey.repository';
import {
  LearningPlanRecord,
  LearningPhaseRecord,
  LearningModuleRecord,
  LearningObjectiveRecord,
  CreatePlanRequestDTO,
  UpdatePlanRequestDTO,
  CreatePhaseRequestDTO,
  UpdatePhaseRequestDTO,
  CreateModuleRequestDTO,
  UpdateModuleRequestDTO,
  CreateObjectiveRequestDTO,
  UpdateObjectiveRequestDTO,
  PlanningProgressRecord,
  CreatePlanDTO,
  UpdatePlanDTO,
  CreatePhaseDTO,
  UpdatePhaseDTO,
  CreateModuleDTO,
  UpdateModuleDTO,
  CreateObjectiveDTO,
  UpdateObjectiveDTO
} from '../types';

export class PlanningService {
  private readonly repository = new PlanningRepository();
  private readonly journeyRepository = new JourneyRepository();

  // ---- Private Ownership Helpers ----

  private async getOwnedPlan(learnerId: string, planId: string): Promise<LearningPlanRecord> {
    const plan = await this.repository.findById(planId);
    if (!plan) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    if (plan.learner_id !== learnerId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }
    return plan;
  }

  private async getOwnedPhase(learnerId: string, phaseId: string): Promise<LearningPhaseRecord> {
    const phase = await this.repository.findPhase(phaseId);
    if (!phase) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    await this.getOwnedPlan(learnerId, phase.plan_id);
    return phase;
  }

  private async getOwnedModule(learnerId: string, moduleId: string): Promise<LearningModuleRecord> {
    const moduleRecord = await this.repository.findModule(moduleId);
    if (!moduleRecord) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    await this.getOwnedPhase(learnerId, moduleRecord.phase_id);
    return moduleRecord;
  }

  private async getOwnedObjective(learnerId: string, objectiveId: string): Promise<LearningObjectiveRecord> {
    const objective = await this.repository.findObjective(objectiveId);
    if (!objective) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    await this.getOwnedModule(learnerId, objective.module_id);
    return objective;
  }

  // ---- Plan Methods ----

  public async createPlan(learnerId: string, dto: Readonly<CreatePlanRequestDTO>): Promise<LearningPlanRecord> {
    const journey = await this.journeyRepository.findById(dto.journey_id);
    if (!journey) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    if (journey.learner_id !== learnerId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const existingPlan = await this.repository.findByJourney(dto.journey_id);
    if (existingPlan) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const planId = generateUUID();
    
    const createDto: CreatePlanDTO = {
      plan_id: planId,
      journey_id: dto.journey_id,
      learner_id: learnerId,
      title: dto.title,
      description: dto.description,
      status: 'draft'
    };

    await this.repository.createPlan(createDto);
    return this.getOwnedPlan(learnerId, planId);
  }

  public async getPlan(learnerId: string, planId: string): Promise<LearningPlanRecord> {
    return this.getOwnedPlan(learnerId, planId);
  }

  public async updatePlan(learnerId: string, planId: string, dto: Readonly<UpdatePlanRequestDTO>): Promise<LearningPlanRecord> {
    const plan = await this.getOwnedPlan(learnerId, planId);
    
    if (dto.status && dto.status !== plan.status) {
      const isValidTransition = 
        (plan.status === 'draft' && dto.status === 'active') ||
        (plan.status === 'active' && dto.status === 'completed') ||
        (plan.status === 'active' && dto.status === 'archived') ||
        (plan.status === 'completed' && dto.status === 'archived');
      if (!isValidTransition) {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
    }
    
    const updateDto: UpdatePlanDTO = {
      plan_id: plan.plan_id,
      learner_id: plan.learner_id,
      title: dto.title ?? plan.title,
      description: dto.description ?? plan.description,
      status: dto.status ?? plan.status,
      version: plan.version
    };

    await this.repository.updatePlan(updateDto);
    return this.getOwnedPlan(learnerId, planId);
  }

  public async archivePlan(learnerId: string, planId: string): Promise<LearningPlanRecord> {
    const plan = await this.getOwnedPlan(learnerId, planId);
    
    if (plan.status !== 'active' && plan.status !== 'completed') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    await this.repository.archivePlan(planId, plan.version);
    return this.getOwnedPlan(learnerId, planId);
  }

  public async completePlan(learnerId: string, planId: string): Promise<LearningPlanRecord> {
    const plan = await this.getOwnedPlan(learnerId, planId);
    
    if (plan.status !== 'active') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const progress = await this.repository.calculateProgress(planId);
    
    if (progress.total_objectives === 0 || progress.completed_objectives !== progress.total_objectives) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    await this.repository.completePlan(planId, plan.version);
    return this.getOwnedPlan(learnerId, planId);
  }

  public async getProgress(learnerId: string, planId: string): Promise<PlanningProgressRecord> {
    await this.getOwnedPlan(learnerId, planId);
    return this.repository.calculateProgress(planId);
  }

  // ---- Phase Methods ----

  public async listPhases(learnerId: string, planId: string): Promise<LearningPhaseRecord[]> {
    await this.getOwnedPlan(learnerId, planId);
    return this.repository.listPhases(planId);
  }

  public async createPhase(learnerId: string, planId: string, dto: Readonly<CreatePhaseRequestDTO>): Promise<LearningPhaseRecord> {
    await this.getOwnedPlan(learnerId, planId);
    const phaseId = generateUUID();

    const createDto: CreatePhaseDTO = {
      phase_id: phaseId,
      plan_id: planId,
      title: dto.title,
      description: dto.description,
      order_no: dto.order_no,
      status: 'locked'
    };

    await this.repository.createPhase(createDto);
    return this.getOwnedPhase(learnerId, phaseId);
  }

  public async updatePhase(learnerId: string, phaseId: string, dto: Readonly<UpdatePhaseRequestDTO>): Promise<LearningPhaseRecord> {
    const phase = await this.getOwnedPhase(learnerId, phaseId);

    if (dto.status && dto.status !== phase.status) {
      const isValidTransition = 
        (phase.status === 'locked' && dto.status === 'active') ||
        (phase.status === 'active' && dto.status === 'completed');
      if (!isValidTransition) {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
    }

    const updateDto: UpdatePhaseDTO = {
      phase_id: phase.phase_id,
      plan_id: phase.plan_id,
      title: dto.title ?? phase.title,
      description: dto.description ?? phase.description,
      order_no: dto.order_no ?? phase.order_no,
      status: dto.status ?? phase.status,
      version: phase.version
    };

    await this.repository.updatePhase(updateDto);
    return this.getOwnedPhase(learnerId, phaseId);
  }

  public async completePhase(learnerId: string, phaseId: string): Promise<LearningPhaseRecord> {
    const phase = await this.getOwnedPhase(learnerId, phaseId);
    await this.repository.completePhase(phaseId, phase.plan_id, phase.version);
    return this.getOwnedPhase(learnerId, phaseId);
  }

  public async deletePhase(learnerId: string, phaseId: string): Promise<void> {
    const phase = await this.getOwnedPhase(learnerId, phaseId);
    if (phase.status === 'completed') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }
    await this.repository.deletePhase(phaseId, phase.plan_id);
  }

  // ---- Module Methods ----

  public async listModules(learnerId: string, phaseId: string): Promise<LearningModuleRecord[]> {
    await this.getOwnedPhase(learnerId, phaseId);
    return this.repository.listModules(phaseId);
  }

  public async createModule(learnerId: string, phaseId: string, dto: Readonly<CreateModuleRequestDTO>): Promise<LearningModuleRecord> {
    await this.getOwnedPhase(learnerId, phaseId);
    const moduleId = generateUUID();

    const createDto: CreateModuleDTO = {
      module_id: moduleId,
      phase_id: phaseId,
      title: dto.title,
      description: dto.description,
      order_no: dto.order_no,
      estimated_minutes: dto.estimated_minutes,
      status: 'locked'
    };

    await this.repository.createModule(createDto);
    return this.getOwnedModule(learnerId, moduleId);
  }

  public async updateModule(learnerId: string, moduleId: string, dto: Readonly<UpdateModuleRequestDTO>): Promise<LearningModuleRecord> {
    const moduleRecord = await this.getOwnedModule(learnerId, moduleId);

    if (dto.status && dto.status !== moduleRecord.status) {
      const isValidTransition = 
        (moduleRecord.status === 'locked' && dto.status === 'active') ||
        (moduleRecord.status === 'active' && dto.status === 'completed');
      if (!isValidTransition) {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
    }

    const updateDto: UpdateModuleDTO = {
      module_id: moduleRecord.module_id,
      phase_id: moduleRecord.phase_id,
      title: dto.title ?? moduleRecord.title,
      description: dto.description ?? moduleRecord.description,
      order_no: dto.order_no ?? moduleRecord.order_no,
      estimated_minutes: dto.estimated_minutes ?? moduleRecord.estimated_minutes,
      status: dto.status ?? moduleRecord.status,
      version: moduleRecord.version
    };

    await this.repository.updateModule(updateDto);
    return this.getOwnedModule(learnerId, moduleId);
  }

  public async completeModule(learnerId: string, moduleId: string): Promise<LearningModuleRecord> {
    const moduleRecord = await this.getOwnedModule(learnerId, moduleId);
    await this.repository.completeModule(moduleId, moduleRecord.phase_id, moduleRecord.version);
    return this.getOwnedModule(learnerId, moduleId);
  }

  public async deleteModule(learnerId: string, moduleId: string): Promise<void> {
    const moduleRecord = await this.getOwnedModule(learnerId, moduleId);
    if (moduleRecord.status === 'completed') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }
    await this.repository.deleteModule(moduleId, moduleRecord.phase_id);
  }

  // ---- Objective Methods ----

  public async listObjectives(learnerId: string, moduleId: string): Promise<LearningObjectiveRecord[]> {
    await this.getOwnedModule(learnerId, moduleId);
    return this.repository.listObjectives(moduleId);
  }

  public async createObjective(learnerId: string, moduleId: string, dto: Readonly<CreateObjectiveRequestDTO>): Promise<LearningObjectiveRecord> {
    await this.getOwnedModule(learnerId, moduleId);
    const objectiveId = generateUUID();

    const createDto: CreateObjectiveDTO = {
      objective_id: objectiveId,
      module_id: moduleId,
      title: dto.title,
      description: dto.description,
      order_no: dto.order_no,
      status: 'pending'
    };

    await this.repository.createObjective(createDto);
    return this.getOwnedObjective(learnerId, objectiveId);
  }

  public async updateObjective(learnerId: string, objectiveId: string, dto: Readonly<UpdateObjectiveRequestDTO>): Promise<LearningObjectiveRecord> {
    const objective = await this.getOwnedObjective(learnerId, objectiveId);

    if (dto.status && dto.status !== objective.status) {
      const isValidTransition = 
        (objective.status === 'pending' && dto.status === 'in_progress') ||
        (objective.status === 'in_progress' && dto.status === 'completed') ||
        (objective.status === 'pending' && dto.status === 'skipped');
      if (!isValidTransition) {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
    }

    const updateDto: UpdateObjectiveDTO = {
      objective_id: objective.objective_id,
      module_id: objective.module_id,
      title: dto.title ?? objective.title,
      description: dto.description ?? objective.description,
      order_no: dto.order_no ?? objective.order_no,
      status: dto.status ?? objective.status,
      version: objective.version
    };

    await this.repository.updateObjective(updateDto);
    return this.getOwnedObjective(learnerId, objectiveId);
  }

  public async completeObjective(learnerId: string, objectiveId: string): Promise<LearningObjectiveRecord> {
    const objective = await this.getOwnedObjective(learnerId, objectiveId);
    await this.repository.completeObjective(objectiveId, objective.module_id, objective.version);
    return this.getOwnedObjective(learnerId, objectiveId);
  }

  public async deleteObjective(learnerId: string, objectiveId: string): Promise<void> {
    const objective = await this.getOwnedObjective(learnerId, objectiveId);
    if (objective.status === 'completed') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }
    await this.repository.deleteObjective(objectiveId, objective.module_id);
  }
}
