import { ThienBan, Palace, Interpretation, TamPhuongTuChinh } from './types.js';

export function generateInterpretation(
  thienBan: ThienBan,
  palaces: Palace[],
  tamPhuongTuChinh: Record<number, TamPhuongTuChinh>,
  viewingYear = 2026
): Interpretation {
  const menhPalace = palaces.find(p => p.isMenh) || palaces[0];
  const thanPalace = palaces.find(p => p.isThan) || palaces[0];

  // 1. Phân tích Mệnh Cục
  let menhCucText = '';
  const menhElem = thienBan.banMenh; // e.g. "Hải Trung Kim"
  const cucElem = thienBan.cuc; // e.g. "Thủy Nhị Cục"

  if (cucElem.includes('Kim')) {
    if (menhElem.includes('Thủy')) menhCucText = 'Cục sinh Mệnh (Kim sinh Thủy): Môi trường hoàn cảnh và xã hội luôn tạo điều kiện thuận lợi, nâng đỡ đương số phát triển tài năng và sự nghiệp.';
    else if (menhElem.includes('Mộc')) menhCucText = 'Cục khắc Mệnh (Kim khắc Mộc): Tiền vận hay gặp sóng gió thử thách từ môi trường ngoại cảnh, cần bền chí vượt khó khăn để thành công vững bền.';
    else if (menhElem.includes('Kim')) menhCucText = 'Cục Mệnh Tỷ Hòa: Cuộc đời hài hòa với hoàn cảnh xung quanh, làm việc có lộ trình rõ ràng, ít bị biến động đột ngột.';
    else menhCucText = 'Cục và Mệnh tương tác chuyển hóa: Cần chủ động nắm bắt thời cơ và linh hoạt ứng biến theo chu kỳ vận hạn.';
  } else if (cucElem.includes('Thủy')) {
    if (menhElem.includes('Mộc')) menhCucText = 'Cục sinh Mệnh (Thủy sinh Mộc): Đắc thời đắc địa, được quý nhân hỗ trợ, học hành sự nghiệp có duyên gặp người chỉ dẫn đúng đắn.';
    else if (menhElem.includes('Hỏa')) menhCucText = 'Cục khắc Mệnh (Thủy khắc Hỏa): Gặp nhiều cạnh tranh và áp lực trong cuộc sống, tôi luyện nên bản lĩnh kiên cường, càng về hậu vận càng thăng tiến.';
    else if (menhElem.includes('Thủy')) menhCucText = 'Cục Mệnh Tỷ Hòa: Khả năng thích nghi cao, mềm mỏng nhưng sâu sắc, dễ hòa nhập và xây dựng quan hệ bền chặt.';
    else menhCucText = 'Cục và Mệnh tương hòa: Phát huy tư duy chiến lược và sự linh hoạt để đạt thành tựu cao.';
  } else if (cucElem.includes('Mộc')) {
    if (menhElem.includes('Hỏa')) menhCucText = 'Cục sinh Mệnh (Mộc sinh Hỏa): Khí thế hừng hực, có nhiệt huyết và năng lượng dồi dào, mở rộng quy mô kinh doanh hoặc sự nghiệp hanh thông.';
    else if (menhElem.includes('Thổ')) menhCucText = 'Cục khắc Mệnh (Mộc khắc Thổ): Đòi hỏi sự kiên nhẫn bền bỉ, cần chú trọng tích lũy nội lực trước khi bung sức mở rộng quy mô.';
    else menhCucText = 'Cục Mệnh cộng hưởng: Lòng nhân ái, chí hướng vươn lên mạnh mẽ, công danh bền vững.';
  } else if (cucElem.includes('Hỏa')) {
    if (menhElem.includes('Thổ')) menhCucText = 'Cục sinh Mệnh (Hỏa sinh Thổ): Nhiệt huyết soi sáng nền tảng vững chắc, tạo dựng cơ đồ vững vàng từ trung vận trở đi.';
    else if (menhElem.includes('Kim')) menhCucText = 'Cục khắc Mệnh (Hỏa khắc Kim): Gian nan rèn luyện nên ngọc sáng, trải qua nhiều bài học lớn mới gặt hái quả ngọt trường tồn.';
    else menhCucText = 'Hỏa khí rạng ngời: Sáng tạo, quyết đoán, có khả năng dẫn dắt và truyền cảm hứng cho tập thể.';
  } else {
    // Thổ
    if (menhElem.includes('Kim')) menhCucText = 'Cục sinh Mệnh (Thổ sinh Kim): Đất ươm mầm quặng quý, có nền tảng gia đình hoặc căn cơ vững chắc để bứt phá.';
    else if (menhElem.includes('Thủy')) menhCucText = 'Cục khắc Mệnh (Thổ khắc Thủy): Đòi hỏi đương số phải làm chủ cảm xúc và quản trị rủi ro chặt chẽ, tiền tài vào ra phải có kế hoạch.';
    else menhCucText = 'Căn cơ dày dặn: Đáng tin cậy, thực tế, làm việc chắc chắn từng bước.';
  }

  // 2. Phân tích Thân Cư
  let thanCuText = '';
  if (thanPalace.isMenh) {
    thanCuText = 'Thân cư Mệnh: Tự lập từ sớm, tính cách nhất quán từ tiền vận đến hậu vận. Trọng trách tự thân gánh vác, số tự làm chủ cuộc đời.';
  } else if (thanPalace.name === 'Phúc Đức') {
    thanCuText = 'Thân cư Phúc Đức: Hậu vận gắn liền với phúc ấm tổ tiên và đời sống tâm linh, tinh thần. Có xu hướng hướng nội, thích làm việc thiện, được hưởng phúc lộc lúc tuổi già.';
  } else if (thanPalace.name === 'Quan Lộc') {
    thanCuText = 'Thân cư Quan Lộc: Người coi trọng sự nghiệp, danh vị và cống hiến xã hội. Hậu vận gắn bó chặt chẽ với thành bại công danh.';
  } else if (thanPalace.name === 'Tài Bạch') {
    thanCuText = 'Thân cư Tài Bạch: Thực tế, nhạy bén kinh tế và quản lý dòng tiền. Hậu vận mưu cầu sự an toàn tài chính, tích lũy đất đai tài sản dồi dào.';
  } else if (thanPalace.name === 'Thiên Di') {
    thanCuText = 'Thân cư Thiên Di: Duyên đi xa phát triển, thích xuất ngoại hoặc công tác ngoại giao, hay thay đổi môi trường sống và làm việc.';
  } else if (thanPalace.name === 'Phu Thê') {
    thanCuText = 'Thân cư Phu Thê: Gia đình và bạn đời có sức ảnh hưởng quyết định đến thành bại hậu vận. Vợ chồng đồng lòng sẽ gây dựng cơ nghiệp rực rỡ.';
  } else {
    thanCuText = `Thân cư ${thanPalace.name}: Trọng tâm nửa đời sau chuyển dịch mạnh mẽ về các mối quan hệ và lĩnh vực của cung này.`;
  }

  const generalAssessment = `Đương số ${thienBan.fullName} (${thienBan.amDuong}), Bản mệnh ${thienBan.banMenh}, đắc Cục ${thienBan.cuc}. ${thienBan.amDuongLy}. Cung Mệnh an tại ${menhPalace.branch} có các chính tinh ${menhPalace.majorStars.map(s => s.name + ' (' + s.brightness + ')').join(', ') || 'Vô Chính Diệu'}. Đây là cách cục biểu hiện trí tuệ linh hoạt, nội lực tiềm tàng, cần phát huy sở trường quản trị và giữ vững tâm thế kiên định trước thời cuộc.`;

  // 3. Luận giải chi tiết 12 Cung
  const palaceInterpretations: Record<string, string> = {};

  for (const palace of palaces) {
    const majors = palace.majorStars;
    const majorNames = majors.map(s => `${s.name} (${s.brightness})`).join(', ');
    const minors = palace.minorStars.map(s => s.name).slice(0, 6).join(', ');
    const relation = tamPhuongTuChinh[palace.id];
    const xungChieuPalace = palaces.find(p => p.id === relation.xungChieu)?.name || '';

    let content = `Cung ${palace.name} an tại địa chi ${palace.branch} (Can ${palace.can}). `;

    if (majors.length > 0) {
      content += `Chính tinh tọa thủ gồm: ${majorNames}. `;
      const isMieuVuong = majors.some(s => s.brightness === 'M' || s.brightness === 'V');
      const isHam = majors.every(s => s.brightness === 'H');

      if (isMieuVuong) {
        content += `Chính tinh đắc cách Miếu/Vượng mang lại sinh khí tốt, giúp gia tăng uy lực, tài lộc và sự hanh thông cho các vấn đề thuộc cung này. `;
      } else if (isHam) {
        content += `Chính tinh hãm địa đòi hỏi đương số phải cẩn trọng hơn, nên tu dưỡng thêm phẩm hạnh và kiến thức chuyên môn để hóa giải bất lợi. `;
      } else {
        content += `Chính tinh đắc bình địa quân bình, cần thêm các cát tinh hội tụ để kích hoạt tài vận tốt nhất. `;
      }
    } else {
      content += `Cung này Vô Chính Diệu (không có chính tinh tọa thủ). Phải mượn chính tinh từ cung xung chiếu (${xungChieuPalace}) để luận đoán, đương số có khả năng biến hóa tùy cơ ứng biến rất cao. `;
    }

    if (minors.length > 0) {
      content += `Các phụ tinh phối chiếu nổi bật: ${minors}. `;
    }

    if (palace.triet && palace.tuan) {
      content += `Đặc biệt cung này đồng gặp cả Tuần và Triệt án ngữ, trước trở ngại sau ắt hanh thông kỳ lạ. `;
    } else if (palace.triet) {
      content += `Cung này có Triệt án ngữ, tiền vận gặp trắc trở nhưng hậu vận khai thông rõ rệt. `;
    } else if (palace.tuan) {
      content += `Cung này có Tuần Không bao bọc, tính chất ổn định và từ tốn, kìm hãm bớt những hung sát tinh nếu có. `;
    }

    content += `Tam phương tứ chính hội tụ tương tác mật thiết với cung ${xungChieuPalace} và các cung tam hợp.`;

    palaceInterpretations[palace.name] = content;
  }

  // 4. Vận Hạn
  // Tính tuổi ta hiện tại theo viewingYear
  const birthYear = parseInt(thienBan.canChiYear.split(' ')[0], 10) || 1999;
  const currentAge = Math.max(1, viewingYear - birthYear + 1);

  // Tìm Đại hạn hiện tại
  let currentDecadePalace = palaces[0];
  for (const palace of palaces) {
    if (currentAge >= palace.daiHan && currentAge < palace.daiHan + 10) {
      currentDecadePalace = palace;
      break;
    }
  }

  const luckFortune = {
    currentDecade: `Năm ${viewingYear} (đương số ${currentAge} tuổi ta): Đang trong đại vận 10 năm tại cung ${currentDecadePalace.name} (${currentDecadePalace.branch}, từ ${currentDecadePalace.daiHan} đến ${currentDecadePalace.daiHan + 9} tuổi). Cung này hội tụ các sao ${currentDecadePalace.majorStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'}, chủ về giai đoạn cần xây đắp nền móng, củng cố nội lực và hợp tác phát triển.`,
    currentYear: `Tiểu hạn năm ${viewingYear} (Lưu niên Thái Tuế tại cung Ngọ): Đây là thời điểm có nhiều cơ hội đan xen thử thách. Đương số nên chủ động học hỏi kỹ năng mới, kiểm soát tài chính minh bạch và duy trì thói quen lành mạnh.`,
    advice: `Lời khuyên tu dưỡng: "Tâm sinh tướng, đức năng thắng số". Bản chất Tử Vi là tấm bản đồ thiên hướng và chu kỳ thời gian. Nắm được thế mạnh để phát huy, nhận biết điểm yếu để tu dưỡng khiêm cung, lấy phúc đức làm gốc thì vận trình ắt luôn vững vàng đại cát.`
  };

  return {
    overview: {
      menhCuc: menhCucText,
      amDuong: `${thienBan.amDuong} (${thienBan.amDuongLy})`,
      thanCu: thanCuText,
      generalAssessment
    },
    palaces: palaceInterpretations,
    luckFortune
  };
}
