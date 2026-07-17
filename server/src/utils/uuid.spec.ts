import { generateUUID } from './uuid';

describe('UUID Utility', () => {
  it('should generate a valid v4 UUID', () => {
    const uuid = generateUUID();
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBe(36);
  });
});
