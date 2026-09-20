import { test, expect } from '@fixtures/pages.fixture';
import { HousingDesignsPage } from '@pages/HousingDesignsPage';

test.describe('Housing designs catalogue', () => {
  test('TC-01 The catalogue renders designs', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.waitForCatalogue();
    await expect(designs.availableDesignsHeading.first()).toBeVisible();
  });

  test('TC-02 Land width accepts a valid dimension', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('20');

    expect(await designs.landWidth.inputValue()).toBe('20');
  });

  test('TC-03 Land width rejects a negative dimension', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('-5');

    expect(await designs.landWidth.inputValue()).not.toMatch(/^-/);
  });

  test('TC-04 Land width rejects non-numeric input', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landWidth.fill('abc');

    expect(await designs.landWidth.inputValue()).not.toMatch(/abc/i);
  });

  test('TC-05 Land length accepts both ends of a plausible range', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.landLength.fill('1');
    expect(await designs.landLength.inputValue()).toBe('1');

    await designs.landLength.fill('9999');
    expect(await designs.landLength.inputValue()).toBe('9999');
  });

  test('TC-06 Front street width is filterable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.frontStreetWidth.fill('15');

    expect(await designs.frontStreetWidth.inputValue()).toBe('15');
  });

  test('TC-07 A price range can be applied', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const designs = new HousingDesignsPage(authenticatedPage);
    await designs.open();
    await designs.expectLoaded();

    await designs.minPrice.fill('10000');
    await designs.maxPrice.fill('50000');

    await designs.waitForCatalogue();
  });

  test('TC-08 An impossible dimension combination settles on an empty state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
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

  test('TC-09 A room-count chip is selectable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
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
  test('TC-01 The offers page lists vouchers', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
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
  test('TC-02 The vendor join CTA is offered to a signed-in visitor', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
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
    test(`TC-01 The ${service.slug} landing page renders`, {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
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

  test('TC-02 Mortgage "Get started" opens the calculator', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
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
