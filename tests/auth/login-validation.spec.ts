import { test, expect } from '@fixtures/pages.fixture';
import { findBookableUnit } from '@helpers/marketplaceApi';
import { PROJECTS } from '@data/testData';

/**
 * AUTH — negative and validation cases on the identifier step.
 * spec: specs/exploration-report.md  (TC-AUTH negative)
 */
test.describe('Authentication - validation', () => {
  test('AUTH-06 @P2 non-numeric identifier does not advance the flow', async ({ loginPage }) => {
    await loginPage.open();

    await loginPage.enterIdentifier('abc');

    // Either the control stays disabled or the app refuses to advance.
    if (await loginPage.continueButton.isEnabled()) {
      await loginPage.submitIdentifier();
      await expect(loginPage.nafathModal).toBeHidden({ timeout: 20_000 });
    }
    await expect(loginPage.page).toHaveURL(/\/app\/authentication\/login/);
  });

  test('AUTH-07 @P2 unregistered national ID does not reach Nafath', async ({ loginPage }) => {
    await loginPage.open();

    // Well-formed but not a registered beneficiary.
    await loginPage.continueWithId('1111111111');

    await expect(loginPage.nafathModal).toBeHidden({ timeout: 30_000 });
    await expect(loginPage.page).toHaveURL(/\/app\/authentication\/login/);
  });

  /**
   * PRODUCT DEFECT D16 — this asserts the same guest-booking behaviour as
   * UDP-11, which is `test.fail()`-marked against D16. Left unmarked here **on
   * purpose**: D16 is still recorded as "probable, pending confirmation of the
   * intended guest behaviour", and this is the only test that also asserts the
   * return URL is preserved. Deciding whether to mark it against D16 or drop it
   * as a duplicate is a product call, not an automation one — see
   * `specs/known-defects.md`.
   *
   * Two automation defects were repaired here so that when it fails, it fails
   * for the product reason rather than for a stale fixture:
   *   - unit 135553 was hard-coded, against the repo's "never hard-code a unit
   *     id" rule; inventory is now resolved live.
   *   - `waitForURL` used its default `waitUntil: 'load'`, which this app's
   *     bundle outlives; `commit` is the convention everywhere else.
   */
  test('AUTH-11 @P0 guest booking redirects to login and preserves the return url', async ({
    page,
    browser,
  }) => {
    // The inventory lookup needs a session; the journey itself must be a guest.
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

    // Deep-link the unit as a guest; booking must bounce through authentication.
    await page.goto(`/app/units/${unitId}?lang=en`, { waitUntil: 'commit' });

    const bookButton = page.getByRole('button', { name: /Book a unit|احجز وحدة/i }).first();
    await bookButton.waitFor({ state: 'visible', timeout: 150_000 });
    await bookButton.focus();
    await bookButton.press('Enter');

    await page.waitForURL(/\/app\/authentication\/login/, {
      waitUntil: 'commit',
      timeout: 120_000,
    });
    expect(page.url()).toMatch(/returnUrl|redirect/i);
  });
});
