import { test, expect } from '@fixtures/pages.fixture';
import { TEST_USER, API } from '@data/testData';
import { Header } from '@components/Header';
import { logStep } from '@helpers/LogSteps';

test.describe('User authentication validation', () => {
  test('TC-01 Login page renders the identity form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ loginPage }) => {
    await logStep('Step 01: Open the login page');
    await loginPage.open();

    await logStep('Step 02: Verify the login title and identity form');
    await expect(loginPage.page).toHaveTitle(/Login|تسجيل الدخول/);
    await loginPage.expectFormRendered();
    await expect(loginPage.usernameInput).toHaveAttribute(
      'placeholder',
      /Enter your ID|أدخل معرفك/i,
    );
  });

  test('TC-02 Full login through Nafath lands on the marketplace', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    loginPage,
    page,
  }) => {
    const captcha = page.waitForResponse(
      (r) => r.url().includes(API.captcha) && r.request().method() === 'POST',
      { timeout: 120_000 },
    );
    const sessionCheck = page.waitForResponse(
      (r) => r.url().includes(API.sessionCheck) && r.request().method() === 'POST',
      { timeout: 120_000 },
    );

    await logStep('Step 01: Open the login form and continue with the national ID');
    await loginPage.open();
    await loginPage.continueWithId(TEST_USER.nationalId);

    await logStep('Step 02: Wait for server-side captcha and session validation');
    expect((await captcha).status(), 'reCAPTCHA validation should pass').toBe(200);
    expect((await sessionCheck).ok()).toBeTruthy();

    await logStep('Step 03: Confirm the Nafath modal');
    await expect(loginPage.nafathModal).toBeVisible({ timeout: 60_000 });
    await expect(loginPage.nafathModalIdInput).toHaveValue(TEST_USER.nationalId);
    const challengeNumber = await loginPage.confirmNafathModal();
    expect(challengeNumber, 'Nafath should display a challenge number').toMatch(/^\d{1,3}$/);

    await logStep('Step 04: Complete authentication and confirm marketplace entry');
    await loginPage.waitForAuthenticated();
    await expect(page).toHaveURL(/\/app\/marketplace/);
    await new Header(page).expectAuthenticated(/ALSHAIKHA|اليامي/);
  });

  test('TC-03 User can log out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const header = new Header(authenticatedPage);

    await logStep('Step 01: Log out from the authenticated session');
    await header.logout();

    await logStep('Step 02: Validate the login option is visible again');
    await expect(header.loginButton.first()).toBeVisible({ timeout: 90_000 });
  });
});