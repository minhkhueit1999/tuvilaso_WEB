import { describe, it, expect } from 'vitest';
import { generateTuViChart, TuViInput } from '../src/engine/tuvi/index.js';
import { solarToLunar, lunarToSolar, getCanChi } from '../src/engine/tuvi/lunar.js';
import { calculateCuc, getAmDuongNamNu } from '../src/engine/tuvi/elements.js';

describe('Tử Vi Engine - Core Calculations', () => {
  it('should accurately convert solar date to lunar date', () => {
    // Ngày 10/02/2024 là mùng 1 Tết Giáp Thìn (Âm lịch: 1/1/2024)
    const lunar = solarToLunar(10, 2, 2024);
    expect(lunar.day).toBe(1);
    expect(lunar.month).toBe(1);
    expect(lunar.year).toBe(2024);
  });

  it('should calculate accurate Can Chi for Year, Month, Day, Hour', () => {
    // Năm 2024 là Giáp Thìn
    const canChi = getCanChi(10, 2, 2024, 7, 1, 2024);
    expect(canChi.canYear).toBe('Giáp');
    expect(canChi.chiYear).toBe('Thìn');
    expect(canChi.chiHour).toBe('Thìn'); // 7h sáng là giờ Thìn (7-9h)
  });

  it('should determine Am Duong and Thuan/Nghich ly correctly', () => {
    // Giáp là Dương Can -> Dương Nam thuận lý
    const duongNam = getAmDuongNamNu('Giáp', 'male');
    expect(duongNam.label).toBe('Dương Nam');
    expect(duongNam.isThuan).toBe(true);

    // Giáp là Dương Can -> Dương Nữ nghịch lý
    const duongNu = getAmDuongNamNu('Giáp', 'female');
    expect(duongNu.label).toBe('Dương Nữ');
    expect(duongNu.isThuan).toBe(false);
  });

  it('should calculate Cuc correctly', () => {
    // Giáp Thìn, Cung Mệnh tại Dần (index 2)
    // Can Dần là Bính Dần -> Lư Trung Hỏa -> Hỏa Lục Cục
    const cuc = calculateCuc('Giáp', 2);
    expect(cuc.name).toBe('Hỏa Lục Cục');
    expect(cuc.number).toBe(6);
  });

  it('should generate complete chart data with 12 palaces and Thien Ban', () => {
    const input: TuViInput = {
      fullName: 'Tống Minh Khuê',
      gender: 'male',
      calendarType: 'solar',
      day: 28,
      month: 10,
      year: 1999,
      hour: 9,
      minute: 30,
      viewingYear: 2026
    };

    const chart = generateTuViChart(input);

    expect(chart.thienBan.fullName).toBe('Tống Minh Khuê');
    expect(chart.thienBan.canChiYear).toBe('Kỷ Mão');
    expect(chart.palaces.length).toBe(12);

    // Phải có đúng 1 cung Mệnh và 1 cung Thân
    const menhPalaces = chart.palaces.filter(p => p.isMenh);
    const thanPalaces = chart.palaces.filter(p => p.isThan);
    expect(menhPalaces.length).toBe(1);
    expect(thanPalaces.length).toBe(1);

    // Kiểm tra Tam Phương Tứ Chính được sinh đủ cho 12 cung
    expect(Object.keys(chart.tamPhuongTuChinh).length).toBe(12);

    // Kiểm tra Luận giải được sinh động
    expect(chart.interpretation.overview.generalAssessment).toBeTruthy();
    expect(chart.interpretation.palaces['Mệnh']).toBeTruthy();
    expect(chart.interpretation.luckFortune.currentDecade).toBeTruthy();
  });

  it('should support 110+ stars, Lai Nhan Cung, Tu Hoa, and 4 schools', () => {
    const input: TuViInput = {
      fullName: 'Tống Minh Khuê',
      gender: 'male',
      calendarType: 'solar',
      day: 28,
      month: 10,
      year: 1999,
      hour: 9,
      minute: 30,
      school: 'phi_tinh'
    };

    const chart = generateTuViChart(input);

    // 1. Kiểm tra tổng số sao trên lá số >= 110
    let totalStars = 0;
    for (const p of chart.palaces) {
      totalStars += p.majorStars.length + p.minorStars.length;
    }
    expect(totalStars).toBeGreaterThanOrEqual(110);

    // 2. Kiểm tra Lai Nhân Cung (Năm Kỷ Mão -> Can Kỷ -> Cung mang Can Kỷ là Lai Nhân Cung)
    const laiNhan = chart.palaces.find(p => p.isLaiNhan);
    expect(laiNhan).toBeDefined();
    expect(laiNhan?.can).toBe('Kỷ');
    expect(chart.laiNhanPalaceId).toBe(laiNhan?.id);

    // 3. Kiểm tra Bảng Phi Tinh Tứ Hóa có đủ 12 cung
    expect(Object.keys(chart.phiHoaTable).length).toBe(12);
    const menhPhi = chart.phiHoaTable[chart.palaces.find(p => p.isMenh)!.id];
    expect(menhPhi.loc).toBeDefined();
    expect(menhPhi.quyen).toBeDefined();
    expect(menhPhi.khoa).toBeDefined();
    expect(menhPhi.ky).toBeDefined();
    expect(menhPhi.summaryText).toContain('Phi Lộc');

    // 4. Kiểm tra cấu trúc 3 tầng các thuộc tính trong Palace
    const p0 = chart.palaces[0];
    expect(p0.shortCanChi).toBeTruthy();
    expect(p0.branchYinYangElement).toBeTruthy();
    expect(p0.daiHanPalaceName).toContain('ĐV.');
    expect(p0.luuNienPalaceName).toContain('LN.');
    expect(p0.luuNguyet).toBeGreaterThanOrEqual(1);
    expect(p0.luuNguyet).toBeLessThanOrEqual(12);

    // 5. Kiểm tra các trường phái
    const chartNamPhai = generateTuViChart({ ...input, school: 'nam_phai' });
    expect(chartNamPhai.school).toBe('nam_phai');
    expect(chartNamPhai.interpretation.classicPattern).toBeDefined();

    const chartBacPhai = generateTuViChart({ ...input, school: 'bac_phai' });
    expect(chartBacPhai.school).toBe('bac_phai');
    expect(chartBacPhai.interpretation.khamThienMon).toBeDefined();
  });
});

