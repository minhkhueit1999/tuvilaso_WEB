import { ThienBan, Palace, Interpretation, TamPhuongTuChinh, AspectScores, ChartData, Star, TuViSchool } from './types.js';
import { TU_HOA_TABLE } from './stars.js';

export function calculateAspectScores(palaces: Palace[]): AspectScores {
  const findPalace = (name: string) => palaces.find(p => p.name === name) || palaces[0];

  const menh = findPalace('Mệnh');
  const quan = findPalace('Quan Lộc');
  const tai = findPalace('Tài Bạch');
  const the = findPalace('Phu Thê');
  const tat = findPalace('Tật Ách');
  const phuc = findPalace('Phúc Đức');

  // Helper score calculation based on major star brightness and cat/sat balance
  const scorePalace = (p: Palace, base = 75): number => {
    let score = base;
    for (const star of p.majorStars) {
      if (star.brightness === 'M') score += 6;
      else if (star.brightness === 'V') score += 4;
      else if (star.brightness === 'D') score += 2;
      else if (star.brightness === 'H') score -= 5;

      if (star.tuHoa === 'Lộc' || star.tuHoa === 'Quyền') score += 5;
      if (star.tuHoa === 'Kỵ') score -= 4;
    }
    // Cat stars bonus
    score += Math.min(p.catStars.length * 1.5, 8);
    // Sat stars deduction
    score -= Math.min(p.satStars.filter(s => s.category === 'phu_tinh_hung').length * 2, 8);

    return Math.max(60, Math.min(95, Math.round(score)));
  };

  const careerScore = Math.round((scorePalace(quan, 74) * 0.6) + (scorePalace(menh, 74) * 0.4));
  const wealthScore = Math.round((scorePalace(tai, 73) * 0.7) + (scorePalace(phuc, 73) * 0.3));
  const loveScore = scorePalace(the, 72);
  const healthScore = Math.round(160 - scorePalace(tat, 75));
  const fortuneScore = scorePalace(phuc, 76);

  const getSummary = (score: number, good: string, moderate: string, caution: string) => {
    if (score >= 82) return good;
    if (score >= 72) return moderate;
    return caution;
  };

  return {
    career: careerScore,
    wealth: wealthScore,
    love: loveScore,
    health: healthScore,
    fortune: fortuneScore,
    summary: {
      career: getSummary(careerScore, 'Công danh rạng rỡ, có năng lực lãnh đạo và thăng tiến vượt trội.', 'Sự nghiệp ổn định, cần bồi đắp thêm quan hệ đồng môn để bứt phá.', 'Nên chuyên môn hóa sâu, cẩn trọng trong các quyết định chuyển hướng.'),
      wealth: getSummary(wealthScore, 'Tài chính hanh thông, nguồn thu dồi dào, có duyên kinh doanh đầu tư.', 'Tích lũy đều đặn, chi tiêu có kế hoạch, hậu vận dư dả.', 'Dòng tiền có biến động, hạn chế đầu tư rủi ro lớn khi chưa chuẩn bị kỹ.'),
      love: getSummary(loveScore, 'Gia đạo êm ấm, bạn đời là chỗ dựa vững vàng cả tinh thần lẫn sự nghiệp.', 'Hôn nhân cần sự thấu hiểu và sẻ chia chân thành để bền chặt.', 'Duyên muộn tốt hơn duyên sớm, học cách lắng nghe để duy trì hòa khí.'),
      health: getSummary(healthScore, 'Thể chất tráng kiện, đề kháng tốt, tinh thần dẻo dai.', 'Cần chú ý nghỉ ngơi điều độ, tránh làm việc quá sức kéo dài.', 'Lưu tâm hệ tiêu hóa và hô hấp, nên duy trì thói quen vận động mỗi ngày.'),
      fortune: getSummary(fortuneScore, 'Phúc trạch sâu dày, tổ tiên phù trì, tâm tính thiện lành hưởng an vui.', 'Phúc khí vững vàng, nên siêng làm việc thiện tích đức cho con cháu.', 'Lấy chữ Đức làm kim chỉ nam, tĩnh tâm tu dưỡng sẽ hóa giải hung họa.')
    }
  };
}

