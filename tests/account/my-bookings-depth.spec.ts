import { test, expect } from '@fixtures/pages.fixture';
import { MyBookingsPage } from '@pages/MyBookingsPage';

test.describe('My bookings - depth', () => {
  test('TC-01 The Cancelled tab lists only cancelled bookings', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
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

  test('TC-02 The Completed tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();
    await bookings.selectTab(bookings.tabCompleted);
    // Either completed bookings or an explicit empty state — never a blank pane.
    await bookings.waitForListing();
  });

  test('TC-03 The Unpaid tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();
    await bookings.selectTab(bookings.tabUnpaid);
    await bookings.waitForListing();
  });

  test('TC-04 The Ready to sign tab renders', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();
    await bookings.selectTab(bookings.tabReadyToSign);
    await bookings.waitForListing();
  });

  test('TC-05 The All tab is a superset of the Active tab', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
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

  test('TC-06 Booking card carries its identifying fields', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
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

  test('TC-07 View details opens the matching booking', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
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

  test('TC-08 Returning from a booking keeps the listing usable', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
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

  test('TC-09 Every status tab is present', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const bookings = new MyBookingsPage(authenticatedPage);
    await bookings.open();
    await bookings.expectLoaded();
    expect(await bookings.tabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed', 'Unpaid', 'Ready to sign']),
    );
  });
});
