import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';

export type PaymentMethod = 'DOMESTIC-Online' | 'COD-COD' | 'MOMO-Online' | 'VIETQR-Online';

export class CheckoutUltrafastPage extends BasePage {
  // ── Inputs ──────────────────────────────────────────────────────────────
  readonly phoneInput: Locator;
  readonly emailInput: Locator;

  // ── Clear buttons ────────────────────────────────────────────────────────
  readonly clearPhoneButton: Locator;

  // ── Payment method radio buttons ─────────────────────────────────────────
  readonly ptttATM: Locator;
  readonly ptttCOD: Locator;
  readonly ptttMomo: Locator;
  readonly ptttVietQR: Locator;

  // ── Action buttons ───────────────────────────────────────────────────────
  readonly tiepTucButton: Locator;
  readonly thanhToanButton: Locator;

  // ── Navigation ───────────────────────────────────────────────────────────
  readonly quayLaiLink: Locator;
  readonly fptLogoLink: Locator;
  readonly termsLink: Locator;

  // ── Content blocks ────────────────────────────────────────────────────────
  readonly productNameText: Locator;
  readonly cycleLabel: Locator;
  readonly totalAmountLarge: Locator;
  readonly totalAmountSidebar: Locator;
  readonly canThanhToanLabel: Locator;
  readonly thongTinCaNhanSection: Locator;
  readonly thongTinKhachHangSection: Locator;
  readonly thongTinThanhToanSection: Locator;

  constructor(page: Page) {
    super(page);

    this.phoneInput = page.locator('input[name="phone"]');
    this.emailInput = page.locator('input[name="email"]');
    this.clearPhoneButton = page.getByRole('button', { name: 'Clear' }).first();

    this.ptttATM    = page.locator('#payment-method-DOMESTIC-Online');
    this.ptttCOD    = page.locator('#payment-method-COD-COD');
    this.ptttMomo   = page.locator('#payment-method-MOMO-Online');
    this.ptttVietQR = page.locator('#payment-method-VIETQR-Online');

    // .last() vì trang có 2 bản (desktop + mobile): desktop button là bản cuối
    this.tiepTucButton   = page.locator('button[type="submit"]').filter({ hasText: 'Tiếp tục' }).last();
    this.thanhToanButton = page.locator('button[type="submit"]').filter({ hasText: 'Thanh toán' }).last();

    this.quayLaiLink = page.getByRole('link', { name: 'Quay lại' });
    this.fptLogoLink = page.locator('a:has(img[alt="logo"])');
    // .last() vì có 2 bản terms (mobile ẩn + desktop hiện): lấy bản desktop cuối
    this.termsLink   = page.locator('a[href*="privacy-policy"]').last();

    this.productNameText          = page.getByText('gói hyperfast 2', { exact: false });
    this.cycleLabel               = page.getByText(/Chu kỳ:/);
    this.totalAmountLarge         = page.locator('.text-\\[32px\\]').first();
    this.totalAmountSidebar       = page.locator('.text-2xl.font-bold').first();
    this.canThanhToanLabel        = page.getByText('Cần thanh toán', { exact: false }).first();
    this.thongTinCaNhanSection    = page.getByRole('button', { name: 'Thông tin cá nhân' });
    this.thongTinKhachHangSection = page.getByRole('button', { name: 'Thông tin khách hàng' });
    this.thongTinThanhToanSection = page.getByRole('button', { name: 'Thông tin thanh toán' });
  }

  async dismissCookieBanner(): Promise<void> {
    const btn = this.page.getByRole('button', { name: 'Đồng ý' });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
    }
  }

  async fillPhone(phone: string): Promise<void> {
    await expect(this.phoneInput).toBeVisible({ timeout: 10000 });
    await this.phoneInput.focus();
    await this.phoneInput.selectText();
    await this.phoneInput.pressSequentially(phone, { delay: 30 });
    await this.phoneInput.blur();
  }

  async selectPaymentMethod(method: PaymentMethod): Promise<void> {
    const btn = this.page.locator(`#payment-method-${method}`);
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async clickTiepTuc(): Promise<void> {
    // requestSubmit() kích hoạt React form validation + submit (khác btn.click() bỏ qua validation)
    await this.page.evaluate(() => {
      const phoneInput = document.querySelector('input[name="phone"]');
      const form = phoneInput?.closest('form');
      if (form) (form as HTMLFormElement).requestSubmit();
    });
  }

  async getPhoneValidationError(): Promise<string> {
    const error = this.page.locator('p').filter({ hasText: /Vui lòng nhập số điện thoại|Số điện thoại chưa đúng/ });
    await expect(error).toBeVisible({ timeout: 5000 });
    return (await error.textContent()) ?? '';
  }

  async isPhoneInputInvalid(): Promise<boolean> {
    const cls = await this.phoneInput.getAttribute('aria-invalid') ?? '';
    if (cls === 'true') return true;
    const wrapper = this.phoneInput.locator('..').locator('..');
    const wrapperClass = await wrapper.getAttribute('class') ?? '';
    return wrapperClass.includes('border-red') || wrapperClass.includes('destructive');
  }

  async getProductInfo(): Promise<{ name: string; cycle: string; amount: string }> {
    const name   = (await this.productNameText.first().textContent() ?? '').trim();
    const cycle  = (await this.cycleLabel.first().textContent() ?? '').trim();
    const amount = (await this.totalAmountLarge.textContent() ?? '').trim();
    return { name, cycle, amount };
  }

  async getAllPaymentMethodIds(): Promise<string[]> {
    await this.page.waitForSelector('[id^="payment-method-"]', { timeout: 10000 });
    const paymentBtns = this.page.locator('[id^="payment-method-"]');
    const count = await paymentBtns.count();
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      const id = await paymentBtns.nth(i).getAttribute('id');
      if (id) ids.push(id);
    }
    return ids;
  }

  async getMaxPhoneLength(): Promise<number> {
    const maxLen = await this.phoneInput.getAttribute('maxlength');
    return maxLen ? parseInt(maxLen, 10) : -1;
  }
}
