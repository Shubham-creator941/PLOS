import { LearnerRepository } from '../repository/learner.repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  OnboardLearnerDTO,
  UpdateProfileRequestDTO,
  LearnerProfile,
  OnboardResponse,
  UpdateLearnerDTO,
  UpdateJourneyDTO,
  PurposeProfile,
  MemoryProfile
} from '../types/learner.types';

export class LearnerService {
  private repository: LearnerRepository;

  constructor() {
    this.repository = new LearnerRepository();
  }

  public async onboardLearner(dto: OnboardLearnerDTO): Promise<OnboardResponse> {
    const profile = await this.repository.findProfile(dto.learner_id);
    if (!profile) {
      throw new Error(MESSAGES.LEARNER_NOT_FOUND);
    }

    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    if (!dto.domain || dto.domain.trim().length === 0) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (new Date(dto.target_date).getTime() <= now.getTime()) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const activeJourney = await this.repository.findActiveJourney(dto.learner_id);
    if (activeJourney) {
      throw new Error(MESSAGES.ACTIVE_JOURNEY_EXISTS);
    }

    const journeyId = generateUUID();

    await this.repository.createJourney({
      journey_id: journeyId,
      learner_id: dto.learner_id,
      title: dto.title,
      domain: dto.domain,
      target_date: dto.target_date,
      purpose_profile: dto.purpose_profile,
      memory_profile: dto.memory_profile
    });

    const journey = await this.repository.findActiveJourney(dto.learner_id);
    const updatedProfile = await this.repository.findProfile(dto.learner_id);

    if (!journey) {
      throw new Error(MESSAGES.JOURNEY_RETRIEVAL_FAILED);
    }
    
    if (!updatedProfile) {
      throw new Error(MESSAGES.PROFILE_RETRIEVAL_FAILED);
    }

    return {
      learner: updatedProfile,
      journey
    };
  }

  public async getProfile(learnerId: string): Promise<LearnerProfile> {
    const profile = await this.repository.findProfile(learnerId);
    if (!profile) {
      throw new Error(MESSAGES.LEARNER_NOT_FOUND);
    }
    return profile;
  }

  public async updateProfile(dto: UpdateProfileRequestDTO): Promise<LearnerProfile> {
    const profile = await this.repository.findProfile(dto.learner_id);
    if (!profile) {
      throw new Error(MESSAGES.LEARNER_NOT_FOUND);
    }

    const updateLearnerDto: UpdateLearnerDTO = {
      learner_id: dto.learner_id,
      full_name: dto.full_name !== undefined ? dto.full_name : profile.full_name,
      avatar_url: dto.avatar_url !== undefined ? dto.avatar_url : profile.avatar_url,
      timezone: dto.timezone !== undefined ? dto.timezone : profile.timezone,
    };

    await this.repository.updateProfile(updateLearnerDto);

    if (dto.purpose_profile || dto.memory_profile) {
      await this.updateJourneyProfiles(dto.learner_id, dto.purpose_profile, dto.memory_profile);
    }

    const updatedProfile = await this.repository.findProfile(dto.learner_id);
    if (!updatedProfile) {
      throw new Error(MESSAGES.PROFILE_RETRIEVAL_FAILED);
    }
    
    return updatedProfile;
  }

  private async updateJourneyProfiles(
    learnerId: string, 
    purposeProfileUpdate?: Partial<PurposeProfile>, 
    memoryProfileUpdate?: Partial<MemoryProfile>
  ): Promise<void> {
    const journey = await this.repository.findActiveJourney(learnerId);
    if (!journey) return;

    const updateJourneyDto: UpdateJourneyDTO = {
      journey_id: journey.journey_id,
      learner_id: journey.learner_id,
      title: journey.title,
      domain: journey.domain,
      target_date: journey.target_date,
      purpose_profile: {
        ...journey.purpose_profile,
        ...(purposeProfileUpdate || {})
      },
      memory_profile: {
        ...journey.memory_profile,
        ...(memoryProfileUpdate || {})
      }
    };

    await this.repository.updateJourney(updateJourneyDto);
  }
}
