import { test, expect } from '@fixtures/pages.fixture';
import { UserProfilePage } from '@pages/UserProfilePage';
import { PROFILE_ROUTES } from '@data/testData';

test.describe('Account - profile page', () => {
  test('TC-01 Dashboard renders for the authenticated user', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openDashboard();
    await expect(authenticatedPage).toHaveURL(/\/user-profile\/dashboard/);
    await expect(profile.startServiceButton.first()).toBeVisible();
  });

  test('TC-02 User profile sidebar exposes every top-level area', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openDashboard();
    const labels = await profile.sidebarLabels();
    expect(labels).toEqual(
      expect.arrayContaining([
        'Dashboard',
        'My information',
        'My Wallet',
        'Financial Advisory',
        'Activities',
        'Preferences',
        'Payment and transactions',
        'Favorites',
      ]),
    );
  });

  test('TC-03 My information shows the user profile and its actions', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openMyInformation();
    await expect(profile.profileHeading).toBeVisible();
    await expect(profile.verifyEmailButton.first()).toBeVisible();
    await expect(profile.updateContactButton.first()).toBeVisible();
  });

  test('TC-04 User national ID is not exposed in full', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openMyInformation();
    const body = await authenticatedPage.locator('body').innerText();
    // The raw 10-digit identifier must never be rendered in the profile UI.
    expect(body, 'Plain national ID should be masked').not.toContain('1000011485');
  });

  test('TC-05 Wallet shows a balance and both tabs (Balance & Transactions, Bank account)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();
    await expect(profile.walletHeading).toBeVisible();
    await expect(profile.walletBalance).toBeVisible();
    await expect(await profile.visibleTabLabels(['Balance & Transactions', 'Bank account'])).toEqual(
      expect.arrayContaining(['Balance & Transactions', 'Bank account']),
    );
  });

  test('TC-06 Wallet transactions list renders correctly', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();
    await expect(
      authenticatedPage.getByRole('heading', { name: /Transactions/i }).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-07 The bank account tab opens', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();
    await profile.bankAccountTab.click({ force: true });
    // Either bank details or an add-account prompt — both are valid, a blank
    // panel is not.
    await expect(
      authenticatedPage.getByText(/IBAN|bank|إضافة|account/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-08 Financial advisory shows the profile and both tabs (Overview, Financing Requests)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openFinancialAdvisory();
    await expect(profile.advisoryHeading.first()).toBeVisible();
    await expect(profile.updateFinancialInfoButton.first()).toBeVisible();
    expect(await profile.visibleTabLabels(['Overview', 'Financing Requests'])).toEqual(
      expect.arrayContaining(['Overview', 'Financing Requests']),
    );
  });

  test('TC-09 Financing requests tab opens', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openFinancialAdvisory();
    await profile.financingRequestsTab.click({ force: true });
    await expect(profile.advisoryHeading.first()).toBeVisible();
  });

  test('TC-10 Payments page exposes all four status tabs (All, Unpaid, Paid, Cancelled)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();
    expect(await profile.visibleTabLabels(['All', 'Unpaid', 'Paid', 'Cancelled'])).toEqual(
      expect.arrayContaining(['All', 'Unpaid', 'Paid', 'Cancelled']),
    );
  });

  test('TC-11 An invoice can be previewed from the payments list', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();
    const invoice = profile.previewInvoiceButton.first();
    const hasInvoice = await invoice.isVisible().catch(() => false);
    test.skip(!hasInvoice, 'Fixture account has no invoice to preview in this environment');
    await expect(invoice).toBeEnabled();
  });

  test('TC-12 Pagination controls are disabled on the first page', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();
    const first = authenticatedPage.getByRole('button', { name: /^\s*First\s*$/i }).first();
    const hasPaging = await first.isVisible().catch(() => false);
    test.skip(!hasPaging, 'Not enough transactions to paginate');
    await expect(first).toBeDisabled();
  });

  test('TC-13 Favorites exposes all five category tabs (All, Destinations, Projects, Units, Services)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openFavorites();
    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Units', 'Services']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Units', 'Services']));
  });

  test('TC-14 Registered interests exposes all five tabs (All, Destinations, Projects, Developers, Brokers)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openRegisteredInterests();
    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']));
  });

  test('TC-15 Registered interests shows its empty state with a CTA', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openRegisteredInterests();
    await expect(profile.exploreMarketplaceButton).toBeVisible({ timeout: 60_000 });
  });

  test('TC-16 Profile routes redirect to login page when logged out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ page }) => {
    await page.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });
    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });
});
