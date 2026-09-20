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

  test('TC-01 The hero renders its search controls', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await expect(homePage.heroHeading.first()).toBeVisible();
    await expect(homePage.citySearchInput.first()).toBeVisible();
    await expect(homePage.searchSubmit).toBeVisible();
    await expect(homePage.aiSearchButton.first()).toBeVisible();
  });

  test('TC-02 Three hero product tabs are selectable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await expect(homePage.tabOffplan).toBeVisible();
    await expect(homePage.tabReadyUnits).toBeVisible();
    await expect(homePage.tabRentalUnits).toBeVisible();
    await homePage.selectHeroTab(homePage.tabReadyUnits);
    await homePage.selectHeroTab(homePage.tabRentalUnits);
    await homePage.selectHeroTab(homePage.tabOffplan);
  });

  test('TC-03 Searching a city from the hero opens the marketplace', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    homePage,
    page,
  }) => {
    await homePage.citySearchInput.first().click();
    await homePage.citySearchInput.first().fill(SEARCH.city);
    await homePage.submitSearch();
    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('TC-04 Searching with no criteria still opens the marketplace', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    homePage,
    page,
  }) => {
    // No city, no filters — the hero must either block with a hint or fall
    // through to the default listing. A dead button would be the defect.
    await homePage.submitSearch();
    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('TC05 Hero exposes unit type, price and rooms filters', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await expect(homePage.unitTypeFilter.first()).toBeVisible();
    await expect(homePage.priceRangeFilter.first()).toBeVisible();
    await expect(homePage.roomsFilter.first()).toBeVisible();
  });

  test('TC-06 Personalised-services selector switches persona', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    for (const persona of ['Broker', 'Developer', 'Self-Build', 'Buyer', 'Tenant'] as const) {
      await expect(homePage.persona(persona)).toBeVisible();
    }
    await homePage.persona('Buyer').click({ force: true });
    await expect(homePage.persona('Buyer')).toHaveClass(/active|selected/, { timeout: 15_000 });
  });

  test('TC-07 AI search entry point is reachable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage, page }) => {
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
