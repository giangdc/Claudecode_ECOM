import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private cycleButton(cycle: '1 tháng' | '3 tháng' | '6 tháng' | '12 tháng') {
    return this.page.getByRole('button', { name: cycle });
  }

  private get muaNgayButton() {
    return this.page.getByRole('button', { name: 'Mua ngay' });
  }

  private get registerLink() {
    return this.page.locator('a[href*="checkout/register"]').first();
  }

  get productTitle() {
    return this.page.getByRole('heading', { level: 1 });
  }

  async selectCycle(cycle: '1 tháng' | '3 tháng' | '6 tháng' | '12 tháng'): Promise<void> {
    await expect(this.cycleButton(cycle)).toBeVisible();
    await this.cycleButton(cycle).click();
  }

  async clickMuaNgay(): Promise<void> {
    await expect(this.muaNgayButton).toBeVisible();
    await this.muaNgayButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCheckoutUrl(cycle: number = 1): Promise<string> {
    const href = await this.registerLink.getAttribute('href');
    if (!href) throw new Error('Checkout register link not found');
    return href.replace(/month=\d+/, `month=${cycle}`);
  }
}
