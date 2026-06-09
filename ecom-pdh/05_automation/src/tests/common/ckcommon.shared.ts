import { test, expect, Page } from '@playwright/test';
import { DeviceCheckoutPage } from '../../pages/common/device-checkout.page';
import { DeviceProductDetailPage } from '../../pages/common/device-product-detail.page';
import { DeviceOrderCompletePage } from '../../pages/common/device-order-complete.page';

/**
 * TC_CKCOMMON — Shared suite chạy được trên mọi dịch vụ có màn checkout 1-bước (AP / SmartTV / Camera).
 * Gọi runCkcommonSuite(params) từ từng spec file của dịch vụ.
 * Report phân biệt dịch vụ qua describe title "[SERVICE] TC_CKCOMMON — ...".
 * TC ID trong test() giữ nguyên "TC_CKCOMMON.N" để sync-tc-results map đúng cột Round.
 */

export interface CkcommonParams {
  serviceLabel: string;   // 'AP' | 'SmartTV' | 'Camera' — xuất hiện trong report
  registerUrl: string;    // URL /checkout/register/{slug}?...
  productUrl: string;     // URL trang sản phẩm tongdaiwifi.vn
  validName?: string;
  validPhone?: string;
}

export function runCkcommonSuite(params: CkcommonParams): void {
  const { serviceLabel, registerUrl, productUrl } = params;
  const VALID_NAME  = params.validName  ?? 'Nguyen Van Auto';
  const VALID_PHONE = params.validPhone ?? '0901234567';

  async function openCheckout(page: Page): Promise<DeviceCheckoutPage> {
    const checkout = new DeviceCheckoutPage(page);
    await checkout.start(registerUrl);
    return checkout;
  }

  async function completeCOD(page: Page): Promise<void> {
    const checkout = new DeviceCheckoutPage(page);
    await checkout.start(registerUrl);
    await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
    await checkout.selectPaymentMethod('COD-COD');
    await checkout.clickThanhToan();
    await expect(page).toHaveURL(/\/completed/, { timeout: 20000 });
  }

  // ════════════════════════ Navigation ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Navigation`, () => {

    test('TC_CKCOMMON.2 — Kiểm tra Logo FPT điều hướng về Home', async ({ page }) => {
      const checkout = await openCheckout(page);
      await expect(checkout.logoLink).toBeVisible();
      const href = await checkout.logoLink.getAttribute('href');
      expect(href).toMatch(/tongdaiwifi\.vn|fpt\.vn/i);
    });

    test('TC_CKCOMMON.3 — Kiểm tra icon back khi mở trực tiếp link đăng ký', async ({ page }) => {
      const checkout = await openCheckout(page);
      await expect(checkout.quayLaiLink).toBeVisible();
      const href = await checkout.quayLaiLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/tongdaiwifi\.vn/);
    });

    test('TC_CKCOMMON.4 — Kiểm tra icon back khi vào từ tongdaiwifi.vn', async ({ page }) => {
      const product = new DeviceProductDetailPage(page);
      await product.navigateToProduct(productUrl);
      await product.clickMuaNgay();
      await page.waitForURL(/\/payment/, { timeout: 20000 });
      const checkout = new DeviceCheckoutPage(page);
      await checkout.dismissCookieBanner();
      const href = await checkout.quayLaiLink.getAttribute('href');
      expect(href).toMatch(/tongdaiwifi\.vn/);
      await page.goto(href!);
      await expect(page).toHaveURL(/tongdaiwifi\.vn/, { timeout: 15000 });
    });

  });

  // ════════════════════════ Họ tên ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Block Thông tin cá nhân: Họ tên`, () => {

    test('TC_CKCOMMON.5 — Kiểm tra nhập Họ tên hợp lệ', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen('  Nguyen Van A  ');
      await expect(checkout.hoTenInput).toHaveValue(/Nguyen Van A/);
      expect(await checkout.hoTenInput.getAttribute('aria-invalid')).not.toBe('true');
    });

    test('TC_CKCOMMON.6 — Kiểm tra Họ tên để trống → báo lỗi bắt buộc', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.fillValidAddress();
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng nhập họ( và)? tên/)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.7 — Kiểm tra Họ tên chứa số hoặc ký tự đặc biệt → báo lỗi', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.fillValidAddress();
      await checkout.fillHoTen('Nguyen 123 !@#');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Họ( và)? tên không hợp lệ|chỉ (được )?chứa chữ|không hợp lệ/i))
        .toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.8 — Kiểm tra Họ tên không cho nhập quá 100 ký tự', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.hoTenInput.fill('A'.repeat(120));
      const v = await checkout.hoTenInput.inputValue();
      expect(v.length).toBeLessThanOrEqual(100);
    });

    test('TC_CKCOMMON.9 — Kiểm tra icon X xóa dữ liệu Họ tên', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen('Nguyen Van A');
      const clearBtn = checkout.hoTenInput.locator('xpath=../button');
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
      await expect(checkout.hoTenInput).toHaveValue('');
    });

  });

  // ════════════════════════ Số điện thoại ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Block Thông tin cá nhân: Số điện thoại`, () => {

    test('TC_CKCOMMON.10 — Kiểm tra nhập SĐT hợp lệ', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillSdt(VALID_PHONE);
      await expect(checkout.sdtInput).toHaveValue(VALID_PHONE);
      expect(await checkout.sdtInput.getAttribute('aria-invalid')).not.toBe('true');
    });

    test('TC_CKCOMMON.11 — Kiểm tra SĐT để trống → báo lỗi bắt buộc', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillValidAddress();
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng nhập số điện thoại/)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.12 — Kiểm tra SĐT chứa ký tự không phải số → báo lỗi', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillValidAddress();
      await checkout.fillSdt('090abc1234');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.13 — Kiểm tra SĐT 10 số không bắt đầu bằng 0', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillValidAddress();
      await checkout.fillSdt('1901234567');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Số điện thoại (không hợp lệ|chưa đúng)/)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.14 — Kiểm tra SĐT không cho nhập quá 10 số', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.sdtInput.fill('09012345678');
      const v = await checkout.sdtInput.inputValue();
      expect(v.length).toBeLessThanOrEqual(10);
    });

    test('TC_CKCOMMON.15 — Kiểm tra icon X xóa dữ liệu SĐT', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillSdt(VALID_PHONE);
      const clearBtn = checkout.sdtInput.locator('xpath=../button');
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
      await expect(checkout.sdtInput).toHaveValue('');
    });

  });

  // ════════════════════════ Địa chỉ lắp đặt ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Block Địa chỉ lắp đặt`, () => {

    test('TC_CKCOMMON.20 — Kiểm tra Tỉnh/Thành phố mặc định rỗng (placeholder)', async ({ page }) => {
      await openCheckout(page);
      await expect(page.getByRole('button', { name: 'Chọn tỉnh thành phố' })).toBeVisible();
    });

    test.fixme('TC_CKCOMMON.21 — Kiểm tra không chọn Tỉnh/Thành phố → báo lỗi bắt buộc', async ({ page }) => {
      // FIXME: Checkout 1-bước pre-fills Tỉnh/Phường/Đường từ server (HCM).
      // Không thể trigger "Province not selected" trên staging hiện tại.
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng chọn tỉnh|địa chỉ.*bắt buộc|chọn tỉnh/i))
        .toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.22 — Kiểm tra load danh sách Tỉnh ưu tiên HCM/HN/Đà Nẵng', async ({ page }) => {
      const checkout = await openCheckout(page);
      const dd = await checkout.openProvinceDropdown();
      const texts = await dd.locator('p').allInnerTexts();
      const top3 = texts.filter(t => t.trim()).slice(0, 3).map(t => t.trim());
      expect(top3).toEqual(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']);
    });

    test('TC_CKCOMMON.23 — Kiểm tra tìm kiếm Tỉnh theo từ khóa (contains)', async ({ page }) => {
      const checkout = await openCheckout(page);
      const dd = await checkout.openProvinceDropdown();
      await dd.getByRole('textbox', { name: 'Nhập thông tin' }).fill('Hà N');
      await expect(dd.getByText('Hà Nội', { exact: true })).toBeVisible();
      await expect(dd.getByText('Hồ Chí Minh', { exact: true })).toBeHidden();
    });

    test('TC_CKCOMMON.24 — Kiểm tra chọn Tỉnh load thêm Phường/Xã, Tên đường, Số nhà', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
      await expect(checkout.soNhaInput).toBeVisible();
    });

    test('TC_CKCOMMON.25 — Kiểm tra đổi Tỉnh/Thành phố reset Phường/Xã và Tên đường', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.selectWard('Phường Bến Thành');
      await checkout.selectProvince('Hà Nội', 'Hà N');
      await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: /Phường Bến Thành/ })).not.toBeVisible();
    });

    test.fixme('TC_CKCOMMON.27 — Kiểm tra Phường/Xã bắt buộc khi đã chọn Tỉnh', async ({ page }) => {
      // FIXME: Province = Hà Nội tự động điền Ward/Street trên staging → không trigger lỗi bắt buộc.
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.selectProvince('Hà Nội', 'Hà N');
      await checkout.fillSoNha('113');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng chọn (?:phường|xã)/i)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.28 — Kiểm tra tìm kiếm và chọn Phường/Xã', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.selectWard('Phường Bến Thành', 'Bến Thành');
      await expect(page.getByRole('button', { name: 'Chọn phường/xã' })).toContainText('Phường Bến Thành', { timeout: 10000 });
      await expect(page.getByRole('button', { name: 'Chọn tên đường' })).toBeVisible();
    });

    test('TC_CKCOMMON.32 — Kiểm tra Tên đường bắt buộc sau khi đã chọn Phường/Xã', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.selectWard('Phường Bến Thành');
      await checkout.fillSoNha('113');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng chọn tên đường|đường.*bắt buộc/i))
        .toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.33 — Kiểm tra tìm kiếm và chọn Tên đường', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.selectWard('Phường Bến Thành');
      await checkout.selectStreet('Đường Lê Lai', 'Lê Lai');
      await expect(page.locator('button[aria-label="Chọn tên đường"]')).toContainText('Lê Lai', { timeout: 8000 });
    });

    test('TC_CKCOMMON.35 — Kiểm tra Số nhà để trống → báo lỗi bắt buộc', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillHoTen(VALID_NAME);
      await checkout.fillSdt(VALID_PHONE);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.selectWard('Phường Bến Thành');
      await checkout.selectStreet('Đường Lê Lai');
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng nhập (địa chỉ|số nhà)/i)).toBeVisible({ timeout: 8000 });
    });

    test('TC_CKCOMMON.36 — Kiểm tra Số nhà không cho nhập quá 50 ký tự', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.fillSoNha('1'.repeat(60));
      const v = await checkout.soNhaInput.inputValue();
      expect(v.length).toBeLessThanOrEqual(50);
    });

    test('TC_CKCOMMON.37 — Kiểm tra Ghi chú không bắt buộc và giới hạn 100 ký tự', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectProvince('Hồ Chí Minh');
      await checkout.fillNote('N'.repeat(120));
      const v = await checkout.noteInput.inputValue();
      expect(v.length).toBeLessThanOrEqual(100);
    });

  });

  // ════════════════════════ Popup Địa chỉ hành chính cũ ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Popup Địa chỉ hành chính cũ`, () => {

    test('TC_CKCOMMON.38 — Kiểm tra hiển thị UI popup Địa chỉ hành chính cũ', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.openOldAddressPopup();
      await expect(checkout.oldAddrDialog).toBeVisible();
      await expect(checkout.oldAddrDialog.getByRole('button', { name: 'Chọn quận/huyện' })).toBeVisible();
      await expect(checkout.oldAddrConfirmButton).toBeVisible();
    });

    test('TC_CKCOMMON.39 — Kiểm tra load phân cấp và tìm kiếm trong popup ĐCHC', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.openOldAddressPopup();
      const dialog = checkout.oldAddrDialog;
      const districtBtn = dialog.getByRole('button', { name: 'Chọn quận/huyện' });
      await expect(districtBtn).toBeVisible();
      await districtBtn.click();
      const dd = page.locator('[role="dialog"][data-state="open"]').last();
      await expect(dd.getByRole('textbox', { name: 'Nhập thông tin' })).toBeVisible({ timeout: 10000 });
      expect(await dd.locator('p').count()).toBeGreaterThan(0);
      await dd.getByRole('textbox', { name: 'Nhập thông tin' }).fill('1');
      await expect(dd.locator('p').first()).toBeVisible({ timeout: 5000 });
    });

    test('TC_CKCOMMON.40 — Kiểm tra button Xác nhận disable khi chưa chọn đủ cấp', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.openOldAddressPopup();
      await expect(checkout.oldAddrConfirmButton).toBeDisabled();
    });

    test('TC_CKCOMMON.44 — Kiểm tra click Close đóng popup', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.openOldAddressPopup();
      await checkout.oldAddrCloseButton.click();
      await expect(checkout.oldAddrDialog).toBeHidden();
    });

    test.fixme('TC_CKCOMMON.45 — Kiểm tra click Xác nhận đẩy địa chỉ 2-cấp vào form', async ({ page }) => {
      // Cần địa chỉ 3-cấp cũ có mapping sang 2-cấp mới trên staging.
      const checkout = await openCheckout(page);
      await checkout.openOldAddressPopup();
    });

  });

  // ════════════════════════ PTTT & Luồng thanh toán ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Phương thức thanh toán & Luồng thanh toán`, () => {

    test('TC_CKCOMMON.49 — Kiểm tra hiển thị UI block Phương thức thanh toán', async ({ page }) => {
      const checkout = await openCheckout(page);
      const ids = await checkout.getAllPaymentMethodIds();
      expect(ids.length).toBeGreaterThan(0);
    });

    test('TC_CKCOMMON.51 — Kiểm tra > 4 PTTT có button Xem thêm', async ({ page }) => {
      const checkout = await openCheckout(page);
      await expect(checkout.xemThemButton).toBeVisible();
      await checkout.clickXemThem();
      const ids = await checkout.getAllPaymentMethodIds();
      expect(ids.length).toBeGreaterThan(4);
    });

    test('TC_CKCOMMON.52 — Kiểm tra chỉ chọn được 1 PTTT', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.selectPaymentMethod('COD-COD');
      await expect(checkout.paymentMethodRadio('COD-COD')).toBeChecked();
      await checkout.selectPaymentMethod('DOMESTIC-Online');
      await expect(checkout.paymentMethodRadio('DOMESTIC-Online')).toBeChecked();
      await expect(checkout.paymentMethodRadio('COD-COD')).not.toBeChecked();
    });

    test('TC_CKCOMMON.53 — Kiểm tra hyperlink điều khoản tại màn Thanh toán', async ({ page }) => {
      const checkout = await openCheckout(page);
      await expect(checkout.termsLink).toBeVisible();
      const href = await checkout.termsLink.getAttribute('href');
      expect(href).toContain('privacy-policy');
    });

    test('TC_CKCOMMON.59 — Kiểm tra click Thanh toán khi tất cả trường để trống', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.thanhToanButton.scrollIntoViewIfNeeded();
      await checkout.thanhToanButton.click();
      await expect(checkout.fieldError(/Vui lòng nhập họ( và)? tên/)).toBeVisible({ timeout: 8000 });
      await expect(checkout.fieldError(/Vui lòng nhập số điện thoại/)).toBeVisible();
    });

    test('TC_CKCOMMON.60 — Kiểm tra thanh toán COD điều hướng màn Hoàn tất', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
      await checkout.selectPaymentMethod('COD-COD');
      await checkout.clickThanhToan();
      await expect(page).not.toHaveURL(/\/payment/, { timeout: 20000 });
    });

    test('TC_CKCOMMON.61 — Kiểm tra thanh toán Online điều hướng cổng 3rd party', async ({ page }) => {
      const checkout = await openCheckout(page);
      await checkout.fillAllValid(VALID_NAME, VALID_PHONE, '113');
      await checkout.selectPaymentMethod('DOMESTIC-Online');
      await checkout.clickThanhToan();
      await expect(page).not.toHaveURL(/\/payment$/, { timeout: 20000 });
    });

  });

  // ════════════════════════ Màn hình Hoàn tất ════════════════════════
  test.describe(`[${serviceLabel}] TC_CKCOMMON — Màn hình Hoàn tất`, () => {

    test('TC_CKCOMMON.68 — Kiểm tra hiển thị Mã đơn hàng và hyperlink Theo dõi ĐH', async ({ page }, testInfo) => {
      await completeCOD(page);
      const complete = new DeviceOrderCompletePage(page);
      await expect(complete.orderIdText).toBeVisible({ timeout: 15000 });
      await expect(complete.trackingLink).toBeVisible();
      const orderId = await complete.getOrderId();
      expect(orderId.length).toBeGreaterThan(0);
      testInfo.annotations.push({ type: 'orderId', description: orderId });
    });

    test.fixme('TC_CKCOMMON.69 — Kiểm tra click hyperlink Theo dõi đơn hàng điều hướng đúng', async ({ page }) => {
      // FIXME: "Theo dõi ĐH" là <P> không phải <a href> — confirmed DOM inspect 2026-06-07.
      await completeCOD(page);
      const complete = new DeviceOrderCompletePage(page);
      await expect(complete.trackingLink).toBeVisible({ timeout: 15000 });
      const href = await complete.trackingLink.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(href!);
      await expect(page).not.toHaveURL(/\/completed/, { timeout: 15000 });
    });

    test('TC_CKCOMMON.70 — Kiểm tra block Thông tin khách hàng hiển thị trên màn Hoàn tất', async ({ page }) => {
      await completeCOD(page);
      await expect(page.getByText(VALID_NAME, { exact: false })).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(VALID_PHONE, { exact: false })).toBeVisible();
      await expect(page.getByText('Địa chỉ', { exact: true })).toBeVisible();
    });

    test('TC_CKCOMMON.71 — Kiểm tra trạng thái hoàn tất: COD hiển thị Chưa thanh toán', async ({ page }, testInfo) => {
      await completeCOD(page);
      const complete = new DeviceOrderCompletePage(page);
      await expect(complete.successMessage).toBeVisible({ timeout: 15000 });
      await expect(complete.codStatus).toBeVisible();
      const orderId = await complete.getOrderId();
      if (orderId) testInfo.annotations.push({ type: 'orderId', description: orderId });
    });

  });
}
