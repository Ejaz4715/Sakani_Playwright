import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';
import { PROFILE_ROUTES, PROJECTS } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

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
    await logStep('Step 01: Open the home page and move to the marketplace');
    await homePage.open();
    await homePage.expectLoaded();
    await page.goto('/app/marketplace?lang=en', { waitUntil: 'commit' });

    await logStep('Step 02: Go back and forward without losing the page state');
    await page.goBack({ waitUntil: 'commit' });
    await page.goForward({ waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/app\/marketplace/);
  });

  test('TC-02 Refreshing the marketplace preserves the view', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);

    await logStep('Step 01: Open the marketplace and capture the filter state');
    await marketplace.open();
    await marketplace.expectLoaded();
    const before = await marketplace.filterParams();

    await logStep('Step 02: Reload and confirm the view is preserved');
    await authenticatedPage.reload({ waitUntil: 'commit' });
    await marketplace.expectLoaded();
    expect(await marketplace.filterParams()).toEqual(before);
  });

  test('TC-03 Public routes are deep-linkable', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page }) => {
    const routes = ['/app/promotion-vouchers', '/app/mortgage-page', '/services/farz-certificate'];
    for (const route of routes) {
      await logStep(`Step 01: Open public route ${route}`);
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
    await logStep('Step 01: Set the viewport and open the marketplace');
    await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoadedCompact();

    await logStep('Step 02: Validate the compact layout still renders results');
    await marketplace.waitForResults();
    expect(await marketplace.resultCount()).toBeGreaterThan(0);
  });

  test('TC-05 Home page is usable at a mobile viewport', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page, homePage }) => {
    await logStep('Step 01: Open the home page at mobile width');
    await page.setViewportSize({ width: 390, height: 844 });
    await homePage.openResponsive();
    await homePage.expectLoadedResponsive();

    await logStep('Step 02: Confirm the mobile hero inputs remain visible');
    await expect(homePage.citySearchInput.first()).toBeVisible({ timeout: 60_000 });
  });

  test('TC-06 Home page is usable at a tablet viewport', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ page, homePage }) => {
    await logStep('Step 01: Open the home page at tablet width');
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.openResponsive();
    await homePage.expectLoadedResponsive();

    await logStep('Step 02: Validate the search action remains visible');
    await expect(homePage.searchSubmit).toBeVisible({ timeout: 60_000 });
  });

  test('TC-07 Protected page is not served from cache after logout', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
    header,
  }) => {
    await logStep('Step 01: Open a protected route while authenticated');
    await authenticatedPage.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });
    await expect(
      authenticatedPage.getByRole('heading', { name: /^\s*Wallet\s*$/i }),
    ).toBeVisible({ timeout: 150_000 });

    await logStep('Step 02: Log out and test the browser back navigation');
    await header.logout();
    await authenticatedPage.goBack({ waitUntil: 'commit' });
    await expect
      .poll(async () => header.isAuthenticated(), { timeout: 90_000 })
      .toBeFalsy();
  });

  test('TC-08 Filtered marketplace URL is shareable to a clean session', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
    browser,
  }) => {
    const marketplace = new MarketplacePage(authenticatedPage);

    await logStep('Step 01: Apply a filter and capture the shareable URL');
    await marketplace.open();
    await marketplace.expectLoaded();
    await marketplace.openFilters();
    await marketplace.selectFilterOption('Villa');
    await marketplace.applyFilters();
    const sharedUrl = authenticatedPage.url();

    await logStep('Step 02: Open the shared URL in a guest context');
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();
    try {
      await guestPage.goto(sharedUrl, { waitUntil: 'commit' });
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
    await logStep('Step 01: Open a protected page with a valid session');
    await authenticatedPage.goto(`${PROFILE_ROUTES.myBookings}?lang=en`, { waitUntil: 'commit' });
    await expect.poll(async () => header.isAuthenticated(), { timeout: 150_000 }).toBeTruthy();

    await logStep('Step 02: Drop cookies and retry the protected route');
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
      await logStep('Step 01: Open the protected dashboard in a second tab');
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
    await logStep('Step 01: Navigate to a project and traverse browser history');
    await authenticatedPage.goto(`/app/offplan-projects/${PROJECTS.bookable}?lang=en`, {
      waitUntil: 'commit',
    });
    await authenticatedPage.goBack({ waitUntil: 'commit' });
    await authenticatedPage.goForward({ waitUntil: 'commit' });

    await logStep('Step 02: Confirm the page still renders substantial content');
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
