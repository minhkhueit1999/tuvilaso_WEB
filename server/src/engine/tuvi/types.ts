export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';
export type ElementType = 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho';
export type StarBrightness = 'M' | 'V' | 'D' | 'B' | 'H'; // Mieu, Vuong, Dac, Binh, Ham
export type StarCategory = 
  | 'chinh_tinh' 
  | 'phu_tinh_cat' 
  | 'phu_tinh_hung' 
  | 'tu_hoa' 
  | 'vong_thai_tue' 
  | 'vong_trang_sinh' 
  | 'dac_biet';

export interface Star {
  name: string;
  element: ElementType;
  brightness?: StarBrightness;
  category: StarCategory;
  note?: string;
}

export interface PalacePosition {
  row: number; // 0 to 3
  col: number; // 0 to 3
}

export interface Palace {
  id: number; // 0 to 11 (Ty, Suu, Dan, Mao, Thin, Ty, Ngo, Mui, Than, Dau, Tuat, Hoi)
  name: string; // Menh, Phu Mau, Phuc Duc, Dien Trach, Quan Loc, No Boc, Thien Di, Tat Ach, Tai Bach, Tu Tuc, Phu The, Huynh De
  branch: string; // Ty, Suu, Dan, Mao, Thin, Ty, Ngo, Mui, Than, Dau, Tuat, Hoi
  can: string; // Giap, At, Binh, Dinh, Mau, Ky, Canh, Tan, Nham, Quy
  element: ElementType;
  isMenh: boolean;
  isThan: boolean;
  majorStars: Star[];
  minorStars: Star[];
  triet: boolean;
  tuan: boolean;
  daiHan: number;
  tieuHan: string;
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
  viewingYear: number;
}

export interface TamPhuongTuChinh {
  palaceId: number;
  palaceName: string;
  branch: string;
  tamHop: [number, number];
  xungChieu: number;
  nhiHop: number;
}

export interface Interpretation {
  overview: {
    menhCuc: string;
    amDuong: string;
    thanCu: string;
    generalAssessment: string;
  };
  palaces: Record<string, string>;
  luckFortune: {
    currentDecade: string;
    currentYear: string;
    advice: string;
  };
}

export interface ChartData {
  id?: string;
  createdAt: string;
  thienBan: ThienBan;
  palaces: Palace[];
  tamPhuongTuChinh: Record<number, TamPhuongTuChinh>;
  interpretation: Interpretation;
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
}
