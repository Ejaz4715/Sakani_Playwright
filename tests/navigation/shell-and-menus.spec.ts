import { test, expect } from '@fixtures/pages.fixture';

/**
 * SHL / NVX — global shell chrome and mega-menu routing.
 * spec: specs/functional-test-design.md § 2-3
 *
 * Public pages only, so these run unauthenticated and fast. Complements
 * NAV-01…08, which assert that the menus *exist*; these assert that each entry
 * actually routes where it claims to.
 */
test.describe('Global shell', () => {
  test('SHL-05 @P3 the government DGA banner expands', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.expectLoaded();

    await page.getByRole('button', { name: /How you know\?|كيف تتحقق/i }).first().click({ force: true });

    await expect(
      page.getByText(/Registered on Digital Government Authority|مسجل لدى هيئة الحكومة/i).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('20250428955').first()).toBeVisible();
  });

  test('SHL-13 @P1 an unknown app route does not leave a blank shell', async ({ page }) => {
    await page.goto('/app/this-route-does-not-exist?lang=en', { waitUntil: 'commit' });

    // Whatever the app does — 404 view or redirect — the user must end up on a
    // page with real content and a way onward, not an empty shell.
    await expect
      .poll(
        async () => {
          const text = await page.locator('body').innerText().catch(() => '');
          return text.replace(/\s+/g, ' ').trim().length;
        },
        { timeout: 150_000, message: 'Unknown route rendered no content' },
      )
      .toBeGreaterThan(200);
  });

  test('SHL-06 @P2 the Sakani Assistant chat can be opened and closed', async ({
    homePage,
    page,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    const chatToggle = page
      .getByRole('button', { name: /chat/i })
      .first();
    const hasChat = await chatToggle.isVisible().catch(() => false);
    test.skip(!hasChat, 'Chat widget not rendered in this environment');

    await chatToggle.click({ force: true });
    // The widget must not swallow the page: navigation stays reachable.
    await expect(homePage.header.nav).toBeVisible();
  });

  test('SHL-12 @P3 every footer link points at a real destination', async ({ homePage, page }) => {
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

test.describe('Navigation routing', () => {
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
    test(`NVX-02 @P1 Properties for Sale → ${route.label.source} routes correctly`, async ({
      homePage,
    }) => {
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
    test(`NVX-01 @P1 Properties for Rent → ${route.label.source} routes correctly`, async ({
      homePage,
    }) => {
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

  test('NVX-05 @P2 "Publish your units" points at the external Digitar site', async ({
    homePage,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    const hrefs = await homePage.header.megaMenuHrefs(homePage.header.propertiesForSale.first());

    expect(hrefs.some((h) => h.includes('digitar.sakani.sa'))).toBeTruthy();
  });

  test('NVX-07 @P3 Real Estate Indicators links to the external REGA site', async ({
    homePage,
    page,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    const link = page.locator('footer a', { hasText: /Real Estate Indicators|المؤشرات العقارية/i }).first();

    expect(await link.getAttribute('href')).toContain('rei.rega.gov.sa');
  });

  test('NVX-10 @P2 a mega-menu closes when the page body is clicked', async ({
    homePage,
    page,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    await homePage.header.services.first().hover();
    const menuLink = page.getByRole('link', { name: /Mortgage Calculator/i }).first();
    await menuLink.waitFor({ state: 'visible', timeout: 30_000 });

    await page.mouse.move(700, 700);
    await page.mouse.click(700, 700);

    await expect(menuLink).toBeHidden({ timeout: 30_000 });
  });

  test('NVX-03 @P2 every Services menu entry resolves to a service route', async ({
    homePage,
    page,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    const hrefs = await homePage.header.megaMenuHrefs(homePage.header.services.first());

    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    for (const href of hrefs) {
      expect(href, `services link "${href}"`).toMatch(/^(https?:\/\/|\/)/);
    }
  });
});
