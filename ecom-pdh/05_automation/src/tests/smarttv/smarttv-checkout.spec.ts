import { test, expect, Page } from '@playwright/test';
import { DeviceProductDetailPage } from '../../pages/common/device-product-detail.page';
import { DeviceCheckoutPage } from '../../pages/common/device-checkout.page';
import { DeviceOrderCompletePage } from '../../pages/common/device-order-complete.page';
import { checkoutData } from '../../../test-data/checkout/checkout.data';

/**
 * Automation cho module CHECKOUT — luồng Smart TV.
 * Nguồn TC: 03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.1.xlsx (sheet Checkout_SmartTV).
 * Tên test theo TC ID (TC_SMARTTV.N) để sync-tc-results map được vào sheet Checkout_SmartTV.
 * Smart TV có rule GIỐNG HỆT AP (1 bước /payment, số lượng không chu kỳ, COD + địa chỉ lắp đặt,
 * label giao hàng 3-7 ngày, KHÔNG có "Thời gian lắp đặt"), chỉ khác label SP/giá → dùng chung Device* page object.
 */

// Product params — mặc định gói TV Samsung QA55Q60BAKXXV; override qua env để chạy gói Smart TV khác.
const SLUG          = process.env.SMARTTV_PRODUCT_SLUG  || 'tv-samsung-qa55q60bakxxv';
const PRODUCT_URL   = process.env.SMARTTV_PRODUCT_URL   || `https://staging.tongdaiwifi.vn/thiet-bi-thong-minh/${SLUG}`;
const REGISTER_URL  = process.env.SMARTTV_REGISTER_URL  || `https://staging.fpt.vn/checkout/register/${SLUG}?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn`;
const PRODUCT_NAME  = process.env.SMARTTV_PRODUCT_NAME  || 'Smart TV -TV SAMSUNG QA55Q60BAKXXV';
const PRODUCT_PRICE = process.env.SMARTTV_PRODUCT_PRICE || '4.500.000đ';
const VALID_NAME    = checkoutData.validName;
const VALID_PHONE   = checkoutData.validPhone;

async function openPayment(page: Page): Promise<DeviceCheckoutPage> {
  const checkout = new DeviceCheckoutPage(page);
  await checkout.start(REGISTER_URL);
  return checkout;
}

async function fillAndSubmitCOD(page: Page): Promise<void> {
  const checkout = await openPayment(page);
  await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
  await checkout.selectPaymentMethod('COD-COD');
  await checkout.clickThanhToan();
}

// ════════════════════════ TC_SMARTTV — Điều hướng ════════════════════════
test.describe('TC_SMARTTV — Điều hướng từ trang sản phẩm', () => {

  test('TC_SMARTTV.2 — Kiểm tra nút Mua ngay điều hướng vào luồng checkout Smart TV', async ({ page }) => {
    const product = new DeviceProductDetailPage(page);
    await product.navigateToProduct(PRODUCT_URL);
    await product.clickMuaNgay();
    await expect(page).toHaveURL(/staging\.fpt\.vn\/checkout/, { timeout: 20000 });
  });

});

