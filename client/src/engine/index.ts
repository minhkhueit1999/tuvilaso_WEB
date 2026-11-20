import {
  TuViInput,
  ChartData,
  Palace,
  ThienBan,
  TuViSchool
} from './types.js';
import {
  solarToLunar,
  lunarToSolar,
  getCanChi
} from './lunar.js';
import {
  getNapAm,
  getAmDuongNamNu,
  calculateCuc
} from './elements.js';
import {
  CHI_NAMES,
  PALACE_NAMES,
  PALACE_ELEMENTS,
  BRANCH_YINYANG_ELEMENT,
  PALACE_GRID_POSITIONS,
  getMenhThanPosition,
  getPalaceCanList,
  buildTamPhuongTuChinh,
  calculateDaiHan,
  calculateTieuHan,
  calculateDaiHanPalaceNames,
  calculateLuuNienPalaceNames,
  calculateLuuNguyet
} from './palaces.js';
import {
  findTuViPosition,
  placeMajorStars,
  placeMinorStars,
  calculateTuHoaLyHuongTam,
  calculatePhiHoaTable,
  getChuMenh,
  getChuThan,
  TU_HOA_TABLE,
  getTuHoaTable
} from './stars.js';
import { generateInterpretation, answerTuViQuestion } from './interpreter.js';

export * from './types.js';
export { answerTuViQuestion };

