import { test, expect } from '@playwright/test';

test.describe('Tử Vi Minh Khuê - E2E Verification', () => {
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
    await expect(page.locator('h1')).toContainText('Tử Vi Minh Khuê');
    await expect(page.getByText('Nhập Thông Tin Lập Lá Số')).toBeVisible();

    // Verify no console errors and no network 4xx/5xx
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('2. Generate chart successfully, displaying 12 palaces, Thien Ban, and interpretation', async ({ page }) => {
    await page.goto('/');

    // Click "Điền mẫu nhanh"
    await page.getByRole('button', { name: /Điền mẫu nhanh/i }).click();

    // Submit form
    await page.getByRole('button', { name: /LẬP LÁ SỐ & LUẬN ĐOÁN/i }).click();

    // Verify matrix is rendered
    const matrix = page.locator('#tuvi-laso-matrix');
    await expect(matrix).toBeVisible({ timeout: 10000 });

    // Verify Thien Ban has full name
    await expect(matrix.getByText('THIÊN BÀN TỬ VI')).toBeVisible();
    await expect(matrix.getByText('Tống Minh Khuê')).toBeVisible();

    // Verify Mệnh and Thân badges exist
    await expect(matrix.getByText('MỆNH', { exact: true })).toBeVisible();
    await expect(matrix.getByText('THÂN', { exact: true })).toBeVisible();

    // Verify Interpretation Tabs are present
    await expect(page.getByText('Tổng Quan Bản Mệnh')).toBeVisible();
    await expect(page.getByText('Luận Vận Hạn')).toBeVisible();
  });

  test('3. Clicking a palace renders SVG Tam Phương Tứ Chính and synchronizes interpretation', async ({ page }) => {
    await page.goto('/');

    // Generate chart
    await page.getByRole('button', { name: /Điền mẫu nhanh/i }).click();
    await page.getByRole('button', { name: /LẬP LÁ SỐ & LUẬN ĐOÁN/i }).click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible();

    // Verify initial SVG overlay exists
    const svgLayer = page.locator('#tuvi-laso-matrix svg');
    await expect(svgLayer).toBeVisible();
    await expect(svgLayer.locator('polygon')).toBeVisible();
    await expect(svgLayer.locator('line')).toBeVisible();

    // Click on another palace in the matrix, e.g. "Phúc Đức"
    const phucDucPalace = page.locator('#tuvi-laso-matrix').getByText('Phúc Đức', { exact: true }).first();
    await phucDucPalace.click();

    // Switch to tab "Chi Tiết 12 Cung"
    await page.getByRole('button', { name: /Chi Tiết 12 Cung/i }).click();
    await expect(page.getByText(/Cung Phúc Đức tại/i)).toBeVisible();
  });

  test('4. Toggle Light/Dark mode seamlessly', async ({ page }) => {
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

  test('5. Open Export modal and verify image generation flow', async ({ page }) => {
    await page.goto('/');

    // Generate chart first
    await page.getByRole('button', { name: /Điền mẫu nhanh/i }).click();
    await page.getByRole('button', { name: /LẬP LÁ SỐ & LUẬN ĐOÁN/i }).click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible();

    // Click "Xuất Ảnh PNG"
    await page.getByRole('button', { name: /Xuất Ảnh PNG/i }).click();

    // Export modal should appear
    await expect(page.getByText('Xuất Ảnh Lá Số Tử Vi')).toBeVisible();
    await expect(page.getByRole('button', { name: /TẢI ẢNH VỀ MÁY/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lưu Trữ Ảnh Lên Máy Chủ/i })).toBeVisible();

    // Close modal
    await page.locator('div[role="dialog"], div.fixed button').filter({ hasText: '' }).first().click();
  });
});
