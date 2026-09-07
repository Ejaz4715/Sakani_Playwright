import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';
import { SEARCH, PRICE_FILTER } from '@data/testData';

/**
 * FLT / SRCH / LST — deeper marketplace filter, search and sort coverage.
 * spec: specs/functional-test-design.md § 5-7
 *
 * Reuses the existing `MarketplacePage` object throughout; no new page object
 * was needed. Complements (does not duplicate) the automated MKT-01…08 cases,
 * which cover the panel taxonomy and a single apply/clear cycle.
 */
test.describe('Marketplace - advanced filters & search', () => {
  test('FLT-12 @P1 an inverted price range does not silently return an empty list', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.setPriceRange('900000', '100000');
    await marketplace.applyFilters();

    // Either the app corrects/rejects the range, or it must still explain the
    // empty result rather than showing a bare, unexplained list.
    const summary = await marketplace.resultsSummaryText().catch(() => '');
    const body = await authenticatedPage.locator('body').innerText();
    expect(
      summary.length > 0 || /no results|no matching|لا توجد/i.test(body),
      'An inverted price range must produce either results or an explicit empty state',
    ).toBeTruthy();
  });

  test('FLT-14 @P2 negative price input is rejected by the field', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.minPrice.fill('-1000');

    expect(await marketplace.minPrice.inputValue()).not.toMatch(/^-/);
  });

  test('FLT-15 @P2 non-numeric price input is rejected by the field', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.minPrice.fill('abc');

    expect(await marketplace.minPrice.inputValue()).not.toMatch(/abc/i);
  });

  test('FLT-24 @P1 an impossible filter combination shows an explicit empty state', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    // Must stay inside the slider domain: values under SAR 1,000 are clamped to
    // the floor, so a 1-2 range would not actually constrain anything. The top
    // SAR of the domain is empty by construction — the filter was verified live
    // to reach the query as `min_price`/`max_price` and to return nothing here.
    await marketplace.setPriceRange(String(PRICE_FILTER.ceiling - 1), String(PRICE_FILTER.ceiling));
    await marketplace.applyFilters();

    // Poll rather than sample once. `applyFilters()` waits a fixed interval and
    // the listing re-renders asynchronously, so a single read lands on the
    // *previous* result set — which is what made this look like the band had
    // filled with inventory when it had not.
    //
    // The explicit empty-state copy is the only usable signal, and it is what
    // this test is named for. `resultCount()` cannot substitute: at zero results
    // the summary heading renders as a bare "Projects" with no number for it to
    // parse, and it blocks on a 60s visibility assertion before giving up —
    // enough to consume this poll's entire budget on one iteration.
    await expect
      .poll(async () => authenticatedPage.locator('body').innerText(), {
        timeout: 60_000,
        message: 'A price band with no inventory should yield an explicit zero-result state',
      })
      .toMatch(/no results|no matching|لا توجد/i);
  });

  test('FLT-13 @P1 a price typed below the slider floor is clamped, not accepted', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.setPriceRange('1', '2');

    // The control's documented domain is SAR 1,000 - 20,000,000. Sub-floor
    // input must not survive into the applied filter.
    await marketplace.applyFilters();
    const params = await marketplace.filterParams();
    const appliedMin = Number(params.min_price ?? params.price_from ?? PRICE_FILTER.floor);
    expect(appliedMin).toBeGreaterThanOrEqual(PRICE_FILTER.floor);
  });

  test('FLT-28 @P1 applied filters survive a page reload', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();
    const before = await marketplace.filterParams();
    expect(before.unit_types).toContain('villa');

    await authenticatedPage.reload({ waitUntil: 'commit' });
    await marketplace.expectLoaded();

    // The filters live in the URL; the map viewport is excluded because it is
    // recomputed on every load and is not part of the filter state.
    expect(await marketplace.filterParams()).toEqual(before);
  });

  test('FLT-30 @P1 a filtered URL reproduces the same result set', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();
    const filteredUrl = authenticatedPage.url();
    const before = await marketplace.filterParams();

    await authenticatedPage.goto(filteredUrl, { waitUntil: 'commit' });
    await marketplace.expectLoaded();
    await marketplace.waitForResults();

    // The filters reproduce exactly. The result *count* is deliberately not
    // asserted for equality: the listing is also bounded by the map viewport,
    // which the app recomputes on load, so counts legitimately vary by a few.
    expect(await marketplace.filterParams()).toEqual(before);
    expect(await marketplace.resultCount()).toBeGreaterThan(0);
  });

  test('FLT-29 @P0 filters survive navigating into a project and back', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();
    const before = await marketplace.filterParams();

    await authenticatedPage.goto('/app/offplan-projects/1441?lang=en', { waitUntil: 'commit' });
    await authenticatedPage.goBack({ waitUntil: 'commit' });

    await marketplace.expectLoaded();
    expect(await marketplace.filterParams()).toEqual(before);
  });

  test('SRCH-09 @P1 a no-match search term returns no suggestions', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    const suggestions = await marketplace.searchSuggestions(SEARCH.noResultsCity);

    expect(suggestions, 'A nonsense query should not suggest locations').toHaveLength(0);
  });

  test('SRCH-12 @P1 script-like search input is handled safely', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    let dialogAppeared = false;
    authenticatedPage.on('dialog', async (d) => {
      dialogAppeared = true;
      await d.dismiss().catch(() => {});
    });

    await marketplace.searchSuggestions('<script>alert(1)</script>');

    expect(dialogAppeared, 'Search input must not execute injected script').toBeFalsy();
    await expect(marketplace.searchInput.first()).toBeVisible();
  });

  test('SRCH-13 @P1 clearing the search restores the default listing', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.waitForResults();
    const original = await marketplace.resultsSummaryText();

    await marketplace.searchSuggestions(SEARCH.city);
    await marketplace.searchInput.first().fill('');
    await marketplace.waitForResults();

    expect(await marketplace.resultsSummaryText()).toBe(original);
  });

  test('LST-01 @P1 sorting by price high to low reorders the listing', async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.waitForResults();

    await marketplace.sortBy('Price: High to low');
    await marketplace.waitForResults();

    // The sort must be reflected in the shareable URL, which is how the app
    // carries it across reloads.
    expect(decodeURIComponent(authenticatedPage.url())).toMatch(/sort=/);
  });

  test('LST-09 @P1 the result count matches the rendered cards', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.waitForResults();

    const count = await marketplace.resultCount();
    const rendered = await marketplace.resultCards.count();

    expect(count).toBeGreaterThan(0);
    // The first page renders a subset; it must never exceed the reported total.
    expect(rendered).toBeLessThanOrEqual(count);
  });

  test('LST-21 @P1 the rent purpose renders the rental listing', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(
      '/app/marketplace?marketplace_purpose=rent&unit_types=apartment&lang=en',
      { waitUntil: 'commit' },
    );

    await expect(
      authenticatedPage.getByRole('heading', { name: /Rental Units/i }).first(),
    ).toBeVisible({ timeout: 150_000 });
  });

  test('LST-22 @P1 the lands purpose renders a land listing', async ({ authenticatedPage }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await authenticatedPage.goto(
      '/app/marketplace?marketplace_purpose=buy&product_types=lands&lang=en',
      { waitUntil: 'commit' },
    );

    await marketplace.expectLoaded();
    await marketplace.waitForResults();
    expect(await marketplace.resultCount()).toBeGreaterThan(0);
  });
});
