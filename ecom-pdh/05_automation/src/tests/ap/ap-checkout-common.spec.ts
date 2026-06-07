import { test, expect, Page } from '@playwright/test';
import { ApCheckoutPage } from '../../pages/ap/ap-checkout.page';
import { ApProductDetailPage } from '../../pages/ap/ap-product-detail.page';
import { ApOrderCompletePage } from '../../pages/ap/ap-order-complete.page';

/**
 * TC_CKCOMMON — Field validation dùng chung, chạy trên màn Checkout AP.
 * Nguồn TC: 03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.1.xlsx (sheet Checkout_Common).
 * Tên test theo TC ID (TC_CKCOMMON.N) để sync-tc-results map vào sheet Checkout_Common.
 * CKCOMMON realized trên màn checkout AP (1 bước — /payment page chứa form + PTTT).
 */

const REGISTER_URL  = 'https://staging.fpt.vn/checkout/register/access-point-ax1800az?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn';
const PRODUCT_URL   = 'https://staging.tongdaiwifi.vn/thiet-bi-thong-minh/access-point-ax1800az';
const VALID_NAME    = 'Nguyen Van Auto';
const VALID_PHONE   = '0901234567';

async function completeCOD(page: Page): Promise<void> {
  const checkout = new ApCheckoutPage(page);
  await checkout.start(REGISTER_URL);
  await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
  await checkout.selectPaymentMethod('COD-COD');
  await checkout.clickThanhToan();
  await expect(page).toHaveURL(/\/completed/, { timeout: 20000 });
}

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

// ════════════════════════ TC_CKCOMMON — GROUP A (bổ sung) ════════════════════════

// ── Navigation & Icon back ──────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Navigation back (AP URL)', () => {

  test('TC_CKCOMMON.3 — Kiểm tra icon back khi mở trực tiếp link đăng ký', async ({ page }) => {
    const checkout = await openAP(page);
    // AP 1-bước: link Quay lại luôn hiển thị trên màn payment, kể cả khi mở URL trực tiếp
    await expect(checkout.quayLaiLink).toBeVisible();
    const href = await checkout.quayLaiLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/tongdaiwifi\.vn/);
  });

  test('TC_CKCOMMON.4 — Kiểm tra icon back khi vào từ tongdaiwifi.vn', async ({ page }) => {
    const product = new ApProductDetailPage(page);
    await product.navigateToProduct(PRODUCT_URL);
    await product.clickMuaNgay();
    await page.waitForURL(/\/payment/, { timeout: 20000 });
    const checkout = new ApCheckoutPage(page);
    await checkout.dismissCookieBanner();
    const href = await checkout.quayLaiLink.getAttribute('href');
    expect(href).toMatch(/tongdaiwifi\.vn/);
    await page.goto(href!);
    await expect(page).toHaveURL(/tongdaiwifi\.vn/, { timeout: 15000 });
  });

});

// ── Block Sản phẩm ─────────────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Block Sản phẩm (AP URL)', () => {

  test('TC_CKCOMMON.7 — Kiểm tra Block Sản phẩm hiển thị tên, số lượng và giá', async ({ page }) => {
    await openAP(page);
    await expect(page.getByText(/Access Point/i)).toBeVisible();
    await expect(page.getByText(/^x\d+$/).first()).toBeVisible();
    await expect(page.getByText(/\d+\.000đ/).first()).toBeVisible();
  });

});

// ── Họ tên bổ sung ─────────────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Block Thông tin cá nhân: Họ tên bổ sung (AP URL)', () => {

  test('TC_CKCOMMON.10 — Kiểm tra Họ tên chứa số hoặc ký tự đặc biệt → báo lỗi', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.fillValidAddress();
    await checkout.fillHoTen('Nguyen 123 !@#');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Họ( và)? tên không hợp lệ|chỉ (được )?chứa chữ|không hợp lệ/i))
      .toBeVisible({ timeout: 8000 });
  });

});

