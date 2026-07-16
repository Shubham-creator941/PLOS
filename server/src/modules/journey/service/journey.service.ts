import { JourneyRepository } from '../repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  JourneyRecord,
  MilestoneRecord,
  UpdateJourneyDTO,
  UpdateMilestoneDTO,
  JourneyProgressRecord,
  CreateMilestoneDTO,
  UpdateJourneyRequestDTO,
  CreateMilestoneRequestDTO,
  UpdateMilestoneRequestDTO
} from '../types';

export class JourneyService {
  private repository: JourneyRepository;

  constructor() {
    this.repository = new JourneyRepository();
  }

  /**
   * TODO: Temporary implementation.
   * The planning module should eventually provide proper plan resolution.
   * For now, we assume a 1:1 mapping where plan_id === journey_id.
   */
  private resolvePlanId(journeyId: string): string {
    return journeyId;
  }

  private async reloadJourney(id: string): Promise<JourneyRecord> {
    const updated = await this.repository.findById(id);
    if (!updated) throw new Error(MESSAGES.NOT_FOUND);
    return updated;
  }

  private async reloadMilestone(id: string): Promise<MilestoneRecord> {
    const updated = await this.repository.findMilestone(id);
    if (!updated) throw new Error(MESSAGES.NOT_FOUND);
    return updated;
  }

  private async getOwnedMilestone(
    learnerId: string,
    milestoneId: string
  ): Promise<MilestoneRecord> {
    const journey = await this.getActiveJourney(learnerId); 
    const expectedPlanId = this.resolvePlanId(journey.journey_id);
    
    // TODO: Future Ready (Sprint 5)
    // Once Planning is introduced, ownership verification belongs inside the repository:
    // findOwnedMilestone(planId, milestoneId)
    const existing = await this.repository.findMilestone(milestoneId);
    if (!existing) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (existing.plan_id !== expectedPlanId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    return existing;
  }

  public async getActiveJourney(learnerId: string): Promise<JourneyRecord> {
    const journey = await this.repository.findActiveByLearner(learnerId);
    if (!journey) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    return journey;
  }

  public async updateJourney(
    learnerId: string, 
    dto: Readonly<UpdateJourneyRequestDTO>
  ): Promise<JourneyRecord> {
    const existing = await this.getActiveJourney(learnerId);

    if (existing.status === 'completed' || existing.status === 'abandoned') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const completeDto: UpdateJourneyDTO = {
      journey_id: existing.journey_id,
      learner_id: existing.learner_id,
      title: dto.title ?? existing.title,
      domain: dto.domain ?? existing.domain,
      purpose_profile: dto.purpose_profile ?? existing.purpose_profile,
      memory_profile: dto.memory_profile ?? existing.memory_profile,
      target_date: dto.target_date ?? existing.target_date,
      version: existing.version
    };

    await this.repository.updateJourney(completeDto);
    return this.reloadJourney(existing.journey_id);
  }

  public async pauseJourney(learnerId: string): Promise<JourneyRecord> {
    const journey = await this.getActiveJourney(learnerId);
    await this.repository.pauseJourney(journey.journey_id, journey.version);
    return this.reloadJourney(journey.journey_id);
  }

  public async resumeJourney(learnerId: string): Promise<JourneyRecord> {
    const journey = await this.repository.findCurrentByLearner(learnerId);
    if (!journey) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    
    if (journey.status !== 'paused') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    await this.repository.resumeJourney(journey.journey_id, journey.version);
    return this.reloadJourney(journey.journey_id);
  }

  public async completeJourney(learnerId: string): Promise<JourneyRecord> {
    const journey = await this.getActiveJourney(learnerId);
    
    const progress = await this.repository.calculateProgress(journey.journey_id);
    if (
      progress.total_milestones === 0 || 
      progress.completed_milestones !== progress.total_milestones
    ) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    await this.repository.completeJourney(journey.journey_id, journey.version);
    return this.reloadJourney(journey.journey_id);
  }

  public async archiveJourney(learnerId: string): Promise<JourneyRecord> {
    const journey = await this.repository.findCurrentByLearner(learnerId);
    if (!journey) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (journey.status === 'completed') {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    await this.repository.archiveJourney(journey.journey_id, journey.version);
    return this.reloadJourney(journey.journey_id);
  }

  public async getProgress(learnerId: string): Promise<JourneyProgressRecord> {
    const journey = await this.getActiveJourney(learnerId);
    return this.repository.calculateProgress(journey.journey_id);
  }

  public async listMilestones(learnerId: string): Promise<MilestoneRecord[]> {
    const journey = await this.getActiveJourney(learnerId);
    const planId = this.resolvePlanId(journey.journey_id);
    return this.repository.listMilestones(planId);
  }

  public async createMilestone(
    learnerId: string, 
    dto: Readonly<CreateMilestoneRequestDTO>
  ): Promise<MilestoneRecord[]> {
    const journey = await this.getActiveJourney(learnerId);
    const planId = this.resolvePlanId(journey.journey_id);

    const existingMilestones = await this.repository.listMilestones(planId);
    let nextOrderNo = 0;
    if (existingMilestones.length > 0) {
      nextOrderNo = Math.max(...existingMilestones.map(m => m.order_no)) + 1;
    }

    const completeDto: CreateMilestoneDTO = {
      milestone_id: generateUUID(),
      plan_id: planId,
      title: dto.title,
      description: dto.description,
      deadline: dto.deadline,
      difficulty: dto.difficulty,
      priority: dto.priority,
      order_no: nextOrderNo
    };

    await this.repository.createMilestone(completeDto);
    return this.repository.listMilestones(planId);
  }

  public async updateMilestone(
    learnerId: string, 
    milestoneId: string, 
    dto: Readonly<UpdateMilestoneRequestDTO>
  ): Promise<MilestoneRecord> {
    const existing = await this.getOwnedMilestone(learnerId, milestoneId);

    const completeDto: UpdateMilestoneDTO = {
      milestone_id: existing.milestone_id,
      plan_id: existing.plan_id,
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      deadline: dto.deadline ?? existing.deadline,
      difficulty: dto.difficulty ?? existing.difficulty,
      priority: dto.priority ?? existing.priority,
      status: dto.status ?? existing.status,
      order_no: dto.order_no ?? existing.order_no
    };

    await this.repository.updateMilestone(completeDto);
    return this.reloadMilestone(milestoneId);
  }

  public async completeMilestone(learnerId: string, milestoneId: string): Promise<MilestoneRecord> {
    const existing = await this.getOwnedMilestone(learnerId, milestoneId);

    await this.repository.completeMilestone(milestoneId, existing.plan_id);
    return this.reloadMilestone(milestoneId);
  }
}
