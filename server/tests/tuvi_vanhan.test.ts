import { describe, it, expect } from 'vitest';
import {
  calculateDaiHanDetails,
  calculateDaiHanPalaceNames,
  calculateLuuDaiHanPath,
  calculateTieuHanInfo,
  calculateLuuNienPalaceNames,
  calculateLuuNguyetDetailed,
  CHI_NAMES,
  PALACE_NAMES
} from '../src/engine/tuvi/palaces.js';
import { generateTuViChart } from '../src/engine/tuvi/index.js';

describe('Kiểm Chứng Toán Học Đường Đi Vận Hạn (Chuẩn Hóa Tuyệt Đối)', () => {
  const dummyPalaceCans = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất'];
  const dummyPalaceNames = PALACE_NAMES;

  // Ca 1: Dương Nam (1990 Canh Ngọ, Nam)
  it('Ca 1: Dương Nam (Canh Ngọ) -> Đại Vận đi THUẬN, Tiểu Hạn khởi Thìn đi THUẬN, ĐV và LN đi THUẬN', () => {
    const menhIndex = 2; // Dần
    const cucNum = 4; // Kim Tứ Cục
    const currentAge = 35; // 2024 - 1990 + 1 = 35

    const dh = calculateDaiHanDetails(cucNum, 'Canh', 'male', menhIndex, currentAge, dummyPalaceCans, dummyPalaceNames);
    expect(dh.dvDir).toBe(1); // Thuận
    expect(dh.dvDirectionLabel).toContain('Thuận');

    // Cung thứ k=0..11: chi = (menhIndex + k * 1) % 12
    expect(dh.daiVanList[0].palaceId).toBe(2); // Dần
    expect(dh.daiVanList[1].palaceId).toBe(3); // Mão
    expect(dh.daiVanList[2].palaceId).toBe(4); // Thìn

    // Tiểu Hạn cho Ngọ (Tam hợp Dần-Ngọ-Tuất)
    const th = calculateTieuHanInfo('Ngọ', 'male', currentAge);
    expect(th.thStart).toBe(4); // Khởi tại Thìn (4)
    expect(th.thDir).toBe(1); // Nam luôn đi THUẬN

    // ĐV.* luôn đi THUẬN từ dvChi
    const dvChi = dh.activeDecade.dvChi;
    const dvPalaces = calculateDaiHanPalaceNames(dvChi);
    expect(dvPalaces[dvChi]).toBe('ĐV.MỆNH');
    expect(dvPalaces[(dvChi + 1) % 12]).toBe('ĐV.PHỤ');
    expect(dvPalaces[(dvChi + 2) % 12]).toBe('ĐV.PHÚC');

    // LN.* luôn đi THUẬN từ viewChi
    const viewChi = 6; // Ngọ
    const lnPalaces = calculateLuuNienPalaceNames(viewChi);
    expect(lnPalaces[viewChi]).toBe('LN.MỆNH');
    expect(lnPalaces[(viewChi + 1) % 12]).toBe('LN.PHỤ');
    expect(lnPalaces[(viewChi + 2) % 12]).toBe('LN.PHÚC');
  });

  // Ca 2: Âm Nam (2005 Ất Dậu, Nam)
  it('Ca 2: Âm Nam (Ất Dậu) -> Đại Vận đi NGHỊCH, Tiểu Hạn khởi Mùi vẫn đi THUẬN, ĐV và LN đi THUẬN', () => {
    const menhIndex = 8; // Thân
    const cucNum = 2; // Thủy Nhị Cục
    const currentAge = 20;

    const dh = calculateDaiHanDetails(cucNum, 'Ất', 'male', menhIndex, currentAge, dummyPalaceCans, dummyPalaceNames);
    expect(dh.dvDir).toBe(-1); // Nghịch
    expect(dh.dvDirectionLabel).toContain('Nghịch');

    // Cung k=0..11: chi = (8 - k + 120) % 12
    expect(dh.daiVanList[0].palaceId).toBe(8); // Thân
    expect(dh.daiVanList[1].palaceId).toBe(7); // Mùi
    expect(dh.daiVanList[2].palaceId).toBe(6); // Ngọ

    // Tiểu Hạn cho Dậu (Tam hợp Tỵ-Dậu-Sửu)
    const th = calculateTieuHanInfo('Dậu', 'male', currentAge);
    expect(th.thStart).toBe(7); // Khởi tại Mùi (7)
    expect(th.thDir).toBe(1); // Nam VẪN ĐI THUẬN dù là Âm Nam

    // ĐV.* VẪN BẮT BUỘC ĐI THUẬN (+1) từ dvChi
    const dvChi = dh.activeDecade.dvChi;
    const dvPalaces = calculateDaiHanPalaceNames(dvChi);
    expect(dvPalaces[dvChi]).toBe('ĐV.MỆNH');
    expect(dvPalaces[(dvChi + 1) % 12]).toBe('ĐV.PHỤ');
  });

  // Ca 3: Dương Nữ (1998 Mậu Dần, Nữ)
  it('Ca 3: Dương Nữ (Mậu Dần) -> Đại Vận đi NGHỊCH, Tiểu Hạn khởi Thìn đi NGHỊCH, ĐV và LN đi THUẬN', () => {
    const menhIndex = 4; // Thìn
    const cucNum = 3;
    const currentAge = 27;

    const dh = calculateDaiHanDetails(cucNum, 'Mậu', 'female', menhIndex, currentAge, dummyPalaceCans, dummyPalaceNames);
    expect(dh.dvDir).toBe(-1); // Dương Nữ đi Nghịch

    // Tiểu Hạn cho Dần (Tam hợp Dần-Ngọ-Tuất)
    const th = calculateTieuHanInfo('Dần', 'female', currentAge);
    expect(th.thStart).toBe(4); // Khởi tại Thìn
    expect(th.thDir).toBe(-1); // Nữ đi NGHỊCH

    // ĐV.* và LN.* luôn đi THUẬN
    const dvChi = dh.activeDecade.dvChi;
    const dvPalaces = calculateDaiHanPalaceNames(dvChi);
    expect(dvPalaces[dvChi]).toBe('ĐV.MỆNH');
    expect(dvPalaces[(dvChi + 1) % 12]).toBe('ĐV.PHỤ');
  });

  // Ca 4: Âm Nữ (2005 Ất Dậu, Nữ)
  it('Ca 4: Âm Nữ (Ất Dậu) -> Đại Vận đi THUẬN, Tiểu Hạn khởi Mùi đi NGHỊCH, ĐV và LN đi THUẬN', () => {
    const menhIndex = 1; // Sửu
    const cucNum = 5;
    const currentAge = 20;

    const dh = calculateDaiHanDetails(cucNum, 'Ất', 'female', menhIndex, currentAge, dummyPalaceCans, dummyPalaceNames);
    expect(dh.dvDir).toBe(1); // Âm Nữ đi THUẬN

    // Tiểu Hạn cho Dậu
    const th = calculateTieuHanInfo('Dậu', 'female', currentAge);
    expect(th.thStart).toBe(7); // Khởi tại Mùi
    expect(th.thDir).toBe(-1); // Nữ VẪN ĐI NGHỊCH dù là Âm Nữ

    // ĐV.* luôn đi THUẬN
    const dvChi = dh.activeDecade.dvChi;
    const dvPalaces = calculateDaiHanPalaceNames(dvChi);
    expect(dvPalaces[dvChi]).toBe('ĐV.MỆNH');
    expect(dvPalaces[(dvChi + 1) % 12]).toBe('ĐV.PHỤ');
  });

  // Ca 5: Lộ trình 10 năm Lưu Đại Hạn (Ziczac chuẩn Nam Phái)
  it('Ca 5: Lộ trình 10 năm Lưu Đại Hạn chuẩn xác (Năm 2 xung chiếu, Năm 3 lùi 1, Năm 10 quay về dvChi)', () => {
    const dvChi = 4; // Thìn
    const birthLunarYear = 1999;
    const dvStartAge = 25;

    // Test trường hợp dvDir = +1 (Thuận)
    const pathThuan = calculateLuuDaiHanPath(dvChi, 1, dvStartAge, birthLunarYear, dummyPalaceCans, dummyPalaceNames);
    expect(pathThuan).toHaveLength(10);
    expect(pathThuan[0].chiIdx).toBe(dvChi); // Năm 1: 4 (Thìn)
    expect(pathThuan[1].chiIdx).toBe((dvChi + 6) % 12); // Năm 2: 10 (Tuất - xung chiếu)
    expect(pathThuan[2].chiIdx).toBe((dvChi + 6 - 1 + 12) % 12); // Năm 3: 9 (Dậu - lùi 1 cung)
    expect(pathThuan[3].chiIdx).toBe((dvChi + 6 + 0) % 12); // Năm 4: 10 (Tuất)
    expect(pathThuan[4].chiIdx).toBe((dvChi + 6 + 1) % 12); // Năm 5: 11 (Hợi)
    expect(pathThuan[5].chiIdx).toBe((dvChi + 6 + 2) % 12); // Năm 6: 0 (Tý)
    expect(pathThuan[6].chiIdx).toBe((dvChi + 6 + 3) % 12); // Năm 7: 1 (Sửu)
    expect(pathThuan[7].chiIdx).toBe((dvChi + 6 + 4) % 12); // Năm 8: 2 (Dần)
    expect(pathThuan[8].chiIdx).toBe((dvChi + 6 + 5) % 12); // Năm 9: 3 (Mão)
    expect(pathThuan[9].chiIdx).toBe(dvChi); // Năm 10: 4 (Thìn - quay đúng về dvChi)

    // Test trường hợp dvDir = -1 (Nghịch)
    const pathNghich = calculateLuuDaiHanPath(dvChi, -1, dvStartAge, birthLunarYear, dummyPalaceCans, dummyPalaceNames);
    expect(pathNghich).toHaveLength(10);
    expect(pathNghich[0].chiIdx).toBe(dvChi); // Năm 1: 4
    expect(pathNghich[1].chiIdx).toBe((dvChi + 6) % 12); // Năm 2: 10
    expect(pathNghich[2].chiIdx).toBe((dvChi + 6 - (-1) + 12) % 12); // Năm 3: 11
    expect(pathNghich[3].chiIdx).toBe((dvChi + 6 + 0) % 12); // Năm 4: 10
    expect(pathNghich[9].chiIdx).toBe(dvChi); // Năm 10: quay đúng về dvChi (4)
  });

  // Ca 6: Lưu Nguyệt Đẩu Quân (Thái Tuế và Tiểu Hạn)
  it('Ca 6: Lưu Nguyệt Đẩu Quân hỗ trợ cả 2 chế độ và 12 tháng luôn đi THUẬN', () => {
    const viewChi = 6; // Ngọ
    const tieuHanChi = 10; // Tuất
    const lunarMonth = 9;
    const chiHourIndex = 4; // Thìn

    // Mode 'thai_tue'
    const lnThaiTue = calculateLuuNguyetDetailed(viewChi, tieuHanChi, lunarMonth, chiHourIndex, 'thai_tue');
    expect(Object.keys(lnThaiTue.luuNguyetMap)).toHaveLength(12);

    // Tháng m đi thuận: tháng 2 phải là (th1 + 1) % 12
    const th1 = lnThaiTue.th1Chi;
    expect(lnThaiTue.luuNguyetMap[th1]).toBe(1);
    expect(lnThaiTue.luuNguyetMap[(th1 + 1) % 12]).toBe(2);
    expect(lnThaiTue.luuNguyetMap[(th1 + 11) % 12]).toBe(12);

    // Mode 'tieu_han'
    const lnTieuHan = calculateLuuNguyetDetailed(viewChi, tieuHanChi, lunarMonth, chiHourIndex, 'tieu_han');
    const th1TieuHan = lnTieuHan.th1Chi;
    expect(lnTieuHan.luuNguyetMap[th1TieuHan]).toBe(1);
    expect(lnTieuHan.luuNguyetMap[(th1TieuHan + 1) % 12]).toBe(2);
  });

  it('Ca 7: Tích hợp đầy đủ vào generateTuViChart và trả về cấu trúc vanHan hoàn chỉnh', () => {
    const chart = generateTuViChart({
      fullName: 'Tống Minh Khuê',
      gender: 'male',
      calendarType: 'solar',
      day: 28,
      month: 10,
      year: 1999,
      hour: 7,
      minute: 30,
      viewingYear: 2026
    });

    expect(chart.vanHan).toBeDefined();
    expect(chart.vanHan.daiVanList).toHaveLength(12);
    expect(chart.vanHan.daiVanYearlyPath).toHaveLength(10);
    expect(chart.vanHan.luuNguyetTable).toHaveLength(12);
    expect(chart.vanHan.chongCung.relationships.length).toBeGreaterThan(0);

    // Kiểm tra 4 cờ vận hạn trên cung
    const dvPalace = chart.palaces.find(p => p.isDV);
    const ldhPalace = chart.palaces.find(p => p.isLDH);
    const thPalace = chart.palaces.find(p => p.isTieuHan);
    const lnPalace = chart.palaces.find(p => p.isLN);

    expect(dvPalace).toBeDefined();
    expect(ldhPalace).toBeDefined();
    expect(thPalace).toBeDefined();
    expect(lnPalace).toBeDefined();

    // Kiểm tra Tứ Hóa Tầng Vận trên sao
    const allStars = chart.palaces.flatMap(p => [...p.majorStars, ...p.catStars, ...p.satStars]);
    const hasDVTuHoa = allStars.some(s => s.dvTuHoa !== undefined);
    const hasLNTuHoa = allStars.some(s => s.lnTuHoa !== undefined);
    expect(hasDVTuHoa).toBe(true);
    expect(hasLNTuHoa).toBe(true);
  });
});
