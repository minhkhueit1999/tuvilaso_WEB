# Kế Hoạch Hiện Thực Hóa: Tử Vi Minh Khuê — Cổ Tịch Trung Hoa & 110+ Sao

## 1. Mục Tiêu Tổng Thể
Nâng cấp toàn diện ứng dụng **Tử Vi Minh Khuê** theo chuẩn:
- **Thẩm mỹ Cổ Tịch Trung Hoa (Sách Mộc Bản & Thư Pháp Tống–Minh)**: Triết lý Lưu Bạch, Giấy Tuyên Chỉ & Sơn Mài Huyền Dạ, Khung Song Biên (Double-line Frame), Con Dấu Ấn Triện (Red Seal Stamp), Họa Tiết Hồi Văn (Meander Corner), tuyệt đối không dùng Emoji, không gradient tím/xanh neon SaaS, không bo góc tròn to (`rounded-none` hoặc `rounded-[2px]`).
- **Engine Tử Vi 110+ Sao Đầy Đủ**: 14 Chính Tinh (kèm `+`/`-`, Ngũ Hành, Miếu/Vượng/Đắc/Bình/Hãm), Lục Cát & Lục Sát, Vòng Bác Sĩ (12 sao), Vòng Thái Tuế (12 sao), Vòng Tràng Sinh (12 sao), Hệ phụ tinh theo Năm/Tháng/Ngày/Giờ (Thiên Hình, Thiên Riêu, Đẩu Quân, Tam Thai, Bát Tọa, Ân Quang, Thiên Quý...), Sao Lưu Niên, Tuần/Triệt.
- **Bố Cục 3 Tầng Cho Từng Ô Cung**:
  * Tầng 1 (Header): Can Chi viết tắt, Âm/Dương Ngũ Hành chi, Tên Cung HOA đậm + Con dấu Ấn Triện (THÂN / LAI NHÂN), Chính tinh (màu ngũ hành), Tuổi Đại Vận, Lưu Nguyệt (`Th.1`..`Th.12`).
  * Tầng 2 (Thân cung): 2 cột phụ tinh thẳng tắp (Trái: Cát tinh + Lưu Cát; Phải: Sát tinh + Lưu Sát; Ký hiệu Tứ Hóa `A/B/C/D`, Tự Hóa `↑/↓`).
  * Tầng 3 (Footer): Đại Vận (`ĐV.MỆNH`..), Vòng Tràng Sinh (đậm), Lưu Niên (`LN.MỆNH`..).
  * Tuần/Triệt: Dấu chữ nhật Đen Mực chữ trắng trên đường giáp ranh.
- **4 Trường Phái (School Switcher)**:
  1. **Tổng Hợp**: 110+ sao + Tứ Hóa Tiên Thiên + Tự Hóa + Lai Nhân Cung + Tam Phương Tứ Chính + Tóm tắt Phi Hóa.
  2. **Nam Phái**: Thuần 110+ sao, Tam Phương Tứ Chính, ẩn ký hiệu Bắc Phái, luận giải theo Cách Cục kinh điển.
  3. **Bắc Phái**: 18 sao Tứ Hóa, đóng dấu LAI NHÂN CUNG, Sinh Niên Tứ Hóa (`A/B/C/D`), Tự Hóa Ly Tâm (`↑`) & Hướng Tâm (`↓`), bảng đối chiếu Thập Thiên Can.
  4. **Phi Tinh**: Click cung vẽ 4 đường SVG mũi tên (Phi Lộc `#245B43`, Phi Quyền `#C27803`, Phi Khoa `#234B6E`, Phi Kỵ `#9E2A22` + nét đứt xung chiếu), kèm bảng giải mã thời gian thực.
- **Chất Lượng & Độ Ổn Định**:
  * `npm run build` 0 lỗi TypeScript ở cả `/server` và `/client`.
  * Bộ test Playwright E2E 100% PASS (Desktop + Mobile).
  * Push sạch lên GitHub `origin/main`.

