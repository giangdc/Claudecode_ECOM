import { test as baseTest } from './base.fixture';
import { config } from '../utils/env.config';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type AuthFixtures = {
  loginAsAdmin: () => Promise<void>;
};

export const test = baseTest.extend<AuthFixtures>({
  loginAsAdmin: async ({ page }, use) => {
    const loginAction = async () => {
      await page.goto(`${config.baseUrl}/login`);
      const loginPage = new LoginPage(page);
      await loginPage.login(config.adminEmail, config.adminPassword);
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.isLoaded();
    };
    await use(loginAction);
  },
});

export { expect } from '@playwright/test';