// ── Địa chỉ bổ sung ────────────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Block Địa chỉ lắp đặt bổ sung (AP URL)', () => {

  test.fixme('TC_CKCOMMON.24 — Kiểm tra không chọn Tỉnh/Thành phố → báo lỗi bắt buộc', async ({ page }) => {
    // FIXME: AP checkout pre-fills Tỉnh/Phường/Đường từ server (confirmed qua DOM inspect 2026-06-07).
    // Scenario "Province not selected" không xảy ra được trong AP flow.
    // TC này cần test tay hoặc implement bằng cách reset dropdown về placeholder trước khi submit.
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng chọn tỉnh|địa chỉ.*bắt buộc|chọn tỉnh/i))
      .toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.28 — Kiểm tra đổi Tỉnh/Thành phố reset Phường/Xã và Tên đường', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.selectWard('Phường Bến Thành');
    // Đổi sang tỉnh khác → các dropdown phụ thuộc phải reset
    await checkout.selectProvince('Hà Nội', 'Hà N');
    await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Phường Bến Thành/ })).not.toBeVisible();
  });

  test.fixme('TC_CKCOMMON.30 — Kiểm tra Phường/Xã bắt buộc khi đã chọn Tỉnh', async ({ page }) => {
    // FIXME: AP checkout pre-fills Tỉnh/Phường/Đường từ server (HCM).
    // Để trigger Ward reset, phải đổi sang Province khác (VD: Hà Nội).
    // Nhưng trên staging, Province = Hà Nội tự động điền Ward/Street và đổi PTTT sang Thẻ ATM,
    // khiến form submit thành công thay vì hiện lỗi "Vui lòng chọn phường/xã".
    // Cùng lý do với TC_CKCOMMON.24 — không thể automate trên AP staging hiện tại.
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.selectProvince('Hà Nội', 'Hà N');
    await checkout.fillSoNha('113');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng chọn (?:phường|xã)/i)).toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.35 — Kiểm tra Tên đường bắt buộc sau khi đã chọn Phường/Xã', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.fillHoTen(VALID_NAME);
    await checkout.fillSdt(VALID_PHONE);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.selectWard('Phường Bến Thành');
    // Không chọn Tên đường; điền Số nhà
    await checkout.fillSoNha('113');
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    await expect(checkout.fieldError(/Vui lòng chọn tên đường|đường.*bắt buộc/i))
      .toBeVisible({ timeout: 8000 });
  });

  test('TC_CKCOMMON.36 — Kiểm tra tìm kiếm và chọn Tên đường', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.selectProvince('Hồ Chí Minh');
    await checkout.selectWard('Phường Bến Thành');
    await checkout.selectStreet('Đường Lê Lai', 'Lê Lai');
    // Street button giữ aria-label="Chọn tên đường" sau khi chọn; kiểm tra text content thay vì accessible name
    await expect(page.locator('button[aria-label="Chọn tên đường"]')).toContainText('Lê Lai', { timeout: 8000 });
  });

});

// ── Popup ĐCHC bổ sung ─────────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Popup Địa chỉ hành chính cũ bổ sung (AP URL)', () => {

  test('TC_CKCOMMON.42 — Kiểm tra load phân cấp và tìm kiếm trong popup ĐCHC', async ({ page }) => {
    const checkout = await openAP(page);
    await checkout.openOldAddressPopup();
    const dialog = checkout.oldAddrDialog;
    // Popup mở với dropdown Quận/Huyện (cấp đầu tiên trong 3-cấp cũ)
    const districtBtn = dialog.getByRole('button', { name: 'Chọn quận/huyện' });
    await expect(districtBtn).toBeVisible();
    await districtBtn.click();
    // Dropdown danh sách mở có ô tìm kiếm và ít nhất 1 item
    const dd = page.locator('[role="dialog"][data-state="open"]').last();
    await expect(dd.getByRole('textbox', { name: 'Nhập thông tin' })).toBeVisible({ timeout: 10000 });
    const itemCount = await dd.locator('p').count();
    expect(itemCount).toBeGreaterThan(0);
    // Tìm kiếm lọc kết quả
    await dd.getByRole('textbox', { name: 'Nhập thông tin' }).fill('1');
    await expect(dd.locator('p').first()).toBeVisible({ timeout: 5000 });
  });

  test.fixme('TC_CKCOMMON.48 — Kiểm tra click Xác nhận đẩy địa chỉ 2-cấp vào form', async ({ page }) => {
    // Cần test data: địa chỉ 3-cấp (Quận/Phường cũ) có mapping sang 2-cấp mới trên staging.
    // Thực hiện thủ công cho đến khi team QA cung cấp bộ địa chỉ cụ thể.
    const checkout = await openAP(page);
    await checkout.openOldAddressPopup();
    // TODO: chọn đủ 4 cấp → oldAddrConfirmButton.click() → verify soNhaInput / ward button đã điền
  });

});

