import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Eligibility Check wizard — `/app/eligibility/check`
 *
 * Reached from "Get started" on `/services/check-eligibility`. Four steps:
 *   1. Terms and Conditions  — a single consent checkbox gates the continue button
 *   2. Acknowledgement
 *   3. Verify Information
 *   4. Financial Advisory
 *
 * Step 1's continue control is disabled until `#agreeTermsConditions` is ticked,
 * which is the wizard's only client-side gate that can be asserted without
 * submitting a real eligibility assessment against the beneficiary record.
 */
export class EligibilityCheckPage extends BasePage {
  protected readonly path = '/app/eligibility/check';

  readonly heading: Locator;
  readonly stepIndicator: Locator;
  readonly termsHeading: Locator;
  readonly agreeCheckbox: Locator;
  readonly agreeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /Eligibility Check|فحص الأهلية/i }).first();
    this.stepIndicator = page.getByText(
      /Terms and Conditions|Acknowledgement|Verify Information|Financial Advisory/i,
    );
    this.termsHeading = page.getByRole('heading', { name: /Terms and Conditions/i }).first();
    this.agreeCheckbox = page.locator('#agreeTermsConditions');
    this.agreeButton = page.getByRole('button', {
      name: /Agree on the terms and conditions|الموافقة على الشروط/i,
    });
    this.backButton = page.getByRole('button', { name: /^\s*(Back|رجوع)\s*$/i }).first();
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.agreeCheckbox);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.agreeCheckbox).toBeAttached();
  }

  /** Step labels rendered by the wizard's progress indicator. */
  async stepLabels(): Promise<string[]> {
    return this.page.evaluate(() => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const known = [
        'Terms and Conditions',
        'Acknowledgement',
        'Verify Information',
        'Financial Advisory',
      ];
      const found = [...document.querySelectorAll('*')]
        .filter((e) => visible(e) && e.children.length === 0)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim());
      return known.filter((k) => found.includes(k));
    });
  }

  /**
   * Toggle the consent checkbox.
   *
   * The `<input type="checkbox">` is visually replaced by a styled control, so
   * clicking the input itself — even with `force` — does not change its state
   * ("Clicking the checkbox did not change its state"). The click has to land on
   * the associated label, which is what a real user activates.
   */
  private async toggleTerms(target: boolean): Promise<void> {
    if ((await this.agreeCheckbox.isChecked()) === target) return;

    const label = this.page.locator('label[for="agreeTermsConditions"]');
    if (await label.count()) {
      await label.first().click();
    } else {
      // Fall back to the control's own wrapper when no explicit label exists.
      await this.agreeCheckbox.locator('xpath=..').click({ position: { x: 10, y: 10 } });
    }
    await expect(this.agreeCheckbox).toBeChecked({ checked: target });
  }

  async acceptTerms(): Promise<void> {
    await this.toggleTerms(true);
  }

  async uncheckTerms(): Promise<void> {
    await this.toggleTerms(false);
  }
}
