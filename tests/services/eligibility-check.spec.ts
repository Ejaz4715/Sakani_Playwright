import { test, expect } from '@fixtures/pages.fixture';
import { EligibilityCheckPage } from '@pages/EligibilityCheckPage';

test.describe('Eligibility check', () => {
  test('TC-01 The wizard opens with all four steps', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
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

  test('TC-02 Continue is disabled until the terms are accepted', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await expect(eligibility.agreeCheckbox).not.toBeChecked();
    await expect(eligibility.agreeButton).toBeDisabled();
  });

  test('TC-03 Accepting the terms enables continue', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await eligibility.acceptTerms();

    await expect(eligibility.agreeCheckbox).toBeChecked();
    await expect(eligibility.agreeButton).toBeEnabled();
  });

  test('TC-04 Unticking the terms disables continue again', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const eligibility = new EligibilityCheckPage(authenticatedPage);
    await eligibility.open();
    await eligibility.expectLoaded();

    await eligibility.acceptTerms();
    await expect(eligibility.agreeButton).toBeEnabled();

    await eligibility.uncheckTerms();

    await expect(eligibility.agreeCheckbox).not.toBeChecked();
    await expect(eligibility.agreeButton).toBeDisabled();
  });

  test('TC-05 The wizard is not reachable when logged out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
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
