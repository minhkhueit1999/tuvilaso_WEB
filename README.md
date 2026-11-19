# Tử Vi Minh Khuê (`tuvilaso_WEB`)

> **Nền Tảng Lập Lá Số & Luận Đoán Tử Vi Đẩu Số Á Đông Chuẩn Mực**  
> Kiến trúc Monorepo (`/server` + `/client`) tuân thủ nghiêm ngặt chuẩn thẩm mỹ Huyền Học Á Đông (Anti-AI-Slop), độc lập thuật toán Tử Vi, cơ chế Fallback linh hoạt và kiểm thử E2E Playwright 100% Pass.

---

## 1. Kiến Trúc & Công Nghệ

- **Backend (`/server`):**
  - Node.js + Express + TypeScript + Mongoose.
  - Thuật toán Âm - Dương Lịch chuẩn Hồ Ngọc Đức (Timezone +7, xử lý chính xác tháng nhuận).
  - Đầy đủ thuật toán: Can Chi Bát Tự, Ngũ Hành Nạp Âm 60 Hoa Giáp, Âm Dương Thuận/Nghịch lý, Định Cục (Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục), An Mệnh/Thân, An 14 Chính Tinh (Miếu/Vượng/Đắc/Bình/Hãm), Phụ Tinh (Tả Hữu, Xương Khúc, Khôi Việt, Lộc Tồn, Kình Đà, Không Kiếp, Hỏa Linh, Tứ Hóa, Vòng Thái Tuế, Vòng Tràng Sinh, Tuần/Triệt), Đại Hạn, Tiểu Hạn, và Luận giải động.
  - Sẵn sàng deploy lên **Render** (`render.yaml`, endpoint `/api/health`).

- **Frontend (`/client`):**
  - React + Vite + TypeScript + TailwindCSS.
  - Thẩm mỹ Huyền Học Á Đông: Chế độ Sáng (Giấy Dó: `#FBF8F1`, nhấn Đỏ Son `#8B1E1E` & Vàng Kim `#B8860B`) và Chế độ Tối (Huyền Đêm: `#121110`).
  - Ma trận Lá số 4×4 bao quanh Thiên Bàn 2×2, đường nối vector SVG **Tam Phương Tứ Chính** (Tam hợp + Xung chiếu) tương tác trực tiếp khi click vào từng cung.
  - Luận giải 3 Tab: Tổng Quan, Chi Tiết 12 Cung (đồng bộ real-time theo cung chọn), Vận Hạn.
  - Tiện ích: Xuất ảnh lá số PNG chất lượng cao (`html2canvas`), lưu trữ lịch sử lá số.
  - Sẵn sàng deploy lên **Vercel** (`vercel.json`).

- **Cơ Chế Fallback Độc Lập (Zero-Crash Guarantee):**
  - Nếu `MONGODB_URI` hoặc key Cloudinary để trống hoặc không khả dụng, Backend **tự động chuyển sang chế độ lưu tạm In-Memory / File JSON cục bộ** và lưu ảnh local (`server/uploads/`). Server và bộ test luôn chạy thành công 100% mà không đòi hỏi tài nguyên cloud bên ngoài.
  - Khi người dùng điền key thật vào `server/.env`, hệ thống tự động kết nối MongoDB Atlas & Cloudinary.

---

## 2. Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### Bước 1: Cài đặt dependencies
```bash
# Cài đặt root & Playwright
npm install

# Cài đặt server
npm --prefix server install

# Cài đặt client
npm --prefix client install
```

### Bước 2: Cấu hình biến môi trường
File `.env` và `.env.example` đã được tạo sẵn trong cả hai thư mục:
- `server/.env`:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/
  CLOUDINARY_CLOUD_NAME=jfj6evxe
  CLOUDINARY_API_KEY=912496717995524
  CLOUDINARY_API_SECRET=Jddg_oB0QNGPoBrcWO2UR6Jr69I
  ```
  *(Nếu không có MongoDB local hoặc Cloudinary key, server tự kích hoạt Fallback mode an toàn)*.
- `client/.env`:
  ```env
  VITE_API_URL=http://localhost:5000
  ```

### Bước 3: Khởi chạy ứng dụng
```bash
# Terminal 1: Chạy Backend
npm --prefix server run dev
# Server lắng nghe tại http://localhost:5000

# Terminal 2: Chạy Frontend
npm --prefix client run dev
# Client truy cập tại http://localhost:3000
```

---

## 3. Kiểm Thử & Kiểm Tra Chất Lượng (Quality Assurance)

```bash
# 1. Kiểm tra Build toàn dự án (0 lỗi TypeScript)
npm run build

# 2. Chạy Unit/Integration test Backend (12/12 test pass)
npm --prefix server test

# 3. Chạy Playwright E2E toàn diện (Desktop Chrome & Mobile, 10/10 test pass)
npx playwright test
```

---

## 4. Hướng Dẫn Deploy Production

### 4.1. Deploy Backend lên Render
1. Tạo Web Service mới trên [Render](https://render.com), liên kết repo GitHub `https://github.com/minhkhueit1999/tuvilaso_WEB`.
2. Root Directory: `server`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm run start`.
5. Health Check Path: `/api/health`.
6. Environment Variables trên Render Dashboard:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<chuỗi kết nối MongoDB Atlas của bạn>`
   - `CLOUDINARY_CLOUD_NAME`: `<tên cloud Cloudinary>`
   - `CLOUDINARY_API_KEY`: `<api key>`
   - `CLOUDINARY_API_SECRET`: `<api secret>`

### 4.2. Deploy Frontend lên Vercel
1. Import repo trên [Vercel](https://vercel.com).
2. Root Directory chọn: `client`.
3. Framework Preset: `Vite`.
4. Environment Variables:
   - `VITE_API_URL`: `<URL backend Render vừa tạo, ví dụ https://tuvilaso-server.onrender.com>`
5. Bấm **Deploy**. File `client/vercel.json` đã cấu hình sẵn rewrite rules cho API và SPA routing.

---

## 5. Giấy Phép & Bản Quyền

Dự án phát triển bởi **Tử Vi Minh Khuê**. Mọi thuật toán tuân thủ nguyên lý Đẩu Số Toàn Thư.
Bản quyền © 2026.
