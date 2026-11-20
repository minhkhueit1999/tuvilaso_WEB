import { ChartData, TuViInput, TuViRuleset, Palace } from './types.js';
import { generateTuViChart } from './index.js';
import { getTuHoaTable } from './stars.js';
import { NGU_HANH_NAP_AM } from './elements.js';

export interface PhiHoaDetail {
  starName: string;
  sourcePalaceName: string;
  sourceCan: string;
  targetPalaceName: string;
  targetPalaceId: number;
  xungPalaceName?: string;
  xungPalaceId?: number;
  meaning: string;
}

export interface PersonPhiHoaSummary {
  fromPersonName: string;
  toPersonName: string;
  loc: PhiHoaDetail;
  quyen: PhiHoaDetail;
  khoa: PhiHoaDetail;
  ky: PhiHoaDetail;
}

export interface SynastryScoreAxis {
  axis: 'thauHieuDuyenNo' | 'hoTroTaiLoc' | 'dongHanhSuNghiep' | 'xungKhacApLuc';
  label: string;
  score: number; // 0 - 100
  assessment: string;
}

export interface SynastryResult {
  personA: {
    name: string;
    gender: string;
    solarDate: string;
    lunarDate: string;
    birthHour: string;
    canChiYear: string;
    banMenh: string;
    menhPalaceBranch: string;
    chart: ChartData;
  };
  personB: {
    name: string;
    gender: string;
    solarDate: string;
    lunarDate: string;
    birthHour: string;
    canChiYear: string;
    banMenh: string;
    menhPalaceBranch: string;
    chart: ChartData;
  };
  purpose: 'marriage' | 'business';
  phiHoaAtoB: PersonPhiHoaSummary;
  phiHoaBtoA: PersonPhiHoaSummary;
  scores: SynastryScoreAxis[];
  totalScore: number;
  branchHarmony: {
    yearBranchRelation: string;
    menhBranchRelation: string;
    napAmRelation: string;
  };
  overallVerdict: {
    title: string;
    summary: string;
    strengths: string[];
    cautions: string[];
    remedy: string;
  };
}

const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// 6 Pairs of Nhị Hợp (Lục Hợp)
const NHI_HOP_PAIRS: [number, number][] = [
  [0, 1], // Tý - Sửu
  [2, 11], // Dần - Hợi
  [3, 10], // Mão - Tuất
  [4, 9], // Thìn - Dậu
  [5, 8], // Tỵ - Thân
  [6, 7]  // Ngọ - Mùi
];

// Tam Hợp Groups
const TAM_HOP_GROUPS: number[][] = [
  [8, 0, 4],  // Thân - Tý - Thìn
  [5, 9, 1],  // Tỵ - Dậu - Sửu
  [2, 6, 10], // Dần - Ngọ - Tuất
  [11, 3, 7]  // Hợi - Mão - Mùi
];

// Lục Xung
const LUC_XUNG_PAIRS: [number, number][] = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]
];

// Lục Hại
const LUC_HAI_PAIRS: [number, number][] = [
  [0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]
];

function checkBranchRelation(idxA: number, idxB: number): string {
  if (idxA === idxB) return 'Đồng Cung (Đồng Khí Hòa Hợp)';
  if (TAM_HOP_GROUPS.some(g => g.includes(idxA) && g.includes(idxB))) {
    return 'Tam Hợp (Tương Sinh Trợ Lực Vững Vàng)';
  }
  if (NHI_HOP_PAIRS.some(([x, y]) => (x === idxA && y === idxB) || (x === idxB && y === idxA))) {
    return 'Nhị Hợp (Ám Hợp Quý Nhân Hậu Thuẫn)';
  }
  if (LUC_XUNG_PAIRS.some(([x, y]) => (x === idxA && y === idxB) || (x === idxB && y === idxA))) {
    return 'Lục Xung (Trực Xung Dễ Đối Đầu Ý Kiến)';
  }
  if (LUC_HAI_PAIRS.some(([x, y]) => (x === idxA && y === idxB) || (x === idxB && y === idxA))) {
    return 'Lục Hại (Ngầm Bất Hòa Cần Nhường Nhịn)';
  }
  return 'Bình Hòa Tương Phối';
}