// Phân tích Cách Cục kinh điển Nam Phái (Tam Hợp)
export function identifyClassicPattern(menhPalace: Palace, quanPalace: Palace, taiPalace: Palace): {
  name: string;
  description: string;
  isAuspicious: boolean;
} {
  const tamHopStars = [
    ...menhPalace.majorStars.map(s => s.name),
    ...quanPalace.majorStars.map(s => s.name),
    ...taiPalace.majorStars.map(s => s.name)
  ];

  const has = (star: string) => tamHopStars.includes(star);

  if (menhPalace.majorStars.length === 0) {
    return {
      name: 'Mệnh Vô Chính Diệu',
      description: 'Cung Mệnh không có chính tinh tọa thủ, tính cách linh hoạt, mẫn cảm, thích ứng hoàn cảnh cực tốt, mượn chính tinh đối cung và cát tinh xung chiếu để thành danh.',
      isAuspicious: true
    };
  }

  if (has('Tử Vi') && (has('Thiên Phủ') || has('Vũ Khúc') || has('Thiên Tướng'))) {
    return {
      name: 'Tử Phủ Vũ Tướng',
      description: 'Cách cục quý hiển bậc nhất của Đẩu Số. Chủ về phong thái khoan dung, khả năng lãnh đạo, quản lý vĩ mô, danh vọng song toàn và hậu vận vinh hiển.',
      isAuspicious: true
    };
  }

  if (has('Thất Sát') && has('Phá Quân') && has('Tham Lang')) {
    return {
      name: 'Sát Phá Tham',
      description: 'Cách cục tiên phong, dũng mãnh, thích nghi mạo hiểm và đột phá thương trường. Dám nghĩ dám làm, biến nguy thành cơ, có duyên gặt hái đại lộc trong nghịch cảnh.',
      isAuspicious: true
    };
  }

  if (has('Thiên Cơ') || has('Thái Âm') || has('Thiên Đồng') || has('Thiên Lương')) {
    return {
      name: 'Cơ Nguyệt Đồng Lương',
      description: 'Cách cục mưu lược, thanh bạch, tài hoa học thuật và công vụ. Thích hợp nghiên cứu, giáo dục, hoạch định chiến lược, làm việc bền bỉ có kỷ luật cao.',
      isAuspicious: true
    };
  }

  if (has('Cự Môn') && has('Thái Dương')) {
    return {
      name: 'Cự Nhật',
      description: 'Cách cục tài hùng biện, ngoại giao và truyền cảm hứng. Thích hợp ngành luật, ngoại thương, truyền thông và các lĩnh vực cần danh tiếng lan tỏa.',
      isAuspicious: true
    };
  }

  return {
    name: 'Nhật Nguyệt Tịnh Minh / Phối Hợp Tinh Diệu',
    description: 'Cách cục hài hòa âm dương, có khả năng kết nối nguồn lực xã hội và phát huy sở trường đúng thời điểm.',
    isAuspicious: true
  };
}

