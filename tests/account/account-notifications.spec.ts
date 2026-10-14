import { test, expect } from '@fixtures/pages.fixture';
import { UserProfilePage } from '@pages/UserProfilePage';
import { Header } from '@components/Header';
import { logStep } from '@helpers/LogSteps';

test.describe('User Account', () => {

  test('TC-01 Account menu exposes every portal area', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    const header = new Header(authenticatedPage);

    await logStep('Step 01: Open the user menu');
    await header.openUserMenu();

    await logStep('Step 02: Validate the menu exposes all expected areas');
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

  test('TC-02 Notificaitons opens the notification centre', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ authenticatedPage }) => {
    const header = new Header(authenticatedPage);
    const profile = new UserProfilePage(authenticatedPage);
    
    await logStep('Step 01: Open the user menu');
    await header.openUserMenu();

    await logStep('Step 02: Open notifications');
    await profile.openNotifications();
    
    await logStep('Step 03: validate the notifications centre renders correctly');
    await profile.expectNotificationsCentreVisible();
  });
});
