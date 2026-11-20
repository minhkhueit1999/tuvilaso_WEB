import { Palace, PalacePosition, TamPhuongTuChinh, Gender, ElementType, DaiVanItem, DaiVanYearlyStep } from './types.js';
import { CucInfo, CAN_NAMES, TU_HOA_TABLE } from './elements.js';

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

export const PALACES_SHORT = [
  'MỆNH', 'PHỤ', 'PHÚC', 'ĐIỀN', 'QUAN', 'NÔ', 'DI', 'TẬT', 'TÀI', 'TỬ', 'PHỐI', 'HUYNH'
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

// ==========================================
// 1. ĐẠI VẬN & ĐỒNG HẠN CHUẨN XÁC TUYỆT ĐỐI
// ==========================================
export interface DaiHanCalculationResult {
  dvDir: 1 | -1;
  dvDirectionLabel: string;
  daiHanAges: Record<number, number>;
  daiVanList: DaiVanItem[];
  activeDecade: {
    decadeIndex: number;
    dvChi: number;
    startAge: number;
    endAge: number;
    isDongHan: boolean;
    dongHanPalaceName?: string;
  };
}

export function calculateDaiHanDetails(
  cucNum: number,
  yearCan: string,
  gender: Gender,
  menhIndex: number,
  currentAge: number,
  palaceCanList: string[],
  palaceNames: string[],
  selectedDecadeIndex?: number
): DaiHanCalculationResult {
  const canIndex = CAN_NAMES.indexOf(yearCan);
  const isDuongYear = (canIndex % 2 === 0);
  const isNam = gender === 'male';
  const dvDir: 1 | -1 = ((isDuongYear && isNam) || (!isDuongYear && !isNam)) ? 1 : -1;
  const dvDirectionLabel = dvDir === 1 ? 'Thuận hành ↻' : 'Nghịch hành ↺';

  const daiHanAges: Record<number, number> = {};
  const daiVanList: DaiVanItem[] = [];

  for (let k = 0; k < 12; k++) {
    const chi = (menhIndex + k * dvDir + 120) % 12;
    const startAge = cucNum + k * 10;
    const endAge = startAge + 9;
    daiHanAges[chi] = startAge;

    const can = palaceCanList[chi];
    const branch = CHI_NAMES[chi];
    const rules = TU_HOA_TABLE[can] || { loc: '', quyen: '', khoa: '', ky: '' };

    daiVanList.push({
      decadeIndex: k,
      startAge,
      endAge,
      palaceId: chi,
      palaceName: palaceNames[chi],
      can,
      branch,
      tuHoa: {
        loc: rules.loc,
        quyen: rules.quyen,
        khoa: rules.khoa,
        ky: rules.ky
      }
    });
  }

  // Đồng Hạn: nếu age < cucNum
  const isDongHan = currentAge < cucNum;
  let dongHanPalaceName: string | undefined = undefined;
  if (isDongHan) {
    const DONG_HAN_PALACES = ['Mệnh', 'Tài Bạch', 'Tật Ách', 'Phu Thê', 'Phúc Đức', 'Quan Lộc'];
    dongHanPalaceName = DONG_HAN_PALACES[Math.min(Math.max(currentAge - 1, 0), 5)];
  }

  let activeDecadeIndex = 0;
  if (typeof selectedDecadeIndex === 'number' && selectedDecadeIndex >= 0 && selectedDecadeIndex < 12) {
    activeDecadeIndex = selectedDecadeIndex;
  } else {
    if (isDongHan) {
      activeDecadeIndex = 0;
    } else {
      const found = daiVanList.findIndex(d => currentAge >= d.startAge && currentAge <= d.endAge);
      activeDecadeIndex = found !== -1 ? found : 0;
    }
  }

  const activeItem = daiVanList[activeDecadeIndex];

  return {
    dvDir,
    dvDirectionLabel,
    daiHanAges,
    daiVanList,
    activeDecade: {
      decadeIndex: activeDecadeIndex,
      dvChi: activeItem.palaceId,
      startAge: activeItem.startAge,
      endAge: activeItem.endAge,
      isDongHan,
      dongHanPalaceName
    }
  };
}

// Wrapper tương thích ngược cho calculateDaiHan
export function calculateDaiHan(cuc: CucInfo, isThuan: boolean, menhIndex: number): Record<number, number> {
  const res: Record<number, number> = {};
  const startAge = cuc.number;
  for (let step = 0; step < 12; step++) {
    const palaceIndex = isThuan
      ? (menhIndex + step) % 12
      : (menhIndex - step + 12) % 12;
    res[palaceIndex] = startAge + step * 10;
  }
  return res;
}

// ==========================================
// 2. 12 CUNG ĐẠI VẬN (BẮT BUỘC LUÔN ĐI THUẬN +1 TỪ dvChi)
// ==========================================
export function calculateDaiHanPalaceNames(currentDecadePalaceId: number): Record<number, string> {
  const res: Record<number, string> = {};
  for (let c = 0; c < 12; c++) {
    const offset = (c - currentDecadePalaceId + 12) % 12;
    res[c] = `ĐV.${PALACES_SHORT[offset]}`;
  }
  return res;
}

// ==========================================
// 3. LƯU ĐẠI HẠN (ĐƯỜNG ĐI 10 NĂM ZICZAC NAM PHÁI)
// ==========================================
export function calculateLuuDaiHanPath(
  dvChi: number,
  dvDir: 1 | -1,
  dvStartAge: number,
  birthLunarYear: number,
  palaceCanList: string[],
  palaceNames: string[]
): DaiVanYearlyStep[] {
  const path: DaiVanYearlyStep[] = [];
  for (let offset = 0; offset < 10; offset++) {
    let ldhChi = dvChi;
    if (offset === 0) {
      ldhChi = dvChi;
    } else if (offset === 1) {
      ldhChi = (dvChi + 6) % 12;
    } else if (offset === 2) {
      ldhChi = (dvChi + 6 - dvDir + 12) % 12;
    } else {
      ldhChi = (dvChi + 6 + (offset - 3) * dvDir + 120) % 12;
    }

    const age = dvStartAge + offset;
    const year = birthLunarYear + age - 1;

    path.push({
      year,
      age,
      offset,
      chiIdx: ldhChi,
      palaceName: palaceNames[ldhChi],
      branch: CHI_NAMES[ldhChi],
      can: palaceCanList[ldhChi]
    });
  }
  return path;
}

// ==========================================
// 4. TIỂU HẠN (CHỈ THEO GIỚI TÍNH, KHÔNG PHỤ THUỘC ÂM DƯƠNG)
// ==========================================
export function calculateTieuHanInfo(
  chiYear: string,
  gender: Gender,
  age: number
): {
  tieuHanLabels: Record<number, string>;
  tieuHanChi: number;
  thStart: number;
  thDir: 1 | -1;
} {
  const chiYearIndex = CHI_NAMES.indexOf(chiYear);
  let thStart = 0;
  if ([2, 6, 10].includes(chiYearIndex)) {
    thStart = 4; // Dần, Ngọ, Tuất -> Thìn (4)
  } else if ([8, 0, 4].includes(chiYearIndex)) {
    thStart = 10; // Thân, Tý, Thìn -> Tuất (10)
  } else if ([5, 9, 1].includes(chiYearIndex)) {
    thStart = 7; // Tỵ, Dậu, Sửu -> Mùi (7)
  } else if ([11, 3, 7].includes(chiYearIndex)) {
    thStart = 1; // Hợi, Mão, Mùi -> Sửu (1)
  }

  const thDir: 1 | -1 = gender === 'male' ? 1 : -1;
  const tieuHanLabels: Record<number, string> = {};

  for (let i = 0; i < 12; i++) {
    const palaceIdx = (thStart + i * thDir + 120) % 12;
    const chiIdx = (chiYearIndex + i) % 12;
    tieuHanLabels[palaceIdx] = CHI_NAMES[chiIdx];
  }

  const step = ((age - 1) % 12 + 12) % 12;
  const tieuHanChi = (thStart + step * thDir + 120) % 12;

  return {
    tieuHanLabels,
    tieuHanChi,
    thStart,
    thDir
  };
}

// Wrapper tương thích ngược
export function calculateTieuHan(chiYear: string, gender: Gender): Record<number, string> {
  return calculateTieuHanInfo(chiYear, gender, 1).tieuHanLabels;
}

// ==========================================
// 5. LƯU NIÊN THÁI TUẾ (BẮT BUỘC LUÔN ĐI THUẬN +1 TỪ viewChi)
// ==========================================
export function calculateLuuNienPalaceNames(viewChi: number): Record<number, string> {
  const res: Record<number, string> = {};
  for (let c = 0; c < 12; c++) {
    const offset = (c - viewChi + 12) % 12;
    res[c] = `LN.${PALACES_SHORT[offset]}`;
  }
  return res;
}

// ==========================================
// 6. LƯU NGUYỆT ĐẨU QUÂN (THÁI TUẾ / TIỂU HẠN)
// ==========================================
export function calculateLuuNguyetDetailed(
  viewChi: number,
  tieuHanChi: number,
  lunarMonth: number,
  chiHourIndex: number,
  method: 'thai_tue' | 'tieu_han' = 'thai_tue'
): {
  luuNguyetMap: Record<number, number>;
  th1Chi: number;
} {
  const baseChi = method === 'thai_tue' ? viewChi : tieuHanChi;
  const th1Chi = ((baseChi - (lunarMonth - 1) + chiHourIndex) % 12 + 12) % 12;
  const luuNguyetMap: Record<number, number> = {};

  for (let m = 1; m <= 12; m++) {
    const palaceId = (th1Chi + (m - 1)) % 12;
    luuNguyetMap[palaceId] = m;
  }

  return {
    luuNguyetMap,
    th1Chi
  };
}

// Wrapper tương thích ngược
export function calculateLuuNguyet(chiYearIndex: number, lunarMonth: number, chiHourIndex: number): Record<number, number> {
  return calculateLuuNguyetDetailed(chiYearIndex, 0, lunarMonth, chiHourIndex, 'thai_tue').luuNguyetMap;
}
