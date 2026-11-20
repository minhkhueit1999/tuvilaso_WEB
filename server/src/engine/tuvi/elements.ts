import { ElementType, Gender } from './types.js';

// Ngũ Hành Nạp Âm cho 60 Hoa Giáp
const NAP_AM: Record<string, { menh: string; element: ElementType }> = {
  'Giáp Tý': { menh: 'Hải Trung Kim', element: 'Kim' },
  'Ất Sửu': { menh: 'Hải Trung Kim', element: 'Kim' },
  'Bính Dần': { menh: 'Lư Trung Hỏa', element: 'Hoa' },
  'Đinh Mão': { menh: 'Lư Trung Hỏa', element: 'Hoa' },
  'Mậu Thìn': { menh: 'Đại Lâm Mộc', element: 'Moc' },
  'Kỷ Tỵ': { menh: 'Đại Lâm Mộc', element: 'Moc' },
  'Canh Ngọ': { menh: 'Lộ Bàng Thổ', element: 'Tho' },
  'Tân Mùi': { menh: 'Lộ Bàng Thổ', element: 'Tho' },
  'Nhâm Thân': { menh: 'Kiếm Phong Kim', element: 'Kim' },
  'Quý Dậu': { menh: 'Kiếm Phong Kim', element: 'Kim' },
  'Giáp Tuất': { menh: 'Sơn Đầu Hỏa', element: 'Hoa' },
  'Ất Hợi': { menh: 'Sơn Đầu Hỏa', element: 'Hoa' },
  'Bính Tý': { menh: 'Giản Hạ Thủy', element: 'Thuy' },
  'Đinh Sửu': { menh: 'Giản Hạ Thủy', element: 'Thuy' },
  'Mậu Dần': { menh: 'Thành Đầu Thổ', element: 'Tho' },
  'Kỷ Mão': { menh: 'Thành Đầu Thổ', element: 'Tho' },
  'Canh Thìn': { menh: 'Bạch Lạp Kim', element: 'Kim' },
  'Tân Tỵ': { menh: 'Bạch Lạp Kim', element: 'Kim' },
  'Nhâm Ngọ': { menh: 'Dương Liễu Mộc', element: 'Moc' },
  'Quý Mùi': { menh: 'Dương Liễu Mộc', element: 'Moc' },
  'Giáp Thân': { menh: 'Tuyền Trung Thủy', element: 'Thuy' },
  'Ất Dậu': { menh: 'Tuyền Trung Thủy', element: 'Thuy' },
  'Bính Tuất': { menh: 'Ốc Thượng Thổ', element: 'Tho' },
  'Đinh Hợi': { menh: 'Ốc Thượng Thổ', element: 'Tho' },
  'Mậu Tý': { menh: 'Tích Lịch Hỏa', element: 'Hoa' },
  'Kỷ Sửu': { menh: 'Tích Lịch Hỏa', element: 'Hoa' },
  'Canh Dần': { menh: 'Tùng Bách Mộc', element: 'Moc' },
  'Tân Mão': { menh: 'Tùng Bách Mộc', element: 'Moc' },
  'Nhâm Thìn': { menh: 'Trường Lưu Thủy', element: 'Thuy' },
  'Quý Tỵ': { menh: 'Trường Lưu Thủy', element: 'Thuy' },
  'Giáp Ngọ': { menh: 'Sa Trung Kim', element: 'Kim' },
  'Ất Mùi': { menh: 'Sa Trung Kim', element: 'Kim' },
  'Bính Thân': { menh: 'Sơn Hạ Hỏa', element: 'Hoa' },
  'Đinh Dậu': { menh: 'Sơn Hạ Hỏa', element: 'Hoa' },
  'Mậu Tuất': { menh: 'Bình Địa Mộc', element: 'Moc' },
  'Kỷ Hợi': { menh: 'Bình Địa Mộc', element: 'Moc' },
  'Canh Tý': { menh: 'Bích Thượng Thổ', element: 'Tho' },
  'Tân Sửu': { menh: 'Bích Thượng Thổ', element: 'Tho' },
  'Nhâm Dần': { menh: 'Kim Bạch Kim', element: 'Kim' },
  'Quý Mão': { menh: 'Kim Bạch Kim', element: 'Kim' },
  'Giáp Thìn': { menh: 'Phúc Đăng Hỏa', element: 'Hoa' },
  'Ất Tỵ': { menh: 'Phúc Đăng Hỏa', element: 'Hoa' },
  'Bính Ngọ': { menh: 'Thiên Hà Thủy', element: 'Thuy' },
  'Đinh Mùi': { menh: 'Thiên Hà Thủy', element: 'Thuy' },
  'Mậu Thân': { menh: 'Đại Trạch Thổ', element: 'Tho' },
  'Kỷ Dậu': { menh: 'Đại Trạch Thổ', element: 'Tho' },
  'Canh Tuất': { menh: 'Thoa Xuyến Kim', element: 'Kim' },
  'Tân Hợi': { menh: 'Thoa Xuyến Kim', element: 'Kim' },
  'Nhâm Tý': { menh: 'Tang Đố Mộc', element: 'Moc' },
  'Quý Sửu': { menh: 'Tang Đố Mộc', element: 'Moc' },
  'Giáp Dần': { menh: 'Đại Khê Thủy', element: 'Thuy' },
  'Ất Mão': { menh: 'Đại Khê Thủy', element: 'Thuy' },
  'Bính Thìn': { menh: 'Sa Trung Thổ', element: 'Tho' },
  'Đinh Tỵ': { menh: 'Sa Trung Thổ', element: 'Tho' },
  'Mậu Ngọ': { menh: 'Thiên Thượng Hỏa', element: 'Hoa' },
  'Kỷ Mùi': { menh: 'Thiên Thượng Hỏa', element: 'Hoa' },
  'Canh Thân': { menh: 'Thạch Lựu Mộc', element: 'Moc' },
  'Tân Dậu': { menh: 'Thạch Lựu Mộc', element: 'Moc' },
  'Nhâm Tuất': { menh: 'Đại Hải Thủy', element: 'Thuy' },
  'Quý Hợi': { menh: 'Đại Hải Thủy', element: 'Thuy' }
};

