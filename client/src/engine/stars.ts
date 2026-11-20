import { Star, StarBrightness, ElementType, Gender, PhiHoaDetail, PhiHoaTarget } from './types.js';
import { CucInfo, TU_HOA_TABLE } from './elements.js';
export { TU_HOA_TABLE };
import { CHI_NAMES, PALACE_NAMES } from './palaces.js';

// 14 Chính Tinh: Âm Dương & Ngũ Hành
export const MAJOR_STARS_INFO: Record<string, { element: ElementType; yinYang: '+' | '-'; defaultName: string }> = {
  'Tử Vi': { element: 'Tho', yinYang: '+', defaultName: 'Tử Vi' },
  'Liêm Trinh': { element: 'Hoa', yinYang: '-', defaultName: 'Liêm Trinh' },
  'Thiên Đồng': { element: 'Thuy', yinYang: '+', defaultName: 'Thiên Đồng' },
  'Vũ Khúc': { element: 'Kim', yinYang: '-', defaultName: 'Vũ Khúc' },
  'Thái Dương': { element: 'Hoa', yinYang: '+', defaultName: 'Thái Dương' },
  'Thiên Cơ': { element: 'Moc', yinYang: '-', defaultName: 'Thiên Cơ' },
  'Thiên Phủ': { element: 'Tho', yinYang: '+', defaultName: 'Thiên Phủ' },
  'Thái Âm': { element: 'Thuy', yinYang: '-', defaultName: 'Thái Âm' },
  'Tham Lang': { element: 'Thuy', yinYang: '+', defaultName: 'Tham Lang' },
  'Cự Môn': { element: 'Thuy', yinYang: '-', defaultName: 'Cự Môn' },
  'Thiên Tướng': { element: 'Thuy', yinYang: '+', defaultName: 'Thiên Tướng' },
  'Thiên Lương': { element: 'Moc', yinYang: '+', defaultName: 'Thiên Lương' },
  'Thất Sát': { element: 'Kim', yinYang: '+', defaultName: 'Thất Sát' },
  'Phá Quân': { element: 'Thuy', yinYang: '-', defaultName: 'Phá Quân' }
};

// Bảng Miếu (M) / Vượng (V) / Đắc (Đ) / Bình (B) / Hãm (H) tại 12 Cung (0: Tý .. 11: Hợi)
export const MAJOR_STARS_BRIGHTNESS: Record<string, StarBrightness[]> = {
  //                  Tý   Sửu  Dần  Mão  Thìn Tỵ   Ngọ  Mùi  Thân Dậu  Tuất Hợi
  'Tử Vi':      ['B', 'D', 'M', 'B', 'V', 'D', 'M', 'D', 'M', 'B', 'V', 'B'],
  'Liêm Trinh': ['H', 'D', 'V', 'H', 'M', 'H', 'V', 'D', 'M', 'H', 'M', 'H'],
  'Thiên Đồng': ['V', 'H', 'M', 'D', 'H', 'H', 'H', 'H', 'M', 'H', 'B', 'D'],
  'Vũ Khúc':    ['V', 'M', 'V', 'D', 'M', 'B', 'V', 'M', 'V', 'D', 'M', 'H'],
  'Thái Dương': ['H', 'H', 'V', 'M', 'V', 'V', 'M', 'D', 'B', 'H', 'H', 'H'],
  'Thiên Cơ':   ['M', 'D', 'V', 'M', 'B', 'H', 'V', 'D', 'V', 'M', 'B', 'H'],
  'Thiên Phủ':  ['M', 'M', 'M', 'B', 'M', 'D', 'V', 'M', 'D', 'B', 'M', 'D'],
  'Thái Âm':    ['M', 'M', 'H', 'H', 'H', 'H', 'H', 'B', 'D', 'V', 'M', 'M'],
  'Tham Lang':  ['H', 'M', 'D', 'H', 'M', 'H', 'H', 'M', 'D', 'H', 'M', 'H'],
  'Cự Môn':     ['V', 'H', 'V', 'M', 'H', 'H', 'V', 'H', 'H', 'M', 'H', 'V'],
  'Thiên Tướng':['V', 'M', 'M', 'H', 'V', 'D', 'V', 'D', 'M', 'H', 'V', 'D'],
  'Thiên Lương':['V', 'V', 'M', 'M', 'V', 'H', 'M', 'V', 'H', 'H', 'M', 'H'],
  'Thất Sát':   ['M', 'D', 'M', 'H', 'H', 'M', 'M', 'D', 'M', 'H', 'H', 'M'],
  'Phá Quân':   ['M', 'V', 'H', 'H', 'M', 'H', 'M', 'V', 'H', 'H', 'M', 'H']
};

// Tìm vị trí Tử Vi theo Cục và Ngày sinh
export function findTuViPosition(lunarDay: number, cuc: CucInfo): number {
  const C = cuc.number;
  const D = lunarDay;

  if (D % C === 0) {
    const Q = D / C;
    return (1 + Q) % 12;
  }

  const X = C - (D % C);
  const Q = (D + X) / C;

  if (X % 2 !== 0) {
    return (1 + Q - X + 120) % 12;
  } else {
    return (1 + Q + X) % 12;
  }
}

// Bảng Tứ Hóa Thập Thiên Can chuẩn học thuật


