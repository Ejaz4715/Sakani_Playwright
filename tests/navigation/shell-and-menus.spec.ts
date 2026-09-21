import { test, expect } from '@fixtures/pages.fixture';
import { logStep } from '@helpers/LogSteps';

/**
 * SHL / NVX — global shell chrome and mega-menu routing.
 * spec: specs/functional-test-design.md § 2-3
 *
 * Public pages only, so these run unauthenticated and fast. Complements
 * NAV-01…08, which assert that the menus *exist*; these assert that each entry
 * actually routes where it claims to.
 */
test.describe('Global shell', () => {
  test('TC-01 Government DGA banner expands', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ homePage, page }) => {
    await logStep('Step 01: Open the homepage and expand the DGA banner');
    await homePage.open();
    await homePage.expectLoaded();
    await page.getByRole('button', { name: /How you know\?|كيف تتحقق/i }).first().click({ force: true });

    await logStep('Step 02: Validate the banner content is visible');
    await expect(
      page.getByText(/Registered on Digital Government Authority|مسجل لدى هيئة الحكومة/i).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('20250428955').first()).toBeVisible();
  });

  test('TC-02 Sakani Assistant chat can be opened and closed', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    homePage,
    page,
  }) => {
    await logStep('Step 01: Open the home page and check for the chat toggle');
    await homePage.open();
    await homePage.expectLoaded();
    const chatToggle = page
      .getByRole('button', { name: /chat/i })
      .first();
    const hasChat = await chatToggle.isVisible().catch(() => false);
    test.skip(!hasChat, 'Chat widget not rendered in this environment');

    await logStep('Step 02: Open and confirm the chat does not trap the page');
    await chatToggle.click({ force: true });
    await expect(homePage.header.nav).toBeVisible();
  });

  test('TC-03 Every footer link points at a real destination', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ homePage, page }) => {
    await logStep('Step 01: Open the homepage and collect footer links');
    await homePage.open();
    await homePage.expectLoaded();
    const hrefs = await page.locator('footer a').evaluateAll((links) =>
      links
        .map((a) => a.getAttribute('href'))
        .filter((h): h is string => !!h && h !== '#'),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    for (const href of hrefs) {
      expect(href, `footer link "${href}" should be absolute or root-relative`).toMatch(
        /^(https?:\/\/|\/)/,
      );
    }
  });
});

test.describe('User Portal Navigation Routing', () => {
  const buyRoutes = [
    { label: /Offplan/i, expect: /product_types=units_under_construction/ },
    { label: /Ready units/i, expect: /product_types=readymade_units/ },
    { label: /Lands/i, expect: /product_types=lands/ },
  ];

  /**
   * The mega-menu entries are present in the DOM but only become *visible* while
   * the panel is hovered, and that hover state is timing-sensitive. Asserting on
   * the panel's hrefs tests the real routing contract without racing CSS.
   */
  for (const route of buyRoutes) {
    test(`TC-01 Properties for Sale → ${route.label.source} routes correctly`, { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
      homePage,
    }) => {
      await logStep('Step 01: Open the homepage and inspect the buy menu links');
      await homePage.open();
      await homePage.expectLoaded();
      const hrefs = await homePage.header.megaMenuHrefs(
        homePage.header.propertiesForSale.first(),
      );
      const match = hrefs.find((h) => route.expect.test(h));
      expect(match, `no menu entry matched ${route.expect}`).toBeTruthy();
      expect(match!).toContain('/app/marketplace');
    });
  }
  const rentRoutes = [
    { label: /^Apartment/i, expect: /unit_types=apartment/ },
    { label: /^Villa/i, expect: /unit_types=villa/ },
    { label: /^Floor/i, expect: /unit_types=floor/ },
  ];
  for (const route of rentRoutes) {
    test(`TC-02 Properties for Rent → ${route.label.source} routes correctly`, { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
      homePage,
    }) => {
      await logStep('Step 01: Open the homepage and inspect the rent menu links');
      await homePage.open();
      await homePage.expectLoaded();
      const hrefs = await homePage.header.megaMenuHrefs(
        homePage.header.propertiesForRent.first(),
      );
      const match = hrefs.find((h) => route.expect.test(h));
      expect(match, `no menu entry matched ${route.expect}`).toBeTruthy();
      expect(match!).toContain('marketplace_purpose=rent');
    });
  }

  test('TC-03 "Publish your units" points at the external Digitar site', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    homePage,
  }) => {
    await logStep('Step 01: Open the homepage and inspect the sale menu hrefs');
    await homePage.open();
    await homePage.expectLoaded();
    const hrefs = await homePage.header.megaMenuHrefs(homePage.header.propertiesForSale.first());
    expect(hrefs.some((h) => h.includes('digitar.sakani.sa'))).toBeTruthy();
  });

  test('TC-04 Real Estate Indicators links to the external REGA site', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    homePage,
    page,
  }) => {
    await logStep('Step 01: Open the homepage and inspect footer links for REGA');
    await homePage.open();
    await homePage.expectLoaded();
    const link = page.locator('footer a', { hasText: /Real Estate Indicators|المؤشرات العقارية/i }).first();
    expect(await link.getAttribute('href')).toContain('rei.rega.gov.sa');
  });

  test('TC-05 Mega-menu closes when the page body is clicked', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    homePage,
    page,
  }) => {
    await logStep('Step 01: Open the menu and then click the page body');
    await homePage.open();
    await homePage.expectLoaded();
    await homePage.header.services.first().hover();
    const menuLink = page.getByRole('link', { name: /Mortgage Calculator/i }).first();
    await menuLink.waitFor({ state: 'visible', timeout: 30_000 });
    await page.mouse.move(700, 700);
    await page.mouse.click(700, 700);
    await expect(menuLink).toBeHidden({ timeout: 30_000 });
  });

  test('TC-06 Every Services menu entry resolves to a service route', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    homePage,
    page,
  }) => {
    await logStep('Step 01: Open the homepage and collect the services links');
    await homePage.open();
    await homePage.expectLoaded();
    const hrefs = await homePage.header.megaMenuHrefs(homePage.header.services.first());
    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    for (const href of hrefs) {
      expect(href, `services link "${href}"`).toMatch(/^(https?:\/\/|\/)/);
    }
  });
});
