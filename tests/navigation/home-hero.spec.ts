import { test, expect } from '@fixtures/pages.fixture';
import { SEARCH } from '@data/testData';

/**
 * HOM — home page hero search and personalised-services selector.
 * spec: specs/functional-test-design.md § 4
 *
 * The home page is the server-rendered marketing site (not the Angular app) and
 * is fully public, so these run on the plain `page` fixture with no login.
 * Complements NAV-01…08, which cover the header, mega-menus and footer.
 */
test.describe('Home page - hero search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.expectLoaded();
  });

  test('HOM-00 @P1 @smoke the hero renders its search controls', async ({ homePage }) => {
    await expect(homePage.heroHeading.first()).toBeVisible();
    await expect(homePage.citySearchInput.first()).toBeVisible();
    await expect(homePage.searchSubmit).toBeVisible();
    await expect(homePage.aiSearchButton.first()).toBeVisible();
  });

  test('HOM-01 @P1 the three hero product tabs are selectable', async ({ homePage }) => {
    await expect(homePage.tabOffplan).toBeVisible();
    await expect(homePage.tabReadyUnits).toBeVisible();
    await expect(homePage.tabRentalUnits).toBeVisible();

    await homePage.selectHeroTab(homePage.tabReadyUnits);
    await homePage.selectHeroTab(homePage.tabRentalUnits);
    await homePage.selectHeroTab(homePage.tabOffplan);
  });

  test('HOM-02 @P0 searching a city from the hero opens the marketplace', async ({
    homePage,
    page,
  }) => {
    await homePage.citySearchInput.first().click();
    await homePage.citySearchInput.first().fill(SEARCH.city);

    await homePage.submitSearch();

    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('HOM-03 @P2 searching with no criteria still opens the marketplace', async ({
    homePage,
    page,
  }) => {
    // No city, no filters — the hero must either block with a hint or fall
    // through to the default listing. A dead button would be the defect.
    await homePage.submitSearch();

    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('HOM-04 @P2 the hero exposes unit type, price and rooms filters', async ({ homePage }) => {
    await expect(homePage.unitTypeFilter.first()).toBeVisible();
    await expect(homePage.priceRangeFilter.first()).toBeVisible();
    await expect(homePage.roomsFilter.first()).toBeVisible();
  });

  test('HOM-09 @P2 the personalised-services selector switches persona', async ({ homePage }) => {
    for (const persona of ['Broker', 'Developer', 'Self-Build', 'Buyer', 'Tenant'] as const) {
      await expect(homePage.persona(persona)).toBeVisible();
    }

    await homePage.persona('Buyer').click({ force: true });
    await expect(homePage.persona('Buyer')).toHaveClass(/active|selected/, { timeout: 15_000 });
  });

  test('HOM-07 @P1 the AI search entry point is reachable', async ({ homePage, page }) => {
    await homePage.aiSearchButton.first().click({ force: true });

    // The control either opens an AI surface in place or routes to one; either
    // way the page must respond rather than sit inert.
    await expect
      .poll(
        async () => {
          const url = page.url();
          const body = await page.locator('body').innerText();
          return /ai/i.test(url) || /AI Search|ask|اسأل/i.test(body);
        },
        { timeout: 30_000 },
      )
      .toBeTruthy();
  });
});
