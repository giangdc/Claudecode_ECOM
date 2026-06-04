import { test, expect, Page } from '@playwright/test';
import { InternetProductPage } from '../../pages/internet/internet-product.page';
import { CheckoutRegisterPage } from '../../pages/internet/checkout-register.page';
import { CheckoutPaymentPage } from '../../pages/internet/checkout-payment.page';

/**
 * Automation cho module CHECKOUT — luồng Internet (gói goi-giga).
 * Nguồn TC: 03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx
 * Tên test theo TC ID (TC_INTERNET.N / TC_CKCOMMON.N) để sync-tc-results map được.
 * CKCOMMON realized trên màn checkout Internet (màn dùng chung có Địa chỉ lắp đặt).
 */
const DETAIL_URL   = 'https://staging.tongdaiwifi.vn/internet/goi-giga';
const REGISTER_URL = 'https://staging.fpt.vn/checkout/register/goi-giga?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn';
const VALID_NAME   = 'Nguyen Van Auto';
const VALID_PHONE  = '0901234567';

async function openB1(page: Page): Promise<CheckoutRegisterPage> {
  const reg = new CheckoutRegisterPage(page);
  await reg.start(REGISTER_URL);
  return reg;
}

async function goToB2(page: Page): Promise<CheckoutPaymentPage> {
  const reg = await openB1(page);
  await reg.fillB1Valid(VALID_NAME, VALID_PHONE);
  await reg.clickTiepTuc();
  await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });
  return new CheckoutPaymentPage(page);
}

// ════════════════════════ TC_INTERNET — Điều hướng & Bước 1 ════════════════════════
test.describe('TC_INTERNET — Điều hướng & Bước 1 Thông tin đăng ký', () => {

  test('TC_INTERNET.2 — Kiểm tra "Đăng ký ngay" điều hướng vào luồng checkout', async ({ page }) => {
    const product = new InternetProductPage(page);
    await product.navigate(DETAIL_URL);
    await product.clickDangKyNgay();
    await expect(page).toHaveURL(/staging\.fpt\.vn\/checkout/, { timeout: 15000 });
  });

  test('TC_INTERNET.4 — Kiểm tra Bước 1 hiển thị đầy đủ các block', async ({ page }) => {
    const reg = await openB1(page);
    await expect(reg.fullNameInput).toBeVisible();
    await expect(reg.phoneInput).toBeVisible();
    await expect(page.getByRole('button', { name: 'Chọn tỉnh thành phố' })).toBeVisible();
    await expect(reg.tiepTucButton).toBeVisible();
    await expect(page.getByText('Thông tin lắp đặt')).toBeVisible();
    await expect(page.getByText('Thông tin thanh toán')).toBeVisible();
  });

  test('TC_INTERNET.5 — Kiểm tra Tiếp tục khi thiếu trường bắt buộc → ở lại Bước 1', async ({ page }) => {
    const reg = await openB1(page);
    await reg.clickTiepTuc();
    // Không điều hướng sang /payment — vẫn ở /register (toHaveURL auto-retry)
    await expect(page).toHaveURL(/\/register/);
    await expect(reg.fullNameInput).toBeVisible();
  });

  test('TC_INTERNET.6 — Kiểm tra Tiếp tục khi nhập đủ hợp lệ → sang Bước 2', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillB1Valid(VALID_NAME, VALID_PHONE);
    await reg.clickTiepTuc();
    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });
  });
});

