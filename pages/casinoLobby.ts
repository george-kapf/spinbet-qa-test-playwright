import { type Page, type Locator, expect } from '@playwright/test';

export class CasinoLobbyPage {
  readonly page: Page;
  readonly searchIcon: Locator;
  readonly searchInput: Locator;
  readonly searchGame: (gameName: string) => Locator;
  readonly gameLauncher: Locator;
  readonly gameBox: Locator;
  readonly loadingBar: Locator;
  readonly gameCanvas: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search elements - based on browser investigation
    this.searchIcon = page.getByTestId('search-button');
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.searchGame = (gameName: string) => page.getByRole('link', { name: gameName, exact: true });
    this.gameLauncher = page.locator('#game_launcher_frame_1 div');
    this.gameBox = page.locator('iframe[name="game-launcher-by-url"]');
    this.loadingBar = this.gameBox.contentFrame().locator('#loadingBar');
    this.gameCanvas = this.gameBox.contentFrame().locator('canvas');
  }

  async goto() {
    await this.page.goto('/casino');
  }

  async openSearch() {
    await this.searchIcon.click();
    await expect(this.searchInput).toBeVisible({ timeout: 5000 });
  }

  async searchForGame(query: string) {
    await this.searchInput.fill(query);
  }

  async verifyGameInResults(gameName: string) {
    await expect(this.searchGame(gameName)).toBeVisible({ timeout: 60_000 });
  }

  async clickGameTile(gameName: string) {
    await this.searchGame(gameName).click();
  }

  async verifyNoResults() {
    await expect(this.page.getByText('No results found').first()).toBeVisible({ timeout: 10_000 });
  }

  async waitForGameToLoad(urlPattern: RegExp) {
    await this.page.waitForURL(urlPattern);
    await expect(this.gameLauncher).toBeVisible({ timeout: 30_000 });
    await expect(this.loadingBar).toBeVisible({ timeout: 60_000 });
    await expect(this.loadingBar).toBeHidden({ timeout: 30_000 });
    await expect(this.gameCanvas).toBeVisible({ timeout: 30_000 });
  }
}
