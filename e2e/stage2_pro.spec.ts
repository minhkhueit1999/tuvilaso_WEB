import { test, expect } from '@playwright/test';

test.describe('Giai Đoạn 2: Cụm Tính Năng Học Thuật Độc Lạ & B2C Viral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const submitBtn = page.locator('#form-section button[type="submit"]');
    await submitBtn.waitFor({ state: 'visible', timeout: 15000 });
    await submitBtn.click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 15000 });
  });

  test('1. Radar 60+ Cách Cục & Cảnh Báo Trùng Phùng is displayed with interactive palace highlighting', async ({ page }) => {
    // Verify Radar panel is visible
    await expect(page.getByText('Radar Quét 60+ Cách Cục & Cảnh Báo Trùng Phùng')).toBeVisible();

    // Check filter pills
    const allBtn = page.getByRole('button', { name: /Tất Cả/i });
    await expect(allBtn).toBeVisible();

    // Find first formation card and click it to highlight palaces
    const firstFormation = page.locator('div:has-text("Nhấn để soi cung →")').first();
    if (await firstFormation.isVisible()) {
      await firstFormation.click();
      // Palace ring/highlight should become active
      await expect(page.locator('#tuvi-laso-matrix [data-palace-id]').first()).toBeVisible();
    }
  });

  test('2. Cung Nhị Hợp (Ám Hợp) toggle draws dashed connection line', async ({ page }) => {
    const nhiHopBtn = page.getByRole('button', { name: /Nhị Hợp \(Ám Hợp\)/i });
    await expect(nhiHopBtn).toBeVisible();

    // Click to toggle Nhị Hợp on
    await nhiHopBtn.click();

    // In SVG, verify line is attached to DOM
    await expect(page.locator('#tuvi-laso-matrix svg line[stroke="#245B43"]')).toHaveCount(1);

    // Toggle off
    await nhiHopBtn.click();
  });

  test('3. Interpretation Tabs: Bát Tự Phụ Trợ displays 4 pillars and 5-element bars', async ({ page }) => {
    const baziTabBtn = page.getByRole('button', { name: /Bát Tự Phụ Trợ/i });
    await expect(baziTabBtn).toBeVisible();
    await baziTabBtn.click();

    // Verify 4 Pillars Table
    await expect(page.getByText('Phụ Trợ Tứ Trụ Bát Tự (Bát Tự Tiểu Bàn)')).toBeVisible();
    await expect(page.getByText('Trụ Năm')).toBeVisible();
    await expect(page.getByText('Trụ Ngày (Nhật Chủ)')).toBeVisible();

    // Verify 5 Elements distribution
    await expect(page.getByText('Phân Bổ Ngũ Hành Bát Tự (Tổng 100%):')).toBeVisible();
    await expect(page.getByText(/Đánh Giá Nhật Chủ/i)).toBeVisible();
    await expect(page.getByText(/Hỷ Thần & Dụng Thần/i)).toBeVisible();
  });

  test('4. Interpretation Tabs: Biểu Đồ Life K-Line Cuộc Đời renders candlestick SVG', async ({ page }) => {
    const klineTabBtn = page.getByRole('button', { name: /Biểu Đồ K-Line/i });
    await expect(klineTabBtn).toBeVisible();
    await klineTabBtn.click();

    // Verify K-Line heading
    await expect(page.getByText(/Biểu Đồ Life K-Line Năng Lượng Cuộc Đời/i)).toBeVisible();

    // Verify SVG chart exists with candles attached
    await expect(page.locator('text=15t').first()).toBeAttached();

    // Verify trend curve toggle buttons
    await expect(page.getByRole('button', { name: 'Tổng Vận', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tài Lộc', exact: true })).toBeVisible();
  });

  test('5. Interpretation Tabs: Lịch Vận Hạn Cá Nhân Hóa (12 Tháng Lưu Nguyệt)', async ({ page }) => {
    const calendarTabBtn = page.getByRole('button', { name: /Lịch Vận Hạn/i });
    await expect(calendarTabBtn).toBeVisible();
    await calendarTabBtn.click();

    // Verify heading
    await expect(page.getByText(/Lịch Vận Hạn Cá Nhân Hóa/i)).toBeVisible();

    // Verify 12 month buttons
    await expect(page.getByRole('button', { name: /Tháng 1/i }).first()).toBeVisible();

    // Verify 30-day grid
    await expect(page.getByText('Ngày Lưu Hạn')).toBeVisible();
    await expect(page.getByText('Chi Tiết Lưu Nhật: Ngày 1 Tháng 1')).toBeVisible();
    await expect(page.getByText(/Việc Nên Làm/i)).toBeVisible();
    await expect(page.getByText(/Việc Nên Tránh/i)).toBeVisible();
  });

  test('6. Hợp Bàn Chồng Lá Số: 2-way Phi Tinh, Branch Harmony & 4-Axis Scores', async ({ page, isMobile }) => {
    // If mobile, open mobile menu first
    if (isMobile) {
      await page.locator('button[aria-label="Menu"]').click();
    }

    // Click "Hợp Bàn"
    await page.getByRole('button', { name: /Hợp Bàn/i }).first().click();

    // Verify Hợp Bàn view is active
    await expect(page.getByText('Hợp Bàn Chồng Lá Số — Phi Tinh Tương Tác')).toBeVisible();

    // Run Synastry
    await page.getByRole('button', { name: /TIẾN HÀNH HỢP BÀN PHI TINH/i }).click();

    // Verify results
    await expect(page.getByText('Điểm hòa hợp', { exact: true })).toBeVisible({ timeout: 12000 });
    await expect(page.getByText('Địa Chi Năm Sinh:')).toBeVisible();
    await expect(page.getByText('A → B')).toBeVisible();
    await expect(page.getByText('B → A')).toBeVisible();
    await expect(page.getByText('Điểm Cộng Tương Hỗ (Cát Khí)')).toBeVisible();
    await expect(page.getByText('Phương Pháp Hóa Giải & Lời Khuyên Của Thầy')).toBeVisible();

    // Back to main
    await page.getByRole('button', { name: /Quay lại Lá Số Cá Nhân/i }).click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible();
  });

  test('7. Xuất "Thiên Thư Mệnh Lý" PDF Cổ Tịch Modal', async ({ page, isMobile }) => {
    // If mobile, open mobile menu first
    if (isMobile) {
      await page.locator('button[aria-label="Menu"]').click();
    }

    // Click "Thiên Thư PDF"
    await page.getByRole('button', { name: /Thiên Thư PDF/i }).first().click();

    // Verify Book Export Modal opens
    await expect(page.getByText(/Xuất "Thiên Thư Mệnh Lý"/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'THIÊN THƯ MỆNH LÝ', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /IN \/ LƯU PDF/i })).toBeVisible();

    // Click edit foreword
    await page.getByRole('button', { name: /Sửa Lời Tựa/i }).click();
    await expect(page.locator('textarea').first()).toBeVisible();

    // Close modal
    await page.locator('button:has(svg.lucide-x)').first().click();
  });
});
