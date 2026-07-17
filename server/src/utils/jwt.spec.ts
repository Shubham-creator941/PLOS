import { generateToken, verifyToken } from './jwt';

describe('JWT Utility', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  it('should sign and verify a token', () => {
    const payload = { id: '123', role: 'learner' };
    const token = generateToken(payload, '1h');
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const decoded = verifyToken(token) as any;
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe('123');
  });

  it('should throw an error on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
});
