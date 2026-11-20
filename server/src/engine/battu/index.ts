export interface PillarInfo {
  can: string;
  chi: string;
  canChi: string;
  element: string; // Ngũ hành của Can Chi (Nạp Âm hoặc Can)
  hiddenStems: { stem: string; element: string; percentage: number }[];
}

export interface BaZiResult {
  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo;
  nhatChu: {
    can: string;
    element: string;
    description: string;
  };
  elementDistribution: {
    element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
    percentage: number;
    color: string;
    weight: number;
  }[];
  strength: {
    dacLenh: boolean;
    dacDia: boolean;
    overall: 'Vượng' | 'Cường' | 'Bình Hòa' | 'Nhược';
    explanation: string;
  };
  hyDungThan: {
    dungThan: string;
    hyThan: string;
    kyThan: string;
    advice: string;
  };
}

const CANS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHIS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const CAN_ELEMENTS: Record<string, 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'> = {
  'Giáp': 'Mộc', 'Ất': 'Mộc',
  'Bính': 'Hỏa', 'Đinh': 'Hỏa',
  'Mậu': 'Thổ', 'Kỷ': 'Thổ',
  'Canh': 'Kim', 'Tân': 'Kim',
  'Nhâm': 'Thủy', 'Quý': 'Thủy'
};

const HIDDEN_STEMS: Record<string, { stem: string; percentage: number }[]> = {
  'Tý': [{ stem: 'Quý', percentage: 100 }],
  'Sửu': [{ stem: 'Kỷ', percentage: 60 }, { stem: 'Quý', percentage: 30 }, { stem: 'Tân', percentage: 10 }],
  'Dần': [{ stem: 'Giáp', percentage: 60 }, { stem: 'Bính', percentage: 30 }, { stem: 'Mậu', percentage: 10 }],
  'Mão': [{ stem: 'Ất', percentage: 100 }],
  'Thìn': [{ stem: 'Mậu', percentage: 60 }, { stem: 'Ất', percentage: 30 }, { stem: 'Quý', percentage: 10 }],
  'Tỵ': [{ stem: 'Bính', percentage: 60 }, { stem: 'Mậu', percentage: 30 }, { stem: 'Canh', percentage: 10 }],
  'Ngọ': [{ stem: 'Đinh', percentage: 70 }, { stem: 'Kỷ', percentage: 30 }],
  'Mùi': [{ stem: 'Kỷ', percentage: 60 }, { stem: 'Đinh', percentage: 30 }, { stem: 'Ất', percentage: 10 }],
  'Thân': [{ stem: 'Canh', percentage: 60 }, { stem: 'Nhâm', percentage: 30 }, { stem: 'Mậu', percentage: 10 }],
  'Dậu': [{ stem: 'Tân', percentage: 100 }],
  'Tuất': [{ stem: 'Mậu', percentage: 60 }, { stem: 'Tân', percentage: 30 }, { stem: 'Đinh', percentage: 10 }],
  'Hợi': [{ stem: 'Nhâm', percentage: 70 }, { stem: 'Giáp', percentage: 30 }]
};

export function getJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 24 Solar Terms boundary days (rough threshold for month stem change in BaZi)
// Dần (Tháng 1 Bát Tự) starts at Lập Xuân (~Feb 4)
const SOLAR_TERM_MONTH_STARTS = [
  { month: 2, day: 4, chiIndex: 2 },  // Dần (Lập Xuân)
  { month: 3, day: 5, chiIndex: 3 },  // Mão (Kinh Trập)
  { month: 4, day: 4, chiIndex: 4 },  // Thìn (Thanh Minh)
  { month: 5, day: 5, chiIndex: 5 },  // Tỵ (Lập Hạ)
  { month: 6, day: 5, chiIndex: 6 },  // Ngọ (Mang Chủng)
  { month: 7, day: 7, chiIndex: 7 },  // Mùi (Tiểu Thử)
  { month: 8, day: 7, chiIndex: 8 },  // Thân (Lập Thu)
  { month: 9, day: 7, chiIndex: 9 },  // Dậu (Bạch Lộ)
  { month: 10, day: 8, chiIndex: 10 }, // Tuất (Hàn Lộ)
  { month: 11, day: 7, chiIndex: 11 }, // Hợi (Lập Đông)
  { month: 12, day: 7, chiIndex: 0 },  // Tý (Đại Tuyết)
  { month: 1, day: 5, chiIndex: 1 }    // Sửu (Tiểu Hàn)
];