// ── Submit thiếu trường tổng hợp ───────────────────────────────────────────────
test.describe('TC_CKCOMMON — Luồng submit thiếu trường (AP URL)', () => {

  test('TC_CKCOMMON.63 — Kiểm tra click Thanh toán khi tất cả trường để trống', async ({ page }) => {
    const checkout = await openAP(page);
    // Không điền bất kỳ trường nào → click Thanh toán
    await checkout.thanhToanButton.scrollIntoViewIfNeeded();
    await checkout.thanhToanButton.click();
    // Nhiều lỗi hiển thị cùng lúc — tối thiểu Họ tên và SĐT
    await expect(checkout.fieldError(/Vui lòng nhập họ( và)? tên/)).toBeVisible({ timeout: 8000 });
    await expect(checkout.fieldError(/Vui lòng nhập số điện thoại/)).toBeVisible();
  });

});

// ── Màn hình Hoàn tất ──────────────────────────────────────────────────────────
test.describe('TC_CKCOMMON — Màn hình Hoàn tất (AP URL)', () => {

  test('TC_CKCOMMON.72 — Kiểm tra hiển thị Mã đơn hàng và hyperlink Theo dõi ĐH', async ({ page }) => {
    await completeCOD(page);
    const complete = new ApOrderCompletePage(page);
    await expect(complete.orderIdText).toBeVisible({ timeout: 15000 });
    await expect(complete.trackingLink).toBeVisible();
    const orderId = await complete.getOrderId();
    expect(orderId.length).toBeGreaterThan(0);
  });

  test.fixme('TC_CKCOMMON.73 — Kiểm tra click hyperlink Theo dõi đơn hàng điều hướng đúng', async ({ page }) => {
    // FIXME: "Theo dõi ĐH" là <P> element bên trong <DIV>, không phải <a href>.
    // Confirmed qua DOM inspect 2026-06-07: không có <a> element nào trên trang /completed.
    // Không thể test href navigation. Cần BA/DEV xác nhận intent: là hyperlink hay display-only label.
    await completeCOD(page);
    const complete = new ApOrderCompletePage(page);
    await expect(complete.trackingLink).toBeVisible({ timeout: 15000 });
    const href = await complete.trackingLink.getAttribute('href');
    expect(href).toBeTruthy();
    await page.goto(href!);
    await expect(page).not.toHaveURL(/\/completed/, { timeout: 15000 });
  });

  test('TC_CKCOMMON.74 — Kiểm tra block Thông tin khách hàng hiển thị trên màn Hoàn tất', async ({ page }) => {
    await completeCOD(page);
    await expect(page.getByText(VALID_NAME, { exact: false })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(VALID_PHONE, { exact: false })).toBeVisible();
    // Kiểm tra label "Địa chỉ" tồn tại (địa chỉ thực tế phụ thuộc vào pre-fill trên AP staging)
    await expect(page.getByText('Địa chỉ', { exact: true })).toBeVisible();
  });

  test('TC_CKCOMMON.75 — Kiểm tra trạng thái hoàn tất: COD hiển thị Chưa thanh toán', async ({ page }) => {
    await completeCOD(page);
    const complete = new ApOrderCompletePage(page);
    await expect(complete.successMessage).toBeVisible({ timeout: 15000 });
    await expect(complete.codStatus).toBeVisible();
  });

});
