import { generateTuViChart } from './index.js';
import { ChartData, TuViInput, Palace } from './types.js';

export interface RectificationCriterionOption {
  id: string;
  label: string;
  tags: string[]; // Key astrological keywords to match
}

export interface RectificationCriterion {
  id: string;
  title: string;
  category: 'appearance' | 'sibling' | 'career' | 'marriage' | 'personality' | 'events' | 'parents' | 'health';
  options: RectificationCriterionOption[];
}

export const RECTIFICATION_CRITERIA: RectificationCriterion[] = [
  {
    id: 'crit_appearance',
    title: '1. Ngoại Hình & Thần Thái Khí Chất',
    category: 'appearance',
    options: [
      {
        id: 'app_conguoc',
        label: 'Thanh nhã, dong dỏng cao, mắt sáng, thư sinh hoặc nho nhã hiền hòa',
        tags: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương', 'Văn Xương', 'Văn Khúc']
      },
      {
        id: 'app_tuphu',
        label: 'Uy nghiêm, đẫy đà, khuôn mặt vuông vức hoặc đầy đặn, phong thái chỉ huy',
        tags: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng', 'Tả Phù', 'Hữu Bật']
      },
      {
        id: 'app_satpha',
        label: 'Sắc sảo, mắt sâu hoặc ánh nhìn kiên định, nhanh nhẹn, cá tính mạnh mẽ',
        tags: ['Thất Sát', 'Phá Quân', 'Tham Lang', 'Kình Dương', 'Bạch Hổ']
      },
      {
        id: 'app_cunhat',
        label: 'Miệng tươi, nói năng khúc chiết lưu loát hoặc vang to, ánh nhìn cương trực',
        tags: ['Cự Môn', 'Thái Dương', 'Hóa Lộc', 'Tấu Thư']
      }
    ]
  },
  {
    id: 'crit_sibling',
    title: '2. Vị Thứ Trong Nhà & Anh Chị Em',
    category: 'sibling',
    options: [
      {
        id: 'sib_truong',
        label: 'Là con trưởng, hoặc là con thứ nhưng tính cách quyết đoán gánh vác như con trưởng',
        tags: ['Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Kình Dương', 'Hóa Quyền']
      },
      {
        id: 'sib_thuut',
        label: 'Là con thứ hoặc con út trong nhà, tính tình hòa nhã, được gia đình quan tâm',
        tags: ['Thiên Đồng', 'Thái Âm', 'Hóa Lộc', 'Thiên Lương']
      },
      {
        id: 'sib_itcach',
        label: 'Anh chị em ít hoặc sống xa nhau, mỗi người một phương trời lập nghiệp',
        tags: ['Cô Thần', 'Quả Tú', 'Thất Sát', 'Phá Quân', 'Địa Không', 'Địa Kiếp']
      }
    ]
  },
  {
    id: 'crit_career',
    title: '3. Xu Hướng Nghề Nghiệp & Sở Trường Công Danh',
    category: 'career',
    options: [
      {
        id: 'car_finance',
        label: 'Tài chính, ngân hàng, kế toán, bất động sản hoặc tự doanh thương mại',
        tags: ['Vũ Khúc', 'Lộc Tồn', 'Hóa Lộc', 'Thiên Phủ', 'Tham Lang']
      },
      {
        id: 'car_tech',
        label: 'Kỹ thuật công nghệ, sản xuất, quân đội, công an hoặc quản lý chịu áp lực cao',
        tags: ['Thất Sát', 'Phá Quân', 'Liêm Trinh', 'Kình Dương', 'Đà La', 'Hỏa Tinh']
      },
      {
        id: 'car_edu',
        label: 'Giáo dục, nghiên cứu, y tế, văn hóa nghệ thuật hoặc cố vấn truyền thông',
        tags: ['Hóa Khoa', 'Văn Xương', 'Văn Khúc', 'Thiên Cơ', 'Thiên Lương', 'Hóa Quyền']
      }
    ]
  },
  {
    id: 'crit_marriage',
    title: '4. Đặc Điểm Hôn Nhân & Người Phối Ngẫu',
    category: 'marriage',
    options: [
      {
        id: 'mar_early_peace',
        label: 'Lập gia đình thuận lợi hoặc người phối ngẫu hiền hòa, đảm đang, hỗ trợ tốt',
        tags: ['Thái Âm', 'Thiên Đồng', 'Thiên Phủ', 'Tả Phù', 'Hữu Bật', 'Hóa Lộc']
      },
      {
        id: 'mar_late_diff',
        label: 'Duyên nợ muộn màng, nhiều trắc trở hoặc vợ chồng hay tranh luận bất đồng',
        tags: ['Hóa Kỵ', 'Cự Môn', 'Cô Thần', 'Quả Tú', 'Địa Kiếp', 'Thất Sát']
      }
    ]
  },
  {
    id: 'crit_personality',
    title: '5. Tính Cách & Phong Cách Ứng Xử Nổi Bật',
    category: 'personality',
    options: [
      {
        id: 'per_calm',
        label: 'Trầm tĩnh, thận trọng, coi trọng chữ tín, danh dự và lòng tự trọng',
        tags: ['Tử Vi', 'Thiên Phủ', 'Thiên Tướng', 'Hóa Khoa', 'Ân Quang']
      },
      {
        id: 'per_freedom',
        label: 'Yêu thích tự do, ưa khám phá, ghét sự rập khuôn gò bó, phản ứng nhanh',
        tags: ['Phá Quân', 'Tham Lang', 'Thiên Mã', 'Hóa Quyền']
      },
      {
        id: 'per_analytical',
        label: 'Tư duy sắc sảo, hay phân tích chi tiết, cẩn mật nhưng đôi khi lo xa',
        tags: ['Cự Môn', 'Thiên Cơ', 'Đà La', 'Hóa Kỵ']
      }
    ]
  },
  {
    id: 'crit_events',
    title: '6. Biến Cố / Thay Đổi Lớn Gần Đây (2024–2025)',
    category: 'events',
    options: [
      {
        id: 'evt_move',
        label: 'Có sự thay đổi lớn về công việc, chỗ ở, đi lại công tác nhiều hoặc xuất ngoại',
        tags: ['L.Thiên Mã', 'L.Thái Tuế', 'Thiên Di', 'Quan Lộc']
      },
      {
        id: 'evt_money',
        label: 'Biến động lớn về tài chính: đầu tư lớn, mua sắm tài sản lớn hoặc chi tiêu nhiều',
        tags: ['L.Lộc Tồn', 'Tài Bạch', 'Điền Trạch', 'Hóa Lộc', 'Hóa Kỵ']
      }
    ]
  },
  {
    id: 'crit_parents',
    title: '7. Mối Quan Hệ Với Cha Mẹ',
    category: 'parents',
    options: [
      {
        id: 'par_support',
        label: 'Rất hợp cha hoặc mẹ, được thừa hưởng sự hỗ trợ và tình thương từ gia đình',
        tags: ['Hóa Lộc', 'Hóa Khoa', 'Thiên Khôi', 'Thiên Việt', 'Thái Dương', 'Thái Âm']
      },
      {
        id: 'par_independent',
        label: 'Sớm tự lập, ít sống cùng cha mẹ hoặc tính cách khác biệt với phụ mẫu',
        tags: ['Triệt', 'Tuần', 'Địa Không', 'Địa Kiếp', 'Thất Sát', 'Kình Dương']
      }
    ]
  },
  {
    id: 'crit_health',
    title: '8. Sức Khỏe & Thể Trạng Dễ Mắc Phải',
    category: 'health',
    options: [
      {
        id: 'hea_stomach',
        label: 'Đường tiêu hóa, dạ dày kém hoặc hay bị căng thẳng thần kinh, khó ngủ',
        tags: ['Thiên Cơ', 'Cự Môn', 'Hóa Kỵ', 'Đà La', 'Bệnh Phù']
      },
      {
        id: 'hea_scar',
        label: 'Từng có vết tích/sẹo trên người hoặc hay bị va chạm trầy xước xương khớp',
        tags: ['Thất Sát', 'Kình Dương', 'Thiên Hình', 'Hỏa Tinh', 'Địa Kiếp']
      }
    ]
  }
];

