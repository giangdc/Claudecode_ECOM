import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type DevicePaymentMethodCode = 'COD-COD' | 'DOMESTIC-Online' | 'MOMO-Online' | 'VIETQR-Online';

/**
 * Màn checkout thiết bị (AP / Smart TV / Camera) — page object DÙNG CHUNG — 1 bước (URL /register → redirect thẳng /payment).
 * Gồm block TTKH (form nhập liệu), Địa chỉ, PTTT, nút Thanh toán, nút Quay lại.
 * Locators verified từ DOM thực tế (access-point-ax1800az, 2026-06-07).
 */
export class DeviceCheckoutPage extends BasePage {
  // ── Block Thông tin khách hàng ─────────────────────────────────────────────
  readonly hoTenInput: Locator;
  readonly sdtInput: Locator;

  // ── Block Địa chỉ lắp đặt ─────────────────────────────────────────────────
  readonly soNhaInput: Locator;
  readonly deliveryLabel: Locator;

  // ── Block PTTT ─────────────────────────────────────────────────────────────
  readonly xemThemButton: Locator;

  // ── Actions ────────────────────────────────────────────────────────────────
  readonly thanhToanButton: Locator;
  readonly quayLaiLink: Locator;
  readonly logoLink: Locator;

  constructor(page: Page) {
    super(page);
    this.hoTenInput    = page.locator('input[name="full_name"]');
    this.sdtInput      = page.locator('input[name="phone"]');
    this.soNhaInput    = page.locator('input[name="detailAddress"]');
    this.deliveryLabel = page.getByText('Thời gian giao hàng dự kiến từ 3 đến 7 ngày', { exact: false });
    this.xemThemButton   = page.getByRole('button', { name: 'Xem thêm' });
    this.thanhToanButton = page.getByRole('button', { name: 'Thanh toán', exact: true });
    this.quayLaiLink     = page.getByRole('link', { name: 'Quay lại' });
    this.logoLink        = page.locator('a:has(img[alt="logo"])').first();

    this.noteInput           = page.getByLabel('Ghi chú');
    this.oldAddressLink      = page.getByText('Địa chỉ trước sáp nhập');
    this.oldAddrDialog       = page.getByRole('dialog', { name: 'Địa chỉ hành chính cũ' });
    this.oldAddrConfirmButton = this.oldAddrDialog.getByRole('button', { name: 'Xác nhận' });
    this.oldAddrCloseButton  = this.oldAddrDialog.getByRole('button', { name: 'Close' });
    this.termsLink           = page.locator('a[href*="privacy-policy"]:visible').first();
  }

  async start(url: string): Promise<void> {
    await this.navigate(url);
    await this.page.waitForURL(/\/payment/, { timeout: 20000 });
    await this.dismissCookieBanner();
    await this.page.waitForSelector('input[name="full_name"]', { state: 'visible', timeout: 15000 });
  }

