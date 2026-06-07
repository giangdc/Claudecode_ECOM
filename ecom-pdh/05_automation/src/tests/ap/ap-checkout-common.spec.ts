import { test, expect, Page } from '@playwright/test';
import { ApCheckoutPage } from '../../pages/ap/ap-checkout.page';

/**
 * TC_CKCOMMON — Field validation dùng chung, chạy trên màn Checkout AP.
 * Nguồn TC: 03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.1.xlsx (sheet Checkout_Common).
 * Tên test theo TC ID (TC_CKCOMMON.N) để sync-tc-results map vào sheet Checkout_Common.
 * CKCOMMON realized trên màn checkout AP (1 bước — /payment page chứa form + PTTT).
 */

const REGISTER_URL = 'https://staging.fpt.vn/checkout/register/access-point-ax1800az?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn';
const VALID_NAME   = 'Nguyen Van Auto';
const VALID_PHONE  = '0901234567';

async function openAP(page: Page): Promise<ApCheckoutPage> {
  const checkout = new ApCheckoutPage(page);
  await checkout.start(REGISTER_URL);
  return checkout;
}

// ════════════════════════ TC_CKCOMMON — Navigation ════════════════════════
test.describe('TC_CKCOMMON — Navigation (AP URL)', () => {

  test('TC_CKCOMMON.2 — Kiểm tra Logo FPT điều hướng về Home', async ({ page }) => {
    const checkout = await openAP(page);
    await expect(checkout.logoLink).toBeVisible();
    const href = await checkout.logoLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn|fpt\.vn/i);
  });

});

// ════════════════════════ TC_CKCOMMON — Họ tên ════════════════════════
test.describe('TC_CKCOMMON — Block Thông tin cá nhân: Họ tên (AP URL)', () => {

  test('TC_CKCOMMON.8 — Kiểm tra nhập Họ tên hợp lệ', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen('  Nguyen Van A  ');
    await expect(checkout.hoTenInput).toHaveValue(/Nguyen Van A/);
    expect(await checkout.hoTenInput.getAttribute('aria-invalid')).not.toBe('true');
  });

  test('TC_CKCOMMON.9 — Kiểm tra Họ tên để trống → báo lỗi bắt buộc', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.fillValidAddress();
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng nhập họ( và)? tên/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.11 — Kiểm tra Họ tên không cho nhập quá 100 ký tự', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.hoTenInput.fill('A'.repeat(120));
    const v = await checkout.hoTenInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(100);
  });

  test('TC_CKCOMMON.12 — Kiểm tra icon X xóa dữ liệu Họ tên', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen('Nguyen Van A');
    const clearBtn = checkout.hoTenInput.locator('xpath=../button');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(checkout.hoTenInput).toHaveValue('');
  });

});

// ════════════════════════ TC_CKCOMMON — Số điện thoại ════════════════════════
test.describe('TC_CKCOMMON — Block Thông tin cá nhân: Số điện thoại (AP URL)', () => {

  test('TC_CKCOMMON.13 — Kiểm tra nhập SĐT hợp lệ', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillSdt(VALID_PHONE);
    await expect(checkout.sdtInput).toHaveValue(VALID_PHONE);
    expect(await checkout.sdtInput.getAttribute('aria-invalid')).not.toBe('true');
  });

  test('TC_CKCOMMON.14 — Kiểm tra SĐT để trống → báo lỗi bắt buộc', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillValidAddress();
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng nhập số điện thoại/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.15 — Kiểm tra SĐT chứa ký tự không phải số → báo lỗi', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillValidAddress();
    await checkout.fillSdt('090abc1234');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.16 — Kiểm tra SĐT 10 số không bắt đầu bằng 0', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillValidAddress();
    await checkout.fillSdt('1901234567');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.17 — Kiểm tra SĐT không cho nhập quá 10 số', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.sdtInput.fill('09012345678');
    const v = await checkout.sdtInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(10);
  });

  test('TC_CKCOMMON.18 — Kiểm tra icon X xóa dữ liệu SĐT', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillSdt(VALID_PHONE);
    const clearBtn = checkout.sdtInput.locator('xpath=../button');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(checkout.sdtInput).toHaveValue('');
  });

});

