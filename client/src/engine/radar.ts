import { ChartData, Palace } from './types.js';

export interface FormationMatch {
  id: string;
  name: string;
  category: 'cat_cach' | 'hung_cach' | 'dac_biet';
  palaceNames: string[];
  palaceIds: number[];
  matchedConditions: string[];
  description: string;
  advice: string;
}

export interface TrungPhungAlert {
  id: string;
  level: 'dai_cat' | 'canh_bao_do' | 'trung_tinh';
  title: string;
  palaceIds: number[];
  palaceNames: string[];
  description: string;
  actionableAdvice: string;
}

export interface RadarScanResult {
  formations: FormationMatch[];
  catCachCount: number;
  hungCachCount: number;
  dacBietCount: number;
  trungPhungAlerts: TrungPhungAlert[];
}

export function scanFormationsAndAlerts(chart: ChartData): RadarScanResult {
  const formations: FormationMatch[] = [];
  const trungPhungAlerts: TrungPhungAlert[] = [];

  const palaces = chart.palaces;
  const findPalace = (name: string) => palaces.find(p => p.name === name) || palaces[0];
  const menh = findPalace('Mệnh');
  const quan = findPalace('Quan Lộc');
  const tai = findPalace('Tài Bạch');
  const di = findPalace('Thiên Di');
  const the = findPalace('Phu Thê');
  const phuc = findPalace('Phúc Đức');

  const cleanName = (name: string) => name.replace(/^[+-]/, '').trim();
  const getMajorNames = (p: Palace) => (p?.majorStars || []).map(s => cleanName(s.name));
  const getAllStarNames = (p: Palace) => [
    ...getMajorNames(p),
    ...(p?.minorStars || []).map(s => cleanName(s.name))
  ];

  const menhMajors = getMajorNames(menh);
  const menhAll = getAllStarNames(menh);
  const tamPhuongPalaces = [menh, quan, tai, di];
  const tamPhuongMajors = Array.from(new Set(tamPhuongPalaces.flatMap(getMajorNames)));
  const tamPhuongAll = Array.from(new Set(tamPhuongPalaces.flatMap(getAllStarNames)));

  // ==========================================
  // 1. NHÓM TỬ PHỦ VŨ TƯỚNG (Cát Cách)
  // ==========================================
  // Tử Phủ Đồng Cung (Thân / Dần)
  if (menhMajors.includes('Tử Vi') && menhMajors.includes('Thiên Phủ')) {
    formations.push({
      id: 'tu_phu_dong_cung',
      name: 'Tử Phủ Đồng Cung Cách',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Tử Vi và Thiên Phủ đồng tọa tại Cung Mệnh'],
      description: 'Phúc lộc song toàn, khí độ trầm tĩnh đĩnh đạc, có tài tổ chức và lãnh đạo vững vàng suốt đời.',
      advice: 'Nên nắm giữ quyền quản lý thực tế, phát huy uy tín đạo đức để tích lũy cơ đồ bền vững.'
    });
  }

  // Tử Phủ Triều Viên
  if (tamPhuongMajors.includes('Tử Vi') && tamPhuongMajors.includes('Thiên Phủ') && !formations.some(f => f.id === 'tu_phu_dong_cung')) {
    formations.push({
      id: 'tu_phu_trieu_vien',
      name: 'Tử Phủ Triều Viên Cách',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di'],
      palaceIds: tamPhuongPalaces.map(p => p.id),
      matchedConditions: ['Tử Vi và Thiên Phủ hội chiếu tam phương tứ chính Cung Mệnh'],
      description: 'Cách cục đế vương phụ tá, ra ngoài được kính trọng, làm việc có tổ chức và danh vọng lớn.',
      advice: 'Tận dụng các mối quan hệ quý nhân thượng tầng để xây dựng sự nghiệp dài hạn.'
    });
  }

  // Quân Thần Khánh Hội
  if (tamPhuongMajors.includes('Tử Vi') && (tamPhuongAll.includes('Tả Phù') || tamPhuongAll.includes('Hữu Bật')) && (tamPhuongAll.includes('Thiên Khôi') || tamPhuongAll.includes('Thiên Việt'))) {
    formations.push({
      id: 'quan_than_khanh_hoi',
      name: 'Quân Thần Khánh Hội Cách',
      category: 'cat_cach',
      palaceNames: ['Mệnh'],
      palaceIds: [menh.id],
      matchedConditions: ['Tử Vi ngộ Tả Phù, Hữu Bật cùng Khôi Việt hội tụ'],
      description: 'Vua gặp bầy tôi tài giỏi phò tá, năng lực quy tụ quần chúng xuất chúng, nắm đại quyền.',
      advice: 'Biết ủy quyền và trọng dụng người tài xung quanh sẽ đưa doanh nghiệp/tổ chức lên đỉnh cao.'
    });
  }

  // Phủ Tướng Triều Viên
  if (tamPhuongMajors.includes('Thiên Phủ') && tamPhuongMajors.includes('Thiên Tướng')) {
    formations.push({
      id: 'phu_tuong_trieu_vien',
      name: 'Phủ Tướng Triều Viên Cách',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Quan Lộc', 'Tài Bạch'],
      palaceIds: [menh.id, quan.id, tai.id],
      matchedConditions: ['Thiên Phủ và Thiên Tướng triều củng Cung Mệnh'],
      description: 'Tài chính vững như kho tàng, trung hậu thành tín, cơm no áo ấm hưởng phúc dài lâu.',
      advice: 'Phù hợp tài chính, ngân hàng, quản trị nhân sự và kinh doanh quy chuẩn.'
    });
  }

  // Vũ Khúc Thiên Phủ
  if (menhMajors.includes('Vũ Khúc') && menhMajors.includes('Thiên Phủ')) {
    formations.push({
      id: 'vu_phu_dong_cung',
      name: 'Vũ Phủ Đồng Cung (Đại Phú Khố Cách)',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Vũ Khúc (Tài Tinh) hội Thiên Phủ (Thiên Khố) tại Mệnh'],
      description: 'Kho vàng gặp tài tinh, năng lực quản trị vốn tuyệt vời, hậu vận tích lũy điền sản lớn.',
      advice: 'Chú trọng đầu tư an toàn, không nên mạo hiểm đòn bẩy quá mức.'
    });
  }

  // Tham Vũ Đồng Hành
  if ((menhMajors.includes('Vũ Khúc') && menhMajors.includes('Tham Lang')) || (tamPhuongMajors.includes('Vũ Khúc') && tamPhuongMajors.includes('Tham Lang'))) {
    formations.push({
      id: 'tham_vu_dong_hanh',
      name: 'Tham Vũ Đồng Hành Cách (Tiền Bần Hậu Phú)',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Vũ Khúc ngộ Tham Lang tại Mệnh hoặc Tam Phương'],
      description: 'Tuổi trẻ nhiều thử thách bôn ba rèn luyện, trung niên hậu vận phát phúc phát tài mạnh mẽ.',
      advice: 'Kiên trì tích lũy kinh nghiệm giai đoạn trước 35 tuổi, thời cơ bứt phá sau đó rất rực rỡ.'
    });
  }

  // ==========================================
  // 2. NHÓM CƠ NGUYỆT ĐỒNG LƯƠNG (Cát Cách)
  // ==========================================
  const cndlCount = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => tamPhuongMajors.includes(s)).length;
  if (cndlCount >= 3) {
    formations.push({
      id: 'co_nguyet_dong_luong',
      name: 'Cơ Nguyệt Đồng Lương Cách',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di'],
      palaceIds: tamPhuongPalaces.map(p => p.id),
      matchedConditions: ['Tập hợp đầy đủ Cơ - Nguyệt - Đồng - Lương trong Tam Phương Tứ Chính'],
      description: 'Mưu lược cơ trí, tính tình hòa nhã, có duyên công chức, cơ quan nhà nước, giáo dục, tham mưu.',
      advice: 'Nên phát triển thế mạnh tư vấn chiến lược, chuyên môn học thuật hoặc tổ chức hành chính.'
    });
  }

  // Nhật Nguyệt Tịnh Minh
  if (tamPhuongMajors.includes('Thái Dương') && tamPhuongMajors.includes('Thái Âm')) {
    const duongP = palaces.find(p => p.majorStars.some(s => s.name.includes('Thái Dương')));
    const amP = palaces.find(p => p.majorStars.some(s => s.name.includes('Thái Âm')));
    if (duongP && amP && ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ'].includes(duongP.branch) && ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý'].includes(amP.branch)) {
      formations.push({
        id: 'nhat_nguyet_tinh_minh',
        name: 'Nhật Nguyệt Tịnh Minh Cách',
        category: 'cat_cach',
        palaceNames: [duongP.name, amP.name],
        palaceIds: [duongP.id, amP.id],
        matchedConditions: ['Thái Dương đắc vị ban ngày, Thái Âm đắc vị ban đêm hội tụ'],
        description: 'Vầng nhật nguyệt cùng sáng tỏ rực rỡ, danh tài lưỡng toàn, tính tình thanh cao lỗi lạc.',
        advice: 'Tận dụng danh tiếng và sự uy tín cá nhân để mở rộng tầm ảnh hưởng xã hội.'
      });
    }
  }

  // Nhật Xuất Lôi Môn (Thái Dương tại Mão)
  if (menhMajors.includes('Thái Dương') && menh.branch === 'Mão') {
    formations.push({
      id: 'nhat_xuat_loi_mon',
      name: 'Nhật Xuất Lôi Môn Cách',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Thái Dương miếu vượng tọa thủ tại Mão Cung'],
      description: 'Mặt trời mọc cửa sấm sét sáng rực phương Đông, công danh thăng tiến sớm, tính tình quang minh chính trực.',
      advice: 'Dám nghĩ dám làm, thích hợp các cương vị tiên phong mở đường hoặc ngoại giao.'
    });
  }

  // Nguyệt Lãng Thiên Môn (Thái Âm tại Hợi)
  if (menhMajors.includes('Thái Âm') && menh.branch === 'Hợi') {
    formations.push({
      id: 'nguyet_lang_thien_mon',
      name: 'Nguyệt Lãng Thiên Môn Cách',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Thái Âm miếu vượng tọa thủ tại Hợi Cung'],
      description: 'Trăng thanh tỏa sáng cửa trời đêm, tinh tế uyên bác, giàu lòng trắc ẩn, phú quý tiềm tàng.',
      advice: 'Phù hợp phát triển nghệ thuật, tài chính, đầu tư quốc tế và chiến lược thầm lặng.'
    });
  }

  // Cự Nhật Đồng Cung (Dần / Thân)
  if (menhMajors.includes('Cự Môn') && menhMajors.includes('Thái Dương')) {
    formations.push({
      id: 'cu_nhat_dong_cung',
      name: 'Cự Nhật Đồng Cung Cách',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Cự Môn và Thái Dương đồng tọa thủ'],
      description: 'Nói năng khúc chiết lưu loát, Thái Dương xua tan ám tính của Cự Môn, danh tiếng vang xa.',
      advice: 'Phát huy thế mạnh đàm phán, giảng dạy, luật sư, truyền thông và quan hệ công chúng.'
    });
  }

  // ==========================================
  // 3. NHÓM SÁT PHÁ THAM & ĐẶC BIỆT
  // ==========================================
  const sptCount = ['Thất Sát', 'Phá Quân', 'Tham Lang'].filter(s => tamPhuongMajors.includes(s)).length;
  if (sptCount >= 2) {
    formations.push({
      id: 'sat_pha_tham',
      name: 'Sát Phá Tham Cách (Kình Lực Bứt Phá)',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Quan Lộc', 'Tài Bạch'],
      palaceIds: [menh.id, quan.id, tai.id],
      matchedConditions: ['Thất Sát, Phá Quân, Tham Lang hội tụ tam phương'],
      description: 'Cá tính mạnh mẽ quyết liệt, dám chấp nhận rủi ro, năng lực xoay chuyển tình thế trong nghịch cảnh.',
      advice: 'Nên tham gia môi trường kinh doanh cạnh tranh cao, quân ngũ, công nghệ đột phá.'
    });
  }

  // Thất Sát Triều Đẩu (Dần / Thân)
  if (menhMajors.includes('Thất Sát') && ['Dần', 'Thân'].includes(menh.branch)) {
    formations.push({
      id: 'that_sat_trieu_dau',
      name: 'Thất Sát Triều Đẩu Cách',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Thất Sát miếu địa độc tọa tại Dần hoặc Thân Cung'],
      description: 'Đại tướng trấn giữ biên ải, uy vũ lẫy lừng, độc lập tự chủ và có uy tín quân sự, chính trị.',
      advice: 'Thích hợp vai trò đứng đầu, quyết sách độc lập, không chịu gò bó phụ thuộc.'
    });
  }

  // Hỏa Tham / Linh Tham Cách
  if (tamPhuongMajors.includes('Tham Lang') && (tamPhuongAll.includes('Hỏa Tinh') || tamPhuongAll.includes('Linh Tinh'))) {
    formations.push({
      id: 'hoa_tham_linh_tham',
      name: 'Hỏa Tham / Linh Tham Cách (Bạo Phát Hoạnh Tài)',
      category: 'dac_biet',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Tham Lang hội Hỏa Tinh hoặc Linh Tinh'],
      description: 'Cách cục phát tài đột ngột bất ngờ, thời cơ bùng nổ, danh tài tăng tiến mau lẹ.',
      advice: 'Khi phát đạt cần biết thu vén phòng thủ, tích đức hành thiện để giữ gìn thành quả bền vững.'
    });
  }

  // Thạch Trung Ẩn Ngọc (Cự Môn tại Tý/Ngọ gặp Lộc/Quyền/Khoa)
  if (menhMajors.includes('Cự Môn') && ['Tý', 'Ngọ'].includes(menh.branch) && (menhAll.includes('Hóa Lộc') || menhAll.includes('Hóa Quyền') || menhAll.includes('Hóa Khoa') || menhAll.includes('Lộc Tồn'))) {
    formations.push({
      id: 'thach_trung_an_ngoc',
      name: 'Thạch Trung Ẩn Ngọc Cách (Ngọc Ẩn Trong Đá)',
      category: 'cat_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Cự Môn tại Tý/Ngọ gặp Cát Hóa Khoa/Quyền/Lộc'],
      description: 'Tài năng tiềm ẩn ban đầu ít ai hay, càng mài giũa càng lộ phẩm chất ngọc quý sáng giá.',
      advice: 'Cần khiêm tốn tích lũy giai đoạn đầu, không nóng vội khoe mẽ trước thời cuộc.'
    });
  }

  // Tam Kỳ Gia Hội (Lộc - Quyền - Khoa hội tụ Tam Phương)
  if (tamPhuongAll.includes('Hóa Lộc') && tamPhuongAll.includes('Hóa Quyền') && tamPhuongAll.includes('Hóa Khoa')) {
    formations.push({
      id: 'tam_ky_gia_hoi',
      name: 'Tam Kỳ Gia Hội Cách (Đại Cát Đẳng Cấp)',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Quan Lộc', 'Tài Bạch'],
      palaceIds: [menh.id, quan.id, tai.id],
      matchedConditions: ['Hóa Lộc, Hóa Quyền, Hóa Khoa cùng tề tựu tam phương tứ chính'],
      description: 'Phẩm hàm cao quý, có học vấn (Khoa), quyền lực (Quyền) và tài chính hanh thông (Lộc).',
      advice: 'Thời cơ gặp vận thuận buồm xuôi gió, danh lộc vẹn toàn.'
    });
  }

  // Song Lộc Triều Viên
  if (tamPhuongAll.includes('Lộc Tồn') && tamPhuongAll.includes('Hóa Lộc')) {
    formations.push({
      id: 'song_loc_trieu_vien',
      name: 'Song Lộc Triều Viên Cách',
      category: 'cat_cach',
      palaceNames: ['Mệnh', 'Tài Bạch'],
      palaceIds: [menh.id, tai.id],
      matchedConditions: ['Lộc Tồn và Hóa Lộc cùng triều củng Cung Mệnh'],
      description: 'Tiền tài hanh thông như suối nguồn dồi dào, buôn may bán đắt, đại cát kinh thương.',
      advice: 'Phát huy sở trường kinh doanh buôn bán, xây dựng tài sản giá trị thật.'
    });
  }

  // ==========================================
  // 4. NHÓM HUNG CÁCH & CẢNH BÁO
  // ==========================================
  // Linh Xương Đà Vũ
  if (tamPhuongAll.includes('Văn Xương') && tamPhuongAll.includes('Đà La') && tamPhuongMajors.includes('Vũ Khúc') && (tamPhuongAll.includes('Linh Tinh') || tamPhuongAll.includes('Hỏa Tinh'))) {
    formations.push({
      id: 'linh_xuong_da_vu',
      name: 'Linh Xương Đà Vũ Cách (Hung Cách Lưu Ý)',
      category: 'hung_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Vũ Khúc, Văn Xương, Đà La, Linh Tinh cùng hội tụ'],
      description: 'Dễ vướng rắc rối văn bản pháp lý, hạn sông nước hoặc áp lực tâm lý bột phát.',
      advice: 'Cần cẩn trọng hợp đồng giấy tờ, không nóng vội ký kết khi chưa rõ pháp lý.'
    });
  }

  // Không Kiếp Giáp Mệnh
  const leftOfMenh = palaces.find(p => p.id === (menh.id + 11) % 12);
  const rightOfMenh = palaces.find(p => p.id === (menh.id + 1) % 12);
  const leftAll = leftOfMenh ? getAllStarNames(leftOfMenh) : [];
  const rightAll = rightOfMenh ? getAllStarNames(rightOfMenh) : [];
  if ((leftAll.includes('Địa Không') && rightAll.includes('Địa Kiếp')) || (leftAll.includes('Địa Kiếp') && rightAll.includes('Địa Không'))) {
    formations.push({
      id: 'khong_kiep_giap_menh',
      name: 'Địa Không Địa Kiếp Giáp Mệnh Cách',
      category: 'hung_cach',
      palaceNames: [menh.name, leftOfMenh!.name, rightOfMenh!.name],
      palaceIds: [menh.id, leftOfMenh!.id, rightOfMenh!.id],
      matchedConditions: ['Hai bên Cung Mệnh bị Địa Không và Địa Kiếp kẹp giáp'],
      description: 'Cuộc sống hay gặp những khúc quanh bất ngờ, cảm giác đơn độc hoặc thăng trầm tiền tài.',
      advice: 'Nên tích lũy tài sản dưới dạng hiện vật bền vững, hành thiện tích đức để vững tâm.'
    });
  }

  // Dương Đà Giáp Kỵ
  if ((leftAll.includes('Kình Dương') && rightAll.includes('Đà La') && menhAll.includes('Hóa Kỵ')) || (leftAll.includes('Đà La') && rightAll.includes('Kình Dương') && menhAll.includes('Hóa Kỵ'))) {
    formations.push({
      id: 'duong_da_giap_ky',
      name: 'Dương Đà Giáp Kỵ Cách',
      category: 'hung_cach',
      palaceNames: [menh.name],
      palaceIds: [menh.id],
      matchedConditions: ['Kình Dương và Đà La kẹp Cung Mệnh có Hóa Kỵ'],
      description: 'Dễ bị tiểu nhân dèm pha, trói buộc ý chí hoặc áp lực tứ bề bủa vây.',
      advice: 'Nhẫn nhịn là vàng, không can dự vào chuyện thị phi không phải của mình.'
    });
  }

  // ==========================================
  // 5. CẢNH BÁO "TRÙNG PHÙNG" 3 TẦNG (Bản Mệnh - Đại Vận - Lưu Niên)
  // ==========================================
  // Song Lộc Trùng Phùng
  const hasBirthLoc = tamPhuongAll.includes('Hóa Lộc') || tamPhuongAll.includes('Lộc Tồn');
  const hasDecadeLoc = Boolean(chart.vanHan?.tuHoaDaiVan?.loc);
  const hasYearLoc = Boolean(chart.vanHan?.tuHoaLuuNien?.loc);

  if (hasBirthLoc && (hasDecadeLoc || hasYearLoc)) {
    trungPhungAlerts.push({
      id: 'song_loc_trung_phung',
      level: 'dai_cat',
      title: 'Song Lộc / Tam Lộc Trùng Phùng Đắc Vận',
      palaceIds: [menh.id, tai.id],
      palaceNames: ['Mệnh', 'Tài Bạch'],
      description: 'Lộc Tồn / Hóa Lộc bản mệnh tương hội cùng Tứ Hóa Đại Vận hoặc Lưu Niên, tạo xung lực tài chính cực mạnh.',
      actionableAdvice: 'Thời cơ vàng để đẩy mạnh dự án, mở rộng kinh doanh, chốt lời hoặc chuyển nhượng tài sản.'
    });
  }

  // Song Kỵ / Trùng Kỵ Cảnh Báo Đỏ
  const hasBirthKy = menhAll.includes('Hóa Kỵ');
  const hasDecadeKy = chart.vanHan?.tuHoaDaiVan?.ky;
  const hasYearKy = chart.vanHan?.tuHoaLuuNien?.ky;

  if (hasBirthKy && (hasDecadeKy || hasYearKy)) {
    trungPhungAlerts.push({
      id: 'song_ky_trung_phung',
      level: 'canh_bao_do',
      title: 'Cảnh Báo Đỏ: Song Kỵ Trùng Phùng',
      palaceIds: [menh.id],
      palaceNames: ['Mệnh'],
      description: 'Hóa Kỵ bản mệnh hội tụ cùng Hóa Kỵ Đại Vận/Lưu Niên, biểu thị thử thách lớn về áp lực tinh thần hoặc bế tắc.',
      actionableAdvice: 'Phòng thủ toàn diện: bảo toàn vốn, giữ gìn sức khỏe, tránh đầu tư mạo hiểm và hạn chế tranh chấp pháp lý.'
    });
  }

  // Đại Vận Kỵ Xung Lưu Niên hoặc Ngược Lại
  if (chart.vanHan) {
    const vYear = chart?.thienBan?.viewingYear || 2026;
    trungPhungAlerts.push({
      id: 'van_han_canh_bao',
      level: 'trung_tinh',
      title: 'Vận Trình Năm ' + vYear + ': Tương Tác Vận Khí',
      palaceIds: [menh.id, quan.id],
      palaceNames: ['Mệnh', 'Quan Lộc'],
      description: `Đang lưu chuyển tại Đại Vận cung ${chart.vanHan.currentDecadePalaceName || 'Mệnh'} chiếu Lưu Niên năm ${vYear}.`,
      actionableAdvice: 'Theo sát các tháng giao mùa và các cung có sao Lưu để chủ động nắm bắt cơ hội.'
    });
  }

  return {
    formations,
    catCachCount: formations.filter(f => f.category === 'cat_cach').length,
    hungCachCount: formations.filter(f => f.category === 'hung_cach').length,
    dacBietCount: formations.filter(f => f.category === 'dac_biet').length,
    trungPhungAlerts
  };
}

export function detectAllFormations(
  palaces: Palace[],
  tamPhuongTuChinh?: any,
  canYear?: string
): RadarScanResult {
  const dummyChart: any = {
    palaces,
    thienBan: {
      canChiYear: canYear ? `${canYear} ...` : 'Giáp Tý',
      viewingYear: 2026,
      fullName: 'Đương Số'
    },
    tamPhuongTuChinh,
    vanHan: undefined
  };
  return scanFormationsAndAlerts(dummyChart);
}

