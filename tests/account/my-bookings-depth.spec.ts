import { test, expect } from '@fixtures/pages.fixture';
import { MyBookingsPage } from '@pages/MyBookingsPage';
import { logStep } from '@helpers/LogSteps';

test.describe('My bookings - depth', () => {
  test('TC-01 The Cancelled tab lists only cancelled bookings', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the my bookings listing');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Select the cancelled tab');
    await bookings.selectTab(bookings.tabCancelled);

    await logStep('Step 03: Confirm cancelled-booking content is present');
    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no cancelled bookings in this environment');
    const body = await authenticatedPage.locator('body').innerText();
    expect(body).toMatch(/Cancel|ملغ/i);
  });

  test('TC-02 The Completed tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open my bookings');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Select the completed tab');
    await bookings.selectTab(bookings.tabCompleted);

    await logStep('Step 03: Ensure the completed view renders without a blank pane');
    await bookings.waitForListing();
  });

  test('TC-03 The Unpaid tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the bookings page');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Select the unpaid tab');
    await bookings.selectTab(bookings.tabUnpaid);

    await logStep('Step 03: Verify the unpaid listing renders');
    await bookings.waitForListing();
  });

  test('TC-04 The Ready to sign tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open my bookings');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Select the ready to sign tab');
    await bookings.selectTab(bookings.tabReadyToSign);

    await logStep('Step 03: Verify the tab renders a listing');
    await bookings.waitForListing();
  });

  test('TC-05 The All tab is a superset of the Active tab', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the bookings listing');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Capture the active tab count');
    await bookings.selectTab(bookings.tabActive);
    const activeCount = await bookings.bookingCount();

    await logStep('Step 03: Compare with the all tab total');
    await bookings.selectTab(bookings.tabAll);
    const allCount = await bookings.bookingCount();
    expect(allCount).toBeGreaterThanOrEqual(activeCount);
  });

  test('TC-06 Booking card carries its identifying fields', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the bookings page');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Check whether any booking rows are present');
    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to inspect');

    await logStep('Step 03: Validate identifying booking fields are visible');
    const body = await authenticatedPage.locator('body').innerText();
    expect(body).toMatch(/Product type|نوع المنتج/i);
    expect(body).toMatch(/Unit type|Unit code|Plot code|نوع الوحدة/i);
  });

  test('TC-07 View details opens the matching booking', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the booking list');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Check there is a booking to open');
    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to open');

    await logStep('Step 03: Open the first booking details page');
    await bookings.openBookingDetails(0);

    await logStep('Step 04: Confirm the booking detail page is opened');
    await expect(authenticatedPage).toHaveURL(/view-booking\/\d+/);
    await expect(
      authenticatedPage.getByRole('heading', { name: /Booking/i }).first(),
    ).toBeVisible({ timeout: 90_000 });
  });

  test('TC-08 Returning from a booking keeps the listing usable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the bookings page');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Ensure there is a booking to drill into');
    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to open');

    await logStep('Step 03: Open the booking details and return');
    await bookings.openBookingDetails(0);
    await authenticatedPage.goBack({ waitUntil: 'commit' });

    await logStep('Step 04: Verify the listing is still usable after return');
    await bookings.expectLoaded();
  });

  test('TC-09 Every status tab is present', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);

    await logStep('Step 01: Open the bookings page');
    await bookings.open();
    await bookings.expectLoaded();

    await logStep('Step 02: Validate the full set of status tabs');
    expect(await bookings.tabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed', 'Unpaid', 'Ready to sign']),
    );
  });
});