export interface CandidateComparison {
  hourIndex: number; // 0..11
  hourName: string; // VD: "Thìn (07:00 - 08:59)"
  chart: ChartData;
  score: number;
  matchPercent: number;
  matchedReasons: string[];
  keyPalaces: {
    menh: { name: string; branch: string; can: string; stars: string[]; pattern: string };
    than: { name: string; branch: string; can: string; stars: string[] };
    phuThe: { name: string; branch: string; can: string; stars: string[] };
    quanLoc: { name: string; branch: string; can: string; stars: string[] };
    phuMau: { name: string; branch: string; can: string; stars: string[] };
    huynhDe: { name: string; branch: string; can: string; stars: string[] };
  };
}

const CANH_GIO_NAMES = [
  'Tý (23:00 - 00:59)',
  'Sửu (01:00 - 02:59)',
  'Dần (03:00 - 04:59)',
  'Mão (05:00 - 06:59)',
  'Thìn (07:00 - 08:59)',
  'Tỵ (09:00 - 10:59)',
  'Ngọ (11:00 - 12:59)',
  'Mùi (13:00 - 14:59)',
  'Thân (15:00 - 16:59)',
  'Dậu (17:00 - 18:59)',
  'Tuất (19:00 - 20:59)',
  'Hợi (21:00 - 22:59)'
];