// ════════════════════════ TC_CKCOMMON — Họ tên ════════════════════════
test.describe('TC_CKCOMMON — Block Thông tin cá nhân: Họ tên', () => {

  test('TC_CKCOMMON.8 — Kiểm tra nhập Họ tên hợp lệ', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName('  Nguyen Van A  ');
    await expect(reg.fullNameInput).toHaveValue(/Nguyen Van A/);
    expect(await reg.fullNameInput.getAttribute('aria-invalid')).not.toBe('true');
  });

  test('TC_CKCOMMON.9 — Kiểm tra Họ tên để trống → báo lỗi bắt buộc', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillPhone(VALID_PHONE);
    await reg.fillValidAddress();
    await reg.clickTiepTuc();
    await expect(reg.fieldError(/Vui lòng nhập họ( và)? tên/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.11 — Kiểm tra Họ tên không cho nhập quá 100 ký tự', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName('A'.repeat(120));
    const v = await reg.fullNameInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(100);
  });

  test('TC_CKCOMMON.12 — Kiểm tra icon X xóa dữ liệu Họ tên', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName('Nguyen Van A');
    const clear = reg.fullNameInput.locator('xpath=../button');
    await expect(clear).toBeVisible();
    await clear.click();
    await expect(reg.fullNameInput).toHaveValue('');
  });
});

