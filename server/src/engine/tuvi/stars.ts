import { Star, StarBrightness, ElementType, Gender } from './types.js';
import { CucInfo } from './elements.js';
import { CHI_NAMES } from './palaces.js';

// 14 Chính Tinh và Ngũ Hành của từng sao
export const MAJOR_STARS_INFO: Record<string, { element: ElementType; defaultName: string }> = {
  'Tử Vi': { element: 'Tho', defaultName: 'Tử Vi' },
  'Liêm Trinh': { element: 'Hoa', defaultName: 'Liêm Trinh' },
  'Thiên Đồng': { element: 'Thuy', defaultName: 'Thiên Đồng' },
  'Vũ Khúc': { element: 'Kim', defaultName: 'Vũ Khúc' },
  'Thái Dương': { element: 'Hoa', defaultName: 'Thái Dương' },
  'Thiên Cơ': { element: 'Moc', defaultName: 'Thiên Cơ' },
  'Thiên Phủ': { element: 'Tho', defaultName: 'Thiên Phủ' },
  'Thái Âm': { element: 'Thuy', defaultName: 'Thái Âm' },
  'Tham Lang': { element: 'Thuy', defaultName: 'Tham Lang' },
  'Cự Môn': { element: 'Thuy', defaultName: 'Cự Môn' },
  'Thiên Tướng': { element: 'Thuy', defaultName: 'Thiên Tướng' },
  'Thiên Lương': { element: 'Moc', defaultName: 'Thiên Lương' },
  'Thất Sát': { element: 'Kim', defaultName: 'Thất Sát' },
  'Phá Quân': { element: 'Thuy', defaultName: 'Phá Quân' }
};

// Bảng Đắc/Hãm/Miếu/Vượng/Bình của 14 Chính Tinh tại 12 Cung (0: Tý .. 11: Hợi)
// M: Miếu, V: Vượng, D: Đắc, B: Bình, H: Hãm
export const MAJOR_STARS_BRIGHTNESS: Record<string, StarBrightness[]> = {
  //                  Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi
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

// Tìm vị trí Tử Vi
export function findTuViPosition(lunarDay: number, cuc: CucInfo): number {
  const C = cuc.number;
  const D = lunarDay;

  if (D % C === 0) {
    const Q = D / C;
    return (1 + Q) % 12; // Khởi từ Dần (2) đi Q-1 bước = 1 + Q
  }

  // Mượn X để (D + X) chia hết cho C
  const X = C - (D % C);
  const Q = (D + X) / C;

  if (X % 2 !== 0) {
    // X Lẻ: đi nghịch
    return (1 + Q - X + 120) % 12;
  } else {
    // X Chẵn: đi thuận
    return (1 + Q + X) % 12;
  }
}

export function placeMajorStars(tuViPos: number): Record<number, Star[]> {
  const result: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) result[i] = [];

  // Chòm Tử Vi (nghịch)
  const tvStars: [string, number][] = [
    ['Tử Vi', tuViPos],
    ['Thiên Cơ', (tuViPos - 1 + 12) % 12],
    ['Thái Dương', (tuViPos - 3 + 12) % 12],
    ['Vũ Khúc', (tuViPos - 4 + 12) % 12],
    ['Thiên Đồng', (tuViPos - 5 + 12) % 12],
    ['Liêm Trinh', (tuViPos - 8 + 12) % 12]
  ];

  // Chòm Thiên Phủ (đối xứng qua trục Dần - Thân, thuận)
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

  for (const [name, pos] of allMajor) {
    const info = MAJOR_STARS_INFO[name];
    const brightness = MAJOR_STARS_BRIGHTNESS[name]?.[pos] || 'B';
    result[pos].push({
      name,
      element: info.element,
      brightness,
      category: 'chinh_tinh'
    });
  }

  return result;
}