export function generateInterpretation(
  thienBan: ThienBan,
  palaces: Palace[],
  tamPhuongTuChinh: Record<number, TamPhuongTuChinh>,
  viewingYear = 2026,
  school: TuViSchool = 'tong_hop'
): Interpretation {
  const menhPalace = palaces.find(p => p.isMenh) || palaces[0];
  const thanPalace = palaces.find(p => p.isThan) || palaces[0];
  const quanPalace = palaces.find(p => p.name === 'Quan Lộc') || palaces[0];
  const taiPalace = palaces.find(p => p.name === 'Tài Bạch') || palaces[0];
  const laiNhanPalace = palaces.find(p => p.isLaiNhan) || menhPalace;

  // 1. Phân tích Mệnh Cục
  let menhCucText = '';
  const menhElem = thienBan.banMenh;
  const cucElem = thienBan.cuc;

  if (cucElem.includes('Kim')) {
    if (menhElem.includes('Thủy')) menhCucText = 'Cục sinh Mệnh (Kim sinh Thủy): Môi trường hoàn cảnh xã hội nâng đỡ đương số, dễ gặp cơ duyên tốt và quý nhân chỉ lối.';
    else if (menhElem.includes('Mộc')) menhCucText = 'Cục khắc Mệnh (Kim khắc Mộc): Tiền vận hay gặp áp lực từ môi trường ngoài, tôi luyện bản lĩnh kiên cường, càng về sau càng thành tựu.';
    else if (menhElem.includes('Kim')) menhCucText = 'Cục Mệnh Tỷ Hòa: Cuộc đời hài hòa với hoàn cảnh, làm việc có lộ trình rõ ràng, ít bị biến động đột ngột.';
    else menhCucText = 'Cục và Mệnh tương tác chuyển hóa: Cần chủ động nắm bắt thời cơ và linh hoạt ứng biến theo chu kỳ vận hạn.';
  } else if (cucElem.includes('Thủy')) {
    if (menhElem.includes('Mộc')) menhCucText = 'Cục sinh Mệnh (Thủy sinh Mộc): Đắc thời đắc địa, học hành sự nghiệp có duyên gặp người chỉ dẫn đúng đắn.';
    else if (menhElem.includes('Hỏa')) menhCucText = 'Cục khắc Mệnh (Thủy khắc Hỏa): Nhiều cạnh tranh và áp lực, rèn luyện nên ý chí thép, hậu vận vững bền.';
    else if (menhElem.includes('Thủy')) menhCucText = 'Cục Mệnh Tỷ Hòa: Khả năng thích nghi cao, mềm mỏng nhưng sâu sắc, dễ xây dựng mạng lưới quan hệ.';
    else menhCucText = 'Cục và Mệnh tương hòa: Phát huy tư duy chiến lược và sự linh hoạt để đạt thành tựu cao.';
  } else if (cucElem.includes('Mộc')) {
    if (menhElem.includes('Hỏa')) menhCucText = 'Cục sinh Mệnh (Mộc sinh Hỏa): Nhiệt huyết dồi dào, danh tiếng và sự nghiệp phát triển thuận lợi.';
    else if (menhElem.includes('Thổ')) menhCucText = 'Cục khắc Mệnh (Mộc khắc Thổ): Đòi hỏi sự kiên nhẫn bền bỉ, cần tích lũy nội lực trước khi mở rộng quy mô.';
    else menhCucText = 'Cục Mệnh cộng hưởng: Lòng nhân ái, chí hướng vươn lên mạnh mẽ, công danh bền vững.';
  } else if (cucElem.includes('Hỏa')) {
    if (menhElem.includes('Thổ')) menhCucText = 'Cục sinh Mệnh (Hỏa sinh Thổ): Nền tảng vững chắc, tạo dựng cơ đồ lớn từ trung vận trở đi.';
    else if (menhElem.includes('Kim')) menhCucText = 'Cục khắc Mệnh (Hỏa khắc Kim): Gian nan rèn luyện nên ngọc sáng, vượt qua sóng gió để gặt hái thành quả.';
    else menhCucText = 'Hỏa khí rạng ngời: Sáng tạo, quyết đoán, có khả năng dẫn dắt và truyền cảm hứng.';
  } else {
    if (menhElem.includes('Kim')) menhCucText = 'Cục sinh Mệnh (Thổ sinh Kim): Đất ươm mầm quặng quý, có nền tảng gia đạo hoặc căn cơ tốt để bứt phá.';
    else if (menhElem.includes('Thủy')) menhCucText = 'Cục khắc Mệnh (Thổ khắc Thủy): Đương số cần quản trị cảm xúc và dòng tiền có kỷ luật, đề phòng chi tiêu quá đà.';
    else menhCucText = 'Căn cơ dày dặn: Đáng tin cậy, thực tế, làm việc chắc chắn từng bước.';
  }

  // 2. Phân tích Thân Cư
  let thanCuText = '';
  if (thanPalace.isMenh) {
    thanCuText = 'Thân cư Mệnh: Đương số tự lập từ sớm, tính cách nhất quán, số tự tay làm nên cơ đồ.';
  } else if (thanPalace.name === 'Phúc Đức') {
    thanCuText = 'Thân cư Phúc Đức: Hậu vận gắn bó sâu sắc với phúc ấm tổ tiên và đời sống tinh thần tâm linh.';
  } else if (thanPalace.name === 'Quan Lộc') {
    thanCuText = 'Thân cư Quan Lộc: Coi trọng công danh, sự nghiệp và trách nhiệm cống hiến cho tập thể.';
  } else if (thanPalace.name === 'Tài Bạch') {
    thanCuText = 'Thân cư Tài Bạch: Thực tế, nhạy bén tài chính, hậu vận chú trọng an toàn kinh tế và tích lũy điền sản.';
  } else if (thanPalace.name === 'Thiên Di') {
    thanCuText = 'Thân cư Thiên Di: Có duyên phát triển xa quê, thích ngoại giao xuất ngoại và thay đổi môi trường.';
  } else if (thanPalace.name === 'Phu Thê') {
    thanCuText = 'Thân cư Phu Thê: Gia đình và bạn đời có sức ảnh hưởng quyết định đến thành bại nửa đời sau.';
  } else {
    thanCuText = `Thân cư ${thanPalace.name}: Nửa đời sau dịch chuyển trọng tâm về phương diện cung này.`;
  }

  const classicPattern = identifyClassicPattern(menhPalace, quanPalace, taiPalace);

  const generalAssessment = `Đương số ${thienBan.fullName} (${thienBan.amDuong}), Bản mệnh ${thienBan.banMenh}, Cục ${thienBan.cuc}. ${thienBan.amDuongLy}. Cung Mệnh an tại ${menhPalace.branch} (${menhPalace.can}), cách cục "${classicPattern.name}". Sao Chủ Mệnh là ${thienBan.chuMenh}, Chủ Thân là ${thienBan.chuThan}. Lai Nhân Cung an tại ${laiNhanPalace.name} (${laiNhanPalace.can} ${laiNhanPalace.branch}), chủ về gốc rễ duyên nợ và trách nhiệm trọn đời của đương số.`;

  // Điểm mạnh & Điểm cần lưu tâm
  const strengths = [
    `Đắc cách ${thienBan.amDuongLy}: tâm lý và hành động phù hợp với dòng chảy thời vận.`,
    `Cách cục ${classicPattern.name}: hội tụ cát tinh hỗ trợ, tư duy chiến lược và năng lực biến chuyển linh hoạt.`,
    `Bản mệnh ${thienBan.banMenh} vững vàng, có căn cơ tạo lập sự nghiệp độc lập.`
  ];

  const considerations = [
    `Tránh ôm đồm quá nhiều mục tiêu cùng lúc; cần tập trung vào thế mạnh cốt lõi.`,
    `Chú ý quản trị rủi ro và gìn giữ hòa khí trong các mối quan hệ hợp tác đối tác.`,
    `Lưu tâm ảnh hưởng của Hóa Kỵ và các cung bị xung chiếu để giữ vững thế chủ động.`
  ];

  // 3. Luận giải chi tiết 12 Cung
  const palaceInterpretations: Record<string, string> = {};

  for (const palace of palaces) {
    const majors = palace.majorStars;
    const majorNames = majors.map(s => `${s.yinYang || ''}${s.name} (${s.brightness}${s.sinhNienHoa ? `-${s.sinhNienHoa}` : ''})`).join(', ');
    const relation = tamPhuongTuChinh[palace.id];
    const xungChieuPalace = palaces.find(p => p.id === relation.xungChieu)?.name || '';

    let content = `Cung ${palace.name} tại địa chi ${palace.branch} (Can ${palace.can}, ${palace.branchYinYangElement}). `;
    if (palace.isLaiNhan) {
      content += `[LAI NHÂN CUNG]: Đây là cung khởi nguồn duyên nghiệp và trách nhiệm cuộc đời. `;
    }

    if (majors.length > 0) {
      content += `Chính tinh tọa thủ: ${majorNames}. `;
      const isMieuVuong = majors.some(s => s.brightness === 'M' || s.brightness === 'V');
      if (isMieuVuong) {
        content += `Chính tinh Miếu/Vượng mang lại sinh khí tốt, giúp gia tăng uy lực, tài lộc và sự hanh thông. `;
      } else {
        content += `Chính tinh bình hòa hoặc hãm địa, cần thêm cát tinh hội chiếu để hóa giải bất lợi. `;
      }
    } else {
      content += `Cung này Vô Chính Diệu, mượn chính tinh từ cung xung chiếu (${xungChieuPalace}) để luận đoán; đương số linh hoạt và thích ứng rất nhanh. `;
    }

    if (palace.catStars.length > 0) {
      content += `Cát tinh trợ lực: ${palace.catStars.slice(0, 5).map(s => s.name).join(', ')}. `;
    }
    if (palace.satStars.length > 0) {
      content += `Sát tinh / Lưu tinh: ${palace.satStars.slice(0, 5).map(s => s.name).join(', ')}. `;
    }

    if (palace.triet && palace.tuan) {
      content += `Gặp cả Tuần lẫn Triệt án ngữ, tiền vận nhiều trắc trở nhưng hậu vận khai thông rõ nét. `;
    } else if (palace.triet) {
      content += `Có Triệt án ngữ, trước trở ngại sau hanh thông. `;
    } else if (palace.tuan) {
      content += `Có Tuần Không bao bọc, tính chất ổn định và kìm hãm hung sát tinh. `;
    }

    content += `Tam phương tứ chính hội chiếu cùng ${xungChieuPalace} và các cung tam hợp.`;
    palaceInterpretations[palace.name] = content;
  }

  // 4. Vận hạn
  const birthYear = parseInt(thienBan.canChiYear.split(' ')[0], 10) || 1999;
  const currentAge = Math.max(1, viewingYear - birthYear + 1);

  let currentDecadePalace = palaces[0];
  for (const palace of palaces) {
    if (currentAge >= palace.daiHan && currentAge < palace.daiHan + 10) {
      currentDecadePalace = palace;
      break;
    }
  }

  const luckFortune = {
    currentDecade: `Năm ${viewingYear} (đương số ${currentAge} tuổi ta): Đang trong đại vận 10 năm tại cung ${currentDecadePalace.name} (${currentDecadePalace.branch}, từ ${currentDecadePalace.daiHan} đến ${currentDecadePalace.daiHan + 9} tuổi). Cung này hội tụ ${currentDecadePalace.majorStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'}, chủ về giai đoạn xây đắp nền móng, củng cố vị thế và mở rộng tầm nhìn dài hạn.`,
    currentYear: `Tiểu hạn năm ${viewingYear}: Lưu Niên Thái Tuế kích hoạt năng lượng hành động. Đương số có nhiều cơ duyên kết giao đối tác mới, cần phát huy sự cẩn trọng và quyết đoán trong từng nước đi.`,
    advice: `Lời khuyên thời vận: "Biết người biết ta, thuận thời ứng biến". Hiểu rõ điểm mạnh bản mệnh để tiến thủ, nhận diện thời vận để kiên nhẫn gieo hạt, lấy chữ Tín và chữ Đức làm kim chỉ nam thì vạn sự ắt hanh thông đại cát.`
  };

  const aspectScores = calculateAspectScores(palaces);

  // Phân tích Khâm Thiên Môn (Bắc Phái)
  const khamThienMon = {
    laiNhanAnalysis: `Lai Nhân Cung tại ${laiNhanPalace.name} (${laiNhanPalace.can} ${laiNhanPalace.branch}): Theo Khâm Thiên Tứ Hóa, đây là nơi đương số gieo nhân và gặt quả, mọi động lực phát triển, thử thách và thành quả lớn nhất của cuộc đời đều quy hồi về cung này.`,
    sinhNienAnalysis: `Sinh Niên Tứ Hóa: Hóa Lộc (${thienBan.tuHoaYear.loc}) chủ duyên may khởi sự; Hóa Quyền (${thienBan.tuHoaYear.quyen}) chủ quyền biến và năng lực thực thi; Hóa Khoa (${thienBan.tuHoaYear.khoa}) chủ quý nhân và danh tiếng; Hóa Kỵ (${thienBan.tuHoaYear.ky}) chủ tâm niệm chấp niệm và nơi cần bồi đắp nhiều nhất.`,
    tuHoaTable: Object.entries(TU_HOA_TABLE).map(([can, r]) => ({
      can,
      loc: r.loc,
      quyen: r.quyen,
      khoa: r.khoa,
      ky: r.ky
    }))
  };

  return {
    overview: {
      menhCuc: menhCucText,
      amDuong: `${thienBan.amDuong} (${thienBan.amDuongLy})`,
      thanCu: thanCuText,
      generalAssessment,
      strengths,
      considerations
    },
    aspectScores,
    palaces: palaceInterpretations,
    luckFortune,
    classicPattern,
    khamThienMon
  };
}