function getBaZiYearAndMonthChi(year: number, month: number, day: number): { baziYear: number; monthChiIndex: number } {
  // If before Lập Xuân (Feb 4), belongs to previous solar year
  let baziYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    baziYear = year - 1;
  }

  // Determine Month Chi
  let monthChiIndex = 2; // Default Dần
  if (month === 1) {
    monthChiIndex = day >= 5 ? 1 : 0; // Sửu or Tý
  } else if (month === 2) {
    monthChiIndex = day >= 4 ? 2 : 1; // Dần or Sửu
  } else if (month === 3) {
    monthChiIndex = day >= 5 ? 3 : 2; // Mão or Dần
  } else if (month === 4) {
    monthChiIndex = day >= 4 ? 4 : 3; // Thìn or Mão
  } else if (month === 5) {
    monthChiIndex = day >= 5 ? 5 : 4; // Tỵ or Thìn
  } else if (month === 6) {
    monthChiIndex = day >= 5 ? 6 : 5; // Ngọ or Tỵ
  } else if (month === 7) {
    monthChiIndex = day >= 7 ? 7 : 6; // Mùi or Ngọ
  } else if (month === 8) {
    monthChiIndex = day >= 7 ? 8 : 7; // Thân or Mùi
  } else if (month === 9) {
    monthChiIndex = day >= 7 ? 9 : 8; // Dậu or Thân
  } else if (month === 10) {
    monthChiIndex = day >= 8 ? 10 : 9; // Tuất or Dậu
  } else if (month === 11) {
    monthChiIndex = day >= 7 ? 11 : 10; // Hợi or Tuất
  } else if (month === 12) {
    monthChiIndex = day >= 7 ? 0 : 11; // Tý or Hợi
  }

  return { baziYear, monthChiIndex };
}

