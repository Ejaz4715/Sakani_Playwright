import { test, expect } from '@fixtures/pages.fixture';
import { UnitModelPage } from '@pages/UnitModelPage';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS } from '@data/testData';
import { findBookableUnit } from '@helpers/marketplaceApi';
import testData from '@data/test-data.json';
import { logStep } from '@helpers/LogSteps';

test.describe('Unit model listing', () => {
  test('TC-01 Size-band chips filter the unit list', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its model page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available non-beneficiary unit`);
    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();
    await logStep('Step 02: Validate the size-band chips render');
    const chips = await model.chipLabels();
    expect(chips.length).toBeGreaterThan(0);
    expect(chips.join(' | ')).toMatch(/All/i);
  });

  test('TC-02 All chip count is at least any single band', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Find a bookable unit and open its model page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();
    await logStep('Step 02: Compare the All chip count with a size band');
    const chips = await model.chipLabels();
    const allCount = await model.chipCount('All');
    test.skip(chips.length < 2, 'Model exposes only the All band — nothing to compare');
    const bandLabel = chips.find((c) => !/^\s*All/i.test(c))!.split(' ')[0];
    const bandCount = await model.chipCount(bandLabel);
    expect(allCount).toBeGreaterThanOrEqual(bandCount);
  });

  test('TC-03 Pagination moves through the unit list', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its model page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();
    await logStep('Step 02: Page through the listings and verify the first card changes');
    const hasPaging = await model.pagination.first().isVisible().catch(() => false);
    test.skip(!hasPaging, 'TEST DATA BLOCKER: model has too few units to paginate');
    const firstPage = await model.unitCards.first().innerText();
    await model.pagination.filter({ hasText: '2' }).first().click({ force: true });
    await expect
      .poll(async () => model.unitCards.first().innerText(), { timeout: 30_000 })
      .not.toBe(firstPage);
  });

  test('TC-04 A small unit-model renders without pagination', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Open a small unit-model page');
    // Model 581 (project 1187) held exactly one unit at exploration time, but
    // pre-production inventory moves, so the count is read from the model's own
    // "All" chip rather than asserted as a fixed number.
    const model = new UnitModelPage(authenticatedPage, '581');
    await model.open();
    await model.expectLoaded();
    await logStep('Step 02: Confirm the page renders a single page when inventory is small');
    const declared = await model.chipCount('All');
    const rendered = await model.unitCount();
    expect(declared).toBeGreaterThan(0);
    // A model small enough to fit one page must render every unit it declares.
    if (declared <= 12) {
      expect(rendered).toBe(declared);
      await expect(model.pagination.first()).toBeHidden();
    }
  });

  test('TC-05 An unknown unit-model id does not render a broken page', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Attempt to open an unknown unit-model ID');
    await authenticatedPage.goto('/app/unit-models/99999999?lang=en', { waitUntil: 'commit' });
    await logStep('Step 02: Check the page still renders content instead of an empty shell');
    await expect
      .poll(
        async () => {
          const text = await authenticatedPage.locator('body').innerText().catch(() => '');
          return text.replace(/\s+/g, ' ').trim().length;
        },
        { timeout: 150_000, message: 'Unknown unit-model id rendered an empty shell' },
      )
      .toBeGreaterThan(200);
  });
});

test.describe('Unit details page', () => {
  test('TC-01 Unit attributes are rendered in full', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its detail page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();
    await logStep('Step 02: Verify key property attributes are rendered');
    const body = await authenticatedPage.locator('body').innerText();
    expect(body).toMatch(/Property type|نوع العقار/i);
    expect(body).toMatch(/Unit area|مساحة الوحدة/i);
    expect(body).toMatch(/Number of Bedrooms|غرف النوم/i);
  });

  test('TC-02 The price is labelled as excluding VAT', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its detail page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();
    await logStep('Step 02: Confirm the price label says the price excludes VAT');
    await expect(
      authenticatedPage.getByText(/Exl\. VAT|Excl\. VAT|غير شامل/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-03 A unit can be favourited', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its detail page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();
    const favorite = detail.favoriteButton.first();
    await logStep('Step 02: Toggle the favorite state');
    await expect(favorite).toBeVisible();
    await favorite.click({ force: true });
    // Toggle back so no state is left behind.
    await favorite.click({ force: true });
  });

  test('TC-04 The compare control is offered', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    await logStep('Step 01: Find a bookable unit and open its detail page');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);
    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();
    await logStep('Step 02: Confirm the compare control is visible');
    await expect(detail.compareButton.first()).toBeVisible();
  });

  test('TC-05 The mortgage calculator CTA routes to the calculator', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage, page
  }) => {
    await logStep('Step 01: Open a unit detail page for mortgage evaluation');
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();
    const popup = authenticatedPage
      .context()
      .waitForEvent('page', { timeout: 30_000 })
      .catch(() => null);
    await logStep('Step 02: Click the mortgage calculator CTA');
    await detail.mortgageCalculatorButton.first().click({ force: true });
    await expect(page.locator("//h3/child::span[text()='Financial Information']")).toBeVisible({ timeout: 60_000 });
  });

  test('TC-06 Unit in a closed project shows its closed state', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage, page
  }) => {
    await logStep('Step 01: Open a closed-project unit detail page');
    // Project 1187 is bookable=false; its units still list as available.
    // const unitDetailPage = new UnitDetailPage();
    await page.pause();
    const detail = new UnitDetailPage(authenticatedPage, '174918');
    // await page.goto(testData.userPortalUrl);
    await detail.openURL();
    await logStep('Step 02: Validate the closed-project message is visible');
    await expect(detail.bookingsClosedNotice).toBeVisible({ timeout: 60000 });
  });

  test('TC-07 An unknown unit id does not render a broken page', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Open an unknown unit ID');
    await authenticatedPage.goto('/app/units/99999999?lang=en', { waitUntil: 'commit' });
    await logStep('Step 02: Confirm the page remains non-empty instead of blank');
    await expect
      .poll(
        async () => {
          const text = await authenticatedPage.locator('body').innerText().catch(() => '');
          return text.replace(/\s+/g, ' ').trim().length;
        },
        { timeout: 150_000, message: 'Unknown unit id rendered an empty shell' },
      )
      .toBeGreaterThan(200);
  });

  /**
   * Resolves a currently-bookable unit rather than hard-coding one: unit 156428
   * was used by an earlier booking journey and no longer renders a booking CTA
   * at all, which made the hard-coded version burn its whole retry budget.
   */
  /**
   * PROBABLE DEFECT D16 — activating "Book a unit" as a guest leaves the URL on
   * the unit page instead of routing to login. Observed in a genuine
   * unauthenticated browser context; the same control works when authenticated
   * (it starts the booking and fires `start_booking`), so the guest branch
   * appears to fail silently — the same shape as D1, D14 and D15.
   *
   * Held failing pending confirmation of the intended guest behaviour.
   */
  test('TC-08 A guest sees the unit but is prompted to login to book', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    page,
    browser,
  }) => {
    await logStep('Step 01: Prepare a guest booking flow for a unit detail page');
    // test.fail(true, 'D16: guest booking CTA does not route to login');

    // Inventory lookup needs a session; the journey itself must run as a guest.
    const lookupContext = await browser.newContext();
    const lookupPage = await lookupContext.newPage();
    let unitId: string | null = null;
    try {
      await lookupPage.goto('/app/marketplace?lang=en', { waitUntil: 'commit' });
      const unit = await findBookableUnit(lookupPage, PROJECTS.bookable);
      unitId = unit?.id ?? null;
    } finally {
      await lookupContext.close();
    }
    // test.skip(
    //   !unitId,
    //   `TEST DATA BLOCKER: project ${PROJECTS.bookable} exposes no bookable unit for a guest journey`,
    // );
    const detail = new UnitDetailPage(page, unitId!);
    await logStep('Step 02: Trigger booking as a guest and verify login prompt appears');
    await detail.open();
    await detail.clickBook();
    await expect(page.locator("//app-nafath-login-modal")).toBeVisible({ timeout: 60_000 });

    // await expect(page).toHaveURL(/\/app\/authentication\/login/, { timeout: 120_000 });
  });
});