// ════════════════════════ TC_SMARTTV — Thông tin sản phẩm ════════════════════════
test.describe('TC_SMARTTV — Thông tin sản phẩm trong màn Checkout', () => {

  test('TC_SMARTTV.3 — Kiểm tra block sản phẩm hiển thị đúng và không có Chu kỳ', async ({ page }) => {
    const checkout = await openPayment(page);
    await expect(page.getByText(PRODUCT_NAME, { exact: false })).toBeVisible();
    await expect(page.getByText(/^x\d+$/).first()).toBeVisible();
    await expect(page.getByText(PRODUCT_PRICE, { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Chu kỳ', { exact: false })).not.toBeVisible();
  });

  test('TC_SMARTTV.5 — Kiểm tra label giao hàng cố định không thay đổi theo địa chỉ', async ({ page }) => {
    const checkout = await openPayment(page);
    await expect(checkout.deliveryLabel).toBeVisible();
    await expect(checkout.deliveryLabel).toHaveText(/Thời gian giao hàng dự kiến từ 3 đến 7 ngày/);
    // Thay đổi tỉnh → label phải vẫn còn đó (cố định)
    await checkout.selectProvince('Hà Nội', 'Hà N');
    await expect(checkout.deliveryLabel).toBeVisible();
    await expect(checkout.deliveryLabel).toHaveText(/Thời gian giao hàng dự kiến từ 3 đến 7 ngày/);
  });

});

// ════════════════════════ TC_SMARTTV — PTTT ════════════════════════
test.describe('TC_SMARTTV — Block Phương thức thanh toán', () => {

  test('TC_SMARTTV.6 — Kiểm tra block PTTT có COD và Online (ATM / Momo)', async ({ page }) => {
    const checkout = await openPayment(page);
    await checkout.clickXemThem();
    // Kiểm tra COD hiển thị
    await expect(page.getByRole('radio', { name: 'Thanh toán khi triển khai' }).first()).toBeVisible();
    // Kiểm tra ít nhất 1 phương thức Online (ATM / Momo / VietQR)
    const atm  = page.getByRole('radio', { name: 'Thẻ ATM' }).first();
    const momo = page.getByText('Ví MoMo', { exact: false });
    const hasOnline = (await atm.isVisible().catch(() => false)) || (await momo.isVisible().catch(() => false));
    expect(hasOnline).toBeTruthy();
  });

});

// ════════════════════════ TC_SMARTTV — Thông tin khách hàng ════════════════════════
test.describe('TC_SMARTTV — Block Thông tin khách hàng', () => {

  test('TC_SMARTTV.7 — Kiểm tra block TTKH tự load khi vào màn Checkout, không có Thời gian lắp đặt', async ({ page }) => {
    const checkout = await openPayment(page);
    // TTKH section hiển thị ngay khi vào trang
    await expect(checkout.ttkhRegion).toBeVisible();
    await expect(checkout.hoTenInput).toBeVisible();
    await expect(checkout.sdtInput).toBeVisible();
    // Không có "Thời gian lắp đặt" (đặc thù Camera, không có trên Smart TV)
    await expect(page.getByText('Thời gian lắp đặt', { exact: false })).not.toBeVisible();
  });

  test.skip('TC_SMARTTV.8 — Kiểm tra thanh toán khi chính sách không còn active', async ({ page }) => {
    // Cần dữ liệu staging với gói Smart TV có policy đã deactivate trên QLCS.
    // Không thể tự động hóa mà không có test data đặc biệt từ backend.
    // Thực hiện manual khi có môi trường phù hợp.
  });

});

// ════════════════════════ TC_SMARTTV — Luồng thanh toán ════════════════════════
test.describe('TC_SMARTTV — Luồng thanh toán', () => {

  test('TC_SMARTTV.9 — Kiểm tra điền đủ thông tin + chọn COD + bấm Thanh toán → rời khỏi /payment', async ({ page }) => {
    await fillAndSubmitCOD(page);
    await expect(page).not.toHaveURL(/\/payment$/, { timeout: 20000 });
  });

  test('TC_SMARTTV.10 — Kiểm tra luồng COD đầy đủ → màn Hoàn tất với trạng thái Chưa thanh toán', async ({ page }) => {
    await fillAndSubmitCOD(page);
    await expect(page).toHaveURL(/\/completed/, { timeout: 20000 });
    const complete = new DeviceOrderCompletePage(page);
    await expect(complete.successMessage).toBeVisible();
    await expect(complete.codStatus).toBeVisible();
    await expect(complete.orderIdText).toBeVisible();
    const orderId = await complete.getOrderId();
    expect(orderId).toBeTruthy();
  });

});

// ════════════════════════ TC_SMARTTV — Navigation ════════════════════════
test.describe('TC_SMARTTV — Navigation & điều khoản', () => {

  test('TC_SMARTTV.14 — Kiểm tra link Quay lại điều hướng về trang sản phẩm tongdaiwifi.vn', async ({ page }) => {
    const checkout = await openPayment(page);
    // Link bị che bởi sticky bottom bar → verify href rồi navigate trực tiếp
    await expect(checkout.quayLaiLink).toBeVisible();
    const href = await checkout.quayLaiLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn/);
    await page.goto(href!);
    await expect(page).toHaveURL(/tongdaiwifi\.vn/, { timeout: 15000 });
  });

});
