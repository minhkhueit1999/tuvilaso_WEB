export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';
export type ElementType = 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho';
export type StarBrightness = 'M' | 'V' | 'D' | 'B' | 'H';

export interface Star {
  name: string;
  element: ElementType;
  brightness?: StarBrightness;
  category: string;
  note?: string;
}

export interface PalacePosition {
  row: number;
  col: number;
}

export interface Palace {
  id: number;
  name: string;
  branch: string;
  can: string;
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