export function calculateBaZi(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  solarHour: number = 12,
  solarMinute: number = 0
): BaZiResult {
  const { baziYear, monthChiIndex } = getBaZiYearAndMonthChi(solarYear, solarMonth, solarDay);

  // 1. Trụ Năm
  const yearCanIndex = (baziYear + 6) % 10;
  const yearChiIndex = (baziYear + 8) % 12;
  const yearCan = CANS[yearCanIndex];
  const yearChi = CHIS[yearChiIndex];

  // 2. Trụ Tháng (Ngũ Hổ Độn theo Can Năm)
  // Giáp Kỷ -> Bính Dần (start index 2)
  // Ất Canh -> Mậu Dần (start index 4)
  // Bính Tân -> Canh Dần (start index 6)
  // Đinh Nhâm -> Nhâm Dần (start index 8)
  // Mậu Quý -> Giáp Dần (start index 0)
  const nguHoDonOffset = (yearCanIndex % 5) * 2 + 2;
  // monthChiIndex: Dần is 2, Mão is 3...
  const monthOffsetFromDan = (monthChiIndex + 10) % 12; // Dần=0, Mão=1...
  const monthCanIndex = (nguHoDonOffset + monthOffsetFromDan) % 10;
  const monthCan = CANS[monthCanIndex];
  const monthChi = CHIS[monthChiIndex];

  // 3. Trụ Ngày (Julian Day Number)
  const jdn = getJDN(solarYear, solarMonth, solarDay);
  const dayCanIndex = (jdn + 9) % 10;
  const dayChiIndex = (jdn + 1) % 12;
  const dayCan = CANS[dayCanIndex];
  const dayChi = CHIS[dayChiIndex];

  // 4. Trụ Giờ (Ngũ Thử Độn theo Can Ngày)
  // Hour Branch: Tý (23-01)=0, Sửu (01-03)=1, Dần (03-05)=2...
  let hourChiIndex = Math.floor((solarHour + 1) / 2) % 12;
  const nguThuDonOffset = (dayCanIndex % 5) * 2;
  const hourCanIndex = (nguThuDonOffset + hourChiIndex) % 10;
  const hourCan = CANS[hourCanIndex];
  const hourChi = CHIS[hourChiIndex];

  const buildPillar = (can: string, chi: string): PillarInfo => {
    const rawHidden = HIDDEN_STEMS[chi] || [{ stem: can, percentage: 100 }];
    const hiddenStems = rawHidden.map(h => ({
      stem: h.stem,
      element: CAN_ELEMENTS[h.stem] || 'Kim',
      percentage: h.percentage
    }));
    return {
      can,
      chi,
      canChi: `${can} ${chi}`,
      element: CAN_ELEMENTS[can],
      hiddenStems
    };
  };

  const yearPillar = buildPillar(yearCan, yearChi);
  const monthPillar = buildPillar(monthCan, monthChi);
  const dayPillar = buildPillar(dayCan, dayChi);
  const hourPillar = buildPillar(hourCan, hourChi);

  // 5. Tỷ lệ 5 Ngũ Hành
  // Weight: 4 Heavenly Stems (100 points each) + 4 Earthly Branches Hidden Stems (100 points each) = 800 total points
  const elementWeights: Record<'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ', number> = {
    'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0
  };

  // Add heavenly stems
  [yearCan, monthCan, dayCan, hourCan].forEach(c => {
    const ele = CAN_ELEMENTS[c];
    elementWeights[ele] += 100;
  });

  // Add hidden stems
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    p.hiddenStems.forEach(h => {
      const ele = CAN_ELEMENTS[h.stem];
      elementWeights[ele] += h.percentage;
    });
  });

  const totalPoints = Object.values(elementWeights).reduce((a, b) => a + b, 0) || 1;
  const elementDistribution = (['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as const).map(ele => {
    const pct = Math.round((elementWeights[ele] / totalPoints) * 100);
    const colorMap = {
      'Kim': '#52606D',
      'Mộc': '#166534',
      'Thủy': '#1D4ED8',
      'Hỏa': '#B91C1C',
      'Thổ': '#B45309'
    };
    return {
      element: ele,
      percentage: pct,
      color: colorMap[ele],
      weight: elementWeights[ele]
    };
  });

  // Ensure total sum is exactly 100%
  const currentSum = elementDistribution.reduce((sum, item) => sum + item.percentage, 0);
  if (currentSum !== 100) {
    elementDistribution[0].percentage += (100 - currentSum);
  }

  // 6. Nhật Chủ & Thân Vượng / Nhược
  const nhatChuElement = CAN_ELEMENTS[dayCan];
  const monthBranchElement = monthPillar.element;
  const dacLenh = nhatChuElement === monthBranchElement ||
    (nhatChuElement === 'Hỏa' && monthBranchElement === 'Mộc') ||
    (nhatChuElement === 'Thổ' && monthBranchElement === 'Hỏa') ||
    (nhatChuElement === 'Kim' && monthBranchElement === 'Thổ') ||
    (nhatChuElement === 'Thủy' && monthBranchElement === 'Kim') ||
    (nhatChuElement === 'Mộc' && monthBranchElement === 'Thủy');

  const dacDia = [yearChi, dayChi, hourChi].some(c => HIDDEN_STEMS[c]?.some(h => CAN_ELEMENTS[h.stem] === nhatChuElement));

  const nhatChuWeight = elementWeights[nhatChuElement];
  const overall: 'Vượng' | 'Cường' | 'Bình Hòa' | 'Nhược' =
    dacLenh && dacDia ? 'Vượng' :
    dacLenh || nhatChuWeight >= 220 ? 'Cường' :
    dacDia || nhatChuWeight >= 150 ? 'Bình Hòa' : 'Nhược';

  // 7. Gợi ý Hỷ / Dụng Thần
  let dungThan = 'Thủy';
  let hyThan = 'Mộc';
  let kyThan = 'Hỏa';

  if (overall === 'Vượng' || overall === 'Cường') {
    // Vượng cần Khắc / Tiết: Dùng Quan Sát hoặc Thực Thương / Tài Tinh
    if (nhatChuElement === 'Mộc') { dungThan = 'Kim (Quan)'; hyThan = 'Thổ (Tài)'; kyThan = 'Thủy (Ấn)'; }
    else if (nhatChuElement === 'Hỏa') { dungThan = 'Thủy (Quan)'; hyThan = 'Kim (Tài)'; kyThan = 'Mộc (Ấn)'; }
    else if (nhatChuElement === 'Thổ') { dungThan = 'Mộc (Quan)'; hyThan = 'Thủy (Tài)'; kyThan = 'Hỏa (Ấn)'; }
    else if (nhatChuElement === 'Kim') { dungThan = 'Hỏa (Quan)'; hyThan = 'Mộc (Tài)'; kyThan = 'Thổ (Ấn)'; }
    else if (nhatChuElement === 'Thủy') { dungThan = 'Thổ (Quan)'; hyThan = 'Hỏa (Tài)'; kyThan = 'Kim (Ấn)'; }
  } else {
    // Nhược cần Sinh / Trợ: Dùng Chính Ấn hoặc Tỷ Kiếp
    if (nhatChuElement === 'Mộc') { dungThan = 'Thủy (Ấn)'; hyThan = 'Mộc (Tỷ)'; kyThan = 'Kim (Sát)'; }
    else if (nhatChuElement === 'Hỏa') { dungThan = 'Mộc (Ấn)'; hyThan = 'Hỏa (Tỷ)'; kyThan = 'Thủy (Sát)'; }
    else if (nhatChuElement === 'Thổ') { dungThan = 'Hỏa (Ấn)'; hyThan = 'Thổ (Tỷ)'; kyThan = 'Mộc (Sát)'; }
    else if (nhatChuElement === 'Kim') { dungThan = 'Thổ (Ấn)'; hyThan = 'Kim (Tỷ)'; kyThan = 'Hỏa (Sát)'; }
    else if (nhatChuElement === 'Thủy') { dungThan = 'Kim (Ấn)'; hyThan = 'Thủy (Tỷ)'; kyThan = 'Thổ (Sát)'; }
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    nhatChu: {
      can: dayCan,
      element: nhatChuElement,
      description: `Nhật Chủ ${dayCan} (${nhatChuElement}): Bản thể nội tâm, khí chất và nhân sinh quan cốt lõi.`
    },
    elementDistribution,
    strength: {
      dacLenh,
      dacDia,
      overall,
      explanation: dacLenh
        ? `Nhật Chủ sinh vào tháng lệnh ${monthChi} tương trợ, đắc lệnh nắm giữ sinh khí dồi dào.`
        : `Nhật Chủ sinh vào tháng lệnh ${monthChi} không tương sinh trực tiếp, chuyển sang dựa vào căn khí địa chi.`
    },
    hyDungThan: {
      dungThan,
      hyThan,
      kyThan,
      advice: `Ưu tiên nạp năng lượng ngũ hành ${dungThan} và ${hyThan} thông qua ngành nghề, phương hướng phong thủy và đối tác phù hợp.`
    }
  };
}

export const calculateBazi = calculateBaZi;

