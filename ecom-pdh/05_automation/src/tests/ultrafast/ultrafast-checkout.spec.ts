import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ultrafast/product-detail.page';
import { CheckoutUltrafastPage } from '../../pages/ultrafast/checkout-ultrafast.page';
import { checkoutData } from '../../../test-data/checkout/checkout.data';

const PRODUCT_URL  = 'https://staging.tongdaiwifi.vn/dich-vu-so/goi-hyperfast-2';
const CHECKOUT_URL = 'https://staging.fpt.vn/checkout/register/goi-hyperfast-2?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn&sl=1&month=1';
const VALID_PHONE  = checkoutData.validPhone;

async function openCheckout(page: any): Promise<CheckoutUltrafastPage> {
  const checkout = new CheckoutUltrafastPage(page);
  await checkout.navigate(CHECKOUT_URL);
  await page.waitForSelector('input[name="phone"]', { state: 'visible', timeout: 15000 });
  await checkout.dismissCookieBanner();
  return checkout;
}

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Đăng ký UltraFast: Load & Điều hướng', () => {

  test('TC_DANGKYUF.2 — Kiểm tra chọn chu kỳ và click "Mua ngay" điều hướng sang Checkout', async ({ page }) => {
    const productPage = new ProductDetailPage(page);
    await productPage.navigate(PRODUCT_URL);
    await productPage.selectCycle('1 tháng');
    await productPage.clickMuaNgay();

    await expect(page).toHaveURL(/staging\.fpt\.vn\/checkout/);
  });

  test('TC_DANGKYUF.3 — Kiểm tra Checkout load đúng chu kỳ và số tiền từ màn hình Chi tiết', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.cycleLabel).toBeVisible();
    await expect(checkout.cycleLabel).toContainText('1 tháng');
    await expect(checkout.totalAmountLarge).toBeVisible();
    const amount = (await checkout.totalAmountLarge.textContent()) ?? '';
    expect(amount.trim()).toMatch(/\d/);
  });

  test('TC_DANGKYUF.4 — Kiểm tra Block "Sản phẩm dịch vụ đã chọn" hiển thị đúng thông tin', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.productNameText.first()).toBeVisible();
    await expect(checkout.cycleLabel).toBeVisible();
    await expect(checkout.totalAmountLarge).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Block Thông tin cá nhân: Số điện thoại', () => {

  test('TC_DANGKYUF.5 — Kiểm tra nhập SĐT hợp lệ (10 số, bắt đầu bằng 0)', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.fillPhone(VALID_PHONE);

    await expect(checkout.phoneInput).toHaveValue(VALID_PHONE);
    await expect(checkout.clearPhoneButton).toBeVisible();
    const ariaInvalid = await checkout.phoneInput.getAttribute('aria-invalid');
    expect(ariaInvalid).not.toBe('true');
  });

  test('TC_DANGKYUF.6 — Kiểm tra báo lỗi khi bỏ trống SĐT và click Thanh toán', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await checkout.clickTiepTuc();
    await page.waitForTimeout(1000);

    const errorMsg = page.locator('p').filter({ hasText: /Vui lòng nhập số điện thoại/ });
    await expect(errorMsg).toBeVisible({ timeout: 8000 });
  });

  test('TC_DANGKYUF.7 — Kiểm tra báo lỗi khi nhập SĐT ít hơn 10 số', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.fillPhone('090123456'); // 9 số
    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await checkout.clickTiepTuc();
    await page.waitForTimeout(1000);

    // Text lỗi sai định dạng (BA 2026-05-30): "Số điện thoại chưa đúng, mời nhập lại" — dùng cho cả < 10 số và không bắt đầu 0
    const errorMsg = page.locator('p').filter({ hasText: /Số điện thoại chưa đúng/ });
    await expect(errorMsg).toBeVisible({ timeout: 8000 });
  });

  test('TC_DANGKYUF.8 — Kiểm tra báo lỗi khi nhập SĐT không bắt đầu bằng 0', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.fillPhone('1901234567'); // không bắt đầu 0
    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await checkout.clickTiepTuc();
    await page.waitForTimeout(1000);

    const errorMsg = page.locator('p').filter({ hasText: /Số điện thoại chưa đúng/ });
    await expect(errorMsg).toBeVisible({ timeout: 8000 });
  });

  test('TC_DANGKYUF.9 — Kiểm tra trường SĐT không cho nhập quá 10 ký tự (boundary)', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.phoneInput.fill('09012345678'); // 11 số
    await page.waitForTimeout(300);

    const value = await checkout.phoneInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(10);
  });

  test('TC_DANGKYUF.10 — Kiểm tra icon X xóa nội dung đã nhập trong trường SĐT', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.fillPhone(VALID_PHONE);
    await expect(checkout.clearPhoneButton).toBeVisible();
    await checkout.clearPhoneButton.click();

    await expect(checkout.phoneInput).toHaveValue('');
    await expect(checkout.clearPhoneButton).toBeHidden();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Block Phương thức thanh toán', () => {

  test('TC_DANGKYUF.11 — Kiểm tra Block PTTT hiển thị đúng danh sách theo cấu hình QLCS', async ({ page }) => {
    const checkout = await openCheckout(page);

    const methodIds = await checkout.getAllPaymentMethodIds();
    expect(methodIds.length).toBeGreaterThan(0);

    // Verify ít nhất 1 phương thức Online tồn tại
    const hasOnline = methodIds.some(id => id.includes('Online'));
    expect(hasOnline).toBe(true);
  });

  test('TC_DANGKYUF.12 — Kiểm tra không xuất hiện option COD trong Block PTTT', async ({ page }) => {
    const checkout = await openCheckout(page);

    // Theo spec: UltraFast không có COD
    // Nếu test fail: cần xác nhận lại với BA vì DOM hiện tại có payment-method-COD-COD
    const codBtn = checkout.ptttCOD;
    const isCodVisible = await codBtn.isVisible().catch(() => false);
    expect(isCodVisible, 'COD không được hiển thị trong thanh toán UltraFast').toBe(false);
  });

  test('TC_DANGKYUF.13 — Kiểm tra Block PTTT chỉ hiển thị đúng số PTTT đã cấu hình', async ({ page }) => {
    const checkout = await openCheckout(page);

    const methodIds = await checkout.getAllPaymentMethodIds();
    // Verify số PTTT khớp với cấu hình staging (≥1)
    expect(methodIds.length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Block Thông tin khách hàng & Thanh toán', () => {

  test('TC_DANGKYUF.14 — Kiểm tra Block TTKH hiển thị đúng data có sẵn', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.thongTinKhachHangSection).toBeVisible();
    // Block TTKH luôn hiển thị (không bị ẩn)
    const sectionVisible = await checkout.thongTinKhachHangSection.isVisible();
    expect(sectionVisible).toBe(true);
  });

  test('TC_DANGKYUF.15 — Kiểm tra Block TTKH hiển thị rỗng khi chưa có data lắp đặt', async ({ page }) => {
    const checkout = await openCheckout(page);

    // Block vẫn hiển thị dù không có data
    await expect(checkout.thongTinKhachHangSection).toBeVisible();
    // Kiểm tra có text "-" (giá trị rỗng theo spec)
    const emptyValue = page.getByText('-', { exact: true }).first();
    await expect(emptyValue).toBeVisible();
  });

  test('TC_DANGKYUF.16 — Kiểm tra "Cần thanh toán" hiển thị đúng tổng tiền sản phẩm', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.canThanhToanLabel).toBeVisible();
    await expect(checkout.totalAmountLarge).toBeVisible();

    const amount = (await checkout.totalAmountLarge.textContent()) ?? '';
    // Verify có số tiền thực (dạng XX.XXXđ)
    expect(amount).toMatch(/\d+[\.,]\d+/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Button Thanh toán: Validate & Execute', () => {

  test('TC_DANGKYUF.17 — Kiểm tra button Thanh toán không thực hiện khi còn trường bắt buộc chưa nhập', async ({ page }) => {
    const checkout = await openCheckout(page);

    // KHÔNG nhập SĐT, chọn PTTT rồi click "Thanh toán"
    await checkout.selectPaymentMethod('DOMESTIC-Online');

    // "Thanh toán" là regular button (không phải type="submit"), dùng exact để tránh match accordion "Thông tin thanh toán"
    await page.getByRole('button', { name: 'Thanh toán', exact: true }).click();
    await page.waitForTimeout(3000);

    // Vẫn ở trang checkout — không redirect sang 3rd party payment
    await expect(page).toHaveURL(/staging\.fpt\.vn\/checkout/);

    // Phone input vẫn visible → form chưa được submit thành công
    await expect(checkout.phoneInput).toBeVisible();
  });

  test('TC_DANGKYUF.19 — Kiểm tra button Thanh toán redirect đúng trang 3rd party khi data hợp lệ', async ({ page }) => {
    const checkout = await openCheckout(page);

    await checkout.fillPhone(VALID_PHONE);
    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await checkout.clickTiepTuc();

    // Chờ navigation — hoặc sang trang confirm, hoặc sang 3rd party
    await page.waitForTimeout(2000);

    // Verify: đã rời khỏi bước nhập SĐT (URL thay đổi hoặc có confirm step)
    const currentUrl = page.url();
    const isProgressMade = currentUrl !== CHECKOUT_URL &&
      (currentUrl.includes('checkout') || currentUrl.includes('payment'));
    expect(isProgressMade, `Trang không chuyển tiếp sau khi submit hợp lệ. URL: ${currentUrl}`).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC_DANGKYUF — Navigation & UI', () => {

  test('TC_DANGKYUF.23 — Kiểm tra button "Quay lại" điều hướng về màn hình Chi tiết', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.quayLaiLink).toBeVisible();
    const href = await checkout.quayLaiLink.getAttribute('href');
    expect(href).toContain('tongdaiwifi.vn');
  });

  test('TC_DANGKYUF.24 — Kiểm tra click Logo FPT điều hướng về trang chủ FPT.vn', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.fptLogoLink).toBeVisible();
    const href = await checkout.fptLogoLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn|fpt\.vn/i);
  });

  test('TC_DANGKYUF.25 — Kiểm tra click text điều khoản điều hướng đến trang Privacy Policy', async ({ page }) => {
    const checkout = await openCheckout(page);

    await expect(checkout.termsLink).toBeVisible();
    const href = await checkout.termsLink.getAttribute('href');
    expect(href).toContain('privacy-policy');
  });
});
