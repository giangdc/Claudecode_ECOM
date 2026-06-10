import { test, expect, Page } from '@playwright/test';
import { CameraProductDetailPage } from '../../pages/camera/camera-product-detail.page';
import { DeviceCheckoutPage } from '../../pages/common/device-checkout.page';
import { DeviceOrderCompletePage } from '../../pages/common/device-order-complete.page';
import { checkoutData, productUrl, registerUrl } from '../../../test-data/checkout/checkout.data';

/**
 * Automation cho module CHECKOUT — luồng Camera (camera-play-4).
 * Nguồn TC: 03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.2.xlsx (sheet Checkout_Camera).
 * Data: 04_test-data/Checkout_datatest.xlsx — Camera: Gói lưu trữ {3D FPT Camera Only, 7D Only} × Chu kỳ {6,12 tháng}.
 * Giá combo (trang SP, đã gồm device + gói lưu trữ, KHÔNG gồm phí lắp đặt):
 *   3D + 6 tháng = 640.000đ | 3D + 12 tháng = 880.000đ | 7D + 6 tháng = 760.000đ | 7D + 12 tháng = 1.020.000đ
 * Camera KHÁC AP/SmartTV: trang SP có chọn Gói lưu trữ + Chu kỳ + Số lượng trước Mua ngay (2 bước).
 * Màn checkout dùng chung DeviceCheckoutPage / DeviceOrderCompletePage (form + PTTT + hoàn tất giống AP/TV).
 * Tên test theo TC ID (TC_CAMERA.N) để sync-tc-results map đúng sheet Checkout_Camera.
 */

// Product params — đọc từ nguồn sự thật duy nhất test-data/checkout/checkout.data.ts (services.camera).
const CAMERA        = checkoutData.services.camera;
const PRODUCT_URL   = productUrl(CAMERA.slug);
const REGISTER_URL  = registerUrl(CAMERA.slug);
const PRODUCT_NAME  = CAMERA.productName;

// Combo mặc định khi vào trang: 3D FPT Camera Only + 6 tháng → 640.000đ, tổng cần thanh toán 805.000đ (+165.000đ phí lắp đặt).
const DEFAULT_PACKAGE = CAMERA.defaultPackage;
const DEFAULT_CYCLE   = CAMERA.defaultCycle;
const COMBO_PRICE     = CAMERA.comboPrice;
const TOTAL_PRICE     = CAMERA.totalPrice;

const VALID_NAME  = checkoutData.validName;
const VALID_PHONE = checkoutData.validPhone;

/** Vào trang SP → chọn gói/chu kỳ/số lượng → Mua ngay → trả về DeviceCheckoutPage ở màn /payment. */
async function openCheckoutViaProduct(
  page: Page,
  opts: { pkg?: '3D FPT Camera Only' | '7D Only'; cycle?: '6 tháng' | '12 tháng'; qty?: number } = {},
): Promise<DeviceCheckoutPage> {
  const product = new CameraProductDetailPage(page);
  await product.navigateToProduct(PRODUCT_URL);
  await product.selectStoragePackage(opts.pkg ?? DEFAULT_PACKAGE);
  await product.selectCycle(opts.cycle ?? DEFAULT_CYCLE);
  if (opts.qty && opts.qty > 1) await product.setQuantity(opts.qty);
  await product.clickMuaNgay();
  const checkout = new DeviceCheckoutPage(page);
  await page.waitForURL(/\/payment/, { timeout: 25000 });
  await checkout.dismissCookieBanner();
  await page.waitForSelector('input[name="full_name"]', { state: 'visible', timeout: 15000 });
  return checkout;
}

/** Vào thẳng register URL (mặc định 3D + 6 tháng) — nhanh hơn, dùng cho test không cần đổi gói/chu kỳ. */
async function openCheckoutViaRegister(page: Page): Promise<DeviceCheckoutPage> {
  const checkout = new DeviceCheckoutPage(page);
  await checkout.start(REGISTER_URL);
  return checkout;
}

// ════════════════════════ TC_CAMERA — Điều hướng từ trang chi tiết gói ════════════════════════
test.describe('TC_CAMERA — Điều hướng từ trang sản phẩm', () => {

  test('TC_CAMERA.2 — Kiểm tra chọn chu kỳ + số lượng rồi Mua ngay điều hướng sang Checkout', async ({ page }) => {
    const product = new CameraProductDetailPage(page);
    await product.navigateToProduct(PRODUCT_URL);
    await product.selectStoragePackage(DEFAULT_PACKAGE);
    await product.selectCycle(DEFAULT_CYCLE);
    await product.clickMuaNgay();
    await expect(page).toHaveURL(/staging\.fpt\.vn\/checkout/, { timeout: 25000 });
  });

  test('TC_CAMERA.3 — Kiểm tra đổi số lượng thì số tiền cập nhật đúng trên checkout', async ({ page }) => {
    await openCheckoutViaProduct(page, { qty: 2 });
    // Số lượng phản ánh trên block sản phẩm và phần itemized
    await expect(page.getByText(/^x2$/).first()).toBeVisible();
    await expect(page.getByText('FPTCameraPlay4 - 2 cái', { exact: false })).toBeVisible();
    // Giá device cập nhật đúng theo số lượng (400.000đ × 2 = 800.000đ)
    await expect(page.getByText('800.000đ', { exact: false }).first()).toBeVisible();
  });

});