  async dismissCookieBanner(): Promise<void> {
    const btn = this.page.getByRole('button', { name: 'Đồng ý' });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
    }
  }

  // ── Personal info ──────────────────────────────────────────────────────────
  async fillHoTen(value: string): Promise<void> {
    await this.hoTenInput.fill(value);
  }

  async fillSdt(value: string): Promise<void> {
    await this.sdtInput.fill(value);
  }

  async fillSoNha(value: string): Promise<void> {
    await this.soNhaInput.fill(value);
  }

  // ── Address cascading dropdowns (same UI pattern as Internet register) ──────
  private get addressDropdown(): Locator {
    return this.page.locator('[role="dialog"][data-state="open"]').filter({
      has: this.page.getByRole('textbox', { name: 'Nhập thông tin' }),
    });
  }

  private async pickFromDropdown(triggerName: string, optionText: string, keyword?: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: triggerName });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    const dropdown = this.addressDropdown;
    await expect(dropdown).toBeVisible({ timeout: 15000 });
    if (keyword) {
      await dropdown.getByRole('textbox', { name: 'Nhập thông tin' }).fill(keyword);
      await expect(dropdown.getByText(optionText, { exact: true }).first()).toBeVisible({ timeout: 10000 });
    }
    await dropdown.getByText(optionText, { exact: true }).first().click();
  }

  async selectProvince(optionText: string, keyword?: string): Promise<void> {
    await this.pickFromDropdown('Chọn tỉnh thành phố', optionText, keyword);
  }

  async selectWard(optionText: string, keyword?: string): Promise<void> {
    await this.pickFromDropdown('Chọn phường/xã', optionText, keyword);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async selectStreet(optionText: string, keyword?: string): Promise<void> {
    await this.pickFromDropdown('Chọn tên đường', optionText, keyword);
  }

  async fillValidAddress(soNha = '113'): Promise<void> {
    await this.selectProvince('Hồ Chí Minh', 'Hồ Chí');
    await this.selectWard('Phường Bến Thành', 'Bến Thành');
    await this.selectStreet('Đường Lê Lai', 'Lê Lai');
    await this.fillSoNha(soNha);
  }

  /** Điền toàn bộ thông tin hợp lệ để có thể bấm Thanh toán. */
  async fillAllValid(hoTen: string, sdt: string, soNha = '113'): Promise<void> {
    await this.fillHoTen(hoTen);
    await this.fillValidAddress(soNha);
    // SĐT điền sau address để tránh bị clear bởi re-render Province/Ward/Street
    await this.fillSdt(sdt);
  }

  // ── Payment method ─────────────────────────────────────────────────────────
  paymentMethodRadio(code: DevicePaymentMethodCode): Locator {
    return this.page.locator(`#payment-method-${code}`);
  }

  async selectPaymentMethod(code: DevicePaymentMethodCode): Promise<void> {
    const radio = this.paymentMethodRadio(code);
    await expect(radio).toBeVisible();
    await radio.click();
  }

  async getAllPaymentMethodIds(): Promise<string[]> {
    await this.page.waitForSelector('[id^="payment-method-"]', { timeout: 10000 });
    return this.page.locator('[id^="payment-method-"]').evaluateAll(
      els => els.map(e => (e as HTMLElement).id),
    );
  }

  async clickXemThem(): Promise<void> {
    if (await this.xemThemButton.isVisible().catch(() => false)) {
      await this.xemThemButton.click();
    }
  }

  // ── Ghi chú & Old address ──────────────────────────────────────────────────
  readonly noteInput: Locator;
  readonly oldAddressLink: Locator;
  readonly oldAddrDialog: Locator;
  readonly oldAddrConfirmButton: Locator;
  readonly oldAddrCloseButton: Locator;
  readonly termsLink: Locator;

  // ── Submit ─────────────────────────────────────────────────────────────────
  async clickThanhToan(): Promise<void> {
    await this.thanhToanButton.scrollIntoViewIfNeeded();
    await this.thanhToanButton.click();
  }

  // ── TTKH section (region containing form) ─────────────────────────────────
  get ttkhRegion(): Locator {
    return this.page.getByRole('region', { name: 'Thông tin khách hàng' });
  }

  // ── Validation & helpers (dùng cho CKCOMMON tests) ────────────────────────
  fieldError(pattern: RegExp): Locator {
    return this.page.locator('p').filter({ hasText: pattern });
  }

  async fillNote(value: string): Promise<void> {
    await this.noteInput.fill(value);
  }

  async openProvinceDropdown(): Promise<Locator> {
    await this.page.getByRole('button', { name: 'Chọn tỉnh thành phố' }).click();
    const dropdown = this.page.locator('[role="dialog"][data-state="open"]').filter({
      has: this.page.getByRole('textbox', { name: 'Nhập thông tin' }),
    });
    await expect(dropdown).toBeVisible();
    return dropdown;
  }

  async openOldAddressPopup(): Promise<void> {
    await this.oldAddressLink.click();
    await expect(this.oldAddrDialog).toBeVisible({ timeout: 10000 });
  }
}