function checkNapAmRelation(elementA: string, elementB: string): string {
  const map: Record<string, string> = {
    'Kim': 'Thủy',
    'Thủy': 'Mộc',
    'Mộc': 'Hỏa',
    'Hỏa': 'Thổ',
    'Thổ': 'Kim'
  };
  const khacMap: Record<string, string> = {
    'Kim': 'Mộc',
    'Mộc': 'Thổ',
    'Thổ': 'Thủy',
    'Thủy': 'Hỏa',
    'Hỏa': 'Kim'
  };

  const getEle = (full: string) => {
    if (full.includes('Kim')) return 'Kim';
    if (full.includes('Mộc')) return 'Mộc';
    if (full.includes('Thủy')) return 'Thủy';
    if (full.includes('Hỏa')) return 'Hỏa';
    if (full.includes('Thổ')) return 'Thổ';
    return 'Kim';
  };

  const eA = getEle(elementA);
  const eB = getEle(elementB);

  if (eA === eB) return `Tương Hòa (${eA} cùng ${eB} - Đồng thanh tương ứng)`;
  if (map[eA] === eB) return `Tương Sinh (${eA} sinh ${eB} - Nuôi dưỡng trợ lực)`;
  if (map[eB] === eA) return `Tương Sinh (${eB} sinh ${eA} - Nuôi dưỡng trợ lực)`;
  if (khacMap[eA] === eB) return `Tương Khắc (${eA} khắc ${eB} - Cần tiết chế tôi luyện)`;
  if (khacMap[eB] === eA) return `Tương Khắc (${eB} khắc ${eA} - Cần tiết chế tôi luyện)`;
  return 'Hòa Khí Bình Ổn';
}

function computePersonPhiHoa(
  sourceChart: ChartData,
  targetChart: ChartData,
  sourcePalaceName: string,
  ruleset?: TuViRuleset
): PersonPhiHoaSummary {
  const sourcePalace = sourceChart.palaces.find(p => p.name === sourcePalaceName) || sourceChart.palaces[0];
  const sourceCan = sourcePalace.can;
  const tuHoaTable = getTuHoaTable(ruleset);
  const hoa = tuHoaTable[sourceCan] || tuHoaTable['Giáp'];

  const findTargetPalaceByStar = (starName: string): Palace => {
    return targetChart.palaces.find(p =>
      p.majorStars.some(s => s.name.includes(starName)) ||
      p.minorStars.some(s => s.name.includes(starName))
    ) || targetChart.palaces[0];
  };

  const pLoc = findTargetPalaceByStar(hoa.loc);
  const pQuyen = findTargetPalaceByStar(hoa.quyen);
  const pKhoa = findTargetPalaceByStar(hoa.khoa);
  const pKy = findTargetPalaceByStar(hoa.ky);
  const xungKyId = (pKy.id + 6) % 12;
  const pKyXung = targetChart.palaces.find(p => p.id === xungKyId) || targetChart.palaces[0];

  return {
    fromPersonName: sourceChart.thienBan.fullName,
    toPersonName: targetChart.thienBan.fullName,
    loc: {
      starName: hoa.loc,
      sourcePalaceName,
      sourceCan,
      targetPalaceName: pLoc.name,
      targetPalaceId: pLoc.id,
      meaning: `Mang đến lộc tài, duyên lành và sự vui vẻ, hanh thông nhập cung ${pLoc.name} của đối phương.`
    },
    quyen: {
      starName: hoa.quyen,
      sourcePalaceName,
      sourceCan,
      targetPalaceName: pQuyen.name,
      targetPalaceId: pQuyen.id,
      meaning: `Gia tăng uy quyền, quyền lực và sự chủ động hành động nhập cung ${pQuyen.name} của đối phương.`
    },
    khoa: {
      starName: hoa.khoa,
      sourcePalaceName,
      sourceCan,
      targetPalaceName: pKhoa.name,
      targetPalaceId: pKhoa.id,
      meaning: `Mang đến danh tiếng, sự thấu hiểu hòa nhã và quý nhân cứu giải nhập cung ${pKhoa.name} của đối phương.`
    },
    ky: {
      starName: hoa.ky,
      sourcePalaceName,
      sourceCan,
      targetPalaceName: pKy.name,
      targetPalaceId: pKy.id,
      xungPalaceName: pKyXung.name,
      xungPalaceId: pKyXung.id,
      meaning: `Tạo áp lực, trăn trở, chấp niệm nhập cung ${pKy.name} (xung cung ${pKyXung.name}) của đối phương.`
    }
  };
}

