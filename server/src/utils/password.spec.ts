import { hashPassword, comparePassword } from './password';

describe('Password Utility', () => {
  it('should hash a password and verify it', async () => {
    const password = 'mySecretPassword123!';
    const hashed = await hashPassword(password);
    
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(password);
    
    const isValid = await comparePassword(password, hashed);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hashed = await hashPassword('correctPassword');
    const isValid = await comparePassword('wrongPassword', hashed);
    expect(isValid).toBe(false);
  });
});
