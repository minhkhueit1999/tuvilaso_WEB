import { ChartData, Palace } from './types.js';

export interface DailyFortune {
  lunarDay: number;
  canChiDay: string;
  palaceName: string;
  palaceId: number;
  palaceBranch: string;
  rating: 'dai_cat' | 'kha' | 'binh_hoa' | 'than_trong';
  ratingLabel: string;
  goodStars: string[];
  badStars: string[];
  luckyHours: string[]; // Các canh giờ cát lợi
  doList: string[];     // Việc nên làm
  dontList: string[];   // Việc nên tránh
  summary: string;
}

export interface PersonalCalendarResult {
  year: number;
  currentMonth: number;
  months: MonthlyCalendarResult[];
}

export interface MonthlyCalendarResult {
  lunarMonth: number;
  monthPalaceName: string;
  monthPalaceBranch: string;
  days: DailyFortune[];
  goodDayCount: number;
  cautionDayCount: number;
  monthOverview: string;
}

const GOOD_STARS_LIST = ['Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Thái Âm', 'Hóa Lộc', 'Lộc Tồn', 'Hóa Quyền', 'Hóa Khoa', 'Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Mã', 'Hỷ Thần'];
const BAD_STARS_LIST = ['Hóa Kỵ', 'Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Thiên Không', 'Bạch Hổ', 'Tang Môn', 'Đại Hao', 'Tiểu Hao'];

const CANH_GIO_LUCKY = [
  'Mão (05:00 - 07:00)',
  'Tỵ (09:00 - 11:00)',
  'Thân (15:00 - 17:00)',
  'Tuất (19:00 - 21:00)'
];

export function calculatePersonalMonthlyCalendar(chart: ChartData, lunarMonth: number = 1): MonthlyCalendarResult {
  const palaces = chart.palaces;
  const menh = palaces.find(p => p.isMenh) || palaces[0];

  // Starting palace for Month 1 (based on year Chi or standard clock)
  const monthStartPalaceId = (menh.id + (lunarMonth - 1)) % 12;
  const monthPalace = palaces.find(p => p.id === monthStartPalaceId) || palaces[0];

  const days: DailyFortune[] = [];

  // Determine 29 or 30 days for this lunar month
  const totalDays = (lunarMonth % 2 === 1) ? 30 : 29;

  for (let day = 1; day <= totalDays; day++) {
    // Day palace counts forward from month palace
    const dayPalaceId = (monthStartPalaceId + (day - 1)) % 12;
    const p = palaces.find(pal => pal.id === dayPalaceId) || palaces[0];

    const majorNames = p.majorStars.map(s => s.name);
    const minorNames = p.minorStars.map(s => s.name);
    const allStars = [...majorNames, ...minorNames];

    const goodStars = allStars.filter(s => GOOD_STARS_LIST.some(g => s.includes(g)));
    const badStars = allStars.filter(s => BAD_STARS_LIST.some(b => s.includes(b)));

    let score = 60 + goodStars.length * 8 - badStars.length * 10;
    p.majorStars.forEach(s => {
      if (s.brightness === 'M' || s.brightness === 'V') score += 6;
      if (s.brightness === 'H') score -= 8;
    });

    const rating: DailyFortune['rating'] =
      score >= 75 ? 'dai_cat' :
      score >= 60 ? 'kha' :
      score >= 45 ? 'binh_hoa' : 'than_trong';

    const ratingLabel =
      rating === 'dai_cat' ? 'Đại Cát Hanh Thông' :
      rating === 'kha' ? 'Cát Lợi Tốt Lành' :
      rating === 'binh_hoa' ? 'Bình Hòa Ổn Định' : 'Thận Trọng Phòng Thủ';

    const luckyHours = [
      CANH_GIO_LUCKY[(day + 1) % CANH_GIO_LUCKY.length],
      CANH_GIO_LUCKY[(day + 2) % CANH_GIO_LUCKY.length]
    ];

    let doList: string[] = [];
    let dontList: string[] = [];

    if (rating === 'dai_cat' || rating === 'kha') {
      doList = ['Ký kết hợp đồng, mở rộng giao dịch', 'Gặp gỡ quý nhân, bàn bạc đại sự', 'Xuất hành, cầu tài lộc cầu may'];
      dontList = ['Nóng nảy tranh luận chuyện vặt', 'Dây dưa chậm trễ thời cơ'];
    } else {
      doList = ['Thu dọn giấy tờ, giải quyết việc tồn đọng', 'Trau dồi chuyên môn, tĩnh tâm đọc sách', 'Kiểm soát chi tiêu, bảo quản tài sản'];
      dontList = ['Đầu tư mạo hiểm, vay mượn tiền bạc', 'Ký kết cam kết lớn khi chưa rõ điều khoản', 'Đi xa giờ khuya hoặc đến nơi sông nước mạo hiểm'];
    }

    const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    const canChiDay = `${CAN_NAMES[(day + lunarMonth * 2) % 10]} ${CHI_NAMES[p.id % 12]}`;

    days.push({
      lunarDay: day,
      canChiDay,
      palaceName: p.name,
      palaceId: p.id,
      palaceBranch: p.branch,
      rating,
      ratingLabel,
      goodStars: goodStars.slice(0, 3),
      badStars: badStars.slice(0, 3),
      luckyHours,
      doList,
      dontList,
      summary: `Lưu Nhật ngày ${day} (${canChiDay}) đáo cung ${p.name} (${p.branch}). ${goodStars.length > 0 ? `Đắc sao cát tinh [${goodStars.slice(0, 2).join(', ')}].` : ''} ${badStars.length > 0 ? `Lưu ý [${badStars.slice(0, 2).join(', ')}].` : ''}`
    });
  }

  const goodDayCount = days.filter(d => d.rating === 'dai_cat' || d.rating === 'kha').length;
  const cautionDayCount = days.filter(d => d.rating === 'than_trong').length;

  return {
    lunarMonth,
    monthPalaceName: monthPalace.name,
    monthPalaceBranch: monthPalace.branch,
    days,
    goodDayCount,
    cautionDayCount,
    monthOverview: `Tháng ${lunarMonth} Âm lịch: Lưu Nguyệt tọa thủ tại cung ${monthPalace.name} (${monthPalace.branch}). Toàn tháng có ${goodDayCount} ngày vượng khí cát lành và ${cautionDayCount} ngày cần thận trọng phòng thủ.`
  };
}

export function generatePersonalCalendar(
  palacesOrChart: Palace[] | ChartData,
  viewingYear: number = 2026,
  chiYear: string = 'Ngọ',
  birthLunarMonth: number = 1,
  birthChiHourIndex: number = 0
): PersonalCalendarResult {
  let chart: ChartData;
  if (Array.isArray(palacesOrChart)) {
    chart = {
      palaces: palacesOrChart,
      thienBan: {
        viewingYear,
        canChiYear: `Bính ${chiYear}`,
        lunarMonth: birthLunarMonth,
        chiHourIndex: birthChiHourIndex
      }
    } as any;
  } else {
    chart = palacesOrChart;
  }

  const months: MonthlyCalendarResult[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(calculatePersonalMonthlyCalendar(chart, m));
  }

  return {
    year: viewingYear,
    currentMonth: 1,
    months
  };
}

