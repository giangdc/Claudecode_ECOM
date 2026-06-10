import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';

export type CameraStoragePackage = '3D FPT Camera Only' | '7D Only';
export type CameraCycle = '6 tháng' | '12 tháng';

/**
 * Trang chi tiết sản phẩm Camera trên staging.tongdaiwifi.vn (camera-play-4).
 * Khác AP/Smart TV: Camera có chọn Gói lưu trữ + Chu kỳ + Số lượng trước khi Mua ngay.
 * Locators verified từ DOM thực tế (camera-play-4, 2026-06-10).
 *   - Gói lưu trữ / Chu kỳ: <button> theo nhãn ("3D FPT Camera Only", "7D Only", "6 tháng", "12 tháng").
 *   - Số lượng: stepper icon-only — đúng 1 .lucide-plus và 1 .lucide-minus trên trang.
 */
export class CameraProductDetailPage extends BasePage {
  readonly productTitle: Locator;
  readonly muaNgayButton: Locator;
  readonly plusButton: Locator;
  readonly minusButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle  = page.getByRole('heading', { level: 1 });
    this.muaNgayButton = page.getByRole('button', { name: 'Mua ngay', exact: true });
    this.plusButton    = page.locator('button:has(.lucide-plus)');
    this.minusButton   = page.locator('button:has(.lucide-minus)');
  }

  async navigateToProduct(url: string): Promise<void> {
    await this.navigate(url);
    await expect(this.muaNgayButton).toBeVisible({ timeout: 15000 });
    await this.dismissCookieBanner();
  }

  async dismissCookieBanner(): Promise<void> {
    const btn = this.page.getByRole('button', { name: 'Đồng ý' });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
    }
  }

  async selectStoragePackage(name: CameraStoragePackage): Promise<void> {
    await this.clickElement(this.page.getByRole('button', { name, exact: true }));
  }

  async selectCycle(cycle: CameraCycle): Promise<void> {
    await this.clickElement(this.page.getByRole('button', { name: cycle, exact: true }));
  }

  /** Tăng số lượng từ 1 lên `qty` bằng cách bấm nút + (qty-1) lần. */
  async setQuantity(qty: number): Promise<void> {
    for (let i = 1; i < qty; i++) {
      await this.plusButton.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickMuaNgay(): Promise<void> {
    await this.clickElement(this.muaNgayButton);
    await this.page.waitForURL(/staging\.fpt\.vn\/checkout/, { timeout: 25000 });
  }
}
