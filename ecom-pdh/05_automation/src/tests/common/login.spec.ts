import { test, expect } from '../../fixtures/base.fixture';
import { TestDataGenerator } from '../../utils/test-data';
import { config } from '../../utils/env.config';

test.describe('Đăng nhập', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${config.baseUrl}/login`);
  });

  test('Check đăng nhập thành công với tài khoản hợp lệ', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.login(config.adminEmail, config.adminPassword);

    await dashboardPage.isLoaded();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Check đăng nhập thất bại khi nhập sai mật khẩu', async ({ loginPage }) => {
    await loginPage.login(config.adminEmail, 'sai_mat_khau_123');

    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('Check đăng nhập thất bại khi để trống email', async ({ loginPage }) => {
    await loginPage.login('', 'AnyPassword@123');

    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('Check đăng nhập thất bại khi email không tồn tại', async ({ loginPage }) => {
    const fakeEmail = TestDataGenerator.generateEmail('notexist');
    await loginPage.login(fakeEmail, 'AnyPassword@123');

    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });
});