// Bảng Tứ Hóa theo Can năm sinh
const TU_HOA_TABLE: Record<string, Record<string, 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ'>> = {
  'Giáp': { 'Liêm Trinh': 'Hóa Lộc', 'Phá Quân': 'Hóa Quyền', 'Vũ Khúc': 'Hóa Khoa', 'Thái Dương': 'Hóa Kỵ' },
  'Ất': { 'Thiên Cơ': 'Hóa Lộc', 'Thiên Lương': 'Hóa Quyền', 'Tử Vi': 'Hóa Khoa', 'Thái Âm': 'Hóa Kỵ' },
  'Bính': { 'Thiên Đồng': 'Hóa Lộc', 'Thiên Cơ': 'Hóa Quyền', 'Văn Xương': 'Hóa Khoa', 'Liêm Trinh': 'Hóa Kỵ' },
  'Đinh': { 'Thái Âm': 'Hóa Lộc', 'Thiên Đồng': 'Hóa Quyền', 'Thiên Cơ': 'Hóa Khoa', 'Cự Môn': 'Hóa Kỵ' },
  'Mậu': { 'Tham Lang': 'Hóa Lộc', 'Thái Âm': 'Hóa Quyền', 'Hữu Bật': 'Hóa Khoa', 'Thiên Cơ': 'Hóa Kỵ' },
  'Kỷ': { 'Vũ Khúc': 'Hóa Lộc', 'Tham Lang': 'Hóa Quyền', 'Thiên Lương': 'Hóa Khoa', 'Văn Khúc': 'Hóa Kỵ' },
  'Canh': { 'Thái Dương': 'Hóa Lộc', 'Vũ Khúc': 'Hóa Quyền', 'Thiên Đồng': 'Hóa Khoa', 'Thái Âm': 'Hóa Kỵ' },
  'Tân': { 'Cự Môn': 'Hóa Lộc', 'Thái Dương': 'Hóa Quyền', 'Văn Khúc': 'Hóa Khoa', 'Văn Xương': 'Hóa Kỵ' },
  'Nhâm': { 'Thiên Lương': 'Hóa Lộc', 'Tử Vi': 'Hóa Quyền', 'Thiên Phủ': 'Hóa Khoa', 'Vũ Khúc': 'Hóa Kỵ' },
  'Quý': { 'Phá Quân': 'Hóa Lộc', 'Cự Môn': 'Hóa Quyền', 'Thái Âm': 'Hóa Khoa', 'Tham Lang': 'Hóa Kỵ' }
};