export function placeMajorStars(tuViPos: number, canYear: string): Record<number, Star[]> {
  const result: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) result[i] = [];

  const tvStars: [string, number][] = [
    ['Tử Vi', tuViPos],
    ['Thiên Cơ', (tuViPos - 1 + 12) % 12],
    ['Thái Dương', (tuViPos - 3 + 12) % 12],
    ['Vũ Khúc', (tuViPos - 4 + 12) % 12],
    ['Thiên Đồng', (tuViPos - 5 + 12) % 12],
    ['Liêm Trinh', (tuViPos - 8 + 12) % 12]
  ];

  const tpPos = (4 - tuViPos + 12) % 12;
  const tpStars: [string, number][] = [
    ['Thiên Phủ', tpPos],
    ['Thái Âm', (tpPos + 1) % 12],
    ['Tham Lang', (tpPos + 2) % 12],
    ['Cự Môn', (tpPos + 3) % 12],
    ['Thiên Tướng', (tpPos + 4) % 12],
    ['Thiên Lương', (tpPos + 5) % 12],
    ['Thất Sát', (tpPos + 6) % 12],
    ['Phá Quân', (tpPos + 10) % 12]
  ];

  const allMajor = [...tvStars, ...tpStars];
  const tuHoaRules = TU_HOA_TABLE[canYear];

  for (const [name, pos] of allMajor) {
    const info = MAJOR_STARS_INFO[name];
    const brightness = MAJOR_STARS_BRIGHTNESS[name]?.[pos] || 'B';

    let tuHoa: Star['tuHoa'];
    let sinhNienHoa: Star['sinhNienHoa'];
    if (tuHoaRules) {
      if (tuHoaRules.loc === name) { tuHoa = 'Lộc'; sinhNienHoa = 'A'; }
      else if (tuHoaRules.quyen === name) { tuHoa = 'Quyền'; sinhNienHoa = 'B'; }
      else if (tuHoaRules.khoa === name) { tuHoa = 'Khoa'; sinhNienHoa = 'C'; }
      else if (tuHoaRules.ky === name) { tuHoa = 'Kỵ'; sinhNienHoa = 'D'; }
    }

    result[pos].push({
      name,
      element: info.element,
      yinYang: info.yinYang,
      brightness,
      category: 'chinh_tinh',
      weight: 'bold',
      side: 'major',
      tuHoa,
      sinhNienHoa
    });
  }

  return result;
}

// Chủ Mệnh theo Chi năm sinh
export function getChuMenh(chiYear: string): string {
  const map: Record<string, string> = {
    'Tý': 'Tham Lang',
    'Sửu': 'Cự Môn',
    'Dần': 'Lộc Tồn',
    'Mão': 'Văn Khúc',
    'Thìn': 'Liêm Trinh',
    'Tỵ': 'Vũ Khúc',
    'Ngọ': 'Phá Quân',
    'Mùi': 'Vũ Khúc',
    'Thân': 'Liêm Trinh',
    'Dậu': 'Văn Khúc',
    'Tuất': 'Lộc Tồn',
    'Hợi': 'Cự Môn'
  };
  return map[chiYear] || 'Tham Lang';
}

// Chủ Thân theo Chi năm sinh
export function getChuThan(chiYear: string): string {
  const map: Record<string, string> = {
    'Tý': 'Linh Tinh',
    'Ngọ': 'Linh Tinh',
    'Sửu': 'Thiên Tướng',
    'Mùi': 'Thiên Tướng',
    'Dần': 'Thiên Lương',
    'Thân': 'Thiên Lương',
    'Mão': 'Thiên Đồng',
    'Dậu': 'Thiên Đồng',
    'Thìn': 'Văn Xương',
    'Tuất': 'Văn Xương',
    'Tỵ': 'Thiên Cơ',
    'Hợi': 'Thiên Cơ'
  };
  return map[chiYear] || 'Thiên Tướng';
}