// ════════════════════════ TC_CAMERA — Block Sản phẩm dịch vụ ════════════════════════
test.describe('TC_CAMERA — Block Sản phẩm & Thông tin thanh toán', () => {

  test('TC_CAMERA.4 — Kiểm tra Block Sản phẩm dịch vụ đã chọn load đúng thông tin Camera', async ({ page }) => {
    await openCheckoutViaProduct(page);
    await expect(page.getByText(PRODUCT_NAME, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(DEFAULT_PACKAGE, { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Chu kỳ: 6 tháng', { exact: false })).toBeVisible();
    await expect(page.getByText(COMBO_PRICE, { exact: false }).first()).toBeVisible();
  });

  test('TC_CAMERA.5 — Kiểm tra Block Thông tin thanh toán itemized + Cần thanh toán', async ({ page }) => {
    await openCheckoutViaProduct(page);
    await expect(page.getByText('FPTCameraPlay4', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Phí triển khai/lắp đặt Camera', { exact: false })).toBeVisible();
    await expect(page.getByText('3D FPT Camera Only - 6 tháng', { exact: false })).toBeVisible();
    await expect(page.getByText('Cần thanh toán', { exact: false }).first()).toBeVisible();
    await expect(page.getByText(TOTAL_PRICE, { exact: false }).first()).toBeVisible();
  });

});

// ════════════════════════ TC_CAMERA — PTTT ════════════════════════
test.describe('TC_CAMERA — Block Phương thức thanh toán', () => {

  test('TC_CAMERA.6 — Kiểm tra Camera CÓ phương thức COD + online theo QLCS', async ({ page }) => {
    const checkout = await openCheckoutViaRegister(page);
    await checkout.clickXemThem();
    const ids = await checkout.getAllPaymentMethodIds();
    expect(ids).toContain('payment-method-COD-COD');
    // Có ít nhất 1 phương thức Online (không phải COD)
    expect(ids.some(id => id !== 'payment-method-COD-COD')).toBeTruthy();
  });

});

// ════════════════════════ TC_CAMERA — Luồng thanh toán ════════════════════════
test.describe('TC_CAMERA — Luồng thanh toán', () => {

  test.skip('TC_CAMERA.8 — Kiểm tra Thanh toán khi chính sách không còn active trên QLCS', async () => {
    // Cần dữ liệu staging với gói Camera có policy đã deactivate trên QLCS.
    // Không thể tự động hóa mà không có test data đặc biệt từ backend → thực hiện manual.
  });

  test('TC_CAMERA.9 — Kiểm tra Thanh toán khi data hợp lệ + chính sách active → rời /payment', async ({ page }) => {
    const checkout = await openCheckoutViaRegister(page);
    await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
    await checkout.selectPaymentMethod('COD-COD');
    await checkout.clickThanhToan();
    await expect(page).not.toHaveURL(/\/payment$/, { timeout: 20000 });
  });

  test('TC_CAMERA.10 — Kiểm tra hoàn tất đơn hàng với PTTT = COD', async ({ page }, testInfo) => {
    const checkout = await openCheckoutViaRegister(page);
    await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
    await checkout.selectPaymentMethod('COD-COD');
    await checkout.clickThanhToan();
    await expect(page).toHaveURL(/\/completed/, { timeout: 20000 });
    const complete = new DeviceOrderCompletePage(page);
    await expect(complete.successMessage).toBeVisible();
    await expect(complete.codStatus).toBeVisible();
    await expect(complete.orderIdText).toBeVisible();
    const orderId = await complete.getOrderId();
    expect(orderId).toBeTruthy();
    testInfo.annotations.push({ type: 'orderId', description: orderId });
  });

});

// ════════════════════════ TC_CAMERA — Navigation ════════════════════════
test.describe('TC_CAMERA — Navigation', () => {

  test('TC_CAMERA.15 — Kiểm tra button Quay lại điều hướng về màn Chi tiết gói', async ({ page }) => {
    const checkout = await openCheckoutViaRegister(page);
    await expect(checkout.quayLaiLink).toBeVisible();
    const href = await checkout.quayLaiLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn/);
    await page.goto(href!);
    await expect(page).toHaveURL(/tongdaiwifi\.vn/, { timeout: 15000 });
  });

});
