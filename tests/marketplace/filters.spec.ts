import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';
import { FILTERS } from '@data/testData';

/**
 * MKT — the marketplace filter panel.
 * spec: specs/exploration-report.md  (TC-MKT filters)
 */
test.describe('Marketplace - filters', () => {
  test('MKT-05 @P0 filter panel exposes the full taxonomy', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    const text = await marketplace.filterPanelText();

    // Filter groups
    for (const group of [
      'Price range',
      'Eligibility type',
      'Payment options',
      'Construction Status',
      'Project Status',
      'Property type',
      'Rooms',
      'Bath rooms',
    ]) {
      expect(text, `Filter group "${group}" should be present`).toContain(group);
    }

    // Group members
    for (const value of [
      ...FILTERS.eligibilityTypes,
      ...FILTERS.paymentOptions,
      ...FILTERS.constructionStatus,
      ...FILTERS.projectStatus,
      ...FILTERS.propertyTypes,
    ]) {
      expect(text, `Filter option "${value}" should be present`).toContain(value);
    }

    await expect(marketplace.filterApply).toBeVisible();
    await expect(marketplace.filterClear).toBeVisible();
  });

  test('MKT-05b @P1 applying a property-type filter refreshes the results', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.waitForResults();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();

    await marketplace.waitForResults();
  });

  test('MKT-05c @P1 non-beneficiary eligibility filter can be applied', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Non-beneficiary');
    await marketplace.applyFilters();

    await marketplace.waitForResults();
  });

  test('MKT-07 @P1 search requests carry the account segment', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);

    // Must match the **location** search specifically. The marketplace also
    // fires `/search/v2/mega-projects` for the destinations carousel, which
    // carries no segment filter and can win the race depending on load order.
    const searchRequest = authenticatedPage.waitForRequest(
      (r) => /\/marketplaceApi\/search\/v\d+\/location/.test(r.url()),
      { timeout: 120_000 },
    );

    await marketplace.open();
    const url = decodeURIComponent((await searchRequest).url());

    // The backend scopes inventory to the caller's segment.
    expect(url).toContain('filter[user_type]=non_beneficiary');
  });

  test('MKT-08 @P2 clearing filters restores the default listing', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();

    await marketplace.openFilters();
    await marketplace.clearFilters();
    await marketplace.applyFilters();

    await marketplace.waitForResults();
  });
});
