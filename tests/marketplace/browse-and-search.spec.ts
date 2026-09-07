import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';
import { SEARCH, SORT_OPTIONS } from '@data/testData';

/**
 * MKT — browsing, searching and sorting the marketplace.
 * spec: specs/exploration-report.md  (TC-MKT)
 */
test.describe('Marketplace - browse & search', () => {
  test('MKT-01 @P0 @smoke marketplace loads with results and map', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();

    await marketplace.expectLoaded();
    await expect(marketplace.viewMapButton).toBeVisible();
    await marketplace.waitForResults();
  });

  test('MKT-02 @P1 Projects and Units tabs switch the result set', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    // Both tabs render the same card element, so the summary line is the signal.
    await marketplace.switchToUnits();
    expect(await marketplace.resultsSummaryText()).toMatch(/Unit Models/i);
    expect(await marketplace.resultCount()).toBeGreaterThan(0);

    await marketplace.switchToProjects();
    expect(await marketplace.resultsSummaryText()).toMatch(/Projects/i);
    expect(await marketplace.resultCount()).toBeGreaterThan(0);
  });

  test('MKT-03 @P0 location search returns matching suggestions', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    const suggestions = await marketplace.searchSuggestions(SEARCH.city);

    expect(suggestions.length, 'Expected autocomplete suggestions').toBeGreaterThan(0);
    expect(suggestions.some((s) => new RegExp(SEARCH.city, 'i').test(s))).toBeTruthy();
  });

  test('MKT-04 @P1 sort modal exposes all six sort options', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    const options = await marketplace.sortOptions();

    for (const expected of SORT_OPTIONS) {
      expect(options, `Sort option "${expected}" should be offered`).toContain(expected);
    }
  });

  test('MKT-04b @P1 sorting by price low to high re-runs the search', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.waitForResults();

    await marketplace.sortBy('Price: Low to high');

    await marketplace.waitForResults();
  });
});
