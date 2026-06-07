import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';

/**
 * B1 — Thông tin đăng ký (Checkout Internet 3 bước).
 * Màn checkout đầy đủ Địa chỉ lắp đặt: dùng chung cho dịch vụ Internet.
 * Locators verified từ DOM thực tế (gói goi-giga, 2026-06-01) — xem task_checkout.md.
 */
export class CheckoutRegisterPage extends BasePage {
  // ── Block Thông tin cá nhân ───────────────────────────────────────────────
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;

  // ── Block Địa chỉ lắp đặt ──────────────────────────────────────────────────
  readonly oldAddressLink: Locator;
  readonly soNhaInput: Locator;
  readonly noteInput: Locator;

  // ── Action ────────────────────────────────────────────────────────────────
  readonly tiepTucButton: Locator;
  readonly logoLink: Locator;
  readonly termsLink: Locator;

  // ── Popup "Địa chỉ hành chính cũ" ──────────────────────────────────────────
  readonly oldAddrDialog: Locator;
  readonly oldAddrConfirmButton: Locator;
  readonly oldAddrCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.locator('input[name="full_name"]');
    this.phoneInput    = page.locator('input[name="phone"]');
    this.soNhaInput    = page.locator('input[name="detailAddress"]');
    this.noteInput     = page.locator('textarea[name="note"]');

    this.oldAddressLink = page.getByText('Địa chỉ trước sáp nhập');
    // Bản desktop của "Tiếp tục" là button[type=submit] visible đầu tiên
    this.tiepTucButton  = page.locator('button[type="submit"]').filter({ hasText: 'Tiếp tục' }).first();
    this.logoLink       = page.locator('a:has(img[alt="logo"])');
    this.termsLink      = page.getByRole('link', { name: 'Chính sách xử lý dữ liệu cá nhân' }).first();

    this.oldAddrDialog        = page.getByRole('dialog', { name: 'Địa chỉ hành chính cũ' });
    this.oldAddrConfirmButton = this.oldAddrDialog.getByRole('button', { name: 'Xác nhận' });
    this.oldAddrCloseButton   = this.oldAddrDialog.getByRole('button', { name: 'Close' });
  }

  async start(url: string): Promise<void> {
    await this.navigate(url);
    await this.page.waitForSelector('input[name="full_name"]', { state: 'visible', timeout: 20000 });
    await this.dismissCookieBanner();
  }

  async dismissCookieBanner(): Promise<void> {
    const btn = this.page.getByRole('button', { name: 'Đồng ý' });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
    }
  }

  // ── Personal info ──────────────────────────────────────────────────────────
  async fillFullName(name: string): Promise<void> {
    await this.fullNameInput.fill(name);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async fillSoNha(value: string): Promise<void> {
    await this.soNhaInput.fill(value);
  }

  async fillNote(value: string): Promise<void> {
    await this.noteInput.fill(value);
  }

  // ── Address cascading dropdowns ─────────────────────────────────────────────
  /** Dialog dropdown địa chỉ inline đang MỞ (popover cũ vẫn nằm trong DOM ở data-state="closed"). */
  private get addressDropdown(): Locator {
    return this.page.locator('[role="dialog"][data-state="open"]').filter({
      has: this.page.getByRole('textbox', { name: 'Nhập thông tin' }),
    });
  }

  /** Mở dropdown qua tên button trigger, (tùy chọn) gõ từ khóa, rồi chọn option theo text. */
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

  /** Mở dropdown Tỉnh để lấy snapshot danh sách (cho test search/load). */
  async openProvinceDropdown(): Promise<Locator> {
    await this.page.getByRole('button', { name: 'Chọn tỉnh thành phố' }).click();
    const dropdown = this.addressDropdown;
    await expect(dropdown).toBeVisible();
    return dropdown;
  }

  /** Điền đủ địa chỉ hợp lệ (HCM / Phường Bến Thành / Đường Lê Lai / số nhà). */
  async fillValidAddress(soNha = '113'): Promise<void> {
    await this.selectProvince('Hồ Chí Minh', 'Hồ Chí');
    await this.selectWard('Phường Bến Thành', 'Bến Thành');
    await this.selectStreet('Đường Lê Lai', 'Lê Lai');
    await this.fillSoNha(soNha);
  }

  /** Điền toàn bộ B1 hợp lệ để qua B2. */
  async fillB1Valid(fullName: string, phone: string, soNha = '113'): Promise<void> {
    await this.fillFullName(fullName);
    await this.fillPhone(phone);
    await this.fillValidAddress(soNha);
  }

  async openOldAddressPopup(): Promise<void> {
    await this.oldAddressLink.click();
    await expect(this.oldAddrDialog).toBeVisible({ timeout: 10000 });
  }

  async clickTiepTuc(): Promise<void> {
    await this.tiepTucButton.scrollIntoViewIfNeeded();
    await this.tiepTucButton.click();
  }

  // ── Validation helpers ──────────────────────────────────────────────────────
  fieldError(pattern: RegExp): Locator {
    return this.page.locator('p').filter({ hasText: pattern });
  }

  installationInfo(label: 'Họ tên' | 'Số điện thoại' | 'Địa chỉ'): Locator {
    // Block "Thông tin lắp đặt": cặp <p>label</p><p>value</p>
    return this.page.getByText(label, { exact: true }).locator('xpath=following-sibling::p[1]');
  }
}