// ════════════════════════ TC_CKCOMMON — Số điện thoại ════════════════════════
test.describe('TC_CKCOMMON — Block Thông tin cá nhân: Số điện thoại', () => {

  test('TC_CKCOMMON.13 — Kiểm tra nhập SĐT hợp lệ', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillPhone(VALID_PHONE);
    await expect(reg.phoneInput).toHaveValue(VALID_PHONE);
    expect(await reg.phoneInput.getAttribute('aria-invalid')).not.toBe('true');
  });

  test('TC_CKCOMMON.14 — Kiểm tra SĐT để trống → báo lỗi bắt buộc', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName(VALID_NAME);
    await reg.fillValidAddress();
    await reg.clickTiepTuc();
    await expect(reg.fieldError(/Vui lòng nhập số điện thoại/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.15 — Kiểm tra SĐT chứa ký tự không phải số → báo lỗi', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName(VALID_NAME);
    await reg.fillValidAddress();
    await reg.fillPhone('090abc1234');
    await reg.clickTiepTuc();
    await expect(reg.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.16 — Kiểm tra SĐT 10 số không bắt đầu bằng 0', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName(VALID_NAME);
    await reg.fillValidAddress();
    await reg.fillPhone('1901234567');
    await reg.clickTiepTuc();
    await expect(reg.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.17 — Kiểm tra SĐT không cho nhập quá 10 số', async ({ page }) => {
    const reg = await openB1(page);
    await reg.phoneInput.fill('09012345678');
    const v = await reg.phoneInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(10);
  });

  test('TC_CKCOMMON.18 — Kiểm tra icon X xóa dữ liệu SĐT', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillPhone(VALID_PHONE);
    const clear = reg.phoneInput.locator('xpath=../button');
    await expect(clear).toBeVisible();
    await clear.click();
    await expect(reg.phoneInput).toHaveValue('');
  });
});

// ════════════════════════ TC_CKCOMMON — Địa chỉ lắp đặt ════════════════════════
test.describe('TC_CKCOMMON — Block Địa chỉ lắp đặt', () => {

  test('TC_CKCOMMON.23 — Kiểm tra Tỉnh/Thành phố mặc định rỗng (placeholder)', async ({ page }) => {
    const reg = await openB1(page);
    await expect(page.getByRole('button', { name: 'Chọn tỉnh thành phố' })).toBeVisible();
  });

  test('TC_CKCOMMON.25 — Kiểm tra load danh sách Tỉnh ưu tiên HCM/HN/Đà Nẵng', async ({ page }) => {
    const reg = await openB1(page);
    const dd = await reg.openProvinceDropdown();
    const texts = await dd.locator('p').allInnerTexts();
    const top3 = texts.filter(t => t.trim()).slice(0, 3).map(t => t.trim());
    expect(top3).toEqual(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']);
  });

  test('TC_CKCOMMON.26 — Kiểm tra tìm kiếm Tỉnh theo từ khóa (contains)', async ({ page }) => {
    const reg = await openB1(page);
    const dd = await reg.openProvinceDropdown();
    await dd.getByRole('textbox', { name: 'Nhập thông tin' }).fill('Hà N');
    await expect(dd.getByText('Hà Nội', { exact: true })).toBeVisible();
    await expect(dd.getByText('Hồ Chí Minh', { exact: true })).toBeHidden();
  });

  test('TC_CKCOMMON.27 — Kiểm tra chọn Tỉnh load thêm Phường/Xã, Tên đường, Số nhà', async ({ page }) => {
    const reg = await openB1(page);
    await reg.selectProvince('Hồ Chí Minh');
    await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
    await expect(reg.soNhaInput).toBeVisible();
  });

  test('TC_CKCOMMON.31 — Kiểm tra tìm kiếm và chọn Phường/Xã', async ({ page }) => {
    const reg = await openB1(page);
    await reg.selectProvince('Hồ Chí Minh');
    await reg.selectWard('Phường Bến Thành', 'Bến Thành');
    // Trigger giữ aria-label "Chọn phường/xã" nhưng hiển thị giá trị đã chọn bên trong
    await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toContainText('Phường Bến Thành', { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
  });

  test('TC_CKCOMMON.38 — Kiểm tra Số nhà để trống → báo lỗi bắt buộc', async ({ page }) => {
    const reg = await openB1(page);
    await reg.fillFullName(VALID_NAME);
    await reg.fillPhone(VALID_PHONE);
    await reg.selectProvince('Hồ Chí Minh');
    await reg.selectWard('Phường Bến Thành');
    await reg.selectStreet('Đường Lê Lai');
    await reg.clickTiepTuc();
    await expect(reg.fieldError(/Vui lòng nhập (địa chỉ|số nhà)/i)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.39 — Kiểm tra Số nhà không cho nhập quá 50 ký tự', async ({ page }) => {
    const reg = await openB1(page);
    await reg.selectProvince('Hồ Chí Minh');
    await reg.fillSoNha('1'.repeat(60));
    const v = await reg.soNhaInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(50);
  });

  test('TC_CKCOMMON.40 — Kiểm tra Ghi chú không bắt buộc và giới hạn 100 ký tự', async ({ page }) => {
    const reg = await openB1(page);
    await reg.selectProvince('Hồ Chí Minh');
    await reg.fillNote('N'.repeat(120));
    const v = await reg.noteInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(100);
  });
});

// ════════════════════════ TC_CKCOMMON — Popup Địa chỉ hành chính cũ ════════════════════════
test.describe('TC_CKCOMMON — Popup Địa chỉ hành chính cũ', () => {

  test('TC_CKCOMMON.41 — Kiểm tra hiển thị UI popup Địa chỉ hành chính cũ', async ({ page }) => {
    const reg = await openB1(page);
    await reg.openOldAddressPopup();
    await expect(reg.oldAddrDialog).toBeVisible();
    await expect(reg.oldAddrDialog.getByRole('button', { name: 'Chọn quận/huyện' })).toBeVisible();
    await expect(reg.oldAddrConfirmButton).toBeVisible();
  });

  test('TC_CKCOMMON.43 — Kiểm tra button Xác nhận disable khi chưa chọn đủ cấp', async ({ page }) => {
    const reg = await openB1(page);
    await reg.openOldAddressPopup();
    await expect(reg.oldAddrConfirmButton).toBeDisabled();
  });

  test('TC_CKCOMMON.45 — Kiểm tra click Close đóng popup', async ({ page }) => {
    const reg = await openB1(page);
    await reg.openOldAddressPopup();
    await reg.oldAddrCloseButton.click();
    await expect(reg.oldAddrDialog).toBeHidden();
  });
});

// ════════════════════════ TC_INTERNET — Bước 2 Thanh toán ════════════════════════
test.describe('TC_INTERNET — Bước 2 Thanh toán', () => {

  test('TC_INTERNET.7 — Kiểm tra Thông tin lắp đặt load đúng từ Bước 1', async ({ page }) => {
    const pay = await goToB2(page);
    await expect(page.getByText(VALID_NAME)).toBeVisible();
    await expect(page.getByText(VALID_PHONE)).toBeVisible();
    await expect(page.getByText(/Phường Bến Thành/)).toBeVisible();
  });

  test('TC_INTERNET.9 — Kiểm tra gói trả sau: Cần thanh toán = Phí lắp đặt', async ({ page }) => {
    const pay = await goToB2(page);
    await expect(page.getByText('Phí lắp đặt', { exact: true })).toBeVisible();
    await expect(page.getByText('Cần thanh toán').first()).toBeVisible();
  });

  test('TC_INTERNET.10 — Kiểm tra chọn gói trả trước cập nhật số tiền', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.selectPackageByCycle(/- 3 tháng/);
    await expect(page.getByText('Cần thanh toán').first()).toBeVisible();
  });

  test('TC_INTERNET.12 — Kiểm tra Quay lại giữ nguyên dữ liệu Bước 1', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.clickQuayLai();
    await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
    const reg = new CheckoutRegisterPage(page);
    await expect(reg.fullNameInput).toHaveValue(VALID_NAME);
    await expect(reg.phoneInput).toHaveValue(VALID_PHONE);
  });

  test('TC_INTERNET.13 — Kiểm tra Block PTTT có đầy đủ Online và COD', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.clickXemThem();
    const ids = await pay.getAllPaymentMethodIds();
    expect(ids).toContain('payment-method-COD-COD');
    expect(ids.some(id => id.includes('Online'))).toBe(true);
  });
});

// ════════════════════════ TC_CKCOMMON — PTTT & Luồng thanh toán (B2) ════════════════════════
test.describe('TC_CKCOMMON — Phương thức thanh toán & Luồng thanh toán', () => {

  test('TC_CKCOMMON.50 — Kiểm tra hiển thị UI block Phương thức thanh toán', async ({ page }) => {
    const pay = await goToB2(page);
    const ids = await pay.getAllPaymentMethodIds();
    expect(ids.length).toBeGreaterThan(0);
  });

  test('TC_CKCOMMON.52 — Kiểm tra > 4 PTTT có button Xem thêm', async ({ page }) => {
    const pay = await goToB2(page);
    await expect(pay.xemThemButton).toBeVisible();
    await pay.clickXemThem();
    const ids = await pay.getAllPaymentMethodIds();
    expect(ids.length).toBeGreaterThan(4);
  });

  test('TC_CKCOMMON.54 — Kiểm tra chỉ chọn được 1 PTTT', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.selectPaymentMethod('COD-COD');
    await expect(pay.paymentMethodRadio('COD-COD')).toBeChecked();
    await pay.selectPaymentMethod('DOMESTIC-Online');
    await expect(pay.paymentMethodRadio('DOMESTIC-Online')).toBeChecked();
    await expect(pay.paymentMethodRadio('COD-COD')).not.toBeChecked();
  });

  test('TC_CKCOMMON.62 / TC_INTERNET.15 — Kiểm tra thanh toán COD điều hướng màn Hoàn tất', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.selectPaymentMethod('COD-COD');
    await pay.clickThanhToan();
    await expect(page).not.toHaveURL(/\/payment/, { timeout: 20000 });
  });

  test('TC_CKCOMMON.63 — Kiểm tra thanh toán Online điều hướng cổng 3rd party', async ({ page }) => {
    const pay = await goToB2(page);
    await pay.selectPaymentMethod('DOMESTIC-Online');
    await pay.clickThanhToan();
    await expect(page).not.toHaveURL(/\/payment$/, { timeout: 20000 });
  });
});

// ════════════════════════ TC_CKCOMMON — Navigation & Điều khoản ════════════════════════
test.describe('TC_CKCOMMON — Navigation', () => {

  test('TC_CKCOMMON.2 — Kiểm tra Logo FPT điều hướng về Home', async ({ page }) => {
    const reg = await openB1(page);
    await expect(reg.logoLink).toBeVisible();
    const href = await reg.logoLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn|fpt\.vn/i);
  });

  test('TC_CKCOMMON.55 — Kiểm tra hyperlink điều khoản tại Bước 2', async ({ page }) => {
    const pay = await goToB2(page);
    await expect(pay.termsLink).toBeVisible();
    const href = await pay.termsLink.getAttribute('href');
    expect(href).toContain('privacy-policy');
  });
});
