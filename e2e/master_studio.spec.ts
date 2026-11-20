import { test, expect } from '@playwright/test';

test.describe("Master's Studio - Cụm Tính Năng Chuyên Sâu Cho Thầy Tử Vi", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Quick generate default chart
    await page.getByRole('button', { name: /(Dùng dữ liệu mẫu|Điền mẫu nhanh)/i }).click();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 10000 });
  });

  test('1. Master Toolbar is visible above chart with all studio action buttons', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByText("Master's Studio")).toBeVisible();
    await expect(toolbar.getByText(/Chế Độ Ẩn Danh|Ẩn Danh/i)).toBeVisible();
    await expect(toolbar.getByText(/Họa Bút/i)).toBeVisible();
    await expect(toolbar.getByRole('button', { name: /Định Giờ Sinh/i })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: /Phái Luật/i })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: /Hồ Sơ CRM/i })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: /Ấn Triện Riêng/i })).toBeVisible();
  });

  test('2. Privacy Mode masks name and birthdate on Thien Ban', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');
    const matrix = page.locator('#tuvi-laso-matrix');

    // Initially shows full name
    await expect(matrix.getByText('Tống Minh Khuê')).toBeVisible();

    // Click Privacy Mode button
    await toolbar.getByText(/Chế Độ Ẩn Danh/i).click();

    // Verify name is masked
    await expect(matrix.getByText('Đương Số (Ẩn Danh)')).toBeVisible();
    // Verify birth date is masked (select first match since both solar & lunar have year)
    await expect(matrix.getByText(/\*\*\/\*\*\/1999/).first()).toBeVisible();

    // Toggle back off
    await toolbar.getByText(/Ẩn Danh \(Đang Bật\)/i).click();
    await expect(matrix.getByText('Tống Minh Khuê')).toBeVisible();
  });

  test('3. Live Whiteboard Canvas can be toggled and controls displayed', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');

    // Click Họa Bút button
    await toolbar.getByText(/Họa Bút/i).click();

    // Verify canvas overlay and floating toolbar appear
    const canvasOverlay = page.locator('canvas.cursor-crosshair');
    await expect(canvasOverlay).toBeVisible();
    await expect(page.getByText('Khoanh')).toBeVisible();
    await expect(page.getByText('Mũi Tên')).toBeVisible();

    // Close Whiteboard
    await page.getByRole('button', { name: 'Đóng' }).click();
    await expect(canvasOverlay).not.toBeVisible();
  });

  test('4. Custom Ruleset Drawer opens and allows selecting classical presets', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');

    // Open Ruleset Drawer
    await toolbar.getByRole('button', { name: /Phái Luật/i }).click();

    // Verify drawer appears
    await expect(page.getByText('Cài Đặt Phái Luật Riêng')).toBeVisible();
    await expect(page.getByText('Tử Vi Toàn Thư (Cổ Bản)')).toBeVisible();

    // Click preset Toàn Thư
    await page.getByText('Tử Vi Toàn Thư (Cổ Bản)').click();

    // Apply ruleset
    await page.getByRole('button', { name: /Áp Dụng Phái Luật/i }).click();

    // Drawer should close
    await expect(page.getByText('Cài Đặt Phái Luật Riêng')).not.toBeVisible();
  });

  test('5. Smart Birth Hour Rectification screen opens, calculates scores and selects chart', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');

    // Click Định Giờ Sinh
    await toolbar.getByRole('button', { name: /Định Giờ Sinh/i }).click();

    // Verify Rectification view loads
    await expect(page.getByText('Định Giờ Sinh Thông Minh')).toBeVisible();
    await expect(page.getByText(/Khảo Sát Thực Chứng 8 Tiêu Chí/i)).toBeVisible();

    // Check candidate cards exist
    await expect(page.getByText(/● Giờ Nghi Vấn/i)).toBeVisible();
    await expect(page.getByText(/○ Giờ Giáp Ranh/i).first()).toBeVisible();

    // Click an option in the questionnaire
    const option = page.locator('label').filter({ hasText: 'Thanh nhã, dong dỏng cao' }).first();
    if (await option.isVisible()) {
      await option.click();
    }

    // Click "Chốt giờ này & Mở lá số"
    await page.getByRole('button', { name: /CHỐT GIỜ NÀY & MỞ LÁ SỐ/i }).first().click();

    // Verify redirected back to main chart
    await expect(page.locator('#tuvi-laso-matrix')).toBeVisible({ timeout: 10000 });
  });

  test('6. CRM Drawer opens, shows client profiles and tags', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');

    // Open CRM Drawer
    await toolbar.getByRole('button', { name: /Hồ Sơ CRM/i }).click();

    // Verify CRM drawer header
    await expect(page.getByText(/Hồ Sơ Khách Hàng/i).first()).toBeVisible();
    await expect(page.locator('aside[aria-label="Sổ Khách Hàng CRM"]').getByRole('button', { name: 'Tất cả', exact: true })).toBeVisible();

    // Close CRM Drawer
    await page.locator('button[aria-label="Đóng CRM"]').click();
    await expect(page.getByText(/Hồ Sơ Khách Hàng & Nhật Ký/i)).not.toBeVisible();
  });

  test('7. White-Label Modal opens, saves master brand and renders seal on Thien Ban', async ({ page }) => {
    const toolbar = page.locator('aside[aria-label="Thanh công cụ Thầy Tử Vi"]');

    // Open White-Label Modal
    await toolbar.getByRole('button', { name: /Ấn Triện Riêng/i }).click();

    // Verify modal appears
    await expect(page.getByText('Cài Đặt Thương Hiệu & Ấn Triện Riêng Của Thầy')).toBeVisible();

    // Submit form to save
    await page.getByRole('button', { name: /Lưu & Áp Dụng/i }).click();

    // Modal should close
    await expect(page.getByText('Cài Đặt Thương Hiệu & Ấn Triện Riêng Của Thầy')).not.toBeVisible();

    // Verify Cinnabar Seal SVG is rendered on Thien Ban
    const matrix = page.locator('#tuvi-laso-matrix');
    await expect(matrix.locator('svg[viewBox="0 0 100 100"]').first()).toBeVisible();
  });
});
