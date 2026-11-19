# Project Rules: Tử Vi Lá Số Web (`tuvilaso_WEB`)

## 1. Kiến trúc & Tech Stack Cố Định

- **Monorepo:**
  - `/client`: React (Vite hoặc Next.js) + TypeScript + TailwindCSS — cấu hình sẵn `vercel.json` cho **Vercel**.
  - `/server`: Node.js + Express + TypeScript + Mongoose — cấu hình sẵn `render.yaml` và endpoint `/api/health` cho **Render**.
- **Database & Storage:** MongoDB Atlas (Mongoose) và Cloudinary (lưu ảnh PNG lá số).
- **Testing:** Playwright E2E (kiểm thử luồng lập lá số, 12 cung, SVG Tam Phương Tứ Chính, responsive).
- **Ràng buộc thư viện:** Không tự ý cài thêm thư viện UI nặng (như MUI, AntD) làm xung đột với TailwindCSS và thiết kế tùy biến.

## 2. Nguyên Tắc Nghiệp Vụ Tử Vi

- **Tách biệt hoàn toàn Logic & Giao diện:** Toàn bộ thuật toán quy đổi Dương/Âm lịch, Can Chi, Ngũ Hành Nạp Âm, Cục, an 14 Chính Tinh (kèm Miếu/Vượng/Đắc/Bình/Hãm), Phụ Tinh, Tứ Hóa và Vòng Thái Tuế/Tràng Sinh phải nằm trong module độc lập (`server/src/engine/tuvi/` hoặc `shared/tuvi/`), có kiểu dữ liệu TypeScript chặt chẽ.
- **Không hardcode kết quả giả:** Mọi lá số và phần luận giải phải được tính toán động từ dữ liệu ngày/giờ/năm sinh đầu vào.

## 3. Luật Giao Diện (Anti-AI-Slop)

- **Cấm tuyệt đối:** Gradient tím/xanh neon kiểu SaaS mặc định, emoji lòe loẹt trong UI chính, bo góc quá lớn, đổ bóng dày.
- **Bắt buộc:** Thẩm mỹ Huyền Học Á Đông sắc nét:
  - **Light Mode (Giấy Dó):** Nền `#FBF8F1`, chữ `#1C1917`, nhấn Đỏ Son `#8B1E1E` và Vàng Kim `#B8860B`, viền mảnh `1px`.
  - **Dark Mode (Huyền Đêm):** Nền `#121110`, chữ `#EAE3D2`, viền vàng đồng mờ.
  - **Typography:** Font Serif (`Noto Serif` / `Playfair Display`) cho tiêu đề, tên cung, tên sao; Sans-serif (`Be Vietnam Pro` / `Inter`) cho văn bản luận giải.
  - **Lá số 4×4:** Hiển thị chuẩn 12 cung bao quanh Thiên Bàn, hỗ trợ đường nối SVG Tam Phương Tứ Chính khi click cung và tối ưu hiển thị trên mobile.

## 4. Bảo Mật, `.env` & Cơ Chế Fallback

- **Tuyệt đối không commit `.env`:** Luôn kiểm tra `.gitignore` đã chặn `.env`, `node_modules`, `dist`, và báo cáo test thừa trước khi `git add`.
- **Đồng bộ `.env.example`:** Mọi biến môi trường mới thêm vào phải được cập nhật ngay vào `server/.env.example` và `client/.env.example`.
- **Chế độ Fallback khi test local:** Nếu `MONGODB_URI` hoặc các key Cloudinary trong `server/.env` đang trống, Backend phải tự động chuyển sang lưu tạm in-memory/JSON cục bộ để server vẫn chạy bình thường và Playwright pass 100% (không crash khi thiếu key).

## 5. Quy Trình Code, Kiểm Thử & Git

- **Đọc trước khi sửa:** Luôn kiểm tra cấu trúc file hiện có để tái sử dụng component/helper, tránh tạo file trùng lặp.
- **Điều kiện hoàn thành (Definition of Done):** Không báo cáo xong nếu chưa chạy thành công:
  1. `npm run build` (0 lỗi TypeScript/Build ở cả `client` và `server`).
  2. `npx playwright test` (100% pass, 0 console error, 0 network 4xx/5xx).
- **Git Discipline:** Chỉ commit và push lên `https://github.com/minhkhueit1999/tuvilaso_WEB` sau khi build và Playwright đã sạch lỗi. Dùng commit message chuẩn Conventional Commits (`feat:`, `fix:`, `chore:`).
