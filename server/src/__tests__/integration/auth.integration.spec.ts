/**
 * auth.integration.spec.ts
 * Integration tests for POST /api/auth/register, /login, /profile, /logout
 *
 * Mocks:
 *   - AuthRepository (no database)
 *   - No HTTP-level mocking — requests travel the full Express stack.
 */

process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';

import { buildApp } from './helpers/testApp';

// ── Mock the repository so no DB is required ────────────────────────────────
jest.mock('../../modules/auth/repository/auth.repository');
// Also mock dotenv & mysql2 which are eagerly loaded on import
jest.mock('../../database/mysql', () => ({ pool: {} }));
jest.mock('../../database/query', () => ({
  query: jest.fn()
}));

import { AuthRepository } from '../../modules/auth/repository/auth.repository';

const RepoMock = AuthRepository as jest.MockedClass<typeof AuthRepository>;

const EXISTING_USER = {
  learner_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
  full_name: 'Existing User',
  email: 'existing@example.com',
  password_hash: '$2b$10$fakehashedpassword1234567890123456789012',
  avatar_url: null,
  timezone: 'UTC',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted_at: null,
  version: 1
};

describe('Auth Integration', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();

    // Default: email does NOT exist
    RepoMock.prototype.emailExists.mockResolvedValue(false);
    RepoMock.prototype.findByEmail.mockResolvedValue(null);
    RepoMock.prototype.createUser.mockResolvedValue(EXISTING_USER.learner_id);
    RepoMock.prototype.findById.mockResolvedValue(EXISTING_USER);
    RepoMock.prototype.touchUser.mockResolvedValue(undefined);
  });

  // ──────────────────────────────────────────────────────────────
  // POST /api/auth/register
  // ──────────────────────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('201 – creates a new learner and returns token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        full_name: 'New User',
        email: 'new@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.learner).toBeDefined();
    });

    it('422 – validation: missing email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        full_name: 'Test',
        password: 'Password123!'
      });
      expect(res.status).toBe(422);
    });

    it('422 – validation: weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        full_name: 'Test',
        email: 'test@example.com',
        password: '123'
      });
      expect(res.status).toBe(422);
    });

    it('409 – duplicate email', async () => {
      RepoMock.prototype.emailExists.mockResolvedValue(true);

      const res = await request(app).post('/api/auth/register').send({
        full_name: 'Dup User',
        email: 'existing@example.com',
        password: 'Password123!'
      });
      expect(res.status).toBe(409);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // POST /api/auth/login
  // ──────────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('200 – returns token on valid credentials', async () => {
      // Use a real bcrypt hash for "Password123!"
      const bcrypt = await import('bcrypt');
      const hash = await bcrypt.hash('Password123!', 1);
      RepoMock.prototype.findByEmail.mockResolvedValue({
        ...EXISTING_USER,
        password_hash: hash
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'existing@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('401 – unknown email', async () => {
      RepoMock.prototype.findByEmail.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: 'Password123!'
      });
      expect(res.status).toBe(401);
    });

    it('401 – wrong password', async () => {
      const bcrypt = await import('bcrypt');
      const hash = await bcrypt.hash('correct-password', 1);
      RepoMock.prototype.findByEmail.mockResolvedValue({
        ...EXISTING_USER,
        password_hash: hash
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'existing@example.com',
        password: 'wrong-password'
      });
      expect(res.status).toBe(401);
    });

    it('422 – validation: missing password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
      expect(res.status).toBe(422);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // GET /api/auth/profile
  // ──────────────────────────────────────────────────────────────
  describe('GET /api/auth/profile', () => {
    it('401 – no token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });

    it('401 – malformed token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer bad.token.here');
      expect(res.status).toBe(401);
    });

    it('200 – valid token returns profile', async () => {
      const { makeAuthToken } = await import('./helpers/auth.helper');
      const token = makeAuthToken(EXISTING_USER.learner_id);

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body.data.learner_id).toBe(EXISTING_USER.learner_id);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // POST /api/auth/logout
  // ──────────────────────────────────────────────────────────────
  describe('POST /api/auth/logout', () => {
    it('401 – no token', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });

    it('200 – valid token', async () => {
      const { makeAuthToken } = await import('./helpers/auth.helper');
      const token = makeAuthToken(EXISTING_USER.learner_id);

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', token);

      expect(res.status).toBe(200);
    });
  });
});