// An toàn bộ 110+ Phụ Tinh, Vòng Bác Sĩ, Thái Tuế, Tràng Sinh, Lưu Niên
export function placeMinorStars(
  canYear: string,
  chiYear: string,
  lunarMonth: number,
  lunarDay: number,
  chiHourIndex: number,
  cuc: CucInfo,
  isThuan: boolean,
  viewingYear = 2026,
  menhIndex = 0,
  thanIndex = 0
): {
  catStars: Record<number, Star[]>;
  satStars: Record<number, Star[]>;
  minorStars: Record<number, Star[]>;
  tuan: number[];
  triet: number[];
} {
  const catStars: Record<number, Star[]> = {};
  const satStars: Record<number, Star[]> = {};
  const minorStars: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) {
    catStars[i] = [];
    satStars[i] = [];
    minorStars[i] = [];
  }

  const addCat = (
    pos: number,
    name: string,
    element: ElementType,
    category: Star['category'] = 'phu_tinh_cat',
    brightness?: StarBrightness,
    tuHoa?: Star['tuHoa'],
    weight: 'bold' | 'normal' = 'normal',
    sinhNienHoa?: 'A' | 'B' | 'C' | 'D'
  ) => {
    const star: Star = { name, element, category, brightness, tuHoa, weight, side: 'left', sinhNienHoa };
    catStars[pos].push(star);
    minorStars[pos].push(star);
  };

  const addSat = (
    pos: number,
    name: string,
    element: ElementType,
    category: Star['category'] = 'phu_tinh_hung',
    brightness?: StarBrightness,
    isLuuNien = false,
    weight: 'bold' | 'normal' = 'normal',
    tuHoa?: Star['tuHoa'],
    sinhNienHoa?: 'A' | 'B' | 'C' | 'D'
  ) => {
    const star: Star = { name, element, category, brightness, isLuuNien, weight, side: 'right', tuHoa, sinhNienHoa };
    satStars[pos].push(star);
    minorStars[pos].push(star);
  };

  const chiYearIndex = CHI_NAMES.indexOf(chiYear);
  const tuHoaRules = TU_HOA_TABLE[canYear];

  // 1. TẢ PHÙ, HỮU BẬT (theo tháng) - Cát Đậm
  const posTaPhu = (4 + (lunarMonth - 1)) % 12;
  const posHuuBat = (10 - (lunarMonth - 1) + 12) % 12;
  addCat(posTaPhu, 'Tả Phù', 'Tho', 'phu_tinh_cat', 'D', undefined, 'bold', tuHoaRules?.khoa === 'Tả Phù' ? 'C' : undefined);
  addCat(posHuuBat, 'Hữu Bật', 'Tho', 'phu_tinh_cat', 'D', tuHoaRules?.khoa === 'Hữu Bật' ? 'Khoa' : undefined, 'bold', tuHoaRules?.khoa === 'Hữu Bật' ? 'C' : undefined);

  // 2. VĂN XƯƠNG, VĂN KHÚC (theo giờ) - Cát Đậm
  const posVanXuong = (10 - chiHourIndex + 12) % 12;
  const posVanKhuc = (4 + chiHourIndex) % 12;
  const tuHoaXuong = tuHoaRules?.khoa === 'Văn Xương' ? 'Khoa' : (tuHoaRules?.ky === 'Văn Xương' ? 'Kỵ' : undefined);
  const snXuong = tuHoaRules?.khoa === 'Văn Xương' ? 'C' : (tuHoaRules?.ky === 'Văn Xương' ? 'D' : undefined);
  const tuHoaKhuc = tuHoaRules?.khoa === 'Văn Khúc' ? 'Khoa' : (tuHoaRules?.ky === 'Văn Khúc' ? 'Kỵ' : undefined);
  const snKhuc = tuHoaRules?.khoa === 'Văn Khúc' ? 'C' : (tuHoaRules?.ky === 'Văn Khúc' ? 'D' : undefined);
  addCat(posVanXuong, 'Văn Xương', 'Kim', 'phu_tinh_cat', 'D', tuHoaXuong, 'bold', snXuong);
  addCat(posVanKhuc, 'Văn Khúc', 'Thuy', 'phu_tinh_cat', 'D', tuHoaKhuc, 'bold', snKhuc);

  // 3. LỘC TỒN (Cát Đậm) & KÌNH DƯƠNG, ĐÀ LA (Sát Đậm)
  const LOC_TON_MAP: Record<string, number> = {
    'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Đinh': 6, 'Mậu': 5,
    'Kỷ': 6, 'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0
  };
  const posLocTon = LOC_TON_MAP[canYear] ?? 2;
  addCat(posLocTon, 'Lộc Tồn', 'Tho', 'phu_tinh_cat', 'M', undefined, 'bold');
  // Kình Dương tại Lộc Tồn + 1 (Đắc Thìn Tuất Sửu Mùi)
  const posKinh = (posLocTon + 1) % 12;
  const kinBright: StarBrightness = [1, 4, 7, 10].includes(posKinh) ? 'D' : 'H';
  addSat(posKinh, 'Kình Dương', 'Kim', 'phu_tinh_hung', kinBright, false, 'bold');
  // Đà La tại Lộc Tồn - 1 (Đắc Thìn Tuất Sửu Mùi)
  const posDa = (posLocTon - 1 + 12) % 12;
  const daBright: StarBrightness = [1, 4, 7, 10].includes(posDa) ? 'D' : 'H';
  addSat(posDa, 'Đà La', 'Kim', 'phu_tinh_hung', daBright, false, 'bold');

  // 4. THIÊN KHÔI, THIÊN VIỆT (Cát Đậm)
  const KHOI_VIET_MAP: Record<string, [number, number]> = {
    'Giáp': [1, 7], 'Mậu': [1, 7], 'Canh': [1, 7],
    'Ất': [0, 8], 'Kỷ': [0, 8],
    'Bính': [11, 9], 'Đinh': [11, 9],
    'Tân': [6, 2],
    'Nhâm': [3, 5], 'Quý': [3, 5]
  };
  const [posKhoi, posViet] = KHOI_VIET_MAP[canYear] || [1, 7];
  addCat(posKhoi, 'Thiên Khôi', 'Hoa', 'phu_tinh_cat', 'V', undefined, 'bold');
  addCat(posViet, 'Thiên Việt', 'Hoa', 'phu_tinh_cat', 'V', undefined, 'bold');

  // 5. ĐỊA KHÔNG, ĐỊA KIẾP (Sát Đậm kèm Đắc/Hãm)
  const posDiaKiep = (11 + chiHourIndex) % 12;
  const posDiaKhong = (11 - chiHourIndex + 12) % 12;
  const dKhongBright: StarBrightness = [2, 5, 8, 11].includes(posDiaKhong) ? 'D' : 'H';
  const dKiepBright: StarBrightness = [2, 5, 8, 11].includes(posDiaKiep) ? 'D' : 'H';
  addSat(posDiaKhong, 'Địa Không', 'Hoa', 'phu_tinh_hung', dKhongBright, false, 'bold');
  addSat(posDiaKiep, 'Địa Kiếp', 'Hoa', 'phu_tinh_hung', dKiepBright, false, 'bold');

  // 6. HỎA TINH, LINH TINH (Sát Đậm kèm Đắc/Hãm)
  let hoaStart = 1;
  let linhStart = 3;
  if ([8, 0, 4].includes(chiYearIndex)) { hoaStart = 2; linhStart = 10; }
  else if ([5, 9, 1].includes(chiYearIndex)) { hoaStart = 3; linhStart = 10; }
  else if ([11, 3, 7].includes(chiYearIndex)) { hoaStart = 9; linhStart = 10; }

  const posHoaTinh = isThuan ? (hoaStart + chiHourIndex) % 12 : (hoaStart - chiHourIndex + 12) % 12;
  const posLinhTinh = isThuan ? (linhStart - chiHourIndex + 12) % 12 : (linhStart + chiHourIndex) % 12;
  const hoaBright: StarBrightness = [2, 6, 10].includes(posHoaTinh) ? 'D' : 'H';
  const linhBright: StarBrightness = [2, 6, 10].includes(posLinhTinh) ? 'D' : 'H';
  addSat(posHoaTinh, 'Hỏa Tinh', 'Hoa', 'phu_tinh_hung', hoaBright, false, 'bold');
  addSat(posLinhTinh, 'Linh Tinh', 'Hoa', 'phu_tinh_hung', linhBright, false, 'bold');

  // 7. VÒNG BÁC SĨ (12 sao: an từ Lộc Tồn theo chiều âm dương nam nữ)
  const BAC_SI_STARS: [string, ElementType, boolean][] = [
    ['Bác Sĩ', 'Thuy', true],
    ['Lực Sĩ', 'Hoa', true],
    ['Thanh Long', 'Thuy', true],
    ['Tiểu Hao', 'Hoa', false],
    ['Tướng Quân', 'Moc', true],
    ['Tấu Thư', 'Kim', true],
    ['Phi Liêm', 'Hoa', false],
    ['Hỷ Thần', 'Hoa', true],
    ['Bệnh Phù', 'Tho', false],
    ['Đại Hao', 'Hoa', false],
    ['Phục Binh', 'Hoa', false],
    ['Quan Phủ', 'Hoa', false]
  ];
  for (let i = 0; i < 12; i++) {
    const pos = isThuan ? (posLocTon + i) % 12 : (posLocTon - i + 12) % 12;
    const [name, elem, isCat] = BAC_SI_STARS[i];
    if (isCat) addCat(pos, name, elem, 'vong_bac_si');
    else addSat(pos, name, elem, 'vong_bac_si');
  }

  // 8. VÒNG THÁI TUẾ (12 sao an thuận từ Chi năm)
  const THAI_TUE_STARS: [string, ElementType, boolean][] = [
    ['Thái Tuế', 'Hoa', false],
    ['Thiếu Dương', 'Hoa', true],
    ['Tang Môn', 'Moc', false], // Sát
    ['Thiếu Âm', 'Thuy', true],
    ['Quan Phù', 'Hoa', false],
    ['Tử Phù', 'Kim', false],
    ['Tuế Phá', 'Hoa', false],
    ['Long Đức', 'Thuy', true],
    ['Bạch Hổ', 'Kim', false], // Sát
    ['Phúc Đức', 'Tho', true],
    ['Điếu Khách', 'Hoa', false],
    ['Trực Phù', 'Hoa', false]
  ];
  for (let i = 0; i < 12; i++) {
    const pos = (chiYearIndex + i) % 12;
    const [name, elem, isCat] = THAI_TUE_STARS[i];
    if (isCat) addCat(pos, name, elem, 'vong_thai_tue');
    else addSat(pos, name, elem, 'vong_thai_tue');
  }

  // 9. VÒNG TRÀNG SINH (12 sao an theo Cục & Âm Dương thuận nghịch)
  let trangSinhStart = 8; // Thủy Nhị Cục & Thổ Ngũ Cục
  if (cuc.element === 'Moc') trangSinhStart = 11;
  else if (cuc.element === 'Kim') trangSinhStart = 5;
  else if (cuc.element === 'Hoa') trangSinhStart = 2;

  const TRANG_SINH_STARS: [string, ElementType][] = [
    ['Tràng Sinh', 'Thuy'],
    ['Mộc Dục', 'Thuy'],
    ['Quan Đới', 'Kim'],
    ['Lâm Quan', 'Kim'],
    ['Đế Vượng', 'Kim'],
    ['Suy', 'Thuy'],
    ['Bệnh', 'Hoa'],
    ['Tử', 'Hoa'],
    ['Mộ', 'Tho'],
    ['Tuyệt', 'Tho'],
    ['Thai', 'Tho'],
    ['Dưỡng', 'Moc']
  ];
  for (let i = 0; i < 12; i++) {
    const pos = isThuan ? (trangSinhStart + i) % 12 : (trangSinhStart - i + 12) % 12;
    const [name, elem] = TRANG_SINH_STARS[i];
    if (['Tràng Sinh', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Thai', 'Dưỡng'].includes(name)) {
      addCat(pos, name, elem, 'vong_trang_sinh');
    } else {
      addSat(pos, name, elem, 'vong_trang_sinh');
    }
  }

  // 10. PHỤ TINH THEO CHI NĂM
  // Thiên Mã (Cát Đậm)
  let posMa = 8;
  if ([8, 0, 4].includes(chiYearIndex)) posMa = 2;
  else if ([5, 9, 1].includes(chiYearIndex)) posMa = 11;
  else if ([11, 3, 7].includes(chiYearIndex)) posMa = 5;
  addCat(posMa, 'Thiên Mã', 'Hoa', 'phu_tinh_cat', 'D', undefined, 'bold');

  // Đào Hoa
  let posDaoHoa = 3;
  if ([8, 0, 4].includes(chiYearIndex)) posDaoHoa = 9;
  else if ([5, 9, 1].includes(chiYearIndex)) posDaoHoa = 6;
  else if ([11, 3, 7].includes(chiYearIndex)) posDaoHoa = 0;
  addCat(posDaoHoa, 'Đào Hoa', 'Moc', 'phu_tinh_cat');

  // Hoa Cái
  let posHoaCai = 1;
  if ([8, 0, 4].includes(chiYearIndex)) posHoaCai = 4;
  else if ([2, 6, 10].includes(chiYearIndex)) posHoaCai = 10;
  else if ([5, 9, 1].includes(chiYearIndex)) posHoaCai = 1;
  else if ([11, 3, 7].includes(chiYearIndex)) posHoaCai = 7;
  addCat(posHoaCai, 'Hoa Cái', 'Kim', 'phu_tinh_cat');

  // Kiếp Sát (Sát)
  let posKiepSat = 5;
  if ([8, 0, 4].includes(chiYearIndex)) posKiepSat = 5;
  else if ([2, 6, 10].includes(chiYearIndex)) posKiepSat = 11;
  else if ([5, 9, 1].includes(chiYearIndex)) posKiepSat = 2;
  else if ([11, 3, 7].includes(chiYearIndex)) posKiepSat = 8;
  addSat(posKiepSat, 'Kiếp Sát', 'Hoa', 'phu_tinh_hung');

  // Phá Toái (Sát)
  let posPhaToai = 5;
  if ([5, 9, 1].includes(chiYearIndex)) posPhaToai = 5;
  else if ([2, 6, 10].includes(chiYearIndex)) posPhaToai = 9;
  else posPhaToai = 1;
  addSat(posPhaToai, 'Phá Toái', 'Hoa', 'phu_tinh_hung');

  // Hồng Loan, Thiên Hỷ
  const posHongLoan = (3 - chiYearIndex + 12) % 12;
  const posThienHy = (posHongLoan + 6) % 12;
  addCat(posHongLoan, 'Hồng Loan', 'Thuy', 'phu_tinh_cat');
  addCat(posThienHy, 'Thiên Hỷ', 'Thuy', 'phu_tinh_cat');

  // Cô Thần, Quả Tú (Sát)
  let posCoThan = 2;
  let posQuaTu = 10;
  if ([2, 3, 4].includes(chiYearIndex)) { posCoThan = 5; posQuaTu = 1; }
  else if ([5, 6, 7].includes(chiYearIndex)) { posCoThan = 8; posQuaTu = 4; }
  else if ([8, 9, 10].includes(chiYearIndex)) { posCoThan = 11; posQuaTu = 7; }
  addSat(posCoThan, 'Cô Thần', 'Hoa', 'phu_tinh_hung');
  addSat(posQuaTu, 'Quả Tú', 'Tho', 'phu_tinh_hung');

  // Thiên Khốc, Thiên Hư (Sát)
  const posKhoc = (6 - chiYearIndex + 12) % 12;
  const posHu = (6 + chiYearIndex) % 12;
  addSat(posKhoc, 'Thiên Khốc', 'Thuy', 'phu_tinh_hung');
  addSat(posHu, 'Thiên Hư', 'Thuy', 'phu_tinh_hung');

  // Long Trì, Phượng Các, Giải Thần
  const posLongTri = (4 + chiYearIndex) % 12;
  const posPhuongCac = (10 - chiYearIndex + 12) % 12;
  addCat(posLongTri, 'Long Trì', 'Thuy', 'phu_tinh_cat');
  addCat(posPhuongCac, 'Phượng Các', 'Tho', 'phu_tinh_cat');
  addCat(posPhuongCac, 'Giải Thần', 'Moc', 'phu_tinh_cat');

  // Thiên Đức, Nguyệt Đức, Thiên Không
  const posThienDuc = (9 + chiYearIndex) % 12;
  const posNguyetDuc = (5 + chiYearIndex) % 12;
  const posThienKhong = (chiYearIndex + 1) % 12;
  addCat(posThienDuc, 'Thiên Đức', 'Hoa', 'phu_tinh_cat');
  addCat(posNguyetDuc, 'Nguyệt Đức', 'Hoa', 'phu_tinh_cat');
  addSat(posThienKhong, 'Thiên Không', 'Hoa', 'phu_tinh_hung');

  // 11. PHỤ TINH THEO THIÊN CAN NĂM
  const THIEN_QUAN_MAP: Record<string, number> = {
    'Giáp': 7, 'Ất': 4, 'Bính': 5, 'Đinh': 2, 'Mậu': 3,
    'Kỷ': 9, 'Canh': 11, 'Tân': 9, 'Nhâm': 10, 'Quý': 6
  };
  const THIEN_PHUC_MAP: Record<string, number> = {
    'Giáp': 9, 'Ất': 8, 'Bính': 0, 'Đinh': 11, 'Mậu': 3,
    'Kỷ': 2, 'Canh': 6, 'Tân': 5, 'Nhâm': 6, 'Quý': 5
  };
  const LUU_NIEN_VAN_TINH_MAP: Record<string, number> = {
    'Giáp': 5, 'Ất': 6, 'Bính': 8, 'Đinh': 9, 'Mậu': 8,
    'Kỷ': 9, 'Canh': 11, 'Tân': 0, 'Nhâm': 2, 'Quý': 3
  };
  const THIEN_TRU_MAP: Record<string, number> = {
    'Giáp': 5, 'Ất': 6, 'Bính': 0, 'Đinh': 5, 'Mậu': 6,
    'Kỷ': 8, 'Canh': 2, 'Tân': 6, 'Nhâm': 9, 'Quý': 10
  };
  const LUU_HA_MAP: Record<string, number> = {
    'Giáp': 9, 'Ất': 10, 'Bính': 7, 'Đinh': 4, 'Mậu': 5,
    'Kỷ': 6, 'Canh': 8, 'Tân': 3, 'Nhâm': 11, 'Quý': 2
  };
  addCat(THIEN_QUAN_MAP[canYear] ?? 7, 'Thiên Quan', 'Hoa', 'phu_tinh_cat');
  addCat(THIEN_PHUC_MAP[canYear] ?? 9, 'Thiên Phúc', 'Tho', 'phu_tinh_cat');
  addCat(LUU_NIEN_VAN_TINH_MAP[canYear] ?? 5, 'Văn Tinh', 'Hoa', 'phu_tinh_cat');
  addCat(THIEN_TRU_MAP[canYear] ?? 5, 'Thiên Trù', 'Tho', 'phu_tinh_cat');
  addSat(LUU_HA_MAP[canYear] ?? 9, 'Lưu Hà', 'Thuy', 'phu_tinh_hung');

  // Quốc Ấn, Đường Phù theo Lộc Tồn
  const posQuocAn = (posLocTon + 8) % 12;
  const posDuongPhu = (posLocTon + 5) % 12;
  addCat(posQuocAn, 'Quốc Ấn', 'Tho', 'phu_tinh_cat');
  addCat(posDuongPhu, 'Đường Phù', 'Moc', 'phu_tinh_cat');

  // Thiên Tài (theo Mệnh + Chi năm), Thiên Thọ (theo Thân + Chi năm)
  const posThienTai = (menhIndex + chiYearIndex) % 12;
  const posThienTho = (thanIndex + chiYearIndex) % 12;
  addCat(posThienTai, 'Thiên Tài', 'Tho', 'phu_tinh_cat');
  addCat(posThienTho, 'Thiên Thọ', 'Tho', 'phu_tinh_cat');

  // 12. PHỤ TINH THEO THÁNG SINH
  const posThienHinh = (9 + (lunarMonth - 1)) % 12;
  const posThienRieu = (1 + (lunarMonth - 1)) % 12;
  const posThienY = (1 + (lunarMonth - 1)) % 12;
  const posThienGiai = (8 + (lunarMonth - 1)) % 12;
  const posDiaGiai = (7 + (lunarMonth - 1)) % 12;
  addSat(posThienHinh, 'Thiên Hình', 'Hoa', 'phu_tinh_hung', 'D');
  addSat(posThienRieu, 'Thiên Riêu', 'Thuy', 'phu_tinh_hung', 'D');
  addCat(posThienY, 'Thiên Y', 'Thuy', 'phu_tinh_cat');
  addCat(posThienGiai, 'Thiên Giải', 'Hoa', 'phu_tinh_cat');
  addCat(posDiaGiai, 'Địa Giải', 'Tho', 'phu_tinh_cat');

  // 13. PHỤ TINH THEO NGÀY SINH
  const posTamThai = (posTaPhu + (lunarDay - 1)) % 12;
  const posBatToa = (posHuuBat - (lunarDay - 1) + 120) % 12;
  const posAnQuang = (posVanXuong + (lunarDay - 2) + 120) % 12;
  const posThienQuy = (posVanKhuc - (lunarDay - 2) + 120) % 12;
  addCat(posTamThai, 'Tam Thai', 'Thuy', 'phu_tinh_cat');
  addCat(posBatToa, 'Bát Tọa', 'Thuy', 'phu_tinh_cat');
  addCat(posAnQuang, 'Ân Quang', 'Moc', 'phu_tinh_cat');
  addCat(posThienQuy, 'Thiên Quý', 'Tho', 'phu_tinh_cat');

  // 14. PHỤ TINH THEO GIỜ SINH
  const posThaiPhu = (6 + chiHourIndex) % 12;
  const posPhongCao = (2 + chiHourIndex) % 12;
  addCat(posThaiPhu, 'Thai Phụ', 'Kim', 'phu_tinh_cat');
  addCat(posPhongCao, 'Phong Cáo', 'Tho', 'phu_tinh_cat');

  // Đẩu Quân
  const posDauQuan = ((chiYearIndex - (lunarMonth - 1) + 12) + chiHourIndex) % 12;
  addCat(posDauQuan, 'Đẩu Quân', 'Hoa', 'phu_tinh_cat');

  // 15. CUNG CỐ ĐỊNH & KHÔNG VONG
  addSat(4, 'Thiên La', 'Kim', 'phu_tinh_hung'); // Thìn
  addSat(10, 'Địa Võng', 'Tho', 'phu_tinh_hung'); // Tuất

  // Triệt Lộ & Tuần Trung Không Vong
  const TRIET_MAP: Record<string, [number, number]> = {
    'Giáp': [8, 9], 'Kỷ': [8, 9],
    'Ất': [6, 7], 'Canh': [6, 7],
    'Bính': [4, 5], 'Tân': [4, 5],
    'Đinh': [2, 3], 'Nhâm': [2, 3],
    'Mậu': [0, 1], 'Quý': [0, 1]
  };
  const triet = TRIET_MAP[canYear] || [8, 9];

  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const canIndex = CAN.indexOf(canYear);
  const diff = (chiYearIndex - canIndex + 12) % 12;
  const tuan = [(diff + 10) % 12, (diff + 11) % 12];

  // 16. HỆ SAO LƯU NIÊN (15 sao) theo năm xem hạn (viewingYear)
  const canViewingIndex = (viewingYear + 6) % 10;
  const chiViewingIndex = (viewingYear + 8) % 12;
  const canViewing = CAN[canViewingIndex];
  const tuHoaLuu = TU_HOA_TABLE[canViewing];

  // L.Thái Tuế, L.Tang Môn, L.Bạch Hổ
  addSat(chiViewingIndex, 'L.Thái Tuế', 'Hoa', 'sao_luu_nien', undefined, true);
  addSat((chiViewingIndex + 2) % 12, 'L.Tang Môn', 'Moc', 'sao_luu_nien', undefined, true);
  addSat((chiViewingIndex + 8) % 12, 'L.Bạch Hổ', 'Kim', 'sao_luu_nien', undefined, true);

  // L.Lộc Tồn (Đậm), L.Kình Dương, L.Đà La
  const posLLocTon = LOC_TON_MAP[canViewing] ?? 2;
  addCat(posLLocTon, 'L.Lộc Tồn', 'Tho', 'sao_luu_nien', undefined, 'Lộc', 'bold');
  addSat((posLLocTon + 1) % 12, 'L.Kình Dương', 'Kim', 'sao_luu_nien', undefined, true);
  addSat((posLLocTon - 1 + 12) % 12, 'L.Đà La', 'Kim', 'sao_luu_nien', undefined, true);

  // L.Thiên Mã
  let posLMa = 8;
  if ([8, 0, 4].includes(chiViewingIndex)) posLMa = 2;
  else if ([5, 9, 1].includes(chiViewingIndex)) posLMa = 11;
  else if ([11, 3, 7].includes(chiViewingIndex)) posLMa = 5;
  addCat(posLMa, 'L.Thiên Mã', 'Hoa', 'sao_luu_nien', undefined, undefined, 'bold');

  // L.Thiên Khốc, L.Thiên Hư
  const posLKhoc = (6 - chiViewingIndex + 12) % 12;
  const posLHu = (6 + chiViewingIndex) % 12;
  addSat(posLKhoc, 'L.Thiên Khốc', 'Thuy', 'sao_luu_nien', undefined, true);
  addSat(posLHu, 'L.Thiên Hư', 'Thuy', 'sao_luu_nien', undefined, true);

  // L.Đào Hoa, L.Hồng Loan
  let posLDaoHoa = 3;
  if ([8, 0, 4].includes(chiViewingIndex)) posLDaoHoa = 9;
  else if ([5, 9, 1].includes(chiViewingIndex)) posLDaoHoa = 6;
  else if ([11, 3, 7].includes(chiViewingIndex)) posLDaoHoa = 0;
  const posLHongLoan = (3 - chiViewingIndex + 12) % 12;
  addCat(posLDaoHoa, 'L.Đào Hoa', 'Moc', 'sao_luu_nien');
  addCat(posLHongLoan, 'L.Hồng Loan', 'Thuy', 'sao_luu_nien');

  // L.Tứ Hóa
  if (tuHoaLuu) {
    addCat(0, `L.Hóa Lộc`, 'Moc', 'sao_luu_nien', undefined, 'Lộc', 'bold');
    addCat(0, `L.Hóa Quyền`, 'Hoa', 'sao_luu_nien', undefined, 'Quyền', 'bold');
    addCat(0, `L.Hóa Khoa`, 'Thuy', 'sao_luu_nien', undefined, 'Khoa', 'bold');
    addSat(0, `L.Hóa Kỵ`, 'Thuy', 'sao_luu_nien', undefined, true, 'bold', 'Kỵ');
  }

  return {
    catStars,
    satStars,
    minorStars,
    tuan,
    triet
  };
}

