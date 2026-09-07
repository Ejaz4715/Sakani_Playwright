import { test, expect } from '@fixtures/pages.fixture';
import { UserProfilePage } from '@pages/UserProfilePage';
import { PROFILE_ROUTES } from '@data/testData';

test.describe('Account - profile pages', () => {
  test('DSH-01 @P1 dashboard renders for the authenticated user', async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openDashboard();

    await expect(authenticatedPage).toHaveURL(/\/user-profile\/dashboard/);
    await expect(profile.startServiceButton.first()).toBeVisible();
  });

  test('DSH-04 @P1 the portal sidebar exposes every top-level area', async ({
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

  test('MYI-01 @P1 my information shows the profile and its actions', async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openMyInformation();

    await expect(profile.profileHeading).toBeVisible();
    await expect(profile.verifyEmailButton.first()).toBeVisible();
    await expect(profile.updateContactButton.first()).toBeVisible();
  });

  test('MYI-02 @P0 the national ID is not exposed in full', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openMyInformation();

    const body = await authenticatedPage.locator('body').innerText();

    // The raw 10-digit identifier must never be rendered in the profile UI.
    expect(body, 'Plain national ID should be masked').not.toContain('1000011485');
  });

  test('WAL-01 @P1 wallet shows a balance and both tabs', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();

    await expect(profile.walletHeading).toBeVisible();
    await expect(profile.walletBalance).toBeVisible();
    await expect(await profile.visibleTabLabels(['Balance & Transactions', 'Bank account'])).toEqual(
      expect.arrayContaining(['Balance & Transactions', 'Bank account']),
    );
  });

  test('WAL-02 @P1 wallet transactions list renders', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();

    await expect(
      authenticatedPage.getByRole('heading', { name: /Transactions/i }).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('WAL-03 @P1 the bank account tab opens', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openWallet();

    await profile.bankAccountTab.click({ force: true });

    // Either bank details or an add-account prompt — both are valid, a blank
    // panel is not.
    await expect(
      authenticatedPage.getByText(/IBAN|bank|إضافة|account/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('FAD-01 @P1 financial advisory shows the profile and both tabs', async ({
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

  test('FAD-02 @P1 the financing requests tab opens', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openFinancialAdvisory();

    await profile.financingRequestsTab.click({ force: true });

    await expect(profile.advisoryHeading.first()).toBeVisible();
  });

  test('PAY-01 @P1 payments page exposes all four status tabs', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();

    expect(await profile.visibleTabLabels(['All', 'Unpaid', 'Paid', 'Cancelled'])).toEqual(
      expect.arrayContaining(['All', 'Unpaid', 'Paid', 'Cancelled']),
    );
  });

  test('PAY-02 @P1 an invoice can be previewed from the payments list', async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();

    const invoice = profile.previewInvoiceButton.first();
    const hasInvoice = await invoice.isVisible().catch(() => false);
    test.skip(!hasInvoice, 'Fixture account has no invoice to preview in this environment');

    await expect(invoice).toBeEnabled();
  });

  test('PAY-04 @P2 pagination controls are disabled on the first page', async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openPayments();

    const first = authenticatedPage.getByRole('button', { name: /^\s*First\s*$/i }).first();
    const hasPaging = await first.isVisible().catch(() => false);
    test.skip(!hasPaging, 'Not enough transactions to paginate');

    await expect(first).toBeDisabled();
  });

  test('FAV-01 @P1 favorites exposes all five category tabs', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openFavorites();

    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Units', 'Services']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Units', 'Services']));
  });

  test('PRF-01 @P1 registered interests exposes all five tabs', async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openRegisteredInterests();

    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']));
  });

  test('PRF-02 @P1 registered interests shows its empty state with a CTA', async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);
    await profile.openRegisteredInterests();

    await expect(profile.exploreMarketplaceButton).toBeVisible({ timeout: 60_000 });
  });

  test('SEC-16 @P0 profile routes redirect to login when logged out', async ({ page }) => {
    await page.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });

    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });
});
