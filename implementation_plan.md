# Implementation Plan: Web Lập Lá Số & Luận Đoán Tử Vi Minh Khuê

> **Architecture & Execution:** Full-stack Monorepo (`/server` + `/client`) adhering to `GEMINI.md` anti-AI-slop Oriental Metaphysics aesthetics, strict engine separation, auto-fallback for DB/Storage, and 100% Playwright E2E test verification.

**Goal:** Build, test, package, and push a complete, production-ready Tu Vi astrology web platform ("Tử Vi Minh Khuê") matching tuvi.vn standards with 4x4 chart, SVG Tam Phương Tứ Chính, dynamic interpretation, dark/light modes, image export, and zero external dependency failure mode.

**Tech Stack:**
- **Server:** Node.js, Express, TypeScript, Mongoose, Cloudinary, Multer, Lunar calendar algorithms.
- **Client:** React (Vite), TypeScript, TailwindCSS, Lucide-react, html2canvas / dom-to-image.
- **Testing:** Playwright E2E, Vitest / Node test runner.
- **Deployment:** Render (`render.yaml`) & Vercel (`vercel.json`).

---

## Phase 1: Repository Setup, Git Configuration & Security
- [ ] Initialize git repository inside `tuvilaso_WEB` and configure remote origin `https://github.com/minhkhueit1999/tuvilaso_WEB`.
- [ ] Create root `.gitignore`, `server/.gitignore`, and `client/.gitignore` strictly ignoring `.env`, `*.env`, `node_modules/`, `dist/`, `uploads/`, `playwright-report/`, `test-results/`.
- [ ] Create `server/.env` with exact sample variables:
  - `PORT=5000`
  - `MONGODB_URI=mongodb://localhost:27017/`
  - `CLOUDINARY_CLOUD_NAME=jfj6evxe`
  - `CLOUDINARY_API_KEY=912496717995524`
  - `CLOUDINARY_API_SECRET=Jddg_oB0QNGPoBrcWO2UR6Jr69I`
- [ ] Create `server/.env.example`, `client/.env`, and `client/.env.example`.
- [ ] Verify `git status` confirms `.env` files are completely ignored.

## Phase 2: Server Architecture & Tử Vi Engine (`/server`)
- [ ] Initialize `server` with `package.json`, `tsconfig.json`, `render.yaml`.
- [ ] Build Fallback Database module (`server/src/config/db.ts` & `server/src/storage/memoryStore.ts`):
  - In-memory / JSON store fallback when `MONGODB_URI` is blank or unreachable.
- [ ] Build Storage Service module (`server/src/services/storageService.ts`):
  - Fallback to local `server/uploads/` directory when Cloudinary credentials are mock or missing.
- [ ] Build Tu Vi Engine (`server/src/engine/tuvi/`):
  - `lunar.ts`: Solar to Lunar conversion, leap month handling, Can Chi calculations (Year, Month, Day, Hour).
  - `elements.ts`: Ngũ Hành Nạp Âm (Lục Thập Hoa Giáp), Âm Dương Nam/Nữ, Cục định danh (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục).
  - `palaces.ts`: An Mệnh, Thân, và 12 Cung (Mệnh, Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Phu Thê, Huynh Đệ) thuận/nghịch theo Âm Dương Nam Nữ.
  - `stars.ts`:
    * 14 Chính Tinh: Tử Vi, Liêm Trinh, Thiên Đồng, Vũ Khúc, Thái Dương, Thiên Cơ, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân.
    * Đắc/Hãm/Miếu/Vượng/Bình cho từng chính tinh trên 12 địa chi.
    * Phụ tinh: Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt, Lộc Tồn, Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh, Vòng Thái Tuế (12 sao), Vòng Tràng Sinh (12 sao), Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ), Tuần Không & Triệt Không.
  - `interpreter.ts`: Dynamic generator for General Overview (Mệnh, Thân, Cục, Ngũ hành), 12 Cung analysis, and Decade/Yearly luck fortune.
