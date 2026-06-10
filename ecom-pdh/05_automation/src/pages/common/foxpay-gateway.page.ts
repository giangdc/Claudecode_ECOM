import { Page, Locator, expect } from '@playwright/test';

/**
 * Cổng thanh toán online FoxPay (portal-v2-staging.foxpay.vn) — thẻ nội địa qua NAPAS.
 * Đến đây bằng redirect sau khi chọn PTTT "DOMESTIC-Online" + click Thanh toán trên màn checkout.
 *
 * Luồng thực tế (verified 2026-06-10):
 *   /payment/domestic/card/loading/5s...  (trang "Đang kết nối ngân hàng")
 *     → /payment/domestic/card             (form nhập thẻ: số thẻ, tên, ngày hiệu lực)
 *     → "Đang kết nối với ngân hàng thanh toán..."  (loading)
 *     → trang NAPAS (nhập OTP) → "Tiếp tục"
 *     → "Giao dịch thành công" → tự quay về merchant /completed
 *
 * Thẻ test NAPAS: 9704 0000 0000 0018, NGUYEN VAN A, ngày hiệu lực 03/07, OTP "otp".
 */
export interface DomesticCard {
  cardNumber: string;   // có/không khoảng trắng đều được
  cardName:   string;
  issueDate:  string;   // MM/YY (vd '03/07')
  otp:        string;   // OTP NAPAS sandbox (vd 'otp')
}

export class FoxpayGatewayPage {
  readonly cardNumberInput: Locator;
  readonly cardNameInput:   Locator;
  readonly issueDateInput:  Locator;
  readonly payButton:       Locator;
  readonly otpInput:        Locator;
  readonly continueButton:  Locator;

  constructor(private readonly page: Page) {
    this.cardNumberInput = page.locator('#card-number');
    this.cardNameInput   = page.locator('#card-name');
    this.issueDateInput  = page.locator('#issue-date');
    this.payButton       = page.locator('button', { hasText: 'Thanh toán' }).last();
    this.otpInput        = page.locator('#napasOtpCode');
    this.continueButton  = page.getByRole('button', { name: /Tiếp tục/i });
  }

  /** Chờ qua trang loading/5s để tới form nhập thẻ thật. */
  async waitForCardForm(): Promise<void> {
    await this.page.waitForURL(
      u => /foxpay\.vn/.test(u.href) && !/\/loading\//.test(u.href),
      { timeout: 30000 },
    );
    await expect(this.cardNumberInput).toBeVisible({ timeout: 15000 });
  }

  /** Điền thẻ nội địa + submit. */
  async fillCardAndSubmit(card: DomesticCard): Promise<void> {
    await this.cardNumberInput.fill(card.cardNumber.replace(/\s/g, ''));
    await this.cardNameInput.fill(card.cardName);
    await this.issueDateInput.fill(card.issueDate);
    await expect(this.payButton).toBeEnabled({ timeout: 8000 });
    await this.payButton.click();
  }

  /** Chờ trang NAPAS hiện ô OTP, nhập OTP, bấm Tiếp tục. */
  async submitOtp(otp: string): Promise<void> {
    await expect(this.otpInput).toBeVisible({ timeout: 35000 });
    await this.otpInput.fill(otp);
    await this.continueButton.click();
  }

  /** Chạy trọn luồng thẻ nội địa: form → submit → OTP → thành công. */
  async payDomestic(card: DomesticCard): Promise<void> {
    await this.waitForCardForm();
    await this.fillCardAndSubmit(card);
    await this.submitOtp(card.otp);
    await expect(this.page.getByText('Giao dịch thành công', { exact: false }))
      .toBeVisible({ timeout: 30000 });
  }
}
