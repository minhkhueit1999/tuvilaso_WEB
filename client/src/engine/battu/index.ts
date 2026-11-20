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

function getBaZiYearAndMonthChi(year: number, month: number, day: number): { baziYear: number; monthChiIndex: number } {
  let baziYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    baziYear = year - 1;
  }

  let monthChiIndex = 2; // Default Dần
  if (month === 1) {
    monthChiIndex = day >= 5 ? 1 : 0;
  } else if (month === 2) {
    monthChiIndex = day >= 4 ? 2 : 1;
  } else if (month === 3) {
    monthChiIndex = day >= 5 ? 3 : 2;
  } else if (month === 4) {
    monthChiIndex = day >= 4 ? 4 : 3;
  } else if (month === 5) {
    monthChiIndex = day >= 5 ? 5 : 4;
  } else if (month === 6) {
    monthChiIndex = day >= 5 ? 6 : 5;
  } else if (month === 7) {
    monthChiIndex = day >= 7 ? 7 : 6;
  } else if (month === 8) {
    monthChiIndex = day >= 7 ? 8 : 7;
  } else if (month === 9) {
    monthChiIndex = day >= 7 ? 9 : 8;
  } else if (month === 10) {
    monthChiIndex = day >= 8 ? 10 : 9;
  } else if (month === 11) {
    monthChiIndex = day >= 7 ? 11 : 10;
  } else if (month === 12) {
    monthChiIndex = day >= 7 ? 0 : 11;
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

  // 2. Trụ Tháng (Ngũ Hổ Độn)
  const nguHoDonOffset = (yearCanIndex % 5) * 2 + 2;
  const monthOffsetFromDan = (monthChiIndex + 10) % 12;
  const monthCanIndex = (nguHoDonOffset + monthOffsetFromDan) % 10;
  const monthCan = CANS[monthCanIndex];
  const monthChi = CHIS[monthChiIndex];

  // 3. Trụ Ngày (JDN)
  const jdn = getJDN(solarYear, solarMonth, solarDay);
  const dayCanIndex = (jdn + 9) % 10;
  const dayChiIndex = (jdn + 1) % 12;
  const dayCan = CANS[dayCanIndex];
  const dayChi = CHIS[dayChiIndex];

  // 4. Trụ Giờ (Ngũ Thử Độn)
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
  const elementWeights: Record<'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ', number> = {
    'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0
  };

  [yearCan, monthCan, dayCan, hourCan].forEach(c => {
    const ele = CAN_ELEMENTS[c];
    elementWeights[ele] += 100;
  });

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

  const currentSum = elementDistribution.reduce((sum, item) => sum + item.percentage, 0);
  if (currentSum !== 100) {
    elementDistribution[0].percentage += (100 - currentSum);
  }

  // 6. Nhật Chủ
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

  // 7. Hỷ / Dụng Thần
  let dungThan = 'Thủy';
  let hyThan = 'Mộc';
  let kyThan = 'Hỏa';

  if (overall === 'Vượng' || overall === 'Cường') {
    if (nhatChuElement === 'Mộc') { dungThan = 'Kim (Quan)'; hyThan = 'Thổ (Tài)'; kyThan = 'Thủy (Ấn)'; }
    else if (nhatChuElement === 'Hỏa') { dungThan = 'Thủy (Quan)'; hyThan = 'Kim (Tài)'; kyThan = 'Mộc (Ấn)'; }
    else if (nhatChuElement === 'Thổ') { dungThan = 'Mộc (Quan)'; hyThan = 'Thủy (Tài)'; kyThan = 'Hỏa (Ấn)'; }
    else if (nhatChuElement === 'Kim') { dungThan = 'Hỏa (Quan)'; hyThan = 'Mộc (Tài)'; kyThan = 'Thổ (Ấn)'; }
    else if (nhatChuElement === 'Thủy') { dungThan = 'Thổ (Quan)'; hyThan = 'Hỏa (Tài)'; kyThan = 'Kim (Ấn)'; }
  } else {
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

