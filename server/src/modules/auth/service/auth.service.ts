import { AuthRepository } from '../repository/auth.repository';
import { hashPassword, comparePassword } from '../../../utils/password';
import { generateToken } from '../../../utils/jwt';
import { generateUUID } from '../../../utils/uuid';
import { 
  UserRecord, 
  CreateUserDTO, 
  LoginDTO, 
  RegisterDTO, 
  AuthenticatedLearner, 
  AuthResponse 
} from '../types/auth.types';

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  public async register(dto: RegisterDTO): Promise<AuthResponse> {
    const email = this.normalizeEmail(dto.email);
    
    const exists = await this.repository.emailExists(email);
    if (exists) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);
    const learnerId = generateUUID();

    const createUserDto: CreateUserDTO = {
      learner_id: learnerId,
      full_name: dto.full_name,
      email,
      password_hash: passwordHash,
      avatar_url: dto.avatar_url,
      timezone: dto.timezone,
    };

    await this.repository.createUser(createUserDto);

    const token = this.generateAuthToken(learnerId);
    
    const userRecord = await this.repository.findById(learnerId);
    if (!userRecord) {
      throw new Error('Failed to retrieve newly created learner');
    }

    return {
      learner: this.buildAuthenticatedLearner(userRecord),
      token
    };
  }

  public async login(dto: LoginDTO): Promise<AuthResponse> {
    const email = this.normalizeEmail(dto.email);
    
    const userRecord = await this.repository.findByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid email or password');
    }

    if (!dto.password) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await comparePassword(dto.password, userRecord.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    await this.repository.touchUser(userRecord.learner_id);

    const token = this.generateAuthToken(userRecord.learner_id);

    return {
      learner: this.buildAuthenticatedLearner(userRecord),
      token
    };
  }

  public async getProfile(learnerId: string): Promise<AuthenticatedLearner> {
    const userRecord = await this.repository.findById(learnerId);
    if (!userRecord) {
      throw new Error('Learner not found');
    }

    return this.buildAuthenticatedLearner(userRecord);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private generateAuthToken(learnerId: string): string {
    return generateToken({ id: learnerId });
  }

  private buildAuthenticatedLearner(record: UserRecord): AuthenticatedLearner {
    const { password_hash, deleted_at, version, ...safeLearner } = record;
    return safeLearner;
  }
}