export function generateTuViChart(input: TuViInput): ChartData {
  const {
    fullName = 'Đương Số',
    gender = 'male',
    calendarType = 'solar',
    day,
    month,
    year,
    hour = 12,
    minute = 0,
    isLeapMonth = false,
    viewingYear = 2026,
    school = 'tong_hop',
    showTamPhuongTuChinh = true,
    showLuuNien = true,
    ruleset
  } = input;

  // 1. Quy đổi Lịch & Tùy biến Giờ Tý (ziHourMode)
  // 'split_next_day': Giờ Tý 23:00–00:00 (Vãn Tý) tính sang ngày hôm sau
  // 'keep_current_day': Giữ nguyên ngày cũ
  let solarDay = day;
  let solarMonth = month;
  let solarYear = year;

  let lunarDay = day;
  let lunarMonth = month;
  let lunarYear = year;
  let isLeap = Boolean(isLeapMonth);

  if (calendarType === 'solar') {
    if (hour === 23 && ruleset?.ziHourMode === 'split_next_day') {
      const dt = new Date(year, month - 1, day);
      dt.setDate(dt.getDate() + 1);
      solarDay = dt.getDate();
      solarMonth = dt.getMonth() + 1;
      solarYear = dt.getFullYear();
    }
    const lDate = solarToLunar(solarDay, solarMonth, solarYear);
    lunarDay = lDate.day;
    lunarMonth = lDate.month;
    lunarYear = lDate.year;
    isLeap = lDate.isLeap;
  } else {
    if (hour === 23 && ruleset?.ziHourMode === 'split_next_day') {
      lunarDay = day + 1;
    }
    const sDate = lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap);
    solarDay = sDate.day;
    solarMonth = sDate.month;
    solarYear = sDate.year;
  }

  // 2. Tùy biến Tháng Nhuận (leapMonthMode)
  // 'previous_month': tính theo tháng trước (mặc định)
  // 'split_day_15': 1–15 tính tháng trước, 16–30 tính tháng sau
  // 'next_month': đẩy sang tháng sau
  let effectiveLunarMonth = lunarMonth;
  if (isLeap) {
    if (ruleset?.leapMonthMode === 'next_month') {
      effectiveLunarMonth = (lunarMonth % 12) + 1;
    } else if (ruleset?.leapMonthMode === 'split_day_15') {
      if (lunarDay > 15) {
        effectiveLunarMonth = (lunarMonth % 12) + 1;
      }
    }
  }

  // 3. Tùy biến Mốc Đổi Năm (yearBoundaryMode)
  // 'lunar_new_year': Mùng 1 Tết Âm (chuẩn Tử Vi)
  // 'lichun': Tiết Lập Xuân (4/2 Dương lịch)
  let effectiveCanYearYear = lunarYear;
  if (ruleset?.yearBoundaryMode === 'lichun') {
    if (solarMonth < 2 || (solarMonth === 2 && solarDay < 4)) {
      effectiveCanYearYear = solarYear - 1;
    } else {
      effectiveCanYearYear = solarYear;
    }
  }

  // 4. Can Chi Năm, Tháng, Ngày, Giờ
  const canChi = getCanChi(solarDay, solarMonth, solarYear, hour, effectiveLunarMonth, effectiveCanYearYear);
  const chiYearIndex = CHI_NAMES.indexOf(canChi.chiYear);
  const chiHourIndex = CHI_NAMES.indexOf(canChi.chiHour);

  // 5. Vị trí Cung Mệnh & Thân
  const { menhIndex, thanIndex } = getMenhThanPosition(effectiveLunarMonth, chiHourIndex);

  // 6. Âm Dương & Bản Mệnh
  const amDuongInfo = getAmDuongNamNu(canChi.canYear, gender);
  const banMenhInfo = getNapAm(canChi.canYear, canChi.chiYear);

  // 7. Cục
  const cuc = calculateCuc(canChi.canYear, menhIndex);

  // 8. Can của 12 Cung (Ngũ Hổ Độn)
  const palaceCanList = getPalaceCanList(canChi.canYear);

  // 9. Đại Hạn & Tiểu Hạn
  const daiHanMap = calculateDaiHan(cuc, amDuongInfo.isThuan, menhIndex);
  const tieuHanMap = calculateTieuHan(canChi.chiYear, gender);

  // 10. An 14 Chính Tinh (kèm Sinh Niên Tứ Hóa A/B/C/D)
  const tuViPos = findTuViPosition(lunarDay, cuc);
  const rawMajorStarsMap = placeMajorStars(tuViPos, canChi.canYear, ruleset);

  // 11. An Phụ Tinh, Sao Lưu Niên & Tuần/Triệt (110+ sao)
  const {
    catStars: rawCatStars,
    satStars: rawSatStars,
    minorStars: rawMinorStars,
    tuan: tuanList,
    triet: trietList
  } = placeMinorStars(
    canChi.canYear,
    canChi.chiYear,
    effectiveLunarMonth,
    lunarDay,
    chiHourIndex,
    cuc,
    amDuongInfo.isThuan,
    viewingYear,
    menhIndex,
    thanIndex,
    ruleset
  );

  // 12. Tính Tự Hóa Ly Tâm & Hướng Tâm cho toàn bộ các cung
  const { updatedMajor: majorStarsMap, updatedMinor } = calculateTuHoaLyHuongTam(
    palaceCanList,
    rawMajorStarsMap,
    rawMinorStars,
    ruleset
  );

  // Cập nhật lại catStars và satStars với Tự Hóa
  const catStars: Record<number, typeof rawCatStars[0]> = {};
  const satStars: Record<number, typeof rawSatStars[0]> = {};
  for (let i = 0; i < 12; i++) {
    catStars[i] = (rawCatStars[i] || []).map(s => {
      const found = updatedMinor[i]?.find(m => m.name === s.name);
      return found ? { ...s, tuHoaLyTam: found.tuHoaLyTam, tuHoaHuongTam: found.tuHoaHuongTam } : s;
    });
    satStars[i] = (rawSatStars[i] || []).map(s => {
      const found = updatedMinor[i]?.find(m => m.name === s.name);
      return found ? { ...s, tuHoaLyTam: found.tuHoaLyTam, tuHoaHuongTam: found.tuHoaHuongTam } : s;
    });
  }

  // 11. Xác định Lai Nhân Cung (Cung có Can trùng với Can năm sinh của đương số)
  let laiNhanPalaceId = palaceCanList.indexOf(canChi.canYear);
  if (laiNhanPalaceId === -1) {
    laiNhanPalaceId = menhIndex; // Fallback an toàn
  }

  // 12. Tính toán Cung Đại Vận, Lưu Niên và Lưu Nguyệt
  const birthYear = parseInt(canChi.canYear, 10) || year;
  const currentAge = Math.max(1, viewingYear - birthYear + 1);

  let currentDecadePalaceId = menhIndex;
  for (let i = 0; i < 12; i++) {
    const dH = daiHanMap[i] ?? 0;
    if (currentAge >= dH && currentAge < dH + 10) {
      currentDecadePalaceId = i;
      break;
    }
  }

  const chiViewingYearIndex = (viewingYear + 8) % 12;
  const daiHanPalaceNamesMap = calculateDaiHanPalaceNames(menhIndex, currentDecadePalaceId);
  const luuNienPalaceNamesMap = calculateLuuNienPalaceNames(menhIndex, chiViewingYearIndex);
  const luuNguyetMap = calculateLuuNguyet(chiYearIndex, lunarMonth, chiHourIndex);

  // 13. Xây dựng 12 Cung
  const palaces: Palace[] = [];
  const tamPhuongTuChinh = buildTamPhuongTuChinh();
  const allStarsLocation: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const diffFromMenh = (menhIndex - i + 12) % 12;
    const palaceName = PALACE_NAMES[diffFromMenh];
    const can = palaceCanList[i];
    const branch = CHI_NAMES[i];
    const shortCan = can.charAt(0);
    const shortCanChi = `${shortCan}.${branch}`;
    const branchYinYangElement = BRANCH_YINYANG_ELEMENT[i];

    // Ghi nhận vị trí các sao để phục vụ Phi Tinh
    for (const s of majorStarsMap[i] || []) {
      allStarsLocation[s.name] = i;
    }
    for (const s of updatedMinor[i] || []) {
      allStarsLocation[s.name] = i;
    }

    const palace: Palace = {
      id: i,
      name: palaceName,
      branch,
      can,
      shortCanChi,
      branchYinYangElement,
      element: PALACE_ELEMENTS[i],
      isMenh: i === menhIndex,
      isThan: i === thanIndex,
      isLaiNhan: i === laiNhanPalaceId,
      majorStars: majorStarsMap[i] || [],
      catStars: catStars[i] || [],
      satStars: satStars[i] || [],
      minorStars: updatedMinor[i] || [],
      triet: trietList.includes(i),
      tuan: tuanList.includes(i),
      daiHan: daiHanMap[i] ?? 0,
      tieuHan: tieuHanMap[i] ?? '',
      daiHanPalaceName: daiHanPalaceNamesMap[i] || '',
      luuNienPalaceName: luuNienPalaceNamesMap[i] || '',
      luuNguyet: luuNguyetMap[i] ?? 1,
      position: PALACE_GRID_POSITIONS[i]
    };

    palaces.push(palace);
    tamPhuongTuChinh[i].palaceName = palaceName;
  }

  // 14. Tính Bảng Phi Tinh Tứ Hóa cho 12 Cung
  const palaceNamesList = palaces.map(p => p.name);
  const phiHoaTable = calculatePhiHoaTable(palaceCanList, palaceNamesList, allStarsLocation, ruleset);

  // Cung Thân cư ở đâu:
  const thanPalace = palaces.find(p => p.isThan) || palaces[0];
  const thanCu = thanPalace.isMenh ? 'Mệnh' : thanPalace.name;
  const laiNhanPalace = palaces.find(p => p.isLaiNhan) || palaces[0];

  // 15. Tên trường phái hiển thị
  const schoolNamesMap: Record<TuViSchool, string> = {
    'tong_hop': 'Tổng Hợp (Toàn Đồ)',
    'nam_phai': 'Nam Phái (Tam Hợp & Miếu Hãm)',
    'bac_phai': 'Bắc Phái (Khâm Thiên Tứ Hóa)',
    'phi_tinh': 'Phi Tinh (Tứ Hóa Tương Tác)'
  };

  // 16. Thiên Bàn
  const pad = (n: number) => n.toString().padStart(2, '0');
  const tuHoaTable = getTuHoaTable(ruleset);
  const tuHoaRules = tuHoaTable[canChi.canYear] || { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' };

  const thienBan: ThienBan = {
    fullName,
    gender: gender === 'male' ? 'Nam' : 'Nữ',
    solarDate: `${pad(solarDay)}/${pad(solarMonth)}/${solarYear}`,
    lunarDate: `${pad(lunarDay)}/${pad(lunarMonth)}${isLeap ? ' (nhuận)' : ''}/${lunarYear}`,
    birthHour: `${pad(hour)}:${pad(minute)} (Giờ ${canChi.chiHour})`,
    canChiYear: `${canChi.canYear} ${canChi.chiYear}`,
    canChiMonth: `${canChi.canMonth} ${canChi.chiMonth}`,
    canChiDay: `${canChi.canDay} ${canChi.chiDay}`,
    canChiHour: `${canChi.canHour} ${canChi.chiHour}`,
    menh: banMenhInfo.menh,
    cuc: cuc.name,
    thanCu: `Thân cư ${thanCu}`,
    amDuong: amDuongInfo.label,
    amDuongLy: amDuongInfo.isThuan ? 'Âm Dương Thuận Lý' : 'Âm Dương Nghịch Lý',
    banMenh: banMenhInfo.menh,
    chuMenh: getChuMenh(canChi.chiYear),
    chuThan: getChuThan(canChi.chiYear),
    viewingYear,
    schoolName: schoolNamesMap[school] || schoolNamesMap['tong_hop'],
    laiNhanCung: `${laiNhanPalace.name} (${laiNhanPalace.can} ${laiNhanPalace.branch})`,
    tuHoaYear: {
      loc: tuHoaRules.loc,
      quyen: tuHoaRules.quyen,
      khoa: tuHoaRules.khoa,
      ky: tuHoaRules.ky
    }
  };

  // 17. Sinh Luận Giải Động theo trường phái
  const interpretation = generateInterpretation(thienBan, palaces, tamPhuongTuChinh, viewingYear, school, ruleset);

  return {
    createdAt: new Date().toISOString(),
    school,
    ruleset,
    laiNhanPalaceId,
    laiNhanPalaceName: laiNhanPalace.name,
    thienBan,
    palaces,
    tamPhuongTuChinh,
    phiHoaTable,
    interpretation,
    showTamPhuongTuChinh,
    showLuuNien
  };
}
