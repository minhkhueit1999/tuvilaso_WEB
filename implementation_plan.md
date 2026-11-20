# Kế Hoạch Hiện Thực Hóa: Tử Vi Minh Khuê — Chuẩn Hóa Đường Đi Vận Hạn (Đại Vận – Lưu Đại Hạn – Tiểu Hạn – Lưu Niên – Lưu Nguyệt)

## 1. Mục Tiêu & Yêu Cầu Kỹ Thuật
1. **Chuẩn hóa 100% công thức toán học đường đi vận hạn:**
   - **Đại Vận (10 năm):** `isDuongYear = (yearCan % 2 === 0)`, `dvDir = ((isDuongYear && gender === 'Nam') || (!isDuongYear && gender === 'Nữ')) ? 1 : -1`. Cung thứ `k+1`: `(menhChi + k * dvDir + 120) % 12`, tuổi `[cucNum + k*10, cucNum + k*10 + 9]`. Xử lý chính xác Đồng Hạn (`age < cucNum`).
   - **12 Cung Đại Vận (`ĐV.MỆNH`..`ĐV.HUYNH`):** Bắt buộc luôn đi THUẬN (+1) từ `dvChi`.
   - **Lưu Đại Hạn (10 năm Ziczac Nam Phái):**
     * Offset 0: `dvChi`
     * Offset 1: `(dvChi + 6) % 12` (xung chiếu)
     * Offset 2: `(dvChi + 6 - dvDir + 12) % 12` (lùi 1 cung ngược chiều ĐV)
     * Offset 3..9: `(dvChi + 6 + (offset - 3) * dvDir + 120) % 12` (tiến theo chiều ĐV, năm thứ 10 quay đúng về `dvChi`).
   - **Tiểu Hạn (1 năm):** Khởi tuổi 1 theo Tam Hợp năm sinh (`Dần-Ngọ-Tuất` -> Thìn, `Thân-Tý-Thìn` -> Tuất, `Tỵ-Dậu-Sửu` -> Mùi, `Hợi-Mão-Mùi` -> Sửu). Hướng đi `thDir = (gender === 'Nam') ? 1 : -1` (không phụ thuộc Âm Dương).
   - **Lưu Niên Thái Tuế (`LN.MỆNH`..`LN.HUYNH`):** Bắt đầu từ `viewChi`, luôn đi THUẬN (+1).
   - **Lưu Nguyệt (Đẩu Quân):** Hỗ trợ 2 chế độ `luuNguyetMethod: 'thai_tue' | 'tieu_han'`.
   - **Tứ Hóa Tầng Vận:** Tứ Hóa Đại Vận (theo Can cung `dvChi`), Tứ Hóa Lưu Niên (theo `viewCan`). Chồng Cung Tam Bàn Hợp Nhất.
2. **Giao Diện Trực Quan Hóa (Interactive Fortune Bar & SVG Path):**
   - Thanh điều hướng vận hạn tương tác: Chọn 12 Đại Vận (kèm ký hiệu Thuận/Nghịch) & 10 năm trong Đại Vận.
   - 4 dấu ấn mảnh trên cung: `ĐV`, `L.ĐH`, `T.HẠN`, `L.TUẾ`.
   - Lớp SVG vẽ đường đi vận ziczac 10 bước mảnh mai, có số thứ tự bước nhảy.
   - Tab Vận Hạn: Cấu trúc Thể (Đại Vận 10 năm) - Dụng (1 năm hiện tại) - Ứng Kỳ (12 tháng Lưu Nguyệt).
3. **Kiểm Thử Toàn Diện:**
   - Unit tests toán học 6 Ca (Dương Nam, Âm Nam, Dương Nữ, Âm Nữ, 10 bước ziczac, Lưu Nguyệt).
   - Playwright E2E 14+ tests Desktop & Mobile pass 100%.

## 2. Kế Hoạch Triển Khai Chi Tiết
- [x] Lập kế hoạch chi tiết (`implementation_plan.md`).
- [ ] Bổ sung types trong `server/src/engine/tuvi/types.ts` & `client/src/types/index.ts`.
- [ ] Triển khai các hàm toán học vận hạn trong `server/src/engine/tuvi/palaces.ts` & `stars.ts`.
- [ ] Tích hợp đường đi vận hạn & Tam Bàn Hợp Nhất vào `server/src/engine/tuvi/index.ts` & `interpreter.ts`.
- [ ] Đồng bộ engine hoàn chỉnh sang `client/src/engine/`.
- [ ] Viết bộ test toán học chuyên sâu `server/tests/tuvi_vanhan.test.ts` (6 Ca kiểm thử bắt buộc) & chạy vitest PASS 100%.
- [ ] Xây dựng component `client/src/components/InteractiveFortuneBar.tsx`.
- [ ] Cập nhật `client/src/components/ChartGrid.tsx` (hiển thị 4 badge `ĐV`, `L.ĐH`, `T.HẠN`, `L.TUẾ` và lớp SVG 10-step ziczac).
- [ ] Cập nhật `client/src/components/InterpretationTabs.tsx` (Tab Vận Hạn Tam Bàn Hợp Nhất & Lưới 12 Lưu Nguyệt).
- [ ] Tích hợp timeline vận hạn vào `client/src/App.tsx`.
- [ ] Nâng cấp E2E Playwright tests trong `e2e/tuvi.spec.ts`.
- [ ] Build toàn bộ (`npm run build`), chạy test Playwright và Unit test đạt 100% PASS.
- [ ] Git commit & push lên GitHub `origin/main`.
