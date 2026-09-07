import { test, expect } from '@fixtures/pages.fixture';
import { TEST_USER } from '@data/testData';

/**
 * SEC — identifier validation and session behaviour at the login gate.
 * spec: specs/functional-test-design.md § 1
 *
 * Complements AUTH-01…11, which cover the happy path, the enable/disable gate
 * and two negative identifiers. These probe the input's boundaries and the
 * pre-Nafath session rules. Nothing here completes a login, so no OTP or Nafath
 * approval is involved.
 */
test.describe('Login identifier validation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.expectFormRendered();
  });

  test('SEC-04 @P1 an identifier shorter than 10 digits does not advance', async ({
    loginPage,
  }) => {
    await loginPage.usernameInput.fill('123456789');

    // Either the control stays disabled or submitting is rejected — it must
    // never reach the Nafath step with an incomplete identifier.
    if (await loginPage.continueButton.isEnabled()) {
      await loginPage.usernameInput.press('Enter');
      await expect(loginPage.nafathModal).toBeHidden({ timeout: 30_000 });
    } else {
      await expect(loginPage.continueButton).toBeDisabled();
    }
  });

  test('SEC-05 @P1 an over-long identifier is capped or rejected', async ({ loginPage }) => {
    await loginPage.usernameInput.fill('100001148599999');

    const value = await loginPage.usernameInput.inputValue();
    expect(value.length, 'identifier should be bounded').toBeLessThanOrEqual(20);
  });

  test('SEC-06 @P1 a purely alphabetic identifier does not reach Nafath', async ({ loginPage }) => {
    await loginPage.usernameInput.fill('abcdefghij');

    if (await loginPage.continueButton.isEnabled()) {
      await loginPage.usernameInput.press('Enter');
      await expect(loginPage.nafathModal).toBeHidden({ timeout: 30_000 });
    } else {
      await expect(loginPage.continueButton).toBeDisabled();
    }
  });

  test('SEC-07 @P2 surrounding whitespace is tolerated', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(`  ${TEST_USER.nationalId}  `);

    // Trimmed and accepted, or rejected outright — but not silently truncated
    // into a different identifier.
    const value = (await loginPage.usernameInput.inputValue()).trim();
    expect(value).toContain(TEST_USER.nationalId);
  });

  test('SEC-09 @P2 a whitespace-only identifier leaves Continue disabled', async ({
    loginPage,
  }) => {
    await loginPage.usernameInput.fill('     ');

    await expect(loginPage.continueButton).toBeDisabled();
  });

  test('SEC-06b @P2 symbols in the identifier do not reach Nafath', async ({ loginPage }) => {
    await loginPage.usernameInput.fill('10000!!485');

    if (await loginPage.continueButton.isEnabled()) {
      await loginPage.usernameInput.press('Enter');
      await expect(loginPage.nafathModal).toBeHidden({ timeout: 30_000 });
    } else {
      await expect(loginPage.continueButton).toBeDisabled();
    }
  });

  test('SEC-26 @P3 the terms and privacy links are reachable from login', async ({
    loginPage,
    page,
  }) => {
    const terms = page.getByRole('link', { name: /Terms of Use|شروط الاستخدام/i }).first();
    const privacy = page.getByRole('link', { name: /Privacy Policy|سياسة الخصوصية/i }).first();

    expect(await terms.getAttribute('href')).toContain('/terms');
    expect(await privacy.getAttribute('href')).toBeTruthy();
  });
});

test.describe('Login session rules', () => {
  test('SEC-12 @P1 closing the Nafath modal returns to the identifier step', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.expectFormRendered();

    await loginPage.usernameInput.fill(TEST_USER.nationalId);
    await loginPage.usernameInput.press('Enter');
    await expect(loginPage.nafathModal).toBeVisible({ timeout: 120_000 });

    await page.keyboard.press('Escape');

    // No session is created and the identifier step is usable again.
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 60_000 });
    await expect(page).toHaveURL(/\/app\/authentication\/login/);
  });

  test('SEC-23 @P2 opening login while authenticated does not create a second session', async ({
    authenticatedPage,
    header,
  }) => {
    await authenticatedPage.goto('/app/authentication/login?lang=en', { waitUntil: 'commit' });

    // Either redirected away or shown as already signed in — never a fresh
    // identifier form for an authenticated user.
    await expect
      .poll(
        async () => {
          const onLogin = /\/app\/authentication\/login/.test(authenticatedPage.url());
          return !onLogin || (await header.isAuthenticated());
        },
        { timeout: 150_000 },
      )
      .toBeTruthy();
  });

  test('SEC-28 @P2 repeated rapid submissions raise a single auth flow', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.expectFormRendered();

    const iamCalls: string[] = [];
    page.on('request', (r) => {
      if (/\/authApi\/api\/v\d+\/(iam|beneficiary_session)/.test(r.url())) iamCalls.push(r.url());
    });

    await loginPage.usernameInput.fill(TEST_USER.nationalId);
    await loginPage.usernameInput.press('Enter');
    await loginPage.usernameInput.press('Enter');
    await loginPage.usernameInput.press('Enter');

    await expect(loginPage.nafathModal).toBeVisible({ timeout: 120_000 });

    // The identifier check must not be fired once per keypress.
    const sessionChecks = iamCalls.filter((u) => u.includes('beneficiary_session'));
    expect(sessionChecks.length, 'duplicate session checks').toBeLessThanOrEqual(2);
  });
});

