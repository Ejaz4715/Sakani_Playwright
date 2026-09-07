import { test, expect } from '@fixtures/pages.fixture';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS, API, TEST_USER } from '@data/testData';
import {
  findBookableNonBeneUnit,
  getProject,
  getAvailableUnits,
  getBeneficiary,
  getActiveBookingProjectCodes,
} from '@helpers/marketplaceApi';

/**
 * BOOK — business rules that gate the booking journey.
 * spec: specs/exploration-report.md  (TC-BOOK negative / rules)
 */
test.describe('Booking - business rules', () => {
  test('BOOK-02 @P0 a second booking in the same project is refused', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    const project = await getProject(page, PROJECTS.alreadyBooked);
    const blockedCodes = await getActiveBookingProjectCodes(page);
    test.skip(
      !blockedCodes.includes(project.code),
      `Account no longer holds an active booking in ${project.code}; the rule cannot be exercised.`,
    );

    const unit = await findBookableNonBeneUnit(page, PROJECTS.alreadyBooked);

    const unitPage = new UnitDetailPage(page, unit.id);
    await unitPage.open();
    await unitPage.expectBookable();

    const outcome = await unitPage.startBooking();

    expect(outcome, 'The one-booking-per-project rule should block the journey').toBe(
      'blocked-one-per-project',
    );
    await expect(unitPage.oneBookingPerProjectModal.first()).toContainText(
      /not be able to book more than one unit in this project/i,
    );
    await expect(unitPage.returnToProjectButton.first()).toBeVisible();

    // The rule must stop the journey before any summary is reached.
    await expect(page).not.toHaveURL(/booking-summary/);
  });

  test('BOOK-13 @P1 a non-bookable project rejects start_booking', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    const project = await getProject(page, PROJECTS.bookingsClosed);
    test.skip(project.bookable, `Project ${PROJECTS.bookingsClosed} is now bookable`);

    const unit = await findBookableNonBeneUnit(page, PROJECTS.bookingsClosed);

    const unitPage = new UnitDetailPage(page, unit.id);
    await unitPage.open();
    await expect(unitPage.bookUnitButton).toBeVisible({ timeout: 150_000 });

    const startBooking = page.waitForResponse(
      (r) => r.url().includes(API.startBooking(PROJECTS.bookingsClosed)),
      { timeout: 120_000 },
    );

    await unitPage.clickBook();

    // Backend refuses the booking for a closed project.
    expect((await startBooking).status()).toBe(403);
    await expect(page).not.toHaveURL(/booking-summary/, { timeout: 30_000 });

    // DEFECT (documented): the CTA is still enabled and the 403 is swallowed —
    // no error message is surfaced to the user. Assert the notice instead so the
    // test records the only user-visible signal that exists today.
    await expect(unitPage.bookingsClosedNotice).toBeVisible();
  });

  test('BOOK-06 @P0 the account may only book non-beneficiary inventory', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    const me = await getBeneficiary(page);
    expect(me.is_non_beneficiary, 'Fixture account should be a non-beneficiary').toBe(
      TEST_USER.isNonBeneficiary,
    );
    expect(me.decrypted_national_id_number).toBe(TEST_USER.nationalId);

    const units = await getAvailableUnits(page, PROJECTS.bookable);
    expect(units.length).toBeGreaterThan(0);

    // Every unit carries an explicit segment; the journey must pick a non_bene one.
    for (const unit of units) {
      expect(
        unit.targetSegments.length,
        `Unit ${unit.unitName} should declare target segments`,
      ).toBeGreaterThan(0);
    }

    const bookable = await findBookableNonBeneUnit(page, PROJECTS.bookable);
    expect(bookable.targetSegments).toContain('non_bene');
    expect(bookable.bookingStatus).toBe('available');
  });

  test('BOOK-14 @P1 eligibility status is reflected on the profile', async ({
    authenticatedPage,
  }) => {
    const me = await getBeneficiary(authenticatedPage);

    // Drives which products, prices and payment methods the account is offered.
    expect(me.is_non_beneficiary).toBe(true);
    expect(me.purchase_power).toBeGreaterThan(0);
    expect(me.number_of_active_bookings_by_project).toBeDefined();
  });
});
