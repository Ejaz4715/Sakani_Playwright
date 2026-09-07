import { test, expect } from '@fixtures/pages.fixture';
import { MyBookingsPage } from '@pages/MyBookingsPage';
import { Header } from '@components/Header';


test.describe('Account - my bookings', () => {
  test('PROF-01 @P0 @smoke my bookings lists bookings under status tabs', async ({
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

  test('PROF-01b @P1 the Active tab filters to active bookings', async ({ authenticatedPage }) => {
    const myBookings = new MyBookingsPage(authenticatedPage);
    await myBookings.open();
    await myBookings.expectLoaded();

    await myBookings.selectTab(myBookings.tabActive);

    // Active bookings have a booking date, never a cancellation date.
    await expect(
      authenticatedPage.getByText(/Cancellation date|تاريخ الإلغاء/i),
    ).toHaveCount(0);
  });

  test('PROF-02 @P1 a booking can be opened from the listing', async ({ authenticatedPage }) => {
    const myBookings = new MyBookingsPage(authenticatedPage);
    await myBookings.open();
    await myBookings.expectLoaded();

    await myBookings.openBookingDetails(0);

    await expect(authenticatedPage).toHaveURL(/view-booking\/\d+/);
    await expect(
      authenticatedPage.getByRole('heading', { name: /^Booking\s/i }).first(),
    ).toBeVisible({ timeout: 90_000 });
  });

  test('PROF-00 @P1 the account menu exposes every portal area', async ({ authenticatedPage }) => {
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
