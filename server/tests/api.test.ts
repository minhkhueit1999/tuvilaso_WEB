import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Server API Endpoints', () => {
  it('GET /api/health should return 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBeDefined();
    expect(res.body.storage).toBeDefined();
  });

  it('POST /api/laso/generate should validate and return complete chart', async () => {
    const res = await request(app)
      .post('/api/laso/generate')
      .send({
        fullName: 'Nguyễn Văn A',
        gender: 'male',
        calendarType: 'solar',
        day: 1,
        month: 1,
        year: 1995,
        hour: 10,
        minute: 0,
        viewingYear: 2026
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.thienBan.fullName).toBe('Nguyễn Văn A');
    expect(res.body.data.palaces.length).toBe(12);
    expect(res.body.data.interpretation).toBeDefined();
  });

  it('GET /api/laso/history should return array of charts', async () => {
    const res = await request(app).get('/api/laso/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/laso/upload-image should upload base64 image and return url', async () => {
    const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const res = await request(app)
      .post('/api/laso/upload-image')
      .send({
        imageBase64: fakeBase64,
        filename: 'pixel.png'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toBeDefined();
  });
});