// Tính Tự Hóa Ly Tâm & Hướng Tâm cho toàn bộ các cung
export function calculateTuHoaLyHuongTam(
  palaceCans: string[],
  majorStarsByPalace: Record<number, Star[]>,
  minorStarsByPalace: Record<number, Star[]>
): {
  updatedMajor: Record<number, Star[]>;
  updatedMinor: Record<number, Star[]>;
} {
  const updatedMajor: Record<number, Star[]> = {};
  const updatedMinor: Record<number, Star[]> = {};

  for (let i = 0; i < 12; i++) {
    updatedMajor[i] = [];
    updatedMinor[i] = [];
    const myCan = palaceCans[i];
    const myRules = TU_HOA_TABLE[myCan];

    const oppPalaceId = (i + 6) % 12;
    const oppCan = palaceCans[oppPalaceId];
    const oppRules = TU_HOA_TABLE[oppCan];

    const processStar = (star: Star): Star => {
      const cloned = { ...star };
      if (!myRules) return cloned;

      // 1. Tự Hóa Ly Tâm (Can của cung làm sao trong chính cung hóa)
      if (cloned.name === myRules.loc) cloned.tuHoaLyTam = 'A';
      else if (cloned.name === myRules.quyen) cloned.tuHoaLyTam = 'B';
      else if (cloned.name === myRules.khoa) cloned.tuHoaLyTam = 'C';
      else if (cloned.name === myRules.ky) cloned.tuHoaLyTam = 'D';

      // 2. Tự Hóa Hướng Tâm (Can của đối cung làm sao trong cung này hóa)
      if (oppRules) {
        if (cloned.name === oppRules.loc) cloned.tuHoaHuongTam = 'A';
        else if (cloned.name === oppRules.quyen) cloned.tuHoaHuongTam = 'B';
        else if (cloned.name === oppRules.khoa) cloned.tuHoaHuongTam = 'C';
        else if (cloned.name === oppRules.ky) cloned.tuHoaHuongTam = 'D';
      }

      return cloned;
    };

    updatedMajor[i] = (majorStarsByPalace[i] || []).map(processStar);
    updatedMinor[i] = (minorStarsByPalace[i] || []).map(processStar);
  }

  return { updatedMajor, updatedMinor };
}

