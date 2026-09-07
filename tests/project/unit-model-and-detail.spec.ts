import { test, expect } from '@fixtures/pages.fixture';
import { UnitModelPage } from '@pages/UnitModelPage';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS } from '@data/testData';
import { findBookableUnit } from '@helpers/marketplaceApi';

/**
 * UMD / UDP — unit-model listing and unit detail.
 * spec: specs/functional-test-design.md § 9
 *
 * Complements PRJ-09/10, which assert the pages render. These cover the size-band
 * chips, pagination, unit attributes and the availability states.
 *
 * Inventory is resolved live rather than hard-coded so the suite does not depend
 * on one unit staying available forever.
 */
test.describe('Unit model listing', () => {
  test('UMD-01 @P1 size-band chips filter the unit list', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available non-beneficiary unit`);

    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();

    const chips = await model.chipLabels();
    expect(chips.length).toBeGreaterThan(0);
    expect(chips.join(' | ')).toMatch(/All/i);
  });

  test('UMD-02 @P2 the All chip count is at least any single band', async ({
    authenticatedPage,
  }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();

    const chips = await model.chipLabels();
    const allCount = await model.chipCount('All');
    test.skip(chips.length < 2, 'Model exposes only the All band — nothing to compare');

    const bandLabel = chips.find((c) => !/^\s*All/i.test(c))!.split(' ')[0];
    const bandCount = await model.chipCount(bandLabel);

    expect(allCount).toBeGreaterThanOrEqual(bandCount);
  });

  test('UMD-03 @P1 pagination moves through the unit list', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const model = new UnitModelPage(authenticatedPage, String(unit!.unitModelId));
    await model.open();
    await model.expectLoaded();

    const hasPaging = await model.pagination.first().isVisible().catch(() => false);
    test.skip(!hasPaging, 'TEST DATA BLOCKER: model has too few units to paginate');

    const firstPage = await model.unitCards.first().innerText();
    await model.pagination.filter({ hasText: '2' }).first().click({ force: true });

    await expect
      .poll(async () => model.unitCards.first().innerText(), { timeout: 30_000 })
      .not.toBe(firstPage);
  });

  test('UMD-06 @P2 a small unit-model renders without pagination', async ({
    authenticatedPage,
  }) => {
    // Model 581 (project 1187) held exactly one unit at exploration time, but
    // pre-production inventory moves, so the count is read from the model's own
    // "All" chip rather than asserted as a fixed number.
    const model = new UnitModelPage(authenticatedPage, '581');
    await model.open();
    await model.expectLoaded();

    const declared = await model.chipCount('All');
    const rendered = await model.unitCount();

    expect(declared).toBeGreaterThan(0);
    // A model small enough to fit one page must render every unit it declares.
    if (declared <= 12) {
      expect(rendered).toBe(declared);
      await expect(model.pagination.first()).toBeHidden();
    }
  });

  test('UMD-07 @P2 an unknown unit-model id does not render a broken page', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/app/unit-models/99999999?lang=en', { waitUntil: 'commit' });

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

test.describe('Unit detail', () => {
  test('UDP-01 @P1 unit attributes are rendered in full', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();

    const body = await authenticatedPage.locator('body').innerText();
    expect(body).toMatch(/Property type|نوع العقار/i);
    expect(body).toMatch(/Unit area|مساحة الوحدة/i);
    expect(body).toMatch(/Number of Bedrooms|غرف النوم/i);
  });

  test('UDP-02 @P1 the price is labelled as excluding VAT', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();

    await expect(
      authenticatedPage.getByText(/Exl\. VAT|Excl\. VAT|غير شامل/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('UDP-04 @P1 a unit can be favourited', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();

    const favorite = detail.favoriteButton.first();
    await expect(favorite).toBeVisible();
    await favorite.click({ force: true });
    // Toggle back so no state is left behind.
    await favorite.click({ force: true });
  });

  test('UDP-05 @P2 the compare control is offered', async ({ authenticatedPage }) => {
    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();

    await expect(detail.compareButton.first()).toBeVisible();
  });

  /**
   * DEFECT D15 — the unit page's "Mortgage Calculator" button is **inert**.
   * Activating it leaves the URL unchanged and opens no tab. Confirmed twice:
   * a real Playwright click in this test, and a synthetic click driven against
   * the live element. The calculator itself works and is fully covered by the
   * MTG suite via its own route (`/app/mortgage-page`) — only this cross-module
   * entry point is broken.
   */
  test('UDP-06 @P1 the mortgage calculator CTA routes to the calculator', async ({
    authenticatedPage,
  }) => {
    test.fail(true, 'D15: unit-page Mortgage Calculator CTA is inert (no navigation)');

    const unit = await findBookableUnit(authenticatedPage, PROJECTS.bookable);
    test.skip(!unit, `TEST DATA BLOCKER: project ${PROJECTS.bookable} has no available unit`);

    const detail = new UnitDetailPage(authenticatedPage, unit!.id);
    await detail.open();

    // The CTA may route in place or open a new tab, as other cross-module links
    // in this app do.
    const popup = authenticatedPage
      .context()
      .waitForEvent('page', { timeout: 30_000 })
      .catch(() => null);
    await detail.mortgageCalculatorButton.first().click({ force: true });
    const opened = await popup;

    const target = opened ?? authenticatedPage;
    await expect
      .poll(() => target.url(), { timeout: 90_000 })
      .toMatch(/\/app\/mortgage-page/);
  });

  test('UDP-09 @P0 a unit in a closed project shows its closed state', async ({
    authenticatedPage,
  }) => {
    // Project 1187 is bookable=false; its units still list as available.
    const detail = new UnitDetailPage(authenticatedPage, '132976');
    await detail.open();

    await expect(detail.bookingsClosedNotice).toBeVisible({ timeout: 90_000 });
  });

  test('UDP-10 @P2 an unknown unit id does not render a broken page', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/app/units/99999999?lang=en', { waitUntil: 'commit' });

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
  test('UDP-11 @P0 a guest sees the unit but is routed to login to book', async ({
    page,
    browser,
  }) => {
    test.fail(true, 'D16: guest booking CTA does not route to login');

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
    test.skip(
      !unitId,
      `TEST DATA BLOCKER: project ${PROJECTS.bookable} exposes no bookable unit for a guest journey`,
    );

    const detail = new UnitDetailPage(page, unitId!);
    await detail.open();
    await detail.clickBook();

    await expect(page).toHaveURL(/\/app\/authentication\/login/, { timeout: 120_000 });
  });
});
