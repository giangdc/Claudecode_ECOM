import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ loginAsAdmin }) => {
    await loginAsAdmin();
  });

  test('Check dashboard hiển thị đúng sau khi đăng nhập', async ({ page, dashboardPage }) => {
    await dashboardPage.isLoaded();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Check đăng xuất thành công từ dashboard', async ({ page, dashboardPage }) => {
    await dashboardPage.logout();

    await expect(page).toHaveURL(/login/);
  });
});
