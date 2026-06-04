import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';

export type PaymentMethodCode = 'DOMESTIC-Online' | 'COD-COD' | 'MOMO-Online' | 'VIETQR-Online';

/**
 * B2 — Thanh toán (Checkout Internet 3 bước).
 * Block Thông tin sản phẩm (trả sau/trả trước), PTTT, Quay lại, Thanh toán.
 * Locators verified từ DOM thực tế (gói goi-giga, 2026-06-01).
 */
export class CheckoutPaymentPage extends BasePage {
  readonly payLaterSection: Locator;     // "Thanh toán trả sau"
  readonly payUpfrontSection: Locator;   // "Thanh toán trả trước"
  readonly quayLaiButton: Locator;
  readonly thanhToanButton: Locator;
  readonly termsLink: Locator;
  readonly xemThemButton: Locator;
  readonly canThanhToanValue: Locator;

  constructor(page: Page) {
    super(page);
    this.payLaterSection   = page.getByRole('button', { name: 'Thanh toán trả sau' });
    this.payUpfrontSection = page.getByRole('button', { name: 'Thanh toán trả trước' });
    this.quayLaiButton     = page.getByText('Quay lại', { exact: true });
    this.thanhToanButton   = page.getByRole('button', { name: 'Thanh toán', exact: true });
    this.termsLink         = page.locator('a[href*="privacy-policy"]:visible').first();
    this.xemThemButton     = page.getByRole('button', { name: 'Xem thêm' });
    // "Cần thanh toán" → giá nằm ở <p> kế tiếp trong cùng block
    this.canThanhToanValue = page.getByText('Cần thanh toán', { exact: false }).locator('xpath=following::p[1]');
  }

  /** Radio gói theo số tháng (VD /1 tháng/, /3 tháng/). */
  packageRadio(cycleRegex: RegExp): Locator {
    return this.page.getByRole('radio', { name: cycleRegex });
  }

  async selectPackageByCycle(cycleRegex: RegExp): Promise<void> {
    const radio = this.packageRadio(cycleRegex);
    await radio.click();
  }

  paymentMethodRadio(code: PaymentMethodCode): Locator {
    return this.page.locator(`#payment-method-${code}`);
  }

  async selectPaymentMethod(code: PaymentMethodCode): Promise<void> {
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

  async clickQuayLai(): Promise<void> {
    await this.quayLaiButton.click();
  }

  async clickThanhToan(): Promise<void> {
    await this.thanhToanButton.scrollIntoViewIfNeeded();
    await this.thanhToanButton.click();
  }

  installationInfo(label: 'Họ tên' | 'Số điện thoại' | 'Địa chỉ'): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=following-sibling::p[1]');
  }
}
