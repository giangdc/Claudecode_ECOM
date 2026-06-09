import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return (await locator.textContent()) ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.selectOption(value);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