export function getNapAm(can: string, chi: string): { menh: string; element: ElementType } {
  const key = `${can} ${chi}`;
  return NAP_AM[key] || { menh: 'Hải Trung Kim', element: 'Kim' };
}

// Kiểm tra Can là Dương hay Âm
export function isDuongCan(can: string): boolean {
  return ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(can);
}

// Xác định Âm Dương Nam Nữ
export function getAmDuongNamNu(canYear: string, gender: Gender): { label: string; isThuan: boolean } {
  const duong = isDuongCan(canYear);
  if (gender === 'male') {
    return {
      label: duong ? 'Dương Nam' : 'Âm Nam',
      isThuan: duong // Dương Nam thuận lý
    };
  } else {
    return {
      label: duong ? 'Dương Nữ' : 'Âm Nữ',
      isThuan: !duong // Âm Nữ thuận lý
    };
  }
}

export interface CucInfo {
  name: string; // Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục
  number: number; // 2, 3, 4, 5, 6
  element: ElementType;
}

// Khẩu quyết tính Cục từ Can Năm và Chi của Cung Mệnh:
// 1. Dùng Ngũ Hổ Độn tìm Can của cung Mệnh:
//    - Giáp, Kỷ: Bính Dần
//    - Ất, Canh: Mậu Dần
//    - Bính, Tân: Canh Dần
//    - Đinh, Nhâm: Nhâm Dần
//    - Mậu, Quý: Giáp Dần
// 2. Tra Ngũ Hành Nạp Âm của Can-Chi cung Mệnh => đó chính là Cục!
export function calculateCuc(canYear: string, menhChiIndex: number): CucInfo {
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

  const canYearIndex = CAN.indexOf(canYear);
  // Can của cung Dần (index 2)
  const canDanIndex = (canYearIndex % 5) * 2 + 2; // Giáp/Kỷ -> Bính (2), Ất/Canh -> Mậu (4)...
  
  // Từ Dần (index 2) đến menhChiIndex:
  let steps = (menhChiIndex - 2 + 12) % 12;
  let canMenhIndex = (canDanIndex + steps) % 10;
  
  const canMenh = CAN[canMenhIndex];
  const chiMenh = CHI[menhChiIndex];

  const napAmMenh = getNapAm(canMenh, chiMenh);

  switch (napAmMenh.element) {
    case 'Thuy':
      return { name: 'Thủy Nhị Cục', number: 2, element: 'Thuy' };
    case 'Moc':
      return { name: 'Mộc Tam Cục', number: 3, element: 'Moc' };
    case 'Kim':
      return { name: 'Kim Tứ Cục', number: 4, element: 'Kim' };
    case 'Tho':
      return { name: 'Thổ Ngũ Cục', number: 5, element: 'Tho' };
    case 'Hoa':
      return { name: 'Hỏa Lục Cục', number: 6, element: 'Hoa' };
    default:
      return { name: 'Thủy Nhị Cục', number: 2, element: 'Thuy' };
  }
}