// Logic Trợ Lý Tử Vi hỏi đáp theo trường phái & ngữ cảnh lá số
export function answerTuViQuestion(
  chart: ChartData,
  question: string,
  selectedPalaceName?: string,
  school: TuViSchool = 'tong_hop'
): { answer: string; relatedPalaces: string[]; advice: string } {
  const q = question.toLowerCase();
  const { thienBan, palaces, interpretation, phiHoaTable } = chart;
  const findPalace = (name: string): Palace => palaces.find((p: Palace) => p.name === name) || palaces[0];

  // Nếu hỏi về Bắc Phái / Khâm Thiên / Lai Nhân Cung
  if (q.includes('bắc phái') || q.includes('khâm thiên') || q.includes('lai nhân') || q.includes('tự hóa')) {
    const laiNhan = palaces.find(p => p.isLaiNhan) || palaces[0];
    return {
      answer: `Theo Khâm Thiên Tứ Hóa Bắc Phái: Lai Nhân Cung của đương số tọa tại ${laiNhan.name} (Can ${laiNhan.can} ${laiNhan.branch}). Sinh Niên Tứ Hóa gồm: Hóa Lộc [A] tại ${thienBan.tuHoaYear.loc}, Hóa Quyền [B] tại ${thienBan.tuHoaYear.quyen}, Hóa Khoa [C] tại ${thienBan.tuHoaYear.khoa}, Hóa Kỵ [D] tại ${thienBan.tuHoaYear.ky}. Các dấu Tự Hóa Ly Tâm [↑] và Hướng Tâm [↓] trên các sao biểu thị dòng chảy biến động tương tác trực tiếp giữa các cung.`,
      relatedPalaces: [laiNhan.name, 'Mệnh', 'Quan Lộc'],
      advice: 'Trong Bắc Phái, "Nhìn Kỵ để biết chỗ vướng, nhìn Lộc để tìm đường ra". Hãy tập trung cống hiến cho Lai Nhân Cung để hóa giải áp lực của Hóa Kỵ.'
    };
  }

  // Nếu hỏi về Phi Tinh / Phi Hóa
  if (q.includes('phi tinh') || q.includes('phi hóa') || q.includes('phi lộc') || q.includes('phi kỵ')) {
    const curr = selectedPalaceName ? findPalace(selectedPalaceName) : findPalace('Mệnh');
    const phiDetail = phiHoaTable?.[curr.id];
    return {
      answer: phiDetail
        ? `${phiDetail.summaryText}. ${phiDetail.practicalAdvice}`
        : `Hệ thống Tứ Hóa Phi Tinh lấy Can của cung làm xuất phát điểm, phóng 4 luồng năng lượng Lộc - Quyền - Khoa - Kỵ đến các cung mục tiêu, tạo nên mạng lưới cát hung tương tác sống động.`,
      relatedPalaces: phiDetail ? [curr.name, phiDetail.loc.toPalaceName, phiDetail.ky.toPalaceName, phiDetail.ky.xungPalaceName] : [curr.name],
      advice: 'Cung bị Phi Kỵ xung là nơi dễ phát sinh biến động ngoài dự kiến, cần đề phòng hao tổn và giữ chữ Nhẫn.'
    };
  }

  // Nếu hỏi về Nam Phái / Cách cục
  if (q.includes('nam phái') || q.includes('cách cục') || q.includes('tam hợp')) {
    const pattern = interpretation.classicPattern || { name: 'Đắc Cách', description: 'Hài hòa tinh diệu' };
    return {
      answer: `Theo trường phái Nam Phái (Tam Hợp): Đương số thủ đắc cách cục "${pattern.name}". ${pattern.description}. Tam Phương Tứ Chính cung Mệnh hội chiếu cát hung tinh phân minh, lấy miếu hãm và sinh khắc ngũ hành làm nền tảng thẩm định phúc họa.`,
      relatedPalaces: ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di'],
      advice: 'Phát huy tối đa ưu thế của chính tinh đắc địa, đồng thời tích đức hành thiện để giảm trừ tác hại của sát tinh hãm địa.'
    };
  }

  if (q.includes('sự nghiệp') || q.includes('công việc') || q.includes('công danh') || q.includes('nghề nghiệp')) {
    const quan = findPalace('Quan Lộc');
    const menh = findPalace('Mệnh');
    return {
      answer: `Về sự nghiệp của đương số ${thienBan.fullName}: Cung Quan Lộc tọa tại ${quan.branch} (${quan.can}) có các chính tinh ${quan.majorStars.map((s: Star) => `${s.name} (${s.brightness})`).join(', ') || 'Vô Chính Diệu'}. Kết hợp với Mệnh (${menh.majorStars.map((s: Star) => s.name).join(', ') || 'Vô Chính Diệu'}), đương số đạt điểm số sự nghiệp ${interpretation.aspectScores.career}/100. ${interpretation.aspectScores.summary.career}`,
      relatedPalaces: ['Quan Lộc', 'Mệnh', 'Tài Bạch'],
      advice: 'Tập trung phát huy kỹ năng chuyên môn sâu, kiên định với định hướng dài hạn thay vì chạy theo phong trào ngắn hạn.'
    };
  }

  if (q.includes('tài lộc') || q.includes('tiền bạc') || q.includes('kinh doanh') || q.includes('đầu tư')) {
    const tai = findPalace('Tài Bạch');
    const dien = findPalace('Điền Trạch');
    return {
      answer: `Về tài chính và tiền bạc: Cung Tài Bạch tại ${tai.branch} (${tai.majorStars.map((s: Star) => s.name).join(', ') || 'Vô Chính Diệu'}) kết hợp Điền Trạch (${dien.branch}) cho thấy đương số đạt điểm tài lộc ${interpretation.aspectScores.wealth}/100. ${interpretation.aspectScores.summary.wealth}`,
      relatedPalaces: ['Tài Bạch', 'Điền Trạch', 'Phúc Đức'],
      advice: 'Quản lý dòng tiền kỷ luật, chia nhỏ các danh mục tích lũy và hạn chế đòn bẩy tài chính quá mức.'
    };
  }

  if (q.includes('tình duyên') || q.includes('hôn nhân') || q.includes('vợ chồng') || q.includes('người yêu')) {
    const the = findPalace('Phu Thê');
    return {
      answer: `Về tình cảm gia đạo: Cung Phu Thê tại ${the.branch} có các sao ${the.majorStars.map((s: Star) => `${s.name} (${s.brightness})`).join(', ') || 'Vô Chính Diệu'}. Thân cư ${thienBan.thanCu}. Điểm số tình duyên đạt ${interpretation.aspectScores.love}/100. ${interpretation.aspectScores.summary.love}`,
      relatedPalaces: ['Phu Thê', 'Mệnh', 'Thiên Di'],
      advice: 'Học cách lắng nghe và thấu cảm với bạn đời; duyên muộn sẽ giúp tình cảm thêm chín chắn và viên mãn.'
    };
  }

  if (q.includes('vận hạn') || q.includes('năm nay') || q.includes('năm 2026') || q.includes('tương lai')) {
    return {
      answer: `${interpretation.luckFortune.currentDecade} ${interpretation.luckFortune.currentYear}`,
      relatedPalaces: ['Mệnh', 'Thiên Di', 'Quan Lộc'],
      advice: interpretation.luckFortune.advice
    };
  }

  // Phân tích cung đang chọn nếu câu hỏi chung chung
  const currentPalace = selectedPalaceName ? findPalace(selectedPalaceName) : findPalace('Mệnh');
  return {
    answer: `Xét cung ${currentPalace.name} tại ${currentPalace.branch} của đương số ${thienBan.fullName}: ${interpretation.palaces[currentPalace.name] || 'Cung vị này có nguồn năng lượng quân bình, hội tụ các cát tinh thúc đẩy vận trình thuận lợi.'}`,
    relatedPalaces: [currentPalace.name, 'Mệnh'],
    advice: 'Lấy đạo lý làm gốc, hành động khiêm tốn và kiên định sẽ mang lại kết quả tốt nhất.'
  };
}
