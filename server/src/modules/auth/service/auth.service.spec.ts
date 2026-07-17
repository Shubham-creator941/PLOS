import { AuthService } from './auth.service';
import { AuthRepository } from '../repository/auth.repository';
import * as hashUtils from '../../../utils/password';
import * as jwtUtils from '../../../utils/jwt';
import * as uuidUtils from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';

jest.mock('../repository/auth.repository');
jest.mock('../../../utils/password');
jest.mock('../../../utils/jwt');
jest.mock('../../../utils/uuid');

describe('AuthService', () => {
  let service: AuthService;
  let repoMock: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    repoMock = new AuthRepository() as jest.Mocked<AuthRepository>;
    service = new AuthService();
    (service as any).authRepo = repoMock;
  });

  describe('register', () => {
    it('should create a new learner if email does not exist', async () => {
      repoMock.findByEmail.mockResolvedValue(null);
      (hashUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (uuidUtils.generateUUID as jest.Mock).mockReturnValue('mock_uuid');

      const dto = { email: 'test@example.com', password: 'Password123!', full_name: 'Test User' };
      const result = await service.register(dto);

      expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(hashUtils.hashPassword).toHaveBeenCalledWith(dto.password);
      expect(repoMock.createUser).toHaveBeenCalledWith(expect.objectContaining({
        learner_id: 'mock_uuid',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      }));
      expect(result).toHaveProperty('learner_id', 'mock_uuid');
    });

    it('should throw an error if email exists', async () => {
      repoMock.findByEmail.mockResolvedValue({ learner_id: 'existing' } as any);

      const dto = { email: 'test@example.com', password: 'Password123!', full_name: 'Test User' };
      await expect(service.register(dto)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const mockLearner = { learner_id: 'mock_uuid', password_hash: 'hashed' };
      repoMock.findByEmail.mockResolvedValue(mockLearner as any);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('mock_token');

      const dto = { email: 'test@example.com', password: 'Password123!' };
      const result = await service.login(dto);

      expect(result).toHaveProperty('token', 'mock_token');
    });

    it('should throw an error if credentials are invalid', async () => {
      repoMock.findByEmail.mockResolvedValue(null);

      const dto = { email: 'test@example.com', password: 'Password123!' };
      await expect(service.login(dto)).rejects.toThrow();
    });
  });
});
