import { test, expect } from '@fixtures/pages.fixture';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { BookingSummaryPage } from '@pages/BookingSummaryPage';
import { BookingSuccessPage } from '@pages/BookingSuccessPage';
import { BookingDetailPage } from '@pages/BookingDetailPage';
import { CompleteBookingPage } from '@pages/CompleteBookingPage';
import { MyBookingsPage } from '@pages/MyBookingsPage';
import { PROJECTS, API } from '@data/testData';
import {
  findBookableNonBeneUnit,
  getProject,
  getActiveBookingProjectCodes,
} from '@helpers/marketplaceApi';

/**
 * BOOK — the end-to-end off-plan booking journey.
 * spec: specs/exploration-report.md  (TC-BOOK)
 *
 * State-changing: creates a real booking in pre-production. The account may hold
 * only one active booking per project, so this journey targets a project the
 * account has not booked, and skips itself if that is no longer true.
 */
test.describe('Booking - end to end', () => {
  test('BOOK-01 @P0 @smoke book an available unit through to the success state', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // --- preconditions -----------------------------------------------------
    const project = await getProject(page, PROJECTS.bookable);
    expect(project.bookable, `Project ${PROJECTS.bookable} must be bookable`).toBeTruthy();

    const blockedCodes = await getActiveBookingProjectCodes(page);
    test.skip(
      blockedCodes.includes(project.code),
      `Account already holds an active booking in ${project.code}; cancel it or pick another project.`,
    );

    const unit = await findBookableNonBeneUnit(page, PROJECTS.bookable);

    // --- step 1: open the unit --------------------------------------------
    const unitPage = new UnitDetailPage(page, unit.id);
    await unitPage.open();
    await unitPage.expectBookable();

    // --- step 2: start the booking ----------------------------------------
    // start_booking is async: 202 + CQRS precondition result.
    const startBooking = page.waitForResponse(
      (r) => r.url().includes(API.startBooking(PROJECTS.bookable)),
      { timeout: 120_000 },
    );

    const outcome = await unitPage.startBooking();
    expect(
      outcome,
      'Booking should advance to the summary rather than being blocked',
    ).toBe('summary');
    expect((await startBooking).status()).toBe(202);

    // --- step 3: review the booking summary -------------------------------
    const summary = new BookingSummaryPage(page);
    await summary.expectLoaded();

    const summaryText = await summary.summaryText();
    expect(summaryText, 'Summary should name the project').toContain(project.nameEn);
    expect(summaryText).toMatch(/Non-subsidised price|Project Type/i);

    // --- step 4: confirm ---------------------------------------------------
    const bookingId = await summary.confirmBooking();
    expect(bookingId).toMatch(/^\d+$/);

    // --- step 5: success state --------------------------------------------
    const success = new BookingSuccessPage(page);
    await success.expectLoaded(bookingId);
    await expect(success.completeBookingButton).toBeVisible();

    // --- step 6: the booking is now listed --------------------------------
    const myBookings = new MyBookingsPage(page);
    await myBookings.open();
    await myBookings.expectLoaded();
    expect(
      await myBookings.hasBookingForUnit(unit.unitName),
      `New booking for unit ${unit.unitName} should appear in My Bookings`,
    ).toBeTruthy();
  });

  test('BOOK-12 @P1 booking completion offers payment method and contract stages', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Resume the most recent booking that still needs completing.
    const myBookings = new MyBookingsPage(page);
    await myBookings.open();
    await myBookings.expectLoaded();
    await myBookings.selectTab(myBookings.tabActive);

    const hasActive = await myBookings.hasAnyBooking();
    test.skip(!hasActive, 'TEST DATA BLOCKER: account holds no active booking to complete');

    await myBookings.openBookingDetails(0);
    const bookingId = (page.url().match(/view-booking\/(\d+)/) ?? [])[1];

    const detail = new BookingDetailPage(page, bookingId);
    await detail.expectLoaded();
    await expect(detail.paymentMethodStep).toBeVisible();
    await expect(detail.signContractStep).toBeVisible();
    await expect(detail.cancelBookingButton).toBeVisible();

    // --- payment-method stage ---------------------------------------------
    await detail.goToPaymentMethod();

    const complete = new CompleteBookingPage(page, bookingId);
    await complete.expectLoaded();

    // Save&continue stays disabled until BOTH method and schedule are chosen.
    await expect(complete.saveAndContinueButton).toBeDisabled();

    // A non-beneficiary, not-eligible account is offered Cash only.
    expect(await complete.availablePaymentMethods()).toContain('cashRadio');
    expect(await complete.paymentScheduleCount()).toBeGreaterThan(0);

    await complete.selectCash();
    const scheduleValue = await complete.selectPaymentSchedule('fixed');
    expect(scheduleValue).toMatch(/^fixed_payment_schedule___\d+$/);

    await expect(complete.saveAndContinueButton).toBeEnabled();
  });
});
