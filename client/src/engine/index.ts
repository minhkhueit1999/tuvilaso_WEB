import {
  TuViInput,
  ChartData,
  Palace,
  ThienBan,
  TuViSchool,
  Star,
  VanHanCoordinates
} from './types.js';
import {
  solarToLunar,
  lunarToSolar,
  getCanChi
} from './lunar.js';
import {
  getNapAm,
  getAmDuongNamNu,
  calculateCuc,
  CAN_NAMES,
  TU_HOA_TABLE
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
  calculateDaiHanDetails,
  calculateDaiHanPalaceNames,
  calculateLuuDaiHanPath,
  calculateTieuHanInfo,
  calculateLuuNienPalaceNames,
  calculateLuuNguyetDetailed
} from './palaces.js';
import {
  findTuViPosition,
  placeMajorStars,
  placeMinorStars,
  calculateTuHoaLyHuongTam,
  calculatePhiHoaTable,
  getChuMenh,
  getChuThan
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
    selectedDecadeIndex,
    luuNguyetMethod = 'thai_tue',
    school = 'tong_hop',
    showTamPhuongTuChinh = true,
    showLuuNien = true,
    showVanHanPath = true
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
  const chiYearIndex = CHI_NAMES.indexOf(canChi.chiYear);
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
  const daiHanMap = calculateDaiHan(cuc, amDuongInfo.isThuan, menhIndex);
  const tieuHanMap = calculateTieuHan(canChi.chiYear, gender);

  // 8. An 14 Chính Tinh (kèm Sinh Niên Tứ Hóa A/B/C/D)
  const tuViPos = findTuViPosition(lunarDay, cuc);
  const rawMajorStarsMap = placeMajorStars(tuViPos, canChi.canYear);

  // 9. An Phụ Tinh, Sao Lưu Niên & Tuần/Triệt (110+ sao)
  const {
    catStars: rawCatStars,
    satStars: rawSatStars,
    minorStars: rawMinorStars,
    tuan: tuanList,
    triet: trietList
  } = placeMinorStars(
    canChi.canYear,
    canChi.chiYear,
    lunarMonth,
    lunarDay,
    chiHourIndex,
    cuc,
    amDuongInfo.isThuan,
    viewingYear,
    menhIndex,
    thanIndex
  );

  // 10. Tính Tự Hóa Ly Tâm & Hướng Tâm cho toàn bộ các cung
  const { updatedMajor: majorStarsMap, updatedMinor } = calculateTuHoaLyHuongTam(
    palaceCanList,
    rawMajorStarsMap,
    rawMinorStars
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

  // 12. Danh sách tên 12 Cung Bản Mệnh
  const palaceNames: string[] = [];
  for (let i = 0; i < 12; i++) {
    const diffFromMenh = (menhIndex - i + 12) % 12;
    palaceNames[i] = PALACE_NAMES[diffFromMenh];
  }

  // Tuổi âm tại năm xem hạn: age = viewingYear - lunarYear + 1
  const currentAge = Math.max(1, viewingYear - lunarYear + 1);

  // Chi và Can của năm xem hạn
  const viewChiIndex = ((viewingYear - 4) % 12 + 12) % 12;
  const viewCanName = CAN_NAMES[((viewingYear - 4) % 10 + 10) % 10];

  // (1) Đại Vận & Đồng Hạn
  const daiHanDetails = calculateDaiHanDetails(
    cuc.number,
    canChi.canYear,
    gender,
    menhIndex,
    currentAge,
    palaceCanList,
    palaceNames,
    selectedDecadeIndex
  );
  const { dvDir, dvDirectionLabel, daiHanAges, daiVanList, activeDecade } = daiHanDetails;
  const dvChi = activeDecade.dvChi;
  const dvCan = palaceCanList[dvChi];
  const dvStartAge = activeDecade.startAge;
  const dvEndAge = activeDecade.endAge;

  // (2) 12 Cung Đại Vận (Bắt buộc luôn đi THUẬN +1 từ dvChi)
  const daiHanPalaceNamesMap = calculateDaiHanPalaceNames(dvChi);

  // (3) Lưu Đại Hạn (10 năm Ziczac Nam Phái)
  const daiVanYearlyPath = calculateLuuDaiHanPath(
    dvChi,
    dvDir,
    dvStartAge,
    lunarYear,
    palaceCanList,
    palaceNames
  );
  const offsetInDecade = currentAge - dvStartAge;
  const clampedOffset = Math.max(0, Math.min(9, offsetInDecade));
  const ldhStep = daiVanYearlyPath.find(p => p.offset === clampedOffset) || daiVanYearlyPath[0];
  const ldhChi = ldhStep.chiIdx;
  const ldhPalaceName = palaceNames[ldhChi];

  // (4) Tiểu Hạn (Theo Giới tính)
  const tieuHanInfo = calculateTieuHanInfo(canChi.chiYear, gender, currentAge);
  const { tieuHanLabels, tieuHanChi } = tieuHanInfo;
  const tieuHanPalaceName = palaceNames[tieuHanChi];

  // (5) Lưu Niên Thái Tuế (Luôn đi THUẬN +1 từ viewChiIndex)
  const luuNienPalaceNamesMap = calculateLuuNienPalaceNames(viewChiIndex);
  const lnMenhChi = viewChiIndex;
  const lnPalaceName = palaceNames[lnMenhChi];

  // (6) Lưu Nguyệt Đẩu Quân (Thái Tuế / Tiểu Hạn)
  const luuNguyetResult = calculateLuuNguyetDetailed(
    viewChiIndex,
    tieuHanChi,
    lunarMonth,
    chiHourIndex,
    luuNguyetMethod
  );
  const luuNguyetMap = luuNguyetResult.luuNguyetMap;

  // (7) Tứ Hóa Tầng Vận
  const dvTuHoaRules = TU_HOA_TABLE[dvCan] || { loc: '', quyen: '', khoa: '', ky: '' };
  const lnTuHoaRules = TU_HOA_TABLE[viewCanName] || { loc: '', quyen: '', khoa: '', ky: '' };

  const applyVanHanTuHoa = (star: Star): Star => {
    let dvTuHoa: Star['dvTuHoa'] = undefined;
    if (dvTuHoaRules.loc && star.name === dvTuHoaRules.loc) dvTuHoa = 'ĐV.Lộc';
    else if (dvTuHoaRules.quyen && star.name === dvTuHoaRules.quyen) dvTuHoa = 'ĐV.Quyền';
    else if (dvTuHoaRules.khoa && star.name === dvTuHoaRules.khoa) dvTuHoa = 'ĐV.Khoa';
    else if (dvTuHoaRules.ky && star.name === dvTuHoaRules.ky) dvTuHoa = 'ĐV.Kỵ';

    let lnTuHoa: Star['lnTuHoa'] = undefined;
    if (lnTuHoaRules.loc && star.name === lnTuHoaRules.loc) lnTuHoa = 'L.Hóa Lộc';
    else if (lnTuHoaRules.quyen && star.name === lnTuHoaRules.quyen) lnTuHoa = 'L.Hóa Quyền';
    else if (lnTuHoaRules.khoa && star.name === lnTuHoaRules.khoa) lnTuHoa = 'L.Hóa Khoa';
    else if (lnTuHoaRules.ky && star.name === lnTuHoaRules.ky) lnTuHoa = 'L.Hóa Kỵ';

    return {
      ...star,
      dvTuHoa,
      lnTuHoa
    };
  };

  const finalMajorStars: Record<number, Star[]> = {};
  const finalCatStars: Record<number, Star[]> = {};
  const finalSatStars: Record<number, Star[]> = {};
  const finalMinorStars: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) {
    finalMajorStars[i] = (majorStarsMap[i] || []).map(applyVanHanTuHoa);
    finalCatStars[i] = (catStars[i] || []).map(applyVanHanTuHoa);
    finalSatStars[i] = (satStars[i] || []).map(applyVanHanTuHoa);
    finalMinorStars[i] = (updatedMinor[i] || []).map(applyVanHanTuHoa);
  }

  // 13. Xây dựng 12 Cung
  const palaces: Palace[] = [];
  const tamPhuongTuChinh = buildTamPhuongTuChinh();
  const allStarsLocation: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const palaceName = palaceNames[i];
    const can = palaceCanList[i];
    const branch = CHI_NAMES[i];
    const shortCan = can.charAt(0);
    const shortCanChi = `${shortCan}.${branch}`;
    const branchYinYangElement = BRANCH_YINYANG_ELEMENT[i];

    // Ghi nhận vị trí các sao để phục vụ Phi Tinh
    for (const s of finalMajorStars[i] || []) {
      allStarsLocation[s.name] = i;
    }
    for (const s of finalMinorStars[i] || []) {
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
      isDV: i === dvChi,
      isLDH: i === ldhChi,
      isTieuHan: i === tieuHanChi,
      isLN: i === lnMenhChi,
      majorStars: finalMajorStars[i] || [],
      catStars: finalCatStars[i] || [],
      satStars: finalSatStars[i] || [],
      minorStars: finalMinorStars[i] || [],
      triet: trietList.includes(i),
      tuan: tuanList.includes(i),
      daiHan: daiHanAges[i] ?? 0,
      tieuHan: tieuHanLabels[i] ?? '',
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
  const phiHoaTable = calculatePhiHoaTable(palaceCanList, palaceNamesList, allStarsLocation);

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
  const tuHoaRules = TU_HOA_TABLE[canChi.canYear] || { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' };

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

  // 17. Chồng Cung (Tam Bàn Hợp Nhất)
  const chongCungRelationships: string[] = [];
  const checkPair = (nameA: string, chiA: number, nameB: string, chiB: number) => {
    if (chiA === chiB) {
      chongCungRelationships.push(`${nameA} và ${nameB} đồng cung tại ${CHI_NAMES[chiA]} (${palaceNames[chiA]}) — Khí lực trùng phùng, chuyển hóa mạnh mẽ.`);
    } else if ((chiA - chiB + 12) % 12 === 6) {
      chongCungRelationships.push(`${nameA} (${CHI_NAMES[chiA]}) xung chiếu ${nameB} (${CHI_NAMES[chiB]}) — Đối cung xung phá, cần dự phòng biến động.`);
    } else if ((chiA - chiB + 12) % 12 === 4 || (chiA - chiB + 12) % 12 === 8) {
      chongCungRelationships.push(`${nameA} (${CHI_NAMES[chiA]}) tam hợp ${nameB} (${CHI_NAMES[chiB]}) — Cục diện tương trợ, có cơ hội quý nhân phù trợ.`);
    }
  };
  checkPair('Đại Vận', dvChi, 'Lưu Thái Tuế', lnMenhChi);
  checkPair('Đại Vận', dvChi, 'Tiểu Hạn', tieuHanChi);
  checkPair('Lưu Đại Hạn', ldhChi, 'Lưu Thái Tuế', lnMenhChi);
  checkPair('Lưu Đại Hạn', ldhChi, 'Tiểu Hạn', tieuHanChi);
  checkPair('Tiểu Hạn', tieuHanChi, 'Lưu Thái Tuế', lnMenhChi);
  if (chongCungRelationships.length === 0) {
    chongCungRelationships.push('Các tọa độ vận hạn phân bố độc lập trên bàn đồ, vận trình phân hóa đa hướng, không gặp thế xung khắc dồn dập.');
  }

  // 18. Lưới 12 Tháng Lưu Nguyệt
  const luuNguyetTable = [];
  for (let m = 1; m <= 12; m++) {
    const entry = Object.entries(luuNguyetMap).find(([_, mon]) => mon === m);
    const pId = entry ? parseInt(entry[0], 10) : 0;
    const pMajor = (finalMajorStars[pId] || []).map(s => s.name);
    let assessment = 'Bình hòa, ổn định kế hoạch';
    if (pMajor.some(name => ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thái Âm', 'Thái Dương'].includes(name))) {
      assessment = 'Cát lành hanh thông, thuận mưu đại sự';
    } else if (pMajor.some(name => ['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(name))) {
      assessment = 'Biến chuyển bất ngờ, cần hành động quyết đoán';
    } else if (pMajor.some(name => ['Cự Môn', 'Liêm Trinh', 'Thiên Đồng'].includes(name))) {
      assessment = 'Cẩn trọng thị phi, chú ý lời ăn tiếng nói và giấy tờ';
    }
    luuNguyetTable.push({
      month: m,
      palaceId: pId,
      palaceName: palaceNames[pId],
      can: palaceCanList[pId],
      branch: CHI_NAMES[pId],
      majorStars: pMajor,
      assessment
    });
  }

  const vanHan: VanHanCoordinates = {
    age: currentAge,
    isDongHan: activeDecade.isDongHan,
    dongHanPalaceName: activeDecade.dongHanPalaceName,
    dvDir,
    dvDirectionLabel,
    dvChi,
    dvPalaceName: palaceNames[dvChi],
    dvCan,
    dvStartAge,
    dvEndAge,
    dvTuHoa: {
      loc: dvTuHoaRules.loc,
      quyen: dvTuHoaRules.quyen,
      khoa: dvTuHoaRules.khoa,
      ky: dvTuHoaRules.ky
    },
    ldhChi,
    ldhPalaceName,
    tieuHanChi,
    tieuHanPalaceName,
    lnMenhChi,
    lnPalaceName,
    lnCan: viewCanName,
    lnTuHoa: {
      loc: lnTuHoaRules.loc,
      quyen: lnTuHoaRules.quyen,
      khoa: lnTuHoaRules.khoa,
      ky: lnTuHoaRules.ky
    },
    chongCung: {
      dvMenhOnBanMenh: `Cung ${palaceNames[dvChi]} (${CHI_NAMES[dvChi]})`,
      ldhOnBanMenh: `Cung ${palaceNames[ldhChi]} (${CHI_NAMES[ldhChi]})`,
      tieuHanOnBanMenh: `Cung ${palaceNames[tieuHanChi]} (${CHI_NAMES[tieuHanChi]})`,
      lnMenhOnBanMenh: `Cung ${palaceNames[lnMenhChi]} (${CHI_NAMES[lnMenhChi]})`,
      relationships: chongCungRelationships
    },
    luuNguyetMethod,
    luuNguyetTable,
    daiVanList,
    daiVanYearlyPath
  };

  // 19. Sinh Luận Giải Động theo trường phái
  const interpretation = generateInterpretation(thienBan, palaces, tamPhuongTuChinh, viewingYear, school);

  return {
    createdAt: new Date().toISOString(),
    school,
    laiNhanPalaceId,
    laiNhanPalaceName: laiNhanPalace.name,
    thienBan,
    palaces,
    tamPhuongTuChinh,
    phiHoaTable,
    vanHan,
    interpretation,
    showTamPhuongTuChinh,
    showLuuNien,
    showVanHanPath
  };
}
