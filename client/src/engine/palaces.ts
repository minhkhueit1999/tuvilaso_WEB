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

export const BRANCH_YINYANG_ELEMENT: string[] = [
  '+Thuỷ', // Tý: Dương Thủy
  '-Thổ',  // Sửu: Âm Thổ
  '+Mộc',  // Dần: Dương Mộc
  '-Mộc',  // Mão: Âm Mộc
  '+Thổ',  // Thìn: Dương Thổ
  '-Hoả',  // Tỵ: Âm Hỏa
  '+Hoả',  // Ngọ: Dương Hỏa
  '-Thổ',  // Mùi: Âm Thổ
  '+Kim',  // Thân: Dương Kim
  '-Kim',  // Dậu: Âm Kim
  '+Thổ',  // Tuất: Dương Thổ
  '-Thuỷ'  // Hợi: Âm Thủy
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
      palaceName: '',
      branch: CHI_NAMES[i],
      tamHop: [(i + 4) % 12, (i + 8) % 12],
      xungChieu: (i + 6) % 12,
      nhiHop: NHI_HOP_MAP[i]
    };
  }
  return res;
}

// Tính tuổi Đại Vận (10 năm một vận)
export function calculateDaiHan(cuc: CucInfo, isThuan: boolean, menhIndex: number): Record<number, number> {
  const res: Record<number, number> = {};
  const startAge = cuc.number; // 2 (Thủy), 3 (Mộc), 4 (Kim), 5 (Thổ), 6 (Hỏa)

  for (let step = 0; step < 12; step++) {
    const palaceIndex = isThuan
      ? (menhIndex + step) % 12
      : (menhIndex - step + 12) % 12;
    res[palaceIndex] = startAge + step * 10;
  }
  return res;
}

// Tính Tiểu Hạn theo Chi năm sinh và giới tính
export function calculateTieuHan(chiYear: string, gender: Gender): Record<number, string> {
  const chiYearIndex = CHI_NAMES.indexOf(chiYear);
  let startBranchIndex = 0;

  if ([2, 6, 10].includes(chiYearIndex)) {
    // Dần Ngọ Tuất -> Khởi tại Thìn (4)
    startBranchIndex = 4;
  } else if ([8, 0, 4].includes(chiYearIndex)) {
    // Thân Tý Thìn -> Khởi tại Tuất (10)
    startBranchIndex = 10;
  } else if ([5, 9, 1].includes(chiYearIndex)) {
    // Tỵ Dậu Sửu -> Khởi tại Mùi (7)
    startBranchIndex = 7;
  } else if ([11, 3, 7].includes(chiYearIndex)) {
    // Hợi Mão Mùi -> Khởi tại Sửu (1)
    startBranchIndex = 1;
  }

  const isNam = gender === 'male';
  const res: Record<number, string> = {};

  for (let i = 0; i < 12; i++) {
    const branchForPalace = isNam
      ? (startBranchIndex + i) % 12
      : (startBranchIndex - i + 12) % 12;
    res[i] = CHI_NAMES[branchForPalace];
  }
  return res;
}

// Tính tên Cung Đại Vận (ĐV.MỆNH, ĐV.PHỤ, ĐV.PHỐI...)
export function calculateDaiHanPalaceNames(menhIndex: number, currentDecadePalaceId: number): Record<number, string> {
  const SHORT_NAMES = [
    'MỆNH', 'PHỤ', 'PHÚC', 'ĐIỀN', 'QUAN', 'NÔ', 'DI', 'TẬT', 'TÀI', 'TỬ', 'PHỐI', 'HUYNH'
  ];
  const res: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const offset = (i - currentDecadePalaceId + 12) % 12;
    res[i] = `ĐV.${SHORT_NAMES[offset]}`;
  }
  return res;
}

// Tính tên Cung Lưu Niên (LN.MỆNH, LN.HUYNH...) theo Chi năm xem hạn
export function calculateLuuNienPalaceNames(menhIndex: number, chiViewingYearIndex: number): Record<number, string> {
  const SHORT_NAMES = [
    'MỆNH', 'PHỤ', 'PHÚC', 'ĐIỀN', 'QUAN', 'NÔ', 'DI', 'TẬT', 'TÀI', 'TỬ', 'PHỐI', 'HUYNH'
  ];
  const res: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const offset = (i - chiViewingYearIndex + 12) % 12;
    res[i] = `LN.${SHORT_NAMES[offset]}`;
  }
  return res;
}

// Tính vị trí Đẩu Quân và 12 tháng Lưu Nguyệt
export function calculateLuuNguyet(chiYearIndex: number, lunarMonth: number, chiHourIndex: number): Record<number, number> {
  // Đẩu Quân: Khởi Thái Tuế (chiYearIndex), đếm nghịch đến tháng sinh, từ đó coi là giờ Tý đếm thuận đến giờ sinh:
  const dauQuanPos = ((chiYearIndex - (lunarMonth - 1) + 12) + chiHourIndex) % 12;
  const res: Record<number, number> = {};
  for (let m = 1; m <= 12; m++) {
    const palaceId = (dauQuanPos + (m - 1)) % 12;
    res[palaceId] = m; // Tháng m
  }
  return res;
}
