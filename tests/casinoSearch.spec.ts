import { test } from '@playwright/test';
import { CasinoLobbyPage } from '../pages/casinoLobby';
import { CASINO_SEARCH_DATA } from '../utils/data/searchData';

test.describe('Casino Lobby Game Search', () => {
  let casinoLobby: CasinoLobbyPage;

  test.beforeEach(async ({ page }) => {
    casinoLobby = new CasinoLobbyPage(page);
    await casinoLobby.goto();
  });

  test('TC-SEARCH-001: Verify user can find a specific game by its full name and launch it @Prod', { tag: '@Prod' }, async () => {
    const searchData = CASINO_SEARCH_DATA.validSearch;
    await test.step('1. Click the search icon', async () => {
      await casinoLobby.openSearch();
    });

    await test.step(`2. Type the full name of a known game: ${searchData.query}`, async () => {
      await casinoLobby.searchForGame(searchData.query);
    });

    await test.step('3. Verify search results display game tile', async () => {
      await casinoLobby.verifyGameInResults(searchData.expectedGame);
    });

    await test.step('4. Click on the game tile from results', async () => {
      await casinoLobby.clickGameTile(searchData.expectedGame);
    });

    await test.step('5. Wait for game to load', async () => {
      await casinoLobby.waitForGameToLoad(searchData.waitPattern);
    });
  });
});
