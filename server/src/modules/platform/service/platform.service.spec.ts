import { PlatformService } from './platform.service';
import { PlatformRepository } from '../repository/platform.repository';
import * as uuidUtils from '../../../utils/uuid';

jest.mock('../repository/platform.repository');
jest.mock('../../../utils/uuid');

describe('PlatformService', () => {
  let service: PlatformService;
  let repoMock: jest.Mocked<PlatformRepository>;

  beforeEach(() => {
    repoMock = new PlatformRepository() as jest.Mocked<PlatformRepository>;
    service = new PlatformService();
    (service as any).platformRepo = repoMock;
  });

  describe('createSetting', () => {
    it('should create a new setting with a generated UUID', async () => {
      (uuidUtils.generateUUID as jest.Mock).mockReturnValue('mock_uuid');
      repoMock.createSetting.mockResolvedValue({} as any);

      const dto = { setting_key: 'THEME', setting_value: 'dark', description: '', is_public: true };
      const result = await service.createSetting(dto);

      expect(repoMock.createSetting).toHaveBeenCalledWith({
        setting_id: 'mock_uuid',
        setting_key: 'THEME',
        setting_value: 'dark',
        description: '',
        is_public: true,
        version: 1
      });
      expect(result).toHaveProperty('setting_id', 'mock_uuid');
    });
  });

  describe('updateSetting', () => {
    it('should update a setting using versioning', async () => {
      repoMock.findSettingByKey.mockResolvedValue({} as any);
      repoMock.updateSetting.mockResolvedValue({} as any);

      const dto = { setting_value: 'light', description: '', is_public: false, version: 1 };
      const result = await service.updateSetting('THEME', dto.version, dto);

      expect(repoMock.updateSetting).toHaveBeenCalledWith('THEME', dto.version, expect.objectContaining({
        setting_value: 'light',
        description: '',
        is_public: false
      }));
      expect(result).toBeDefined();
    });
  });

  describe('recordSystemSnapshot', () => {
    it('should record system health with UUID', async () => {
      (uuidUtils.generateUUID as jest.Mock).mockReturnValue('snapshot_uuid');
      repoMock.createSystemHealthSnapshot.mockResolvedValue({} as any);

      const dto = {
        active_sessions: 10,
        active_learners: 5,
        running_plans: 2,
        pending_notifications: 0,
        failed_logins: 0,
        system_status: 'healthy' as const,
        recorded_at: new Date()
      };
      const result = await service.recordSystemSnapshot(dto);

      expect(repoMock.createSystemHealthSnapshot).toHaveBeenCalledWith(expect.objectContaining({
        snapshot_id: 'snapshot_uuid'
      }));
      expect(result).toHaveProperty('snapshot_id', 'snapshot_uuid');
    });
  });
});