export function placeMinorStars(
  canYear: string,
  chiYear: string,
  lunarMonth: number,
  chiHourIndex: number,
  cuc: CucInfo,
  isThuan: boolean,
  gender: Gender
): { minorStars: Record<number, Star[]>; tuan: number[]; triet: number[] } {
  const result: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) result[i] = [];

  const addStar = (pos: number, name: string, element: ElementType, category: Star['category'], brightness?: StarBrightness) => {
    result[pos].push({ name, element, category, brightness });
  };

  const chiYearIndex = CHI_NAMES.indexOf(chiYear);

  // 1. Tả Phù, Hữu Bật (theo tháng)
  const posTaPhu = (4 + (lunarMonth - 1)) % 12;
  const posHuuBat = (10 - (lunarMonth - 1) + 12) % 12;
  addStar(posTaPhu, 'Tả Phù', 'Tho', 'phu_tinh_cat', 'D');
  addStar(posHuuBat, 'Hữu Bật', 'Tho', 'phu_tinh_cat', 'D');

  // 2. Văn Xương, Văn Khúc (theo giờ)
  const posVanXuong = (10 - chiHourIndex + 12) % 12;
  const posVanKhuc = (4 + chiHourIndex) % 12;
  addStar(posVanXuong, 'Văn Xương', 'Kim', 'phu_tinh_cat', 'D');
  addStar(posVanKhuc, 'Văn Khúc', 'Thuy', 'phu_tinh_cat', 'D');

  // 3. Lộc Tồn, Kình Dương, Đà La (theo Can năm)
  const LOC_TON_MAP: Record<string, number> = {
    'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Đinh': 6, 'Mậu': 5,
    'Kỷ': 6, 'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0
  };
  const posLocTon = LOC_TON_MAP[canYear] ?? 2;
  addStar(posLocTon, 'Lộc Tồn', 'Tho', 'phu_tinh_cat', 'M');
  addStar((posLocTon + 1) % 12, 'Kình Dương', 'Kim', 'phu_tinh_hung', 'D');
  addStar((posLocTon - 1 + 12) % 12, 'Đà La', 'Kim', 'phu_tinh_hung', 'D');

  // 4. Thiên Khôi, Thiên Việt (theo Can năm)
  const KHOI_VIET_MAP: Record<string, [number, number]> = {
    'Giáp': [1, 7], 'Mậu': [1, 7], 'Canh': [1, 7],
    'Ất': [0, 8], 'Kỷ': [0, 8],
    'Bính': [11, 9], 'Đinh': [11, 9],
    'Tân': [6, 2],
    'Nhâm': [3, 5], 'Quý': [3, 5]
  };
  const [posKhoi, posViet] = KHOI_VIET_MAP[canYear] || [1, 7];
  addStar(posKhoi, 'Thiên Khôi', 'Hoa', 'phu_tinh_cat', 'V');
  addStar(posViet, 'Thiên Việt', 'Hoa', 'phu_tinh_cat', 'V');

  // 5. Địa Không, Địa Kiếp (theo giờ)
  const posDiaKiep = (11 + chiHourIndex) % 12;
  const posDiaKhong = (11 - chiHourIndex + 12) % 12;
  addStar(posDiaKhong, 'Địa Không', 'Hoa', 'phu_tinh_hung', 'H');
  addStar(posDiaKiep, 'Địa Kiếp', 'Hoa', 'phu_tinh_hung', 'H');

  // 6. Hỏa Tinh, Linh Tinh
  let hoaStart = 1;
  let linhStart = 3;
  if ([8, 0, 4].includes(chiYearIndex)) { hoaStart = 2; linhStart = 10; }
  else if ([5, 9, 1].includes(chiYearIndex)) { hoaStart = 3; linhStart = 10; }
  else if ([11, 3, 7].includes(chiYearIndex)) { hoaStart = 9; linhStart = 10; }

  const posHoaTinh = isThuan ? (hoaStart + chiHourIndex) % 12 : (hoaStart - chiHourIndex + 12) % 12;
  const posLinhTinh = isThuan ? (linhStart - chiHourIndex + 12) % 12 : (linhStart + chiHourIndex) % 12;
  addStar(posHoaTinh, 'Hỏa Tinh', 'Hoa', 'phu_tinh_hung', 'D');
  addStar(posLinhTinh, 'Linh Tinh', 'Hoa', 'phu_tinh_hung', 'D');

  // 7. Vòng Thái Tuế (12 sao, từ chi năm sinh, thuận)
  const THAI_TUE_STARS: [string, ElementType, Star['category']][] = [
    ['Thái Tuế', 'Hoa', 'vong_thai_tue'],
    ['Thiếu Dương', 'Hoa', 'vong_thai_tue'],
    ['Tang Môn', 'Moc', 'vong_thai_tue'],
    ['Thiếu Âm', 'Thuy', 'vong_thai_tue'],
    ['Quan Phù', 'Hoa', 'vong_thai_tue'],
    ['Tử Phù', 'Kim', 'vong_thai_tue'],
    ['Tuế Phá', 'Hoa', 'vong_thai_tue'],
    ['Long Đức', 'Thuy', 'vong_thai_tue'],
    ['Bạch Hổ', 'Kim', 'vong_thai_tue'],
    ['Phúc Đức', 'Tho', 'vong_thai_tue'],
    ['Điếu Khách', 'Hoa', 'vong_thai_tue'],
    ['Trực Phù', 'Hoa', 'vong_thai_tue']
  ];
  for (let i = 0; i < 12; i++) {
    const pos = (chiYearIndex + i) % 12;
    const [name, elem, cat] = THAI_TUE_STARS[i];
    addStar(pos, name, elem, cat);
  }

  // 8. Vòng Tràng Sinh (12 sao)
  // Vị trí Tràng Sinh theo Cục: Thủy/Thổ (8 - Thân), Mộc (11 - Hợi), Kim (5 - Tỵ), Hỏa (2 - Dần)
  let trangSinhStart = 8;
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
    addStar(pos, name, elem, 'vong_trang_sinh');
  }

  // 9. Thiên Mã (theo tam hợp năm)
  let posMa = 8; // Thân
  if ([8, 0, 4].includes(chiYearIndex)) posMa = 2; // Dần
  else if ([5, 9, 1].includes(chiYearIndex)) posMa = 11; // Hợi
  else if ([11, 3, 7].includes(chiYearIndex)) posMa = 5; // Tỵ
  addStar(posMa, 'Thiên Mã', 'Hoa', 'phu_tinh_cat', 'D');

  // 10. Đào Hoa, Hồng Loan, Thiên Hỷ
  let posDaoHoa = 3; // Mão
  if ([8, 0, 4].includes(chiYearIndex)) posDaoHoa = 9; // Dậu
  else if ([5, 9, 1].includes(chiYearIndex)) posDaoHoa = 6; // Ngọ
  else if ([11, 3, 7].includes(chiYearIndex)) posDaoHoa = 0; // Tý
  addStar(posDaoHoa, 'Đào Hoa', 'Moc', 'phu_tinh_cat');

  // Hồng Loan (Mão khởi Tý, nghịch đến chi năm)
  const posHongLoan = (3 - chiYearIndex + 12) % 12;
  const posThienHy = (posHongLoan + 6) % 12;
  addStar(posHongLoan, 'Hồng Loan', 'Thuy', 'phu_tinh_cat');
  addStar(posThienHy, 'Thiên Hỷ', 'Thuy', 'phu_tinh_cat');

  // 11. Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ)
  const tuHoaRules = TU_HOA_TABLE[canYear];
  if (tuHoaRules) {
    for (const [starName, hoaName] of Object.entries(tuHoaRules)) {
      // Tìm vị trí của starName trong minor hoặc major
      // Gán thêm nhãn Tứ Hóa vào vị trí sao đó
      let targetPos = -1;
      if (starName === 'Tả Phù') targetPos = posTaPhu;
      else if (starName === 'Hữu Bật') targetPos = posHuuBat;
      else if (starName === 'Văn Xương') targetPos = posVanXuong;
      else if (starName === 'Văn Khúc') targetPos = posVanKhuc;
      
      if (targetPos >= 0) {
        addStar(targetPos, hoaName, hoaName === 'Hóa Kỵ' ? 'Thuy' : 'Moc', 'tu_hoa');
      }
    }
  }

  // 12. Triệt Lộ Không Vong (theo Can năm, chiếm 2 cung)
  const TRIET_MAP: Record<string, [number, number]> = {
    'Giáp': [8, 9], 'Kỷ': [8, 9],
    'Ất': [6, 7], 'Canh': [6, 7],
    'Bính': [4, 5], 'Tân': [4, 5],
    'Đinh': [2, 3], 'Nhâm': [2, 3],
    'Mậu': [0, 1], 'Quý': [0, 1]
  };
  const triet = TRIET_MAP[canYear] || [8, 9];

  // 13. Tuần Trung Không Vong (theo Can Chi năm, chiếm 2 cung)
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const canIndex = CAN.indexOf(canYear);
  const diff = (chiYearIndex - canIndex + 12) % 12;
  const tuan = [(diff + 10) % 12, (diff + 11) % 12];

  return {
    minorStars: result,
    tuan,
    triet
  };
}
