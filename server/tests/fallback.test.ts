import { describe, it, expect, beforeEach } from 'vitest';
import { connectDatabase, getDatabaseStatus, saveChartRecord, getRecentChartRecords } from '../src/config/db.js';
import { memoryStore } from '../src/storage/memoryStore.js';
import { uploadImageBuffer } from '../src/services/storageService.js';
import { generateTuViChart } from '../src/engine/tuvi/index.js';

describe('Resilient Fallback Mechanisms', () => {
  beforeEach(() => {
    memoryStore.clear();
  });

  it('should activate In-Memory fallback without throwing when MONGODB_URI is empty', async () => {
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;

    const res = await connectDatabase();
    expect(res.isConnected).toBe(false);
    expect(res.mode).toBe('in-memory-fallback');

    const status = getDatabaseStatus();
    expect(status.mode).toBe('in-memory-fallback');

    // Restore
    process.env.MONGODB_URI = originalUri;
  });

  it('should successfully save and retrieve charts in fallback store', async () => {
    const chart = generateTuViChart({
      fullName: 'Test User',
      gender: 'female',
      calendarType: 'solar',
      day: 15,
      month: 8,
      year: 2000,
      hour: 6,
      minute: 0
    });

    const saved = await saveChartRecord(chart);
    expect(saved.id).toBeTruthy();

    const recent = await getRecentChartRecords(5);
    expect(recent.length).toBeGreaterThanOrEqual(1);
    expect(recent[0].thienBan.fullName).toBe('Test User');
  });

  it('should save image locally and return local path when Cloudinary is unavailable', async () => {
    const dummyBuffer = Buffer.from('fake png image content for test');
    const res = await uploadImageBuffer(dummyBuffer, 'test_chart.png');

    expect(res.mode).toBe('local-fallback');
    expect(res.secure_url).toContain('/uploads/');
    expect(res.public_id).toContain('test_chart.png');
  });
});
