/**
 * Thuật toán Âm - Dương Lịch Việt Nam chuẩn (Hồ Ngọc Đức - Timezone +7)
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  jd: number;
}

export interface CanChiInfo {
  canYear: string;
  chiYear: string;
  canMonth: string;
  chiMonth: string;
  canDay: string;
  chiDay: string;
  canHour: string;
  chiHour: string;
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function INT(d: number): number {
  return Math.floor(d);
}

// Convert Solar date to Julian Day number (Integer)
export function jdFromDate(dd: number, mm: number, yy: number): number {
  let y = yy;
  let m = mm;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = INT(y / 100);
  const b = 2 - a + INT(a / 4);
  return INT(365.25 * (y + 4716)) + INT(30.6001 * (m + 1)) + dd + b - 1524;
}

// Convert Julian Day to Solar Date
export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let z = jd;
  let a = z;
  if (z >= 2299161) {
    const alpha = INT((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - INT(alpha / 4);
  }
  const b = a + 1524;
  const c = INT((b - 122.1) / 365.25);
  const d = INT(365.25 * c);
  const e = INT((b - d) / 30.6001);
  const day = b - d - INT(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { day, month, year };
}

// Get New Moon Day for a given k at timezone +7
function getNewMoonDay(k: number, timeZone = 7): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  const C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
  const C2 = -0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
  const C3 = -0.0004 * Math.sin(3 * Mpr * dr);
  const C4 = 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
  const C5 = -0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  const C6 = -0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  const C7 = 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((M + 2 * Mpr) * dr);
  const deltaJd = C1 + C2 + C3 + C4 + C5 + C6 + C7;
  const Jd = Jd1 + deltaJd;
  return INT(Jd + 0.5 + timeZone / 24);
}

// Get Sun Longitude at timezone +7
function getSunLongitude(dayNumber: number, timeZone = 7): number {
  const T = (dayNumber - 0.5 - timeZone / 24 - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.00029 * Math.sin(3 * M * dr);
  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return INT((L / Math.PI) * 6);
}

function getLunarMonth11(yy: number, timeZone = 7): number {
  const k = INT((jdFromDate(31, 12, yy) - 2415021.076998695) / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone = 7): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

// Chuyển đổi Dương lịch sang Âm lịch
export function solarToLunar(dd: number, mm: number, yy: number, timeZone = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let isLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        isLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap,
    jd: dayNumber
  };
}

// Chuyển đổi Âm lịch sang Dương lịch
export function lunarToSolar(lunarDay: number, lunarMonth: number, lunarYear: number, isLeap = false, timeZone = 7): { day: number; month: number; year: number } {
  let jd = jdFromDate(1, 1, lunarYear) - 60;
  for (let i = 0; i < 450; i++) {
    const curJd = jd + i;
    const solar = jdToDate(curJd);
    const lDate = solarToLunar(solar.day, solar.month, solar.year, timeZone);
    if (lDate.day === lunarDay && lDate.month === lunarMonth && lDate.year === lunarYear && lDate.isLeap === isLeap) {
      return solar;
    }
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear };
}

// Can Chi Năm, Tháng, Ngày, Giờ
export function getCanChi(solarDay: number, solarMonth: number, solarYear: number, hour: number, lunarMonth: number, lunarYear: number): CanChiInfo {
  const jd = jdFromDate(solarDay, solarMonth, solarYear);

  // Can Chi Năm (theo Năm Âm lịch)
  const canYearIndex = (lunarYear + 6) % 10;
  const chiYearIndex = (lunarYear + 8) % 12;
  const canYear = CAN[canYearIndex];
  const chiYear = CHI[chiYearIndex];

  // Can Chi Tháng
  const canThang1Index = (canYearIndex * 2 + 1) % 10;
  const canMonthIndex = (canThang1Index + (lunarMonth - 1)) % 10;
  const chiMonthIndex = (lunarMonth + 1) % 12; // Tháng 1 là Dần (2)
  const canMonth = CAN[canMonthIndex];
  const chiMonth = CHI[chiMonthIndex];

  // Can Chi Ngày
  const canDayIndex = (jd + 9) % 10;
  const chiDayIndex = (jd + 1) % 12;
  const canDay = CAN[canDayIndex];
  const chiDay = CHI[chiDayIndex];

  // Can Chi Giờ (12 Canh giờ)
  let chiHourIndex = 0;
  if (hour >= 23 || hour < 1) chiHourIndex = 0; // Tý
  else chiHourIndex = INT((hour + 1) / 2);
  const chiHour = CHI[chiHourIndex];

  // Can Giờ: Khởi từ Can Ngày
  const canTyIndex = (canDayIndex % 5) * 2;
  const canHourIndex = (canTyIndex + chiHourIndex) % 10;
  const canHour = CAN[canHourIndex];

  return {
    canYear,
    chiYear,
    canMonth,
    chiMonth,
    canDay,
    chiDay,
    canHour,
    chiHour
  };
}
