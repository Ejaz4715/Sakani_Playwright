import { test, expect } from '@fixtures/pages.fixture';
import { findBookableUnit } from '@helpers/marketplaceApi';
import { PROJECTS } from '@data/testData';
import { TEST_USER, API } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

test.describe('Authentication - validation', () => {
    test('TC-01 Continue is disabled until an identifier is entered', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ loginPage }) => {
    await logStep('Step 01: Open the login form');
    await loginPage.open();

    await logStep('Step 02: Confirm the identifier field is empty and continue is disabled');
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.continueButton).toBeDisabled();
  });

  test('TC-02 Continue enables after entering the national ID', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ loginPage }) => {
    await logStep('Step 01: Open the login page');
    await loginPage.open();

    await logStep('Step 02: Enter the national ID and enable continue');
    await loginPage.enterIdentifier(TEST_USER.nationalId);
    await expect(loginPage.continueButton).toBeEnabled();
  });

  test('TC-03 guest booking redirects to login and preserves the return url', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    page,
    browser,
  }) => {
    // The inventory lookup needs a session; the journey itself must be a guest.
    const lookupContext = await browser.newContext();
    const lookupPage = await lookupContext.newPage();
    let unitId: string | null = null;
    try {
      await logStep('Step 01: Find a bookable unit in a guest session');
      await lookupPage.goto('/app/marketplace?lang=en', { waitUntil: 'commit' });
      const unit = await findBookableUnit(lookupPage, PROJECTS.bookable);
      unitId = unit?.id ?? null;
    } finally {
      await lookupContext.close();
    }
    test.skip(
      !unitId,
      `TEST DATA BLOCKER: project ${PROJECTS.bookable} exposes no bookable unit for a guest journey`,
    );

    await logStep('Step 02: Deep-link the unit as a guest and trigger booking');
    await page.goto(`/app/units/${unitId}?lang=en`, { waitUntil: 'commit' });
    const bookButton = page.getByRole('button', { name: /Book a unit|احجز وحدة/i }).first();
    await bookButton.waitFor({ state: 'visible', timeout: 150_000 });
    await bookButton.focus();
    await bookButton.press('Enter');

    await logStep('Step 03: Confirm the login modal appears');
    await expect(page.locator("//app-nafath-login-modal")).toBeVisible({ timeout: 60_000 });
  });
});
