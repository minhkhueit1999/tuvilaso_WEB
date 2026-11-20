export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';
export type ElementType = 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho';
export type StarBrightness = 'M' | 'V' | 'D' | 'B' | 'H'; // Miếu, Vượng, Đắc, Bình, Hãm
export type TuViSchool = 'tong_hop' | 'nam_phai' | 'bac_phai' | 'phi_tinh';

export type StarCategory = 
  | 'chinh_tinh' 
  | 'phu_tinh_cat' 
  | 'phu_tinh_hung' 
  | 'tu_hoa' 
  | 'vong_bac_si'
  | 'vong_thai_tue' 
  | 'vong_trang_sinh' 
  | 'sao_luu_nien'
  | 'dac_biet';

export interface Star {
  name: string;
  element: ElementType;
  yinYang?: '+' | '-';
  brightness?: StarBrightness;
  category: StarCategory;
  weight?: 'bold' | 'normal';
  side?: 'major' | 'left' | 'right';
  tuHoa?: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';
  isLuuNien?: boolean;
  sinhNienHoa?: 'A' | 'B' | 'C' | 'D';
  tuHoaLyTam?: 'A' | 'B' | 'C' | 'D';
  tuHoaHuongTam?: 'A' | 'B' | 'C' | 'D';
  note?: string;
}

export interface PalacePosition {
  row: number; // 0 to 3
  col: number; // 0 to 3
}

export interface Palace {
  id: number; // 0 to 11 (Tý..Hợi)
  name: string; // Mệnh, Phụ Mẫu, Phúc Đức...
  branch: string; // Tý, Sửu, Dần...
  can: string; // Giáp, Ất, Bính...
  shortCanChi: string; // VD: "K.Tỵ", "G.Thân"
  branchYinYangElement: string; // VD: "-Hoả", "+Thuỷ"
  element: ElementType;
  isMenh: boolean;
  isThan: boolean;
  isLaiNhan?: boolean; // Lai Nhân Cung (Bắc Phái)
  majorStars: Star[];
  catStars: Star[]; // Cát tinh (cột trái)
  satStars: Star[]; // Sát tinh + Lưu tinh (cột phải)
  minorStars: Star[]; // Tất cả phụ tinh
  triet: boolean;
  tuan: boolean;
  daiHan: number;
  tieuHan: string;
  daiHanPalaceName: string; // VD: "ĐV.MỆNH", "ĐV.PHỐI"
  luuNienPalaceName: string; // VD: "LN.HUYNH", "LN.MỆNH"
  luuNguyet: number; // Tháng Lưu Nguyệt (1..12) -> hiển thị "Th.1".."Th.12"
  position: PalacePosition;
}

export interface ThienBan {
  fullName: string;
  gender: string;
  solarDate: string;
  lunarDate: string;
  birthHour: string;
  canChiYear: string;
  canChiMonth: string;
  canChiDay: string;
  canChiHour: string;
  menh: string;
  cuc: string;
  thanCu: string;
  amDuong: string;
  amDuongLy: string;
  banMenh: string;
  chuMenh: string;
  chuThan: string;
  viewingYear: number;
  schoolName: string;
  laiNhanCung: string;
  tuHoaYear: {
    loc: string;
    quyen: string;
    khoa: string;
    ky: string;
  };
}

export interface TamPhuongTuChinh {
  palaceId: number;
  palaceName: string;
  branch: string;
  tamHop: [number, number];
  xungChieu: number;
  nhiHop: number;
}

export interface PhiHoaTarget {
  starName: string;
  toPalaceId: number;
  toPalaceName: string;
  toBranch: string;
}

export interface PhiHoaDetail {
  fromPalaceId: number;
  fromPalaceName: string;
  fromCan: string;
  fromBranch: string;
  loc: PhiHoaTarget;
  quyen: PhiHoaTarget;
  khoa: PhiHoaTarget;
  ky: PhiHoaTarget & { xungPalaceId: number; xungPalaceName: string; xungBranch: string };
  summaryText: string;
  practicalAdvice: string;
}

export interface AspectScores {
  career: number;     // Sự nghiệp (thang 100)
  wealth: number;     // Tài lộc (thang 100)
  love: number;       // Tình duyên (thang 100)
  health: number;     // Sức khỏe (thang 100)
  fortune: number;    // Phúc đức (thang 100)
  summary: {
    career: string;
    wealth: string;
    love: string;
    health: string;
    fortune: string;
  };
}

export interface Interpretation {
  overview: {
    menhCuc: string;
    amDuong: string;
    thanCu: string;
    generalAssessment: string;
    strengths: string[];
    considerations: string[];
  };
  aspectScores: AspectScores;
  palaces: Record<string, string>;
  luckFortune: {
    currentDecade: string;
    currentYear: string;
    advice: string;
  };
  classicPattern?: {
    name: string;
    description: string;
    isAuspicious: boolean;
  };
  khamThienMon?: {
    laiNhanAnalysis: string;
    sinhNienAnalysis: string;
    tuHoaTable: { can: string; loc: string; quyen: string; khoa: string; ky: string }[];
  };
}

export interface ChartData {
  id?: string;
  createdAt: string;
  school?: TuViSchool;
  ruleset?: TuViRuleset;
  laiNhanPalaceId: number;
  laiNhanPalaceName: string;
  thienBan: ThienBan;
  palaces: Palace[];
  tamPhuongTuChinh: Record<number, TamPhuongTuChinh>;
  phiHoaTable: Record<number, PhiHoaDetail>;
  interpretation: Interpretation;
  showTamPhuongTuChinh?: boolean;
  showLuuNien?: boolean;
  radar?: any;
  bazi?: any;
  kline?: any;
  calendar?: any;
  nhiHopMap?: Record<number, number>;
  vanHan?: any;
}

export type CanhVariant = 'vn_standard' | 'toan_thu' | 'bac_phai_alt';
export type NhamVariant = 'vn_standard' | 'toan_thu';
export type MauVariant = 'vn_standard' | 'toan_thu';
export type ZiHourMode = 'split_next_day' | 'keep_current_day';
export type LeapMonthMode = 'previous_month' | 'split_day_15' | 'next_month';
export type YearBoundaryMode = 'lunar_new_year' | 'lichun';
export type KhoiVietVariant = 'vn_standard' | 'bac_phai';
export type LuuNguyetMethod = 'thai_tue' | 'tieu_han';
export type SchoolPreset = 'nam_phai_vn' | 'bac_phai_kham_thien' | 'trung_chau' | 'toan_thu' | 'custom';

export interface TuViRuleset {
  id?: string;
  name?: string;
  canhVariant?: CanhVariant;
  nhamVariant?: NhamVariant;
  mauVariant?: MauVariant;
  ziHourMode?: ZiHourMode;
  leapMonthMode?: LeapMonthMode;
  yearBoundaryMode?: YearBoundaryMode;
  khoiVietVariant?: KhoiVietVariant;
  luuNguyetMethod?: LuuNguyetMethod;
  schoolPreset?: SchoolPreset;
}

export interface TuViInput {
  fullName: string;
  gender: Gender;
  calendarType: CalendarType;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  isLeapMonth?: boolean;
  viewingYear?: number;
  school?: TuViSchool;
  showTamPhuongTuChinh?: boolean;
  showLuuNien?: boolean;
  ruleset?: TuViRuleset;
}
