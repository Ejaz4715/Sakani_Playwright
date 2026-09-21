import { test, expect } from '@fixtures/pages.fixture';
import { UserProfilePage } from '@pages/UserProfilePage';
import { PROFILE_ROUTES } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

test.describe('Account - profile page', () => {
  test('TC-01 Dashboard renders for the authenticated user', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the user dashboard');
    await profile.openDashboard();

    await logStep('Step 02: Validate the dashboard route and start CTA');
    await expect(authenticatedPage).toHaveURL(/\/user-profile\/dashboard/);
    await expect(profile.startServiceButton.first()).toBeVisible();
  });

  test('TC-02 User profile sidebar exposes every top-level area', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the dashboard and inspect the sidebar');
    await profile.openDashboard();

    await logStep('Step 02: Confirm the expected sidebar labels are exposed');
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

    await logStep('Step 01: Open the my information page');
    await profile.openMyInformation();

    await logStep('Step 02: Validate the profile heading and action controls');
    await expect(profile.profileHeading).toBeVisible();
    await expect(profile.verifyEmailButton.first()).toBeVisible();
    await expect(profile.updateContactButton.first()).toBeVisible();
  });

  test('TC-04 User national ID is not exposed in full', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the my information page');
    await profile.openMyInformation();

    await logStep('Step 02: Check the profile content does not expose the full national ID');
    const body = await authenticatedPage.locator('body').innerText();
    expect(body, 'Plain national ID should be masked').not.toContain('1000011485');
  });

  test('TC-05 Wallet shows a balance and both tabs (Balance & Transactions, Bank account)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the wallet page');
    await profile.openWallet();

    await logStep('Step 02: Validate wallet balance and tab set');
    await expect(profile.walletHeading).toBeVisible();
    await expect(profile.walletBalance).toBeVisible();
    await expect(await profile.visibleTabLabels(['Balance & Transactions', 'Bank account'])).toEqual(
      expect.arrayContaining(['Balance & Transactions', 'Bank account']),
    );
  });

  test('TC-06 Wallet transactions list renders correctly', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the wallet page');
    await profile.openWallet();

    await logStep('Step 02: Verify the transactions heading is visible');
    await expect(
      authenticatedPage.getByRole('heading', { name: /Transactions/i }).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-07 The bank account tab opens', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the wallet page');
    await profile.openWallet();

    await logStep('Step 02: Open the bank account tab');
    await profile.bankAccountTab.click({ force: true });

    await logStep('Step 03: Verify the bank account content is rendered');
    await expect(
      authenticatedPage.getByText(/IBAN|bank|إضافة|account/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-08 Financial advisory shows the profile and both tabs (Overview, Financing Requests)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the financial advisory page');
    await profile.openFinancialAdvisory();

    await logStep('Step 02: Validate the advisory heading, action, and tabs');
    await expect(profile.advisoryHeading.first()).toBeVisible();
    await expect(profile.updateFinancialInfoButton.first()).toBeVisible();
    expect(await profile.visibleTabLabels(['Overview', 'Financing Requests'])).toEqual(
      expect.arrayContaining(['Overview', 'Financing Requests']),
    );
  });

  test('TC-09 Financing requests tab opens', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the financial advisory page');
    await profile.openFinancialAdvisory();

    await logStep('Step 02: Open the financing requests tab');
    await profile.financingRequestsTab.click({ force: true });

    await logStep('Step 03: Confirm the page remains visible');
    await expect(profile.advisoryHeading.first()).toBeVisible();
  });

  test('TC-10 Payments page exposes all four status tabs (All, Unpaid, Paid, Cancelled)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the payments page');
    await profile.openPayments();

    await logStep('Step 02: Validate the payment tabs');
    expect(await profile.visibleTabLabels(['All', 'Unpaid', 'Paid', 'Cancelled'])).toEqual(
      expect.arrayContaining(['All', 'Unpaid', 'Paid', 'Cancelled']),
    );
  });

  test('TC-11 An invoice can be previewed from the payments list', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the payments page');
    await profile.openPayments();

    await logStep('Step 02: Check whether an invoice is available to preview');
    const invoice = profile.previewInvoiceButton.first();
    const hasInvoice = await invoice.isVisible().catch(() => false);
    test.skip(!hasInvoice, 'Fixture account has no invoice to preview in this environment');

    await logStep('Step 03: Ensure the invoice preview action is enabled');
    await expect(invoice).toBeEnabled();
  });

  test('TC-12 Pagination controls are disabled on the first page', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the payments list');
    await profile.openPayments();

    await logStep('Step 02: Inspect the first-page pagination controls');
    const first = authenticatedPage.getByRole('button', { name: /^\s*First\s*$/i }).first();
    const hasPaging = await first.isVisible().catch(() => false);
    test.skip(!hasPaging, 'Not enough transactions to paginate');

    await logStep('Step 03: Confirm the first page action is disabled');
    await expect(first).toBeDisabled();
  });

  test('TC-13 Favorites exposes all five category tabs (All, Destinations, Projects, Units, Services)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the favorites page');
    await profile.openFavorites();

    await logStep('Step 02: Validate the favorites tabs');
    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Units', 'Services']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Units', 'Services']));
  });

  test('TC-14 Registered interests exposes all five tabs (All, Destinations, Projects, Developers, Brokers)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the registered interests page');
    await profile.openRegisteredInterests();

    await logStep('Step 02: Validate the interest tabs');
    expect(
      await profile.visibleTabLabels(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']),
    ).toEqual(expect.arrayContaining(['All', 'Destinations', 'Projects', 'Developers', 'Brokers']));
  });

  test('TC-15 Registered interests shows its empty state with a CTA', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const profile = new UserProfilePage(authenticatedPage);

    await logStep('Step 01: Open the registered interests page');
    await profile.openRegisteredInterests();

    await logStep('Step 02: Validate the explore CTA is visible');
    await expect(profile.exploreMarketplaceButton).toBeVisible({ timeout: 60_000 });
  });

  test('TC-16 Profile routes redirect to login page when logged out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ page }) => {
    await logStep('Step 01: Navigate to the protected wallet route while logged out');
    await page.goto(`${PROFILE_ROUTES.wallet}?lang=en`, { waitUntil: 'commit' });

    await logStep('Step 02: Wait for the login redirect');
    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });

    await logStep('Step 03: Confirm the login page loads');
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });
});
