import { ChartData, Palace } from './types.js';

export interface KLineCandle {
  index: number;
  decadeStartAge: number;
  decadeEndAge: number;
  ageLabel: string;
  palaceName: string;
  palaceId: number;
  open: number;
  close: number;
  high: number;
  low: number;
  isBullish: boolean;
  tongVan: number;
  taiLoc: number;
  suNghiep: number;
  tinhDuyenSucKhoe: number;
  phase: 'Tích Lũy' | 'Khởi Sắc' | 'Đỉnh Cao' | 'Bình Ổn' | 'Phòng Thủ';
  keyStars: string[];
  assessment: string;
}

export interface LifeKLineResult {
  candles: KLineCandle[];
  peakDecade: KLineCandle;
  troughDecade: KLineCandle;
  trendCurves: {
    overall: number[];
    wealth: number[];
    career: number[];
    love: number[];
  };
  overallTrend: string;
  decadeAdvice: string;
}

export function calculateLifeKLine(chart: ChartData): LifeKLineResult {
  const palaces = chart.palaces;
  const menh = palaces.find(p => p.isMenh) || palaces[0];
  const cucNumber = parseInt(chart.thienBan.cuc.replace(/\D/g, '') || '2', 10) || 2;

  // Determine decade progression (clockwise vs counter-clockwise)
  const isDuongNamAmNu = chart.thienBan.amDuongLy.includes('Thuận');
  const step = isDuongNamAmNu ? 1 : -1;

  const candles: KLineCandle[] = [];

  let prevClose = 62;

  for (let d = 0; d < 8; d++) {
    const startAge = cucNumber + d * 10;
    const endAge = startAge + 9;
    const palaceId = (menh.id + (d * step) + 120) % 12;
    const palace = palaces.find(p => p.id === palaceId) || palaces[0];

    const majorStars = palace.majorStars;
    const minorStars = palace.minorStars;

    let score = 55;

    // Major stars influence
    majorStars.forEach(s => {
      const b = s.brightness;
      if (b === 'M' || b === 'V') score += 12;
      else if ((b as any) === 'Đ' || b === 'D') score += 7;
      else if (b === 'B') score += 2;
      else if (b === 'H') score -= 8;
    });

    // Auspicious stars
    const goodNames = ['Hóa Lộc', 'Lộc Tồn', 'Hóa Quyền', 'Hóa Khoa', 'Tả Phù', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt', 'Văn Xương', 'Văn Khúc', 'Thiên Mã'];
    minorStars.forEach(s => {
      if (goodNames.some(g => s.name.includes(g))) score += 4;
    });

    // Malefic stars
    const badNames = ['Hóa Kỵ', 'Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Thiên Không', 'Bạch Hổ'];
    minorStars.forEach(s => {
      if (badNames.some(b => s.name.includes(b))) score -= 5;
    });

    // Sub-scores
    let taiLoc = score;
    let suNghiep = score;
    let tinhDuyen = score;

    if (palace.name === 'Tài Bạch' || minorStars.some(s => s.name.includes('Lộc'))) taiLoc += 10;
    if (palace.name === 'Quan Lộc' || minorStars.some(s => s.name.includes('Quyền'))) suNghiep += 10;
    if (palace.name === 'Phu Thê' || minorStars.some(s => s.name.includes('Khoa'))) tinhDuyen += 8;

    const clamp = (n: number) => Math.max(30, Math.min(95, Math.round(n)));

    const closeVal = clamp(score);
    const openVal = clamp(prevClose);
    const highVal = clamp(Math.max(openVal, closeVal) + 5 + (d % 3) * 2);
    const lowVal = clamp(Math.min(openVal, closeVal) - 4 - ((d + 1) % 3) * 2);
    const isBullish = closeVal >= openVal;

    prevClose = closeVal;

    const phase: KLineCandle['phase'] =
      closeVal >= 78 ? 'Đỉnh Cao' :
      isBullish && closeVal >= 65 ? 'Khởi Sắc' :
      !isBullish && closeVal < 50 ? 'Phòng Thủ' :
      closeVal >= 60 ? 'Bình Ổn' : 'Tích Lũy';

    const keyStars = [
      ...majorStars.map(s => `${s.name} (${s.brightness || 'B'})`),
      ...minorStars.filter(s => goodNames.some(g => s.name.includes(g)) || badNames.some(b => s.name.includes(b))).map(s => s.name)
    ].slice(0, 4);

    candles.push({
      index: d,
      decadeStartAge: startAge,
      decadeEndAge: endAge,
      ageLabel: `${startAge} - ${endAge}t`,
      palaceName: palace.name,
      palaceId: palace.id,
      open: openVal,
      close: closeVal,
      high: highVal,
      low: lowVal,
      isBullish,
      tongVan: closeVal,
      taiLoc: clamp(taiLoc),
      suNghiep: clamp(suNghiep),
      tinhDuyenSucKhoe: clamp(tinhDuyen),
      phase,
      keyStars,
      assessment: closeVal >= 75
        ? `Giai đoạn vàng son tại cung ${palace.name}, thiên thời địa lợi nhân hòa, nên quyết đoán bứt phá.`
        : closeVal >= 60
        ? `Vận thế tích lũy ổn định tại cung ${palace.name}, chăm chỉ làm ăn, phòng thủ cẩn trọng sẽ gặt hái lớn.`
        : `Vận thế thử thách tại cung ${palace.name}, lấy tĩnh chế động, trau dồi nội lực và bảo toàn tài chính.`
    });
  }

  const sorted = [...candles].sort((a, b) => b.close - a.close);
  const peakDecade = sorted[0];
  const troughDecade = sorted[sorted.length - 1];

  return {
    candles,
    peakDecade,
    troughDecade,
    trendCurves: {
      overall: candles.map(c => c.tongVan),
      wealth: candles.map(c => c.taiLoc),
      career: candles.map(c => c.suNghiep),
      love: candles.map(c => c.tinhDuyenSucKhoe)
    },
    overallTrend: peakDecade.decadeStartAge >= 40
      ? 'Hậu Vận Đại Phát: Càng về trung niên và hậu vận năng lượng càng tăng tiến bền bỉ.'
      : 'Thiếu Niên Đắc Chí: Khởi sắc từ sớm, cần chú trọng tích lũy dưỡng đức để duy trì lâu dài.',
    decadeAdvice: `Đại Vận đỉnh cao rơi vào độ tuổi ${peakDecade.ageLabel} (tại cung ${peakDecade.palaceName}); đại vận cần phòng thủ cẩn trọng nhất là tuổi ${troughDecade.ageLabel} (tại cung ${troughDecade.palaceName}).`
  };
}

export function generateLifeKline(palaces: Palace[], cucNumber: number = 2, currentAge: number = 30): LifeKLineResult {
  const dummyChart: any = {
    palaces,
    thienBan: {
      cuc: `${cucNumber} Cục`,
      amDuongLy: 'Âm Dương Thuận Lý'
    }
  };
  return calculateLifeKLine(dummyChart);
}

