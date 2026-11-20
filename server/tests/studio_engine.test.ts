import { describe, it, expect, beforeEach } from 'vitest';
import { generateTuViChart } from '../src/engine/tuvi/index.js';
import { getTuHoaTable } from '../src/engine/tuvi/stars.js';
import { generateRectificationComparison, RECTIFICATION_CRITERIA } from '../src/engine/tuvi/rectification.js';
import { memoryStore } from '../src/storage/memoryStore.js';

describe("Master's Studio - Custom Ruleset & Engine Variations", () => {
  it('1. should resolve Canh variant Tứ Hóa correctly for vn_standard, toan_thu, and bac_phai_alt', () => {
    const vnTable = getTuHoaTable({ canhVariant: 'vn_standard' });
    expect(vnTable['Canh']).toEqual({
      loc: 'Thái Dương',
      quyen: 'Vũ Khúc',
      khoa: 'Thái Âm',
      ky: 'Thiên Đồng'
    });

    const toanThuTable = getTuHoaTable({ canhVariant: 'toan_thu' });
    expect(toanThuTable['Canh']).toEqual({
      loc: 'Thái Dương',
      quyen: 'Vũ Khúc',
      khoa: 'Thiên Phủ',
      ky: 'Thiên Đồng'
    });

    const bacPhaiTable = getTuHoaTable({ canhVariant: 'bac_phai_alt' });
    expect(bacPhaiTable['Canh']).toEqual({
      loc: 'Thái Dương',
      quyen: 'Vũ Khúc',
      khoa: 'Thiên Đồng',
      ky: 'Thái Âm'
    });
  });

  it('2. should resolve Nhâm and Mậu variants Tứ Hóa correctly', () => {
    // Nhâm
    const nhamVn = getTuHoaTable({ nhamVariant: 'vn_standard' });
    expect(nhamVn['Nhâm'].khoa).toBe('Tả Phù');

    const nhamToanThu = getTuHoaTable({ nhamVariant: 'toan_thu' });
    expect(nhamToanThu['Nhâm'].khoa).toBe('Thiên Phủ');

    // Mậu
    const mauVn = getTuHoaTable({ mauVariant: 'vn_standard' });
    expect(mauVn['Mậu'].khoa).toBe('Hữu Bật');

    const mauToanThu = getTuHoaTable({ mauVariant: 'toan_thu' });
    expect(mauToanThu['Mậu'].khoa).toBe('Thái Dương');
  });

  it('3. should handle ziHourMode (Giờ Tý 23:00 - 00:00 Vãn Tý)', () => {
    // 23:30 with split_next_day: advances date to next day
    const chartNextDay = generateTuViChart({
      fullName: 'Test Vãn Tý',
      gender: 'male',
      calendarType: 'solar',
      day: 28,
      month: 10,
      year: 1999,
      hour: 23,
      minute: 30,
      ruleset: { ziHourMode: 'split_next_day' }
    });

    // 23:30 with keep_current_day: keeps original date
    const chartCurrentDay = generateTuViChart({
      fullName: 'Test Vãn Tý',
      gender: 'male',
      calendarType: 'solar',
      day: 28,
      month: 10,
      year: 1999,
      hour: 23,
      minute: 30,
      ruleset: { ziHourMode: 'keep_current_day' }
    });

    expect(chartNextDay.thienBan.solarDate).toBe('29/10/1999');
    expect(chartCurrentDay.thienBan.solarDate).toBe('28/10/1999');
  });

  it('4. should handle leapMonthMode (Tháng nhuận 3 chế độ)', () => {
    // Leap month: day 18, month 4
    const chartPrev = generateTuViChart({
      fullName: 'Nhuận Trước',
      gender: 'female',
      calendarType: 'lunar',
      day: 18,
      month: 4,
      year: 2020,
      isLeapMonth: true,
      hour: 8,
      minute: 0,
      ruleset: { leapMonthMode: 'previous_month' }
    });

    const chartNext = generateTuViChart({
      fullName: 'Nhuận Sau',
      gender: 'female',
      calendarType: 'lunar',
      day: 18,
      month: 4,
      year: 2020,
      isLeapMonth: true,
      hour: 8,
      minute: 0,
      ruleset: { leapMonthMode: 'next_month' }
    });

    // Cung Mệnh differs when effective month changes
    const menhPrev = chartPrev.palaces.find(p => p.isMenh);
    const menhNext = chartNext.palaces.find(p => p.isMenh);
    expect(menhPrev?.branch).not.toBe(menhNext?.branch);
  });

  it('5. should handle khoiVietVariant (Khôi/Việt chuẩn VN vs Bắc Phái)', () => {
    // Năm Canh Thìn (2000):
    // vn_standard: Khôi tại Ngọ (6), Việt tại Dần (2)
    // bac_phai: Khôi tại Sửu (1), Việt tại Mùi (7)
    const chartVn = generateTuViChart({
      fullName: 'Canh VN',
      gender: 'male',
      calendarType: 'solar',
      day: 15,
      month: 5,
      year: 2000,
      hour: 10,
      minute: 0,
      ruleset: { khoiVietVariant: 'vn_standard' }
    });

    const chartBacPhai = generateTuViChart({
      fullName: 'Canh Bac Phai',
      gender: 'male',
      calendarType: 'solar',
      day: 15,
      month: 5,
      year: 2000,
      hour: 10,
      minute: 0,
      ruleset: { khoiVietVariant: 'bac_phai' }
    });

    const khoiVn = chartVn.palaces.find(p => p.catStars.some(s => s.name === 'Thiên Khôi'));
    const khoiBacPhai = chartBacPhai.palaces.find(p => p.catStars.some(s => s.name === 'Thiên Khôi'));
    expect(khoiVn?.branch).toBe('Ngọ');
    expect(khoiBacPhai?.branch).toBe('Sửu');
  });
});

describe('CRM Customer Profiles & Verification Notes', () => {
  beforeEach(() => {
    memoryStore.clear();
  });

  it('6. should perform CRUD operations and search on client profiles in resilient storage', () => {
    const client = memoryStore.saveClientChart({
      fullName: 'Đoàn Văn Hậu',
      gender: 'male',
      birthDate: '1999-04-19',
      lunarDate: '04/03/Kỷ Mão',
      birthHour: 'Thân (15:30)',
      phone: '0988112233',
      tags: ['Khách VIP', 'Doanh nhân'],
      notes: 'Khách hàng tư vấn phong thủy và định hướng mở rộng kinh doanh.',
      verificationLogs: []
    });

    expect(client.id).toBeDefined();
    expect(client.fullName).toBe('Đoàn Văn Hậu');

    // Retrieve
    const fetched = memoryStore.getClientChartById(client.id);
    expect(fetched?.phone).toBe('0988112233');

    // Filter by tag
    const vipList = memoryStore.getClientCharts({ tag: 'Khách VIP' });
    expect(vipList.length).toBe(1);

    // Search by text
    const searchRes = memoryStore.getClientCharts({ search: 'Hậu' });
    expect(searchRes.length).toBe(1);

    // Add verification note
    const note = memoryStore.addVerificationNote(client.id, {
      year: 2024,
      month: 8,
      content: 'Chuyển đổi công ty thuận lợi, đúng như sao Lưu Mã tại cung Quan.',
      status: 'verified'
    });
    expect(note).toBeDefined();
    expect(note?.year).toBe(2024);

    const updatedClient = memoryStore.getClientChartById(client.id);
    expect(updatedClient?.verificationLogs.length).toBe(1);

    // Delete note
    const delNoteRes = memoryStore.deleteVerificationNote(client.id, note!.id);
    expect(delNoteRes).toBe(true);
    expect(memoryStore.getClientChartById(client.id)?.verificationLogs.length).toBe(0);

    // Delete client
    const delRes = memoryStore.deleteClientChart(client.id);
    expect(delRes).toBe(true);
    expect(memoryStore.getClientChartById(client.id)).toBeNull();
  });
});

describe('Birth Hour Rectification (Định Giờ Sinh)', () => {
  it('7. should generate 3 candidate charts and calculate dynamic matching score accurately', () => {
    const candidates = generateRectificationComparison(
      {
        fullName: 'Nguyễn Văn A',
        gender: 'male',
        calendarType: 'solar',
        day: 28,
        month: 10,
        year: 1999,
        viewingYear: 2026,
        school: 'tong_hop'
      },
      [3, 4, 5], // Mão (3), Thìn (4), Tỵ (5)
      ['app_conguoc', 'car_tech', 'per_calm']
    );

    expect(candidates.length).toBe(3);
    for (const cand of candidates) {
      expect(cand.keyPalaces.menh).toBeDefined();
      expect(cand.keyPalaces.quanLoc).toBeDefined();
      expect(cand.matchPercent).toBeGreaterThanOrEqual(0);
      expect(cand.matchPercent).toBeLessThanOrEqual(100);
      expect(cand.hourName).toBeDefined();
    }
  });
});
