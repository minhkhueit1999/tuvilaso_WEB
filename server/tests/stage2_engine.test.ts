import { describe, it, expect } from 'vitest';
import { generateTuViChart } from '../src/engine/tuvi/index.js';
import { calculateBazi } from '../src/engine/battu/index.js';
import { detectAllFormations } from '../src/engine/tuvi/radar.js';
import { calculateSynastry } from '../src/engine/tuvi/synastry.js';
import { generateLifeKline } from '../src/engine/tuvi/kline.js';
import { generatePersonalCalendar } from '../src/engine/tuvi/calendar.js';
import { NHI_HOP_PAIRS, getNhiHopPalaceId } from '../src/engine/tuvi/palaces.js';

describe('Stage 2 Engine Verification (Academic & Deep Astrology)', () => {
  const sampleInputA = {
    fullName: 'Đương Số A',
    gender: 'male' as const,
    calendarType: 'solar' as const,
    day: 22,
    month: 9,
    year: 2005,
    hour: 7,
    minute: 30,
    viewingYear: 2026
  };

  const sampleInputB = {
    fullName: 'Đối Tác B',
    gender: 'female' as const,
    calendarType: 'solar' as const,
    day: 15,
    month: 8,
    year: 2006,
    hour: 11,
    minute: 30,
    viewingYear: 2026
  };

  it('1. Bát Tự Tứ Trụ: JDN Algorithm & 5-Element 100% normalization', () => {
    const bazi = calculateBazi(2005, 9, 22, 7, 30);
    expect(bazi).toBeDefined();
    expect(bazi.yearPillar.can).toBe('Ất');
    expect(bazi.yearPillar.chi).toBe('Dậu');
    expect(bazi.dayPillar).toBeDefined();

    // Verify 5-element percentage sum is exactly 100
    const sum = bazi.elementDistribution.reduce((acc, e) => acc + e.percentage, 0);
    expect(sum).toBe(100);

    // Verify Day Master & Hỷ/Dụng Thần
    expect(bazi.nhatChu.can).toBeDefined();
    expect(bazi.hyDungThan.hyThan).toBeDefined();
    expect(bazi.hyDungThan.dungThan).toBeDefined();
  });

  it('2. Nhị Hợp (Ám Hợp): 6 Cặp Lục Hợp hoàn hảo', () => {
    // 0: Tý <-> 1: Sửu
    expect(getNhiHopPalaceId(0)).toBe(1);
    expect(getNhiHopPalaceId(1)).toBe(0);

    // 2: Dần <-> 11: Hợi
    expect(getNhiHopPalaceId(2)).toBe(11);
    expect(getNhiHopPalaceId(11)).toBe(2);

    // 3: Mão <-> 10: Tuất
    expect(getNhiHopPalaceId(3)).toBe(10);
    expect(getNhiHopPalaceId(10)).toBe(3);

    // 4: Thìn <-> 9: Dậu
    expect(getNhiHopPalaceId(4)).toBe(9);
    expect(getNhiHopPalaceId(9)).toBe(4);

    // 5: Tỵ <-> 8: Thân
    expect(getNhiHopPalaceId(5)).toBe(8);
    expect(getNhiHopPalaceId(8)).toBe(5);

    // 6: Ngọ <-> 7: Mùi
    expect(getNhiHopPalaceId(6)).toBe(7);
    expect(getNhiHopPalaceId(7)).toBe(6);
  });

  it('3. Radar 60+ Cách Cục & Cảnh Báo Trùng Phùng', () => {
    const chart = generateTuViChart(sampleInputA);
    expect(chart.radar).toBeDefined();
    expect(Array.isArray(chart.radar.formations)).toBe(true);
    expect(chart.radar.formations.length).toBeGreaterThan(0);

    const firstFormation = chart.radar.formations[0];
    expect(firstFormation.name).toBeDefined();
    expect(firstFormation.description || (firstFormation as any).meaning).toBeDefined();
    expect(Array.isArray(firstFormation.palaceIds)).toBe(true);
  });

  it('4. Hợp Bàn Phi Tinh 2 Chiều & 4 Trục Điểm Số', () => {
    const chartA = generateTuViChart(sampleInputA);
    const chartB = generateTuViChart(sampleInputB);

    const synastry = calculateSynastry(chartA, chartB, 'marriage');
    expect(synastry).toBeDefined();
    expect(synastry.totalScore).toBeGreaterThanOrEqual(0);
    expect(synastry.totalScore).toBeLessThanOrEqual(100);

    // Verify 2-way Phi Tinh
    expect(synastry.phiHoaAtoB.loc).toBeDefined();
    expect(synastry.phiHoaAtoB.quyen).toBeDefined();
    expect(synastry.phiHoaAtoB.khoa).toBeDefined();
    expect(synastry.phiHoaAtoB.ky).toBeDefined();
    expect(synastry.phiHoaAtoB.ky.xungPalaceName).toBeDefined();

    expect(synastry.phiHoaBtoA.loc).toBeDefined();
    expect(synastry.phiHoaBtoA.ky).toBeDefined();

    // Verify 4-axis scores
    expect(synastry.scores.length).toBe(4);
    synastry.scores.forEach(s => {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(s.assessment).toBeDefined();
    });

    // Verify Branch Harmony
    expect(synastry.branchHarmony.yearBranchRelation).toBeDefined();
    expect(synastry.branchHarmony.menhBranchRelation).toBeDefined();
    expect(synastry.branchHarmony.napAmRelation).toBeDefined();
  });

  it('5. Life K-Line Năng Lượng Cuộc Đời & Trend Curves', () => {
    const chart = generateTuViChart(sampleInputA);
    expect(chart.kline).toBeDefined();
    expect(chart.kline.candles.length).toBeGreaterThanOrEqual(7);

    // Validate OHLC bounds (0..100)
    chart.kline.candles.forEach((c: any) => {
      expect(c.open).toBeGreaterThanOrEqual(0);
      expect(c.open).toBeLessThanOrEqual(100);
      expect(c.close).toBeGreaterThanOrEqual(0);
      expect(c.close).toBeLessThanOrEqual(100);
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
    });

    // 4 trend curves
    expect(chart.kline.trendCurves.overall.length).toBe(chart.kline.candles.length);
    expect(chart.kline.trendCurves.wealth.length).toBe(chart.kline.candles.length);
    expect(chart.kline.trendCurves.career.length).toBe(chart.kline.candles.length);
    expect(chart.kline.trendCurves.love.length).toBe(chart.kline.candles.length);
  });

  it('6. Lịch Vận Hạn Cá Nhân Hóa (12 Tháng Lưu Nguyệt & 30 Ngày Lưu Nhật)', () => {
    const chart = generateTuViChart(sampleInputA);
    expect(chart.calendar).toBeDefined();
    expect(chart.calendar.months.length).toBe(12);

    const month1 = chart.calendar.months[0];
    expect(month1.lunarMonth).toBe(1);
    expect(month1.days.length).toBe(30);

    const day1 = month1.days[0];
    expect(day1.lunarDay).toBe(1);
    expect(day1.canChiDay).toBeDefined();
    expect(day1.rating).toBeDefined();
    expect(Array.isArray(day1.luckyHours)).toBe(true);
    expect(day1.doList.length).toBeGreaterThan(0);
    expect(day1.dontList.length).toBeGreaterThan(0);
  });
});