// ════════════════════════ TC_CKCOMMON — Địa chỉ lắp đặt ════════════════════════
test.describe('TC_CKCOMMON — Block Địa chỉ lắp đặt (AP URL)', () => {

  test('TC_CKCOMMON.23 — Kiểm tra Tỉnh/Thành phố mặc định rỗng (placeholder)', async ({ page }) => {
    const checkout = await openAP(page);
    await expect(page.getByRole('button', { name: 'Chọn tỉnh thành phố' })).toBeVisible();
  });

  test('TC_CKCOMMON.25 — Kiểm tra load danh sách Tỉnh ưu tiên HCM/HN/Đà Nẵng', async ({ page }) => {
    const checkout = await openAP(page);
    const dd = await checkout.openProvinceDropdown();
    const texts = await dd.locator('p').allInnerTexts();
    const top3 = texts.filter(t => t.trim()).slice(0, 3).map(t => t.trim());
    expect(top3).toEqual(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']);
  });

  test('TC_CKCOMMON.26 — Kiểm tra tìm kiếm Tỉnh theo từ khóa (contains)', async ({ page }) => {
    const checkout = await openAP(page);
    const dd = await checkout.openProvinceDropdown();
    await dd.getByRole('textbox', { name: 'Nhập thông tin' }).fill('Hà N');
    await expect(dd.getByText('Hà Nội', { exact: true })).toBeVisible();
    await expect(dd.getByText('Hồ Chí Minh', { exact: true })).toBeHidden();
  });

  test('TC_CKCOMMON.27 — Kiểm tra chọn Tỉnh load thêm Phường/Xã, Tên đường, Số nhà', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
    await expect(checkout.soNhaInput).toBeVisible();
  });

  test('TC_CKCOMMON.31 — Kiểm tra tìm kiếm và chọn Phường/Xã', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.selectWard('Phường Bến Thành', 'Bến Thành');
    await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toContainText('Phường Bến Thành', { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
  });

  test('TC_CKCOMMON.38 — Kiểm tra Số nhà để trống → báo lỗi bắt buộc', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.selectWard('Phường Bến Thành');
    await checkout.selectStreet('Đường Lê Lai');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng nhập (địa chỉ|số nhà)/i)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.39 — Kiểm tra Số nhà không cho nhập quá 50 ký tự', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.fillSoNha('1'.repeat(60));
    const v = await checkout.soNhaInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(50);
  });

  test('TC_CKCOMMON.40 — Kiểm tra Ghi chú không bắt buộc và giới hạn 100 ký tự', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.fillNote('N'.repeat(120));
    const v = await checkout.noteInput.inputValue();
    expect(v.length).toBeLessThanOrEqual(100);
  });

});

// ════════════════════════ TC_CKCOMMON — Popup Địa chỉ hành chính cũ ════════════════════════
test.describe('TC_CKCOMMON — Popup Địa chỉ hành chính cũ (AP URL)', () => {

  test('TC_CKCOMMON.41 — Kiểm tra hiển thị UI popup Địa chỉ hành chính cũ', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.openOldAddressPopup();
    await expect(checkout.oldAddrDialog).toBeVisible();
    await expect(checkout.oldAddrDialog.getByRole('button', { name: 'Chọn quận/huyện' })).toBeVisible();
    await expect(checkout.oldAddrConfirmButton).toBeVisible();
  });

  test('TC_CKCOMMON.43 — Kiểm tra button Xác nhận disable khi chưa chọn đủ cấp', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.openOldAddressPopup();
    await expect(checkout.oldAddrConfirmButton).toBeDisabled();
  });

  test('TC_CKCOMMON.47 — Kiểm tra click Close đóng popup', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.openOldAddressPopup();
    await checkout.oldAddrCloseButton.click();
    await expect(checkout.oldAddrDialog).toBeHidden();
  });

});

// ════════════════════════ TC_CKCOMMON — PTTT & Luồng thanh toán ════════════════════════
test.describe('TC_CKCOMMON — Phương thức thanh toán & Luồng thanh toán (AP URL)', () => {

  test('TC_CKCOMMON.52 — Kiểm tra hiển thị UI block Phương thức thanh toán', async ({ page }) => {
    const checkout = await openAP(page);
    const ids = await checkout.getAllPaymentMethodIds();
    expect(ids.length).toBeGreaterThan(0);
  });

  test('TC_CKCOMMON.54 — Kiểm tra > 4 PTTT có button Xem thêm', async ({ page }) => {
    const checkout = await openAP(page);
    await expect(checkout.xemThemButton).toBeVisible();
    await checkout.clickXemThem();
    const ids = await checkout.getAllPaymentMethodIds();
    expect(ids.length).toBeGreaterThan(4);
  });

  test('TC_CKCOMMON.56 — Kiểm tra chỉ chọn được 1 PTTT', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectPaymentMethod('COD-COD');
    await expect(checkout.paymentMethodRadio('COD-COD')).toBeChecked();
    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await expect(checkout.paymentMethodRadio('DOMESTIC-Online')).toBeChecked();
    await expect(checkout.paymentMethodRadio('COD-COD')).not.toBeChecked();
  });

  test('TC_CKCOMMON.57 — Kiểm tra hyperlink điều khoản tại màn Thanh toán', async ({ page }) => {
    const checkout = await openAP(page);
    await expect(checkout.termsLink).toBeVisible();
    const href = await checkout.termsLink.getAttribute('href');
    expect(href).toContain('privacy-policy');
  });

  test('TC_CKCOMMON.64 — Kiểm tra thanh toán COD điều hướng màn Hoàn tất', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
    await checkout.selectPaymentMethod('COD-COD');
    await checkout.clickThanhToan();
    await expect(page).not.toHaveURL(/\/payment/, { timeout: 20000 });
  });

  test('TC_CKCOMMON.65 — Kiểm tra thanh toán Online điều hướng cổng 3rd party', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
    await checkout.selectPaymentMethod('DOMESTIC-Online');
    await checkout.clickThanhToan();
    await expect(page).not.toHaveURL(/\/payment$/, { timeout: 20000 });
  });

});
