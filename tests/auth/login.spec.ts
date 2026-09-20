import { test, expect } from '@fixtures/pages.fixture';
import { TEST_USER, API } from '@data/testData';
import { Header } from '@components/Header';

test.describe('User authentication validation', () => {
  test('TC-01 Login page renders the identity form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ loginPage }) => {
    await loginPage.open();
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
    await loginPage.open();
    await loginPage.continueWithId(TEST_USER.nationalId);
    // The bot gate must pass server-side before the flow can advance.
    expect((await captcha).status(), 'reCAPTCHA validation should pass').toBe(200);
    expect((await sessionCheck).ok()).toBeTruthy();
    // The Nafath modal pre-fills the submitted identifier.
    await expect(loginPage.nafathModal).toBeVisible({ timeout: 60_000 });
    await expect(loginPage.nafathModalIdInput).toHaveValue(TEST_USER.nationalId);
    // Confirming shows the push-approval screen with a challenge number.
    const challengeNumber = await loginPage.confirmNafathModal();
    expect(challengeNumber, 'Nafath should display a challenge number').toMatch(/^\d{1,3}$/);
    // Pre-production auto-approves; the app then loads the beneficiary profile.
    await loginPage.waitForAuthenticated();
    await expect(page).toHaveURL(/\/app\/marketplace/);
    await new Header(page).expectAuthenticated(/ALSHAIKHA|اليامي/);
  });

  test('TC-03 User can log out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const header = new Header(authenticatedPage);
    await header.logout();
    await expect(header.loginButton.first()).toBeVisible({ timeout: 90_000 });
  });
});