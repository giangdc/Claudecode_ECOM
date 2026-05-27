import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // REPLACE: Cập nhật locators sau khi inspect DOM thực tế
  private readonly pageHeading = this.page.getByRole('heading').first();
  private readonly userMenuButton = this.page.getByTestId('user-menu');
  private readonly logoutButton = this.page.getByRole('menuitem', { name: 'Đăng xuất' });

  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.pageHeading).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.clickElement(this.userMenuButton);
    await this.clickElement(this.logoutButton);
  }

  async getHeadingText(): Promise<string> {
    return this.getText(this.pageHeading);
  }
}
