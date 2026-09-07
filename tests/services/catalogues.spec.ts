import { test, expect } from '@fixtures/pages.fixture';
import { HousingDesignsPage } from '@pages/HousingDesignsPage';

test.describe('Housing designs catalogue', () => {
  test('HDS-01 @P1 the catalogue renders designs', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.waitForCatalogue();
    await expect(designs.availableDesignsHeading.first()).toBeVisible();
  });

  test('HDS-07 @P1 land width accepts a valid dimension', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('20');

    expect(await designs.landWidth.inputValue()).toBe('20');
  });

  test('HDS-08 @P1 land width rejects a negative dimension', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('-5');

    expect(await designs.landWidth.inputValue()).not.toMatch(/^-/);
  });

  test('HDS-09 @P1 land width rejects non-numeric input', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('abc');

    expect(await designs.landWidth.inputValue()).not.toMatch(/abc/i);
  });

  test('HDS-10 @P2 land length accepts both ends of a plausible range', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landLength.fill('1');
    expect(await designs.landLength.inputValue()).toBe('1');

    await designs.landLength.fill('9999');
    expect(await designs.landLength.inputValue()).toBe('9999');
  });

  test('HDS-11 @P2 front street width is filterable', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.frontStreetWidth.fill('15');

    expect(await designs.frontStreetWidth.inputValue()).toBe('15');
  });

  test('HDS-05 @P1 a price range can be applied', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.minPrice.fill('10000');
    await designs.maxPrice.fill('50000');

    await designs.waitForCatalogue();
  });

  test('HDS-12 @P1 an impossible dimension combination settles on an empty state', async ({
    authenticatedPage,
  }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('1');
    await designs.landLength.fill('1');

    // Must resolve to designs or an explicit empty state — never hang loading.
    await designs.waitForCatalogue();
  });

  test('HDS-02 @P1 a room-count chip is selectable', async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    const chip = designs.chip('3');
    await expect(chip).toBeVisible();
    await chip.click({ force: true });

    await designs.waitForCatalogue();
  });
});

test.describe('Sakani offers', () => {
  /**
   * The offers carousel renders each discount heading more than once — the
   * duplicates are hidden slides — so `.first()` lands on an invisible node.
   * `filter({ visible: true })` counts only what the user can actually see.
   */
  test('VCH-01 @P1 the offers page lists vouchers', async ({ page }) => {
    await page.goto('/app/promotion-vouchers?lang=en', { waitUntil: 'commit' });

    await expect(
      page.getByRole('heading', { name: /Sakani Offers|عروض سكني/i }).first(),
    ).toBeVisible({ timeout: 150_000 });

    await expect
      .poll(
        async () =>
          page.getByRole('heading', { name: /%\s*off|خصم/i }).filter({ visible: true }).count(),
        { timeout: 60_000, message: 'no visible discount offer rendered' },
      )
      .toBeGreaterThan(0);
  });

  /**
   * The vendor CTA is **only rendered for an authenticated visitor** — the
   * offers list itself is public, but a logged-out session shows the "Join as a
   * Vendor" copy with no "Join us" control at all. Verified by comparing the
   * page in both states.
   */
  test('VCH-08 @P2 the vendor join CTA is offered to a signed-in visitor', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/app/promotion-vouchers?lang=en', { waitUntil: 'commit' });

    await expect(
      authenticatedPage.getByRole('heading', { name: /Sakani Offers|عروض سكني/i }).first(),
    ).toBeVisible({ timeout: 150_000 });

    // The vendor block sits below the fold and renders lazily.
    await authenticatedPage
      .getByRole('heading', { name: /Join as a Vendor|انضم كتاجر/i })
      .first()
      .scrollIntoViewIfNeeded({ timeout: 90_000 });

    await expect(
      authenticatedPage.getByRole('button', { name: /Join us|انضم/i }).first(),
    ).toBeVisible({ timeout: 90_000 });
  });
});

test.describe('Service landing pages', () => {
  const services = [
    { slug: 'check-eligibility', name: /Eligibility Checker/i },
    { slug: 'mortgage-calculator', name: /Mortgage Calculator/i },
    { slug: 'online-lending', name: /Online Lending/i },
    { slug: 'financial-advisory', name: /Financial Advisory/i },
    { slug: 'conveyance-service', name: /Conveyance service/i },
    { slug: 'farz-certificate', name: /Farz Certificate/i },
  ];

  for (const service of services) {
    test(`SVC-01 @P2 the ${service.slug} landing page renders`, async ({ page }) => {
      await page.goto(`/services/${service.slug}?lang=en`, { waitUntil: 'commit' });

      await expect(page.getByRole('heading', { name: service.name }).first()).toBeVisible({
        timeout: 150_000,
      });
      // Every service page offers a way into the journey.
      await expect(
        page.getByRole('link', { name: /Get [Ss]tarted/i })
          .or(page.getByRole('button', { name: /Get [Ss]tarted/i }))
          .first(),
      ).toBeVisible({ timeout: 60_000 });
    });
  }

  test('SVC-03 @P1 mortgage "Get started" opens the calculator', async ({ page }) => {
    await page.goto('/services/mortgage-calculator?lang=en', { waitUntil: 'commit' });

    const cta = page
      .getByRole('link', { name: /Get [Ss]tarted/i })
      .or(page.getByRole('button', { name: /Get [Ss]tarted/i }))
      .first();
    await cta.waitFor({ state: 'visible', timeout: 150_000 });
    await cta.click({ force: true });

    await expect(page).toHaveURL(/\/app\/mortgage-page/, { timeout: 120_000 });
  });
});