## 2. Các Bước Triển Khai
1. **Engine Backend & Shared Engine (`/server/src/engine/tuvi/` & `/client/src/engine/`)**:
   - Mở rộng `types.ts` với đầy đủ schemas: `TuViSchool`, `Star` (110+ sao, `weight`, `side`, `sinhNienHoa`, `tuHoaLyTam`, `tuHoaHuongTam`), `PhiHoaDetail`, `LaiNhanCung`, `LuuNguyet`.
   - Cập nhật `stars.ts`: Bổ sung toàn bộ Vòng Bác Sĩ (12 sao theo chiều âm dương nam nữ), Phụ tinh Năm/Tháng/Ngày/Giờ, Lưu Niên 15 sao, tính Tự Hóa Ly Tâm & Hướng Tâm, Phi Tinh 4 Hóa theo 10 Thiên Can.
   - Cập nhật `palaces.ts`: Tính Lai Nhân Cung (Can năm sinh = Can cung), Đẩu Quân & 12 Lưu Nguyệt, 12 Đại Vận & Lưu Niên cung.
   - Cập nhật `interpreter.ts`: Luận giải đa trường phái (Cách Cục Nam Phái, Tứ Hóa Bắc Phái, Phi Tinh Tương Tác).
   - Đồng bộ hoàn toàn sang `/client/src/engine/`.
2. **Design Tokens & Thẩm Mỹ Cổ Tịch Trung Hoa**:
   - `client/tailwind.config.js`: Bảng màu Tuyên Chỉ `#F5F0E3`, Sơn Mài `#141210`, Mực Tùng Yên `#1C1915`, Đỏ Chu Sa `#9E2A22`, Cổ Đồng Kim `#9A7B3E`, Thanh Ngọc `#245B43`, Thiên Thanh `#234B6E`.
   - `client/src/index.css`: Vân sợi giấy SVG noise mịn (`opacity: 0.03`), khung song biên (`frame-double`), con dấu ấn triện vuông (`seal-stamp`), họa tiết hồi văn góc (`meander-corner`).
   - Xóa bỏ toàn bộ gradient SaaS, glow, bo góc mập, thay thế 100% emoji bằng SVG icons nét mảnh `1.25px`.
3. **UI Components Chuẩn 3 Tầng & 4 Trường Phái**:
   - `SchoolSwitcher.tsx`: Thanh chọn 4 trường phái dạng thẻ bài mộc bản.
   - `Header.tsx`: Logo Bát Quái nét mảnh, chữ Thư pháp Noto Serif, theme toggle.
   - `ChartForm.tsx`: Khung Song Biên viền Cổ Đồng Kim, góc Hồi Văn, font Noto Serif + Be Vietnam Pro.
   - `ChartGrid.tsx`: Bố cục 3 tầng sắc nét từng ô, Tuần/Triệt chữ nhật đen mực, Thiên Bàn khung song biên có watermark Bát Quái + ấn triện đỏ, vẽ đường SVG Tam Phương Tứ Chính và 4 đường Phi Tinh (Lộc, Quyền, Khoa, Kỵ).
   - `InterpretationTabs.tsx`: Tích hợp 4 chế độ luận giải.
   - `TuViAssistant.tsx`: Trợ lý luận đoán theo trường phái.
   - `ExportModal.tsx`: Canvas 2D vẽ ảnh đúng vân Tuyên Chỉ, khung song biên và bố cục 3 tầng.
4. **Kiểm Thử & Đóng Gói**:
   - Unit tests engine trong `server/tests/`.
   - Playwright E2E trong `e2e/tuvi.spec.ts` (kiểm tra 4 trường phái, bố cục 3 tầng, SVG Phi Tinh, mobile responsive, xuất ảnh).
   - Chạy build và test, tự động sửa lỗi, git commit & push.
