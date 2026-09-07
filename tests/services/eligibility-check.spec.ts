import { test, expect } from '@fixtures/pages.fixture';
import { EligibilityCheckPage } from '@pages/EligibilityCheckPage';

/**
 * ELG — Eligibility Check wizard.
 * spec: specs/functional-test-design.md § 20
 *
 * Coverage stops at the step-1 consent gate on purpose. Advancing further
 * submits a real eligibility assessment against the pre-production beneficiary
 * record and mutates `eligible_status`, which would make the suite
 * non-repeatable — see the blocked list in the summary.
 */
test.describe('Eligibility check', () => {
  test('ELG-01 @P1 the wizard opens with all four steps', async ({ authenticatedPage }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await expect(authenticatedPage).toHaveURL(/\/app\/eligibility\/check/);
    expect(await eligibility.stepLabels()).toEqual([
      'Terms and Conditions',
      'Acknowledgement',
      'Verify Information',
      'Financial Advisory',
    ]);
  });

  test('ELG-02 @P0 continue is disabled until the terms are accepted', async ({
    authenticatedPage,
  }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await expect(eligibility.agreeCheckbox).not.toBeChecked();
    await expect(eligibility.agreeButton).toBeDisabled();
  });

  test('ELG-03 @P0 accepting the terms enables continue', async ({ authenticatedPage }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await eligibility.acceptTerms();

    await expect(eligibility.agreeCheckbox).toBeChecked();
    await expect(eligibility.agreeButton).toBeEnabled();
  });

  test('ELG-04 @P1 unticking the terms disables continue again', async ({ authenticatedPage }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await eligibility.acceptTerms();
    await expect(eligibility.agreeButton).toBeEnabled();

    await eligibility.uncheckTerms();

    await expect(eligibility.agreeCheckbox).not.toBeChecked();
    await expect(eligibility.agreeButton).toBeDisabled();
  });

  /**
   * The guard here does **not** send guests to the login page the way the
   * account-portal routes do — it bounces them to the marketplace instead. The
   * assertion therefore tests the security property itself (a guest never
   * reaches the wizard) rather than one specific redirect target.
   */
  test('ELG-16 @P0 the wizard is not reachable when logged out', async ({ page }) => {
    await page.goto('/app/eligibility/check?lang=en', { waitUntil: 'commit' });

    await expect
      .poll(() => new URL(page.url()).pathname, {
        timeout: 150_000,
        message: 'A guest must be redirected away from the eligibility wizard',
      })
      .not.toMatch(/\/app\/eligibility\/check/);

    await expect(page.locator('#agreeTermsConditions')).toHaveCount(0);
  });
});
