import { test, expect } from '@fixtures/pages.fixture';
import { MyBookingsPage } from '@pages/MyBookingsPage';
import { Header } from '@components/Header';


test.describe('Account - my bookings', () => {
  test('TC-01 My bookings lists bookings under status tabs', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const myBookings = new MyBookingsPage(authenticatedPage);
    await myBookings.open();
    await myBookings.expectLoaded();
    const tabs = await myBookings.tabLabels();
    for (const tab of ['All', 'Active', 'Cancelled', 'Completed', 'Unpaid', 'Ready to sign']) {
      expect(tabs, `Status tab "${tab}" should be present`).toContain(tab);
    }
    expect(
      await myBookings.hasAnyBooking(),
      'Fixture account should have at least one booking to list',
    ).toBeTruthy();
  });

  test('TC-02 The Active tab filters to active bookings', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const myBookings = new MyBookingsPage(authenticatedPage);
    await myBookings.open();
    await myBookings.expectLoaded();
    await myBookings.selectTab(myBookings.tabActive);
    // Active bookings have a booking date, never a cancellation date.
    await expect(
      authenticatedPage.getByText(/Cancellation date|تاريخ الإلغاء/i),
    ).toHaveCount(0);
  });

  test('TC-03 A booking can be opened from the listing', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const myBookings = new MyBookingsPage(authenticatedPage);
    await myBookings.open();
    await myBookings.expectLoaded();
    await myBookings.openBookingDetails(0);
    await expect(authenticatedPage).toHaveURL(/view-booking\/\d+/);
    await expect(
      authenticatedPage.getByRole('heading', { name: /^Booking\s/i }).first(),
    ).toBeVisible({ timeout: 90_000 });
  });

  test('TC-04 Account menu exposes every portal area', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const header = new Header(authenticatedPage);
    await header.openUserMenu();
    for (const item of [
      'Profile management',
      'Notifications',
      'Wallet',
      'My bookings',
      'Favorites',
      'Help & support',
      'Logout',
    ]) {
      await expect(
        authenticatedPage.getByText(item, { exact: true }).first(),
        `Account menu should offer "${item}"`,
      ).toBeVisible();
    }
  });
});
