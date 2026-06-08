import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Trang chi tiết sản phẩm AP (Access Point) trên staging.tongdaiwifi.vn.
 * Locators verified từ DOM thực tế (access-point-ax1800az, 2026-06-07).
 */
export class DeviceProductDetailPage extends BasePage {
  readonly productTitle: Locator;
  readonly muaNgayButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle  = page.getByRole('heading', { level: 1 });
    this.muaNgayButton = page.getByRole('button', { name: 'Mua ngay' });
  }

  async navigateToProduct(url: string): Promise<void> {
    await this.navigate(url);
    await expect(this.muaNgayButton).toBeVisible({ timeout: 15000 });
  }

  async clickMuaNgay(): Promise<void> {
    await this.clickElement(this.muaNgayButton);
    await this.page.waitForURL(/staging\.fpt\.vn\/checkout/, { timeout: 20000 });
  }
}
