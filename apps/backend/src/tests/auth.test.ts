import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('Auth Validation & Middleware Tests', () => {
  it('POST /api/auth/register should reject empty fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });

  it('POST /api/auth/register should enforce minimum password length', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'shortpass@example.com',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 6 characters');
  });

  it('POST /api/auth/login should reject empty credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/auth/me should reject requests without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('No token provided');
  });

  it('GET /api/auth/me should reject requests with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_bogus_token_xyz');
    expect(res.status).toBe(401);
  });
});