const CANH_GIO_HOURS = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

function detectMajorPattern(majorStars: string[]): string {
  const names = majorStars.map(s => s.replace(/^[+-]/, '').split(' ')[0]);
  if (names.some(n => ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'].includes(n))) {
    return 'Tử Phủ Vũ Tướng';
  }
  if (names.some(n => ['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(n))) {
    return 'Sát Phá Tham';
  }
  if (names.some(n => ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].includes(n))) {
    return 'Cơ Nguyệt Đồng Lương';
  }
  if (names.some(n => ['Cự Môn', 'Thái Dương'].includes(n))) {
    return 'Cự Nhật Cách';
  }
  return 'Vô Chính Diệu';
}

export function generateRectificationComparison(
  baseInput: Omit<TuViInput, 'hour' | 'minute'>,
  candidateHours: number[], // Array of hour indices (0..11), e.g. [3, 4, 5]
  selectedOptionIds: string[] = []
): CandidateComparison[] {
  const results: CandidateComparison[] = [];

  for (const hIdx of candidateHours) {
    const hour = CANH_GIO_HOURS[hIdx];
    const hourName = CANH_GIO_NAMES[hIdx];

    const chart = generateTuViChart({
      ...baseInput,
      hour,
      minute: 30
    });

    const findPalace = (name: string): Palace => chart.palaces.find(p => p.name === name) || chart.palaces[0];
    const menhP = findPalace('Mệnh');
    const thanP = chart.palaces.find(p => p.isThan) || chart.palaces[0];
    const theP = findPalace('Phu Thê');
    const quanP = findPalace('Quan Lộc');
    const phuP = findPalace('Phụ Mẫu');
    const huynhP = findPalace('Huynh Đệ');

    // Collect all stars in candidate chart for verification
    const allStars = chart.palaces.flatMap(p => [
      ...p.majorStars.map(s => s.name),
      ...p.catStars.map(s => s.name),
      ...p.satStars.map(s => s.name)
    ]);

    const menhStars = [...menhP.majorStars, ...menhP.catStars, ...menhP.satStars].map(s => s.name);
    const quanStars = [...quanP.majorStars, ...quanP.catStars, ...quanP.satStars].map(s => s.name);
    const theStars = [...theP.majorStars, ...theP.catStars, ...theP.satStars].map(s => s.name);
    const phuStars = [...phuP.majorStars, ...phuP.catStars, ...phuP.satStars].map(s => s.name);
    const huynhStars = [...huynhP.majorStars, ...huynhP.catStars, ...huynhP.satStars].map(s => s.name);

    // Score based on selected checklist options
    let rawScore = 0;
    const matchedReasons: string[] = [];

    for (const optId of selectedOptionIds) {
      let option: RectificationCriterionOption | undefined;
      let criterion: RectificationCriterion | undefined;

      for (const crit of RECTIFICATION_CRITERIA) {
        const found = crit.options.find(o => o.id === optId);
        if (found) {
          option = found;
          criterion = crit;
          break;
        }
      }

      if (!option || !criterion) continue;

      let targetStars: string[] = [];
      if (criterion.category === 'appearance' || criterion.category === 'personality') {
        targetStars = menhStars;
      } else if (criterion.category === 'career') {
        targetStars = quanStars;
      } else if (criterion.category === 'marriage') {
        targetStars = theStars;
      } else if (criterion.category === 'parents') {
        targetStars = phuStars;
      } else if (criterion.category === 'sibling') {
        targetStars = [...menhStars, ...huynhStars];
      } else {
        targetStars = allStars;
      }

      const matchCount = option.tags.filter(t => targetStars.some(s => s.includes(t))).length;
      if (matchCount > 0) {
        rawScore += matchCount * 10;
        matchedReasons.push(`${criterion.title.split('.')[1].trim()}: Khớp với sao [${option.tags.filter(t => targetStars.some(s => s.includes(t))).join(', ')}]`);
      }
    }

    const totalPossible = Math.max(selectedOptionIds.length * 15, 1);
    const matchPercent = selectedOptionIds.length === 0
      ? 50
      : Math.min(Math.round((rawScore / totalPossible) * 100), 98);

    results.push({
      hourIndex: hIdx,
      hourName,
      chart,
      score: rawScore,
      matchPercent,
      matchedReasons,
      keyPalaces: {
        menh: {
          name: 'Mệnh',
          branch: menhP.branch,
          can: menhP.can,
          stars: menhP.majorStars.map(s => `${s.name} (${s.brightness || 'B'})`),
          pattern: detectMajorPattern(menhP.majorStars.map(s => s.name))
        },
        than: {
          name: thanP.name,
          branch: thanP.branch,
          can: thanP.can,
          stars: thanP.majorStars.map(s => s.name)
        },
        phuThe: {
          name: 'Phu Thê',
          branch: theP.branch,
          can: theP.can,
          stars: theP.majorStars.map(s => `${s.name} (${s.brightness || 'B'})`)
        },
        quanLoc: {
          name: 'Quan Lộc',
          branch: quanP.branch,
          can: quanP.can,
          stars: quanP.majorStars.map(s => `${s.name} (${s.brightness || 'B'})`)
        },
        phuMau: {
          name: 'Phụ Mẫu',
          branch: phuP.branch,
          can: phuP.can,
          stars: phuP.majorStars.map(s => s.name)
        },
        huynhDe: {
          name: 'Huynh Đệ',
          branch: huynhP.branch,
          can: huynhP.can,
          stars: huynhP.majorStars.map(s => s.name)
        }
      }
    });
  }

  // Sort by matchPercent descending
  return results;
}

export function calculateRectificationScore(
  baseInput: Omit<TuViInput, 'hour' | 'minute'>,
  primaryHourIndex: number,
  selectedOptionIds: string[] = []
): CandidateComparison[] {
  const prevHour = (primaryHourIndex + 11) % 12;
  const nextHour = (primaryHourIndex + 1) % 12;
  const candidateHours = [prevHour, primaryHourIndex, nextHour];
  return generateRectificationComparison(baseInput, candidateHours, selectedOptionIds);
}
