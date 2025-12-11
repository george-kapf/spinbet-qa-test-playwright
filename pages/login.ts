import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.usernameInput = page.getByRole('textbox', { name: 'e.g. John Doe' });
    this.passwordInput = page.getByRole('textbox', { name: 'Min 6 characters' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.successHeading = page.getByRole('heading', { name: 'Login successful' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async openLoginModal() {
    await this.loginButton.click();
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, pass: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.signInButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.successHeading).toBeVisible({ timeout: 30_000 });
  }
}
