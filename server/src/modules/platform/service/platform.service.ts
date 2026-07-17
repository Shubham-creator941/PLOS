import { PlatformRepository } from '../repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import type {
  PlatformSettingRecord,
  FeatureFlagRecord,
  PlatformAnnouncementRecord,
  SystemHealthSnapshotRecord,
  SetPlatformSettingRequestDTO,
  SetFeatureFlagRequestDTO,
  CreateAnnouncementRequestDTO,
  UpdateAnnouncementRequestDTO,
  CreateSystemHealthSnapshotDTO
} from '../types';

export class PlatformService {
  private readonly platformRepo = new PlatformRepository();

  // ====================================================
  // PLATFORM SETTINGS
  // ====================================================

  public async getSetting(settingKey: string): Promise<PlatformSettingRecord> {
    const setting = await this.platformRepo.findSettingByKey(settingKey);
    if (!setting) throw new Error(MESSAGES.NOT_FOUND || 'Setting not found');
    return setting;
  }

  public async listSettings(publicOnly: boolean = false): Promise<PlatformSettingRecord[]> {
    return this.platformRepo.listSettings(publicOnly);
  }

  public async createSetting(dto: SetPlatformSettingRequestDTO): Promise<PlatformSettingRecord> {
    const existing = await this.platformRepo.findSettingByKey(dto.setting_key);
    if (existing) {
      throw new Error('Setting key already exists');
    }

    return this.platformRepo.createSetting({
      setting_id: generateUUID(),
      setting_key: dto.setting_key,
      setting_value: dto.setting_value,
      description: dto.description,
      is_public: dto.is_public
    });
  }

  public async updateSetting(settingKey: string, currentVersion: number, dto: Partial<SetPlatformSettingRequestDTO>): Promise<PlatformSettingRecord> {
    await this.getSetting(settingKey);

    return this.platformRepo.updateSetting(settingKey, currentVersion, {
      setting_value: dto.setting_value,
      description: dto.description,
      is_public: dto.is_public
    });
  }

  // ====================================================
  // FEATURE FLAGS
  // ====================================================

  public async getFeatureFlag(featureName: string): Promise<FeatureFlagRecord> {
    const flag = await this.platformRepo.findFeatureFlagByName(featureName);
    if (!flag) throw new Error(MESSAGES.NOT_FOUND || 'Feature flag not found');
    return flag;
  }

  public async listFeatureFlags(): Promise<FeatureFlagRecord[]> {
    return this.platformRepo.listFeatureFlags();
  }

  public async setFeatureFlag(dto: SetFeatureFlagRequestDTO): Promise<FeatureFlagRecord> {
    const existing = await this.platformRepo.findFeatureFlagByName(dto.feature_name);
    
    if (existing) {
      return this.platformRepo.updateFeatureFlag(existing.feature_name, existing.version, {
        enabled: dto.enabled,
        description: dto.description
      });
    }

    return this.platformRepo.createFeatureFlag({
      feature_flag_id: generateUUID(),
      feature_name: dto.feature_name,
      enabled: dto.enabled,
      description: dto.description
    });
  }

  public async enableFeature(featureName: string, currentVersion: number): Promise<FeatureFlagRecord> {
    return this.platformRepo.updateFeatureFlag(featureName, currentVersion, { enabled: true });
  }

  public async disableFeature(featureName: string, currentVersion: number): Promise<FeatureFlagRecord> {
    return this.platformRepo.updateFeatureFlag(featureName, currentVersion, { enabled: false });
  }

  // ====================================================
  // ANNOUNCEMENTS
  // ====================================================

  public async getAnnouncement(announcementId: string): Promise<PlatformAnnouncementRecord> {
    const announcement = await this.platformRepo.findAnnouncement(announcementId);
    if (!announcement) throw new Error(MESSAGES.NOT_FOUND || 'Announcement not found');
    return announcement;
  }

  public async listAnnouncements(activeOnly: boolean = false): Promise<PlatformAnnouncementRecord[]> {
    return this.platformRepo.listAnnouncements(activeOnly);
  }

  public async createAnnouncement(creatorId: string, dto: CreateAnnouncementRequestDTO): Promise<PlatformAnnouncementRecord> {
    return this.platformRepo.createAnnouncement({
      announcement_id: generateUUID(),
      title: dto.title,
      message: dto.message,
      status: dto.status || 'draft',
      starts_at: dto.starts_at ? new Date(dto.starts_at) : null,
      expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
      created_by: creatorId
    });
  }

  public async updateAnnouncement(announcementId: string, currentVersion: number, dto: UpdateAnnouncementRequestDTO): Promise<PlatformAnnouncementRecord> {
    await this.getAnnouncement(announcementId);

    return this.platformRepo.updateAnnouncement(announcementId, currentVersion, {
      title: dto.title,
      message: dto.message,
      status: dto.status,
      starts_at: dto.starts_at === null ? null : (dto.starts_at ? new Date(dto.starts_at) : undefined),
      expires_at: dto.expires_at === null ? null : (dto.expires_at ? new Date(dto.expires_at) : undefined)
    });
  }

  public async publishAnnouncement(announcementId: string, currentVersion: number): Promise<PlatformAnnouncementRecord> {
    return this.platformRepo.updateAnnouncement(announcementId, currentVersion, { status: 'published' });
  }

  public async archiveAnnouncement(announcementId: string, currentVersion: number): Promise<PlatformAnnouncementRecord> {
    return this.platformRepo.updateAnnouncement(announcementId, currentVersion, { status: 'archived' });
  }

  // ====================================================
  // SYSTEM HEALTH SNAPSHOTS
  // ====================================================

  public async recordSystemSnapshot(dto: Omit<CreateSystemHealthSnapshotDTO, 'snapshot_id'>): Promise<SystemHealthSnapshotRecord> {
    return this.platformRepo.createSystemHealthSnapshot({
      ...dto,
      snapshot_id: generateUUID()
    });
  }

  public async getLatestHealth(): Promise<SystemHealthSnapshotRecord> {
    const health = await this.platformRepo.getLatestSystemHealthSnapshot();
    if (!health) {
      throw new Error(MESSAGES.NOT_FOUND || 'No system health snapshot found');
    }
    return health;
  }
}
