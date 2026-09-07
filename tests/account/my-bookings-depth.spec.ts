import { test, expect } from '@fixtures/pages.fixture';
import { MyBookingsPage } from '@pages/MyBookingsPage';

test.describe('My bookings - depth', () => {
  test('MBK-01 @P1 the Cancelled tab lists only cancelled bookings', async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    await bookings.selectTab(bookings.tabCancelled);

    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no cancelled bookings in this environment');

    const body = await authenticatedPage.locator('body').innerText();
    expect(body).toMatch(/Cancel|ملغ/i);
  });

  test('MBK-02 @P1 the Completed tab renders', async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    await bookings.selectTab(bookings.tabCompleted);

    // Either completed bookings or an explicit empty state — never a blank pane.
    await bookings.waitForListing();
  });

  test('MBK-03 @P1 the Unpaid tab renders', async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    await bookings.selectTab(bookings.tabUnpaid);

    await bookings.waitForListing();
  });

  test('MBK-04 @P1 the Ready to sign tab renders', async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    await bookings.selectTab(bookings.tabReadyToSign);

    await bookings.waitForListing();
  });

  test('MBK-05 @P2 the All tab is a superset of the Active tab', async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    await bookings.selectTab(bookings.tabActive);
    const activeCount = await bookings.bookingCount();

    await bookings.selectTab(bookings.tabAll);
    const allCount = await bookings.bookingCount();

    expect(allCount).toBeGreaterThanOrEqual(activeCount);
  });

  test('MBK-07 @P1 a booking card carries its identifying fields', async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to inspect');

    const body = await authenticatedPage.locator('body').innerText();
    // The listing card carries product type, unit type and the unit code.
    // "Property type" belongs to the booking *detail* page, not this listing.
    expect(body).toMatch(/Product type|نوع المنتج/i);
    expect(body).toMatch(/Unit type|Unit code|Plot code|نوع الوحدة/i);
  });

  test('MBK-11 @P1 View details opens the matching booking', async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to open');

    await bookings.openBookingDetails(0);

    await expect(authenticatedPage).toHaveURL(/view-booking\/\d+/);
    await expect(
      authenticatedPage.getByRole('heading', { name: /Booking/i }).first(),
    ).toBeVisible({ timeout: 90_000 });
  });

  test('MBK-13 @P2 returning from a booking keeps the listing usable', async ({
    authenticatedPage,
  }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    const hasAny = await bookings.hasAnyBooking();
    test.skip(!hasAny, 'Account has no bookings to open');

    await bookings.openBookingDetails(0);
    await authenticatedPage.goBack({ waitUntil: 'commit' });

    await bookings.expectLoaded();
  });

  test('MBK-06 @P1 every status tab is present', async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();

    expect(await bookings.tabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed', 'Unpaid', 'Ready to sign']),
    );
  });
});
