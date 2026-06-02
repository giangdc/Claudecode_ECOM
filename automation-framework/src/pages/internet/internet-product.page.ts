import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';

/** Trang chi tiết gói Internet (tongdaiwifi) — entry vào luồng checkout 3 bước. */
export class InternetProductPage extends BasePage {
  readonly dangKyNgayLink: Locator;

  constructor(page: Page) {
    super(page);
    this.dangKyNgayLink = page.locator('a:has-text("Đăng ký ngay")').first();
  }

  /**
   * "Đăng ký ngay" là <a> 0-size bọc trong button sticky (không click trực tiếp ổn định headless).
   * → Lấy href (entry checkout) rồi điều hướng — vẫn xác minh đúng link đăng ký.
   */
  async clickDangKyNgay(): Promise<void> {
    await expect(this.dangKyNgayLink).toHaveAttribute('href', /checkout\/register/, { timeout: 15000 });
    const href = await this.dangKyNgayLink.getAttribute('href');
    await this.page.goto(href!);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
