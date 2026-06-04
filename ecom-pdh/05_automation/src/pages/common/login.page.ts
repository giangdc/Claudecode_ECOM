import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // REPLACE: Cập nhật locators sau khi inspect DOM thực tế
  private readonly emailInput = this.page.getByLabel('Email');
  private readonly passwordInput = this.page.getByLabel('Mật khẩu');
  private readonly loginButton = this.page.getByRole('button', { name: 'Đăng nhập' });
  private readonly errorMessage = this.page.getByRole('alert');
  private readonly forgotPasswordLink = this.page.getByRole('link', { name: 'Quên mật khẩu' });

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }
}
