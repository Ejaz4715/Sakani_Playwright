import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';
import { PROFILE_ROUTES, PROJECTS } from '@data/testData';

/**
 * XCT — cross-cutting browser and session behaviour.
 * spec: specs/functional-test-design.md § 27
 *
 * Deliberately mixes public and authenticated surfaces: refresh, back/forward,
 * deep-linking and viewport behaviour have to hold on both sides of the login
 * boundary.
 */
test.describe('Cross-cutting behaviour', () => {
  test('TC-01 Forward after back returns without resubmitting', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page, homePage }) => {
    await homePage.open();
    await homePage.expectLoaded();
    await page.goto('/app/marketplace?lang=en', { waitUntil: 'commit' });
    await page.goBack({ waitUntil: 'commit' });
    await page.goForward({ waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('TC-02 Refreshing the marketplace preserves the view', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    const before = await marketplace.filterParams();
    await authenticatedPage.reload({ waitUntil: 'commit' });
    await marketplace.expectLoaded();
    expect(await marketplace.filterParams()).toEqual(before);
  });

  test('TC-03 Public routes are deep-linkable', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page }) => {
    const routes = ['/app/promotion-vouchers', '/app/mortgage-page', '/services/farz-certificate'];
    for (const route of routes) {
      await page.goto(`${route}?lang=en`, { waitUntil: 'commit' });
      await expect
        .poll(
          async () => {
            const text = await page.locator('body').innerText().catch(() => '');
            return text.replace(/\s+/g, ' ').trim().length;
          },
          { timeout: 150_000, message: `${route} rendered no content` },
        )
        .toBeGreaterThan(200);
    }
  });

  test('TC-04 Marketplace remains usable at a 1280px viewport', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    // Below ~1400px the toolbar collapses to icon-only controls, so the readiness
    // gate must not wait on the "Sort by" / "Filter" labels that `expectLoaded()`
    // requires — they are absent by design at this width.
    await marketplace.expectLoadedCompact();
    await marketplace.waitForResults();
    // The collapse is expected; results must still render and the listing must
    // stay navigable.
    expect(await marketplace.resultCount()).toBeGreaterThan(0);
  });

  test('TC-05 Home page is usable at a mobile viewport', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page, homePage }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    // `open()`/`expectLoaded()` gate on the desktop `#main_nav`, which this
    // breakpoint replaces with a collapsed header. The responsive variants keep
    // the same title assertion and wait on the brand link instead.
    await homePage.openResponsive();
    await homePage.expectLoadedResponsive();
    await expect(homePage.citySearchInput.first()).toBeVisible({ timeout: 60_000 });
  });

  test('TC-06 Home page is usable at a tablet viewport', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page, homePage }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.openResponsive();
    await homePage.expectLoadedResponsive();
    await expect(homePage.searchSubmit).toBeVisible({ timeout: 60_000 });
  });

  test('TC-07 Protected page is not served from cache after logout', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
    header,
  }) => {
    await authenticatedPage.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });
    await expect(
      authenticatedPage.getByRole('heading', { name: /^\s*Wallet\s*$/i }),
    ).toBeVisible({ timeout: 150_000 });
    await header.logout();
    await authenticatedPage.goBack({ waitUntil: 'commit' });
    // Back must not restore an authenticated view from the bfcache.
    await expect
      .poll(async () => header.isAuthenticated(), { timeout: 90_000 })
      .toBeFalsy();
  });

  test('TC-08 Filtered marketplace URL is shareable to a clean session', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
    browser,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();
    const sharedUrl = authenticatedPage.url();
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();
    try {
      await guestPage.goto(sharedUrl, { waitUntil: 'commit' });
      // The public listing must reproduce for an unauthenticated visitor.
      await expect
        .poll(
          async () => {
            const text = await guestPage.locator('body').innerText().catch(() => '');
            return text.replace(/\s+/g, ' ').trim().length;
          },
          { timeout: 150_000 },
        )
        .toBeGreaterThan(200);
      expect(guestPage.url()).toContain('unit_types=villa');
    } finally {
      await guestContext.close();
    }
  });

  test('TC-09 Expired session is rejected on a protected route', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
    header,
  }) => {
    await authenticatedPage.goto(`${PROFILE_ROUTES.myBookings}?lang=en`, { waitUntil: 'commit' });
    await expect.poll(async () => header.isAuthenticated(), { timeout: 150_000 }).toBeTruthy();
    // Drop the session the way an expiry would, then act.
    await authenticatedPage.context().clearCookies();
    await authenticatedPage.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });
    await expect
      .poll(() => new URL(authenticatedPage.url()).pathname, { timeout: 150_000 })
      .not.toMatch(/my-wallet/);
  });

  test('TC-10 Second tab sees the same authenticated session', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const secondTab = await authenticatedPage.context().newPage();
    try {
      await secondTab.goto(`${PROFILE_ROUTES.dashboard}?lang=en`, { waitUntil: 'commit' });
      await expect
        .poll(() => new URL(secondTab.url()).pathname, { timeout: 150_000 })
        .toMatch(/dashboard/);
    } finally {
      await secondTab.close();
    }
  });

  test('TC-11 Leaving a project mid-browse does not strand the app', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`/app/offplan-projects/${PROJECTS.bookable}?lang=en`, {
      waitUntil: 'commit',
    });
    await authenticatedPage.goBack({ waitUntil: 'commit' });
    await authenticatedPage.goForward({ waitUntil: 'commit' });
    await expect
      .poll(
        async () => {
          const text = await authenticatedPage.locator('body').innerText().catch(() => '');
          return text.replace(/\s+/g, ' ').trim().length;
        },
        { timeout: 150_000, message: 'Back/forward left the app on a blank shell' },
      )
      .toBeGreaterThan(200);
  });
});
