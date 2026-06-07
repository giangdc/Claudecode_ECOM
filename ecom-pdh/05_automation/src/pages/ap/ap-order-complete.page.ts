import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/base.page';

/**
 * Màn Hoàn tất đơn hàng AP — URL /checkout/{id}/completed.
 * Locators verified từ DOM thực tế (access-point-ax1800az, 2026-06-07).
 */
export class ApOrderCompletePage extends BasePage {
  readonly successMessage: Locator;
  readonly orderIdText: Locator;
  readonly codStatus: Locator;
  readonly trackingLink: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.getByText('Đơn hàng đã đăng ký thành công', { exact: false });
    this.orderIdText    = page.getByText(/Mã đơn hàng:/);
    this.codStatus      = page.getByText('Chưa thanh toán', { exact: false });
    this.trackingLink   = page.getByText('Theo dõi ĐH');
  }

  async getOrderId(): Promise<string> {
    const text = (await this.orderIdText.textContent()) ?? '';
    return text.replace(/Mã đơn hàng:?/, '').trim();
  }
}
