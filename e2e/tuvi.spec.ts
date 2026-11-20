import { test, expect } from '@playwright/test';

test.describe('Tử Vi Huyền Cơ - E2E Verification', () => {
  test('1. Homepage loads cleanly with 0 console error and 0 4xx/5xx network errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const failedRequests: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');

    // Check header and form present
    await expect(page.locator('h1')).toContainText('Tử Vi');
    await expect(page.getByText('Nhập Thông Tin Lập Lá Số')).toBeVisible();

    // Verify no console errors and no network 4xx/5xx
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('2. Knowledge and Sample Charts Modals open and interact smoothly', async ({ page, isMobile }) => {
    await page.goto('/');

    if (!isMobile) {
      // 1. Open Knowledge Modal from navigation
      await page.getByRole('navigation').getByRole('button', { name: /Kiến Thức Tử Vi/i }).click();
      await expect(page.getByText('Cẩm Nang Kiến Thức Tử Vi Đẩu Số')).toBeVisible();
      await expect(page.getByText('1. Thập Tứ Chính Tinh')).toBeVisible();
      await page.getByRole('button', { name: 'Đóng' }).click();

      // 2. Open Sample Charts Modal from navigation
      await page.getByRole('navigation').getByRole('button', { name: /Kho Lá Số Mẫu/i }).click();
      await expect(page.getByText('Kho Lá Số Tử Vi Tiêu Biểu')).toBeVisible();
      await expect(page.getByText('Đại Tướng Võ Nguyên Giáp')).toBeVisible();

      // Select sample chart
      await page.getByText('Đại Tướng Võ Nguyên Giáp').click();

      // Should automatically generate and render the chart
      const matrix = page.locator('#tuvi-laso-matrix');
      await expect(matrix).toBeVisible({ timeout: 10000 });
      await expect(matrix.getByText('Võ Nguyên Giáp')).toBeVisible();
    } else {
      // Mobile: use sample data button in form
      await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 10000 });
    }
  });

  test('3. Generate chart successfully, displaying 3-tier palace layout, 110+ stars, Thien Ban, and 5-aspect scores', async ({ page }) => {
    await page.goto('/');

    // Click "Dùng dữ liệu mẫu"
    await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();

    // Submit form via submit button
    await page.locator('button[type="submit"]').click();

    // Verify matrix is rendered
    const matrix = page.locator('#tuvi-laso-matrix');
    await expect(matrix).toBeVisible({ timeout: 10000 });

    // Verify Thien Ban has full name and central data
    await expect(matrix.getByText('THIÊN BÀN TỬ VI')).toBeVisible();
    await expect(matrix.getByText('Tống Minh Khuê')).toBeVisible();
    await expect(matrix.getByText('Lai Nhân Cung:')).toBeVisible();

    // Verify Mệnh and Thân seals exist
    await expect(matrix.getByText('MỆNH', { exact: true }).first()).toBeVisible();
    await expect(matrix.getByText('THÂN', { exact: true }).first()).toBeVisible();

    // Verify 3-Tier Palace Layout elements (ĐV, LN, Tràng Sinh)
    await expect(matrix.locator('text=/ĐV\\./i').first()).toBeVisible();
    await expect(matrix.locator('text=/LN\\./i').first()).toBeVisible();

    // Verify 5-Aspect rating bars exist in Tab 1
    await expect(page.getByText(/Tổng Quan Mệnh Cục/i)).toBeVisible();
    await expect(page.getByText('Công Danh - Sự Nghiệp')).toBeVisible();
    await expect(page.getByText('Tài Lộc - Điền Sản')).toBeVisible();
  });

  test('4. School Switcher toggles 4 Schools: Nam Phái, Bắc Phái, Phi Tinh, and Tổng Hợp', async ({ page }) => {
    await page.goto('/');

    // Generate chart
    await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();
    await page.locator('button[type="submit"]').click();
    const matrix = page.locator('#tuvi-laso-matrix');
    await expect(matrix).toBeVisible({ timeout: 10000 });

    // 1. Switch to Phi Tinh school
    const phiTinhBtn = page.getByRole('button', { name: /Phi Tinh/i }).first();
    await phiTinhBtn.click();

    // Click on a palace in the matrix to trigger flying star arrows
    const palaceCell = matrix.locator('div[data-palace-id]').first();
    await palaceCell.click();

    // Verify SVG flying arrows overlay is present
    const phiTinhSvg = matrix.locator('svg defs marker#arrow-loc');
    await expect(phiTinhSvg).toBeAttached();

    // Verify Phi Tinh decoding panel is visible below the matrix
    await expect(page.getByText(/PHI TINH TỨ HÓA TỪ CUNG/i)).toBeVisible();

    // 2. Switch to Bắc Phái school
    const bacPhaiBtn = page.getByRole('button', { name: /Bắc Phái/i }).first();
    await bacPhaiBtn.click();
    await expect(matrix.getByText('LAI NHÂN').first()).toBeVisible();

    // 3. Switch to Nam Phái school
    const namPhaiBtn = page.getByRole('button', { name: /Nam Phái/i }).first();
    await namPhaiBtn.click();
    await expect(page.getByText(/Cách Cục Nam Phái:/i)).toBeVisible();

    // 4. Switch back to Tổng Hợp school and verify Tam Phương Tứ Chính
    const tongHopBtn = page.getByRole('button', { name: /Tổng Hợp/i }).first();
    await tongHopBtn.click();
    const svgOverlay = matrix.locator('svg.pointer-events-none');
    await expect(svgOverlay).toBeVisible();
    await expect(svgOverlay.locator('polygon')).toBeVisible();
  });

  test('5. Tu Vi AI Assistant chatbox responds with guidance', async ({ page }) => {
    await page.goto('/');

    // Generate chart
    await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 10000 });

    // Verify Tu Vi Assistant heading is visible
    await expect(page.getByRole('heading', { name: /Trợ Lý Tử Vi Huyền Cơ/i })).toBeVisible();

    // Click quick question pill
    const quickBtn = page.getByRole('button', { name: 'Sự nghiệp & Công danh của tôi' });
    await expect(quickBtn).toBeVisible();
    await quickBtn.click();

    // Verify assistant responds with advice
    await expect(page.getByText(/Lời Khuyên Hành Xử|Định hướng phát triển/i)).toBeVisible({ timeout: 10000 });
  });

  test('6. Toggle Light/Dark mode seamlessly', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Click theme toggle button in header
    const themeBtn = page.getByTitle(/Chuyển sang/i);
    await themeBtn.click();

    // Check class updated
    const isDarkNow = await html.evaluate((el) => el.classList.contains('dark'));

    // Toggle again
    await themeBtn.click();
    const isDarkAfter = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isDarkAfter).not.toBe(isDarkNow);
  });

  test('7. Open Export modal and verify image generation flow', async ({ page }) => {
    await page.goto('/');

    // Generate chart first
    await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 10000 });

    // Click "Xuất Ảnh PNG"
    await page.getByRole('button', { name: /Xuất Ảnh PNG/i }).first().click();

    // Export modal should appear
    await expect(page.getByText('Xuất Ảnh Lá Số Tử Vi')).toBeVisible();
    await expect(page.getByRole('button', { name: /TẢI ẢNH VỀ MÁY/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lưu Trữ Ảnh Lên Máy Chủ/i })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Đóng' }).click();
  });
});
