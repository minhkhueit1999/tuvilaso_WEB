import { Palace, PalacePosition, TamPhuongTuChinh, Gender, ElementType } from './types.js';
import { CucInfo } from './elements.js';

export const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const PALACE_NAMES = [
  'Mệnh',
  'Phụ Mẫu',
  'Phúc Đức',
  'Điền Trạch',
  'Quan Lộc',
  'Nô Bộc',
  'Thiên Di',
  'Tật Ách',
  'Tài Bạch',
  'Tử Tức',
  'Phu Thê',
  'Huynh Đệ'
];

export const PALACE_ELEMENTS: ElementType[] = [
  'Thuy', // Tý
  'Tho',  // Sửu
  'Moc',  // Dần
  'Moc',  // Mão
  'Tho',  // Thìn
  'Hoa',  // Tỵ
  'Hoa',  // Ngọ
  'Tho',  // Mùi
  'Kim',  // Thân
  'Kim',  // Dậu
  'Tho',  // Tuất
  'Thuy'  // Hợi
];

// Layout 4x4 chuẩn Tử Vi truyền thống:
// Hàng 0: Tỵ (0,0), Ngọ (0,1), Mùi (0,2), Thân (0,3)
// Hàng 1: Thìn (1,0) ... Dậu (1,3)
// Hàng 2: Mão (2,0) ... Tuất (2,3)
// Hàng 3: Dần (3,0), Sửu (3,1), Tý (3,2), Hợi (3,3)
export const PALACE_GRID_POSITIONS: Record<number, PalacePosition> = {
  0: { row: 3, col: 2 }, // Tý
  1: { row: 3, col: 1 }, // Sửu
  2: { row: 3, col: 0 }, // Dần
  3: { row: 2, col: 0 }, // Mão
  4: { row: 1, col: 0 }, // Thìn
  5: { row: 0, col: 0 }, // Tỵ
  6: { row: 0, col: 1 }, // Ngọ
  7: { row: 0, col: 2 }, // Mùi
  8: { row: 0, col: 3 }, // Thân
  9: { row: 1, col: 3 }, // Dậu
  10: { row: 2, col: 3 }, // Tuất
  11: { row: 3, col: 3 }  // Hợi
};

export function getMenhThanPosition(lunarMonth: number, chiHourIndex: number): { menhIndex: number; thanIndex: number } {
  // Khởi từ Dần (index 2) là tháng 1, đếm thuận đến tháng sinh:
  const monthPos = (2 + (lunarMonth - 1)) % 12;

  // Từ monthPos coi là giờ Tý (chiHourIndex = 0):
  // Cung Mệnh: đếm nghịch đến giờ sinh
  const menhIndex = (monthPos - chiHourIndex + 12) % 12;

  // Cung Thân: đếm thuận đến giờ sinh
  const thanIndex = (monthPos + chiHourIndex) % 12;

  return { menhIndex, thanIndex };
}

// Tìm Can của từng cung theo Can Năm (Ngũ Hổ Độn)
export function getPalaceCanList(canYear: string): string[] {
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const canYearIndex = CAN.indexOf(canYear);
  // Can của cung Dần (index 2)
  const canDanIndex = (canYearIndex % 5) * 2 + 2;

  const result: string[] = new Array(12);
  for (let i = 0; i < 12; i++) {
    // Khoảng cách từ Dần (index 2) tới i (thuận chiều)
    const diff = (i - 2 + 12) % 12;
    result[i] = CAN[(canDanIndex + diff) % 10];
  }
  return result;
}

export function buildTamPhuongTuChinh(): Record<number, TamPhuongTuChinh> {
  const NHI_HOP_MAP: Record<number, number> = {
    0: 1, 1: 0,   // Tý - Sửu
    2: 11, 11: 2, // Dần - Hợi
    3: 10, 10: 3, // Mão - Tuất
    4: 9, 9: 4,   // Thìn - Dậu
    5: 8, 8: 5,   // Tỵ - Thân
    6: 7, 7: 6    // Ngọ - Mùi
  };

  const res: Record<number, TamPhuongTuChinh> = {};
  for (let i = 0; i < 12; i++) {
    res[i] = {
      palaceId: i,
      palaceName: '', // Sẽ cập nhật sau khi map tên cung
      branch: CHI_NAMES[i],
      xungChieu: (i + 6) % 12,
      tamHop: [(i + 4) % 12, (i + 8) % 12],
      nhiHop: NHI_HOP_MAP[i]
    };
  }
  return res;
}

// Tính Đại Hạn (10 năm một cung)
export function calculateDaiHan(menhIndex: number, cuc: CucInfo, isThuan: boolean): Record<number, number> {
  const daiHanMap: Record<number, number> = {};
  const startAge = cuc.number;

  for (let step = 0; step < 12; step++) {
    const palaceIndex = isThuan
      ? (menhIndex + step) % 12
      : (menhIndex - step + 12) % 12;
    daiHanMap[palaceIndex] = startAge + step * 10;
  }

  return daiHanMap;
}

// Tính Tiểu Hạn (1 năm một cung)
export function calculateTieuHan(chiYear: string, gender: Gender): Record<number, string> {
  const chiYearIndex = CHI_NAMES.indexOf(chiYear);
  // Xác định cung khởi Tiểu Hạn theo tam hợp chi năm:
  // Dần Ngọ Tuất (2, 6, 10) -> khởi Thìn (4)
  // Thân Tý Thìn (8, 0, 4) -> khởi Tuất (10)
  // Tỵ Dậu Sửu (5, 9, 1) -> khởi Mùi (7)
  // Hợi Mão Mùi (11, 3, 7) -> khởi Sửu (1)
  let startChiIndex = 4;
  if ([8, 0, 4].includes(chiYearIndex)) startChiIndex = 10;
  else if ([5, 9, 1].includes(chiYearIndex)) startChiIndex = 7;
  else if ([11, 3, 7].includes(chiYearIndex)) startChiIndex = 1;

  const tieuHanMap: Record<number, string> = {};
  const isMale = gender === 'male';

  for (let i = 0; i < 12; i++) {
    const palaceIndex = isMale
      ? (startChiIndex + i) % 12
      : (startChiIndex - i + 12) % 12;
    tieuHanMap[palaceIndex] = CHI_NAMES[i];
  }

  return tieuHanMap;
}
