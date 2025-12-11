import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login';

setup('GLOBAL SETUP - Login and save auth state to be used in tests', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.openLoginModal();
  await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
  await loginPage.verifyLoginSuccess();

  await page.context().storageState({ path: './.auth/user.json' });
});