export function calculateSynastry(
  inputA: TuViInput | ChartData,
  inputB: TuViInput | ChartData,
  purpose: 'marriage' | 'business' = 'marriage',
  ruleset?: TuViRuleset
): SynastryResult {
  const chartA = 'palaces' in inputA ? inputA : generateTuViChart({ ...inputA, ruleset: ruleset || inputA.ruleset });
  const chartB = 'palaces' in inputB ? inputB : generateTuViChart({ ...inputB, ruleset: ruleset || inputB.ruleset });

  const primaryPalaceA = purpose === 'marriage' ? 'Mệnh' : 'Mệnh';
  const primaryPalaceB = purpose === 'marriage' ? 'Mệnh' : 'Mệnh';

  const phiHoaAtoB = computePersonPhiHoa(chartA, chartB, primaryPalaceA, ruleset);
  const phiHoaBtoA = computePersonPhiHoa(chartB, chartA, primaryPalaceB, ruleset);

  const menhA = chartA.palaces.find(p => p.isMenh) || chartA.palaces[0];
  const menhB = chartB.palaces.find(p => p.isMenh) || chartB.palaces[0];

  const idxYearA = BRANCHES.indexOf(chartA.thienBan.canChiYear.split(' ')[1] || 'Tý');
  const idxYearB = BRANCHES.indexOf(chartB.thienBan.canChiYear.split(' ')[1] || 'Tý');

  const yearBranchRelation = checkBranchRelation(idxYearA >= 0 ? idxYearA : 0, idxYearB >= 0 ? idxYearB : 0);
  const menhBranchRelation = checkBranchRelation(menhA.id, menhB.id);
  const napAmRelation = checkNapAmRelation(chartA.thienBan.banMenh, chartB.thienBan.banMenh);

  // Quantitative 4-Axis Score Calculation
  let baseUnderstanding = 68;
  let baseWealth = 65;
  let baseCareer = 66;
  let baseConflict = 72; // Higher is better (lower tension)

  // Branch bonuses
  if (menhBranchRelation.includes('Tam Hợp')) {
    baseUnderstanding += 14;
    baseCareer += 10;
  } else if (menhBranchRelation.includes('Nhị Hợp')) {
    baseUnderstanding += 16;
    baseWealth += 8;
  } else if (menhBranchRelation.includes('Lục Xung')) {
    baseUnderstanding -= 12;
    baseConflict -= 18;
  } else if (menhBranchRelation.includes('Lục Hại')) {
    baseUnderstanding -= 8;
    baseConflict -= 12;
  }

  // Nạp Âm bonuses
  if (napAmRelation.includes('Tương Sinh')) {
    baseUnderstanding += 10;
    baseWealth += 10;
  } else if (napAmRelation.includes('Tương Khắc')) {
    baseConflict -= 10;
  }

  // Phi Lộc / Quyền / Khoa / Kỵ impacts
  const targetLocA = phiHoaAtoB.loc.targetPalaceName;
  const targetKyA = phiHoaAtoB.ky.targetPalaceName;
  const targetLocB = phiHoaBtoA.loc.targetPalaceName;
  const targetKyB = phiHoaBtoA.ky.targetPalaceName;

  if (['Mệnh', 'Tài Bạch', 'Điền Trạch'].includes(targetLocA) || ['Mệnh', 'Tài Bạch', 'Điền Trạch'].includes(targetLocB)) {
    baseWealth += 12;
  }
  if (['Quan Lộc', 'Mệnh'].includes(phiHoaAtoB.quyen.targetPalaceName) || ['Quan Lộc', 'Mệnh'].includes(phiHoaBtoA.quyen.targetPalaceName)) {
    baseCareer += 12;
  }
  if (['Mệnh', 'Phúc Đức', 'Phu Thê'].includes(phiHoaAtoB.khoa.targetPalaceName) || ['Mệnh', 'Phúc Đức', 'Phu Thê'].includes(phiHoaBtoA.khoa.targetPalaceName)) {
    baseUnderstanding += 10;
  }

  if (['Mệnh', 'Thân', 'Tật Ách', 'Phu Thê'].includes(targetKyA) || ['Mệnh', 'Thân', 'Tật Ách', 'Phu Thê'].includes(targetKyB)) {
    baseConflict -= 14;
  }

  const clamp = (val: number) => Math.max(35, Math.min(96, Math.round(val)));

  const scoreUnderstanding = clamp(baseUnderstanding);
  const scoreWealth = clamp(baseWealth);
  const scoreCareer = clamp(baseCareer);
  const scoreConflict = clamp(baseConflict);

  const totalScore = Math.round((scoreUnderstanding + scoreWealth + scoreCareer + scoreConflict) / 4);

  const scores: SynastryScoreAxis[] = [
    {
      axis: 'thauHieuDuyenNo',
      label: purpose === 'marriage' ? 'Duyên Nợ & Thấu Hiểu' : 'Tâm Đầu Ý Hợp',
      score: scoreUnderstanding,
      assessment: scoreUnderstanding >= 80 ? 'Duyên sâu thấu hiểu, đồng điệu tâm hồn' : scoreUnderstanding >= 60 ? 'Hòa hợp ổn định, cần chia sẻ thêm' : 'Khác biệt suy nghĩ, cần lắng nghe'
    },
    {
      axis: 'hoTroTaiLoc',
      label: 'Hỗ Trợ Tài Lộc & Kinh Tế',
      score: scoreWealth,
      assessment: scoreWealth >= 80 ? 'Vượng tài đắc lộc, bổ khuyết tài chính' : scoreWealth >= 60 ? 'Kinh tế bình ổn, tự lực tương trợ' : 'Tài chính độc lập, tránh chung chạ mập mờ'
    },
    {
      axis: 'dongHanhSuNghiep',
      label: 'Đồng Hành Sự Nghiệp & Xã Hội',
      score: scoreCareer,
      assessment: scoreCareer >= 80 ? 'Đồng chí hướng lớn, nâng tầm danh tiếng' : scoreCareer >= 60 ? 'Tương trợ công việc, phân công rõ ràng' : 'Hai hướng đi riêng, không nên áp đặt'
    },
    {
      axis: 'xungKhacApLuc',
      label: 'Chỉ Số Hòa Khí (Ít Xung Đột)',
      score: scoreConflict,
      assessment: scoreConflict >= 80 ? 'Hòa khí sinh tài, ít tranh chấp cãi vã' : scoreConflict >= 60 ? 'Đôi khi bất đồng nhưng dễ hóa giải' : 'Dễ khắc khẩu áp lực, cần nhẫn nhịn'
    }
  ];

  const strengths: string[] = [];
  const cautions: string[] = [];

  if (menhBranchRelation.includes('Tam Hợp') || menhBranchRelation.includes('Nhị Hợp')) {
    strengths.push(`Cung Mệnh hai bên đạt thế ${menhBranchRelation}, tạo lực hút tự nhiên và thấu cảm sâu sắc.`);
  }
  if (napAmRelation.includes('Tương Sinh')) {
    strengths.push(`Ngũ hành nạp âm ${napAmRelation}, bổ trợ sinh khí lâu dài.`);
  }
  strengths.push(`${chartA.thienBan.fullName} Phi Hóa Lộc nhập ${phiHoaAtoB.loc.targetPalaceName} của ${chartB.thienBan.fullName}, mang phúc khí thực tế.`);
  strengths.push(`${chartB.thienBan.fullName} Phi Hóa Lộc nhập ${phiHoaBtoA.loc.targetPalaceName} của ${chartA.thienBan.fullName}, đem lại thiện duyên bền chặt.`);

  if (menhBranchRelation.includes('Lục Xung') || menhBranchRelation.includes('Lục Hại')) {
    cautions.push(`Chi cung Mệnh hai bên phạm ${menhBranchRelation}, dễ gặp xung đột khi cái tôi quá cao.`);
  }
  cautions.push(`Lưu ý ${chartA.thienBan.fullName} Phi Kỵ nhập ${phiHoaAtoB.ky.targetPalaceName} của đối phương, tránh kiểm soát thái quá lĩnh vực này.`);
  cautions.push(`Lưu ý ${chartB.thienBan.fullName} Phi Kỵ nhập ${phiHoaBtoA.ky.targetPalaceName} của đối phương, cần mềm mỏng trong ứng xử.`);

  const remedy = purpose === 'marriage'
    ? 'Hóa giải bằng cách tôn trọng không gian cá nhân của đối phương; một người nói một người nên lắng nghe; chú trọng hỗ trợ nhau thực tế thay vì kỳ vọng đối phương thay đổi tính nết.'
    : 'Hóa giải bằng hợp đồng pháp lý minh bạch, phân chia quyền hạn và trách nhiệm dứt khoát ngay từ đầu; ai mạnh mảng nào chuyên trách mảng đó, tài chính hạch toán rõ ràng.';

  return {
    personA: {
      name: chartA.thienBan.fullName,
      gender: chartA.thienBan.gender,
      solarDate: chartA.thienBan.solarDate,
      lunarDate: chartA.thienBan.lunarDate,
      birthHour: chartA.thienBan.birthHour,
      canChiYear: chartA.thienBan.canChiYear,
      banMenh: chartA.thienBan.banMenh,
      menhPalaceBranch: menhA.branch,
      chart: chartA
    },
    personB: {
      name: chartB.thienBan.fullName,
      gender: chartB.thienBan.gender,
      solarDate: chartB.thienBan.solarDate,
      lunarDate: chartB.thienBan.lunarDate,
      birthHour: chartB.thienBan.birthHour,
      canChiYear: chartB.thienBan.canChiYear,
      banMenh: chartB.thienBan.banMenh,
      menhPalaceBranch: menhB.branch,
      chart: chartB
    },
    purpose,
    phiHoaAtoB,
    phiHoaBtoA,
    scores,
    totalScore,
    branchHarmony: {
      yearBranchRelation,
      menhBranchRelation,
      napAmRelation
    },
    overallVerdict: {
      title: totalScore >= 80 ? 'Hợp Cách Đại Cát (Đồng Duyên Vượng Khí)' : totalScore >= 65 ? 'Hòa Hợp Trung Cát (Cần Bồi Đắp Tương Trợ)' : 'Bình Hòa Thận Trọng (Cần Tu Tâm Nhẫn Nại)',
      summary: `Mối quan hệ giữa ${chartA.thienBan.fullName} và ${chartB.thienBan.fullName} đạt tổng điểm hòa hợp ${totalScore}/100. ${strengths[0] || ''}`,
      strengths,
      cautions,
      remedy
    }
  };
}

