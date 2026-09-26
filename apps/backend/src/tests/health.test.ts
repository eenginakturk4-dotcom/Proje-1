import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('API Health Check', () => {
  it('GET /api/health should return 200 and ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.name).toBe('Shoppy REST API');
  });

  it('GET /api/unknown-route should return 404', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
