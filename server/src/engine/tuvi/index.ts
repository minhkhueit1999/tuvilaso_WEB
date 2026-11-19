import {
  TuViInput,
  ChartData,
  Palace,
  ThienBan
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
  PALACE_GRID_POSITIONS,
  getMenhThanPosition,
  getPalaceCanList,
  buildTamPhuongTuChinh,
  calculateDaiHan,
  calculateTieuHan
} from './palaces.js';
import {
  findTuViPosition,
  placeMajorStars,
  placeMinorStars
} from './stars.js';
import { generateInterpretation } from './interpreter.js';

export * from './types.js';

export function generateTuViChart(input: TuViInput): ChartData {
  const {
    fullName = 'Vô Danh',
    gender = 'male',
    calendarType = 'solar',
    day,
    month,
    year,
    hour = 12,
    minute = 0,
    isLeapMonth = false,
    viewingYear = 2026
  } = input;

  // 1. Quy đổi Lịch
  let solarDay = day;
  let solarMonth = month;
  let solarYear = year;

  let lunarDay = day;
  let lunarMonth = month;
  let lunarYear = year;
  let isLeap = isLeapMonth;

  if (calendarType === 'solar') {
    const lDate = solarToLunar(solarDay, solarMonth, solarYear);
    lunarDay = lDate.day;
    lunarMonth = lDate.month;
    lunarYear = lDate.year;
    isLeap = lDate.isLeap;
  } else {
    const sDate = lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap);
    solarDay = sDate.day;
    solarMonth = sDate.month;
    solarYear = sDate.year;
  }

  // 2. Can Chi Năm, Tháng, Ngày, Giờ
  const canChi = getCanChi(solarDay, solarMonth, solarYear, hour, lunarMonth, lunarYear);
  const chiHourIndex = CHI_NAMES.indexOf(canChi.chiHour);

  // 3. Vị trí Cung Mệnh & Thân
  const { menhIndex, thanIndex } = getMenhThanPosition(lunarMonth, chiHourIndex);

  // 4. Âm Dương & Bản Mệnh
  const amDuongInfo = getAmDuongNamNu(canChi.canYear, gender);
  const banMenhInfo = getNapAm(canChi.canYear, canChi.chiYear);

  // 5. Cục
  const cuc = calculateCuc(canChi.canYear, menhIndex);

  // 6. Can của 12 Cung (Ngũ Hổ Độn)
  const palaceCanList = getPalaceCanList(canChi.canYear);

  // 7. Đại Hạn & Tiểu Hạn
  const daiHanMap = calculateDaiHan(menhIndex, cuc, amDuongInfo.isThuan);
  const tieuHanMap = calculateTieuHan(canChi.chiYear, gender);

  // 8. An 14 Chính Tinh
  const tuViPos = findTuViPosition(lunarDay, cuc);
  const majorStarsMap = placeMajorStars(tuViPos);

  // 9. An Phụ Tinh & Tuần/Triệt
  const { minorStars: minorStarsMap, tuan: tuanList, triet: trietList } = placeMinorStars(
    canChi.canYear,
    canChi.chiYear,
    lunarMonth,
    chiHourIndex,
    cuc,
    amDuongInfo.isThuan,
    gender
  );

  // 10. Xây dựng 12 Cung
  const palaces: Palace[] = [];
  const tamPhuongTuChinh = buildTamPhuongTuChinh();

  for (let i = 0; i < 12; i++) {
    // Tên cung: Mệnh tại menhIndex, đi nghịch địa chi
    const diffFromMenh = (menhIndex - i + 12) % 12;
    const palaceName = PALACE_NAMES[diffFromMenh];

    const palace: Palace = {
      id: i,
      name: palaceName,
      branch: CHI_NAMES[i],
      can: palaceCanList[i],
      element: PALACE_ELEMENTS[i],
      isMenh: i === menhIndex,
      isThan: i === thanIndex,
      majorStars: majorStarsMap[i] || [],
      minorStars: minorStarsMap[i] || [],
      triet: trietList.includes(i),
      tuan: tuanList.includes(i),
      daiHan: daiHanMap[i] ?? 0,
      tieuHan: tieuHanMap[i] ?? '',
      position: PALACE_GRID_POSITIONS[i]
    };

    palaces.push(palace);
    tamPhuongTuChinh[i].palaceName = palaceName;
  }

  // Cung Thân cư ở đâu:
  const thanPalace = palaces.find(p => p.isThan) || palaces[0];
  const thanCu = thanPalace.isMenh ? 'Mệnh' : thanPalace.name;

  // 11. Thiên Bàn
  const pad = (n: number) => n.toString().padStart(2, '0');
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
    viewingYear
  };

  // 12. Sinh Luận Giải Động
  const interpretation = generateInterpretation(thienBan, palaces, tamPhuongTuChinh, viewingYear);

  return {
    createdAt: new Date().toISOString(),
    thienBan,
    palaces,
    tamPhuongTuChinh,
    interpretation
  };
}