- [ ] Build REST API routes:
  - `POST /api/laso/generate`: Validate input, run engine, store chart (Mongo or memoryStore), return full chart payload.
  - `GET /api/laso/history`: Return recent charts from store.
  - `POST /api/laso/upload-image`: Receive image buffer/base64, upload to Cloudinary or fallback locally.
  - `GET /api/health`: Healthcheck endpoint for Render returning status and adapter modes.
- [ ] Unit test Tu Vi Engine and API endpoints.

## Phase 3: Frontend Development (`/client`)
- [ ] Initialize `client` with Vite, React, TypeScript, TailwindCSS.
- [ ] Configure Oriental Metaphysics Design System (`tailwind.config.js`, `index.css`):
  - Light mode (Giấy Dó): `#FBF8F1`, text `#1C1917`, accents `#8B1E1E` (Đỏ Son) and `#B8860B` (Vàng Kim), 1px border `#E5DFD3`.
  - Dark mode (Huyền Đêm): `#121110`, text `#EAE3D2`, accents `#D4A373` and `#991B1B`.
  - Typography: Serif font (`Playfair Display` / `Noto Serif`) for titles & palaces, Sans-serif (`Inter` / `Be Vietnam Pro`) for interpretation body.
- [ ] Components:
  - `Header`: Title "Tử Vi Minh Khuê", Dark/Light toggle, quick navigation.
  - `ChartForm`: Lunar/Solar toggle, leap month support, name, gender, birth date/time picker (12 Canh Giờ Tý-Hợi), viewing year, "Điền mẫu nhanh" button.
  - `ChartGrid` (4x4 Matrix):
    * 12 outer boxes for 12 Palaces (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi).
    * Center 2x2 for Thiên Bàn (Họ tên, ngày giờ sinh âm/dương, Mệnh, Cục, Thân cư, Bản Mệnh...).
    * Each palace shows Palace Name, Major stars with Brightness (M/V/Đ/B/H) and Ngũ hành colors, Minor stars (good stars green/blue, bad stars red/purple), Dai Han, Tieu Han, Tuan/Triet badges.
    * Interactive selection: Clicking any palace activates SVG lines for **Tam Phương Tứ Chính** (Chính chiếu, Tam hợp 1, Tam hợp 2) linking center coordinates.
  - `InterpretationView`: 3 Tabs (Tổng Quan, Chi Tiết Cung Đang Chọn, Vận Hạn) synced with the selected palace.
  - `ExportPanel`: PNG export utility (clean canvas rendering) and chart history drawer.
  - `vercel.json` routing configuration.

## Phase 4: Playwright E2E Testing & Zero-Error Verification
- [ ] Setup Playwright in project (`playwright.config.ts`, tests in `/e2e` or `/client/e2e`).
- [ ] Write comprehensive E2E test specs:
  - Homepage clean render (no console errors, no 4xx/5xx).
  - Quick sample fill and form submission.
  - Chart display verification (12 palaces + Thien Ban present and populated).
  - Palace click & SVG Tam Phương Tứ Chính rendering verification.
  - Tab navigation and interpretation synchronization.
  - Dark/Light theme switching.
  - Responsive tests on Desktop (`1440x900`) and Mobile (`390x844`).
- [ ] Execute `npm run build` on both `/server` and `/client`.
- [ ] Run Playwright tests and fix any issues until 100% pass.

## Phase 5: Code Review, Documentation & Git Push
- [ ] Review codebase with `@requesting-code-review` guidelines.
- [ ] Verify `.env` is uncommitted and `.gitignore` is intact.
- [ ] Write `README.md` with instructions for Render and Vercel deployments.
- [ ] Commit all work with conventional commit message:
  `feat: complete Tu Vi astrology full-stack web app with Playwright E2E verified`
- [ ] Push to `https://github.com/minhkhueit1999/tuvilaso_WEB` on branch `main`.