// Tính Bảng Phi Tinh Tứ Hóa cho cả 12 Cung
export function calculatePhiHoaTable(
  palaceCans: string[],
  palaceNames: string[],
  allStarsLocation: Record<string, number>
): Record<number, PhiHoaDetail> {
  const table: Record<number, PhiHoaDetail> = {};

  for (let i = 0; i < 12; i++) {
    const fromCan = palaceCans[i];
    const fromName = palaceNames[i];
    const rules = TU_HOA_TABLE[fromCan];
    if (!rules) continue;

    const findTarget = (starName: string): PhiHoaTarget => {
      const targetId = allStarsLocation[starName] ?? i;
      return {
        starName,
        toPalaceId: targetId,
        toPalaceName: palaceNames[targetId],
        toBranch: CHI_NAMES[targetId]
      };
    };

    const loc = findTarget(rules.loc);
    const quyen = findTarget(rules.quyen);
    const khoa = findTarget(rules.khoa);
    const kyTarget = findTarget(rules.ky);
    const xungId = (kyTarget.toPalaceId + 6) % 12;

    const ky = {
      ...kyTarget,
      xungPalaceId: xungId,
      xungPalaceName: palaceNames[xungId],
      xungBranch: CHI_NAMES[xungId]
    };

    const summaryText = `Cung ${fromName} (${fromCan} ${CHI_NAMES[i]}): Phi Lộc nhập ${loc.toPalaceName}, Phi Quyền nhập ${quyen.toPalaceName}, Phi Khoa nhập ${khoa.toPalaceName}, Phi Kỵ nhập ${ky.toPalaceName} xung ${ky.xungPalaceName}`;

    let practicalAdvice = `Khi khởi sự từ ${fromName}, nguồn duyên may và tài lộc sẽ hướng về ${loc.toPalaceName}; quyền lực và động lực tập trung tại ${quyen.toPalaceName}. Cần đặc biệt cẩn trọng đối với ${ky.xungPalaceName} do bị xung phá bởi Hóa Kỵ từ ${ky.toPalaceName}.`;
    if (fromName === 'Mệnh') {
      practicalAdvice = `Bản Mệnh hóa Lộc nhập ${loc.toPalaceName} cho thấy bạn luôn sẵn lòng cống hiến tâm sức cho ${loc.toPalaceName}. Tuy nhiên Hóa Kỵ nhập ${ky.toPalaceName} khiến ${ky.xungPalaceName} chịu áp lực lớn, cần cân bằng tâm lý và giữ gìn các mối quan hệ tại đây.`;
    } else if (fromName === 'Tài Bạch') {
      practicalAdvice = `Đường tài chính của bạn phát xuất sinh khí đổ dồn vào ${loc.toPalaceName}. Chú ý giữ vốn phòng ngừa biến cố xung chiếu tới cung ${ky.xungPalaceName}.`;
    } else if (fromName === 'Quan Lộc') {
      practicalAdvice = `Sự nghiệp của bạn kết nối mật thiết với ${loc.toPalaceName}. Hãy tận dụng tri thức (Hóa Khoa tại ${khoa.toPalaceName}) để tháo gỡ điểm nghẽn tại ${ky.toPalaceName}.`;
    }

    table[i] = {
      fromPalaceId: i,
      fromPalaceName: fromName,
      fromCan,
      fromBranch: CHI_NAMES[i],
      loc,
      quyen,
      khoa,
      ky,
      summaryText,
      practicalAdvice
    };
  }

  return table;
}
