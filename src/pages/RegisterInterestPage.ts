import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Register Interest — `/app/register-interest?project_id=<id>`
 *
 * Guest lead-capture form reached from a project page; no login required.
 * Name and phone are mandatory, email is optional, and a preferred-destinations
 * block pre-selects the originating project.
 *
 * Submission is protected by Cloudflare Turnstile + Google reCAPTCHA and is
 * validated server-side, so a submit can be challenged depending on origin IP.
 */
export class RegisterInterestPage extends BasePage {
  protected readonly path = '/app/register-interest';

  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly citySelect: Locator;
  readonly destinationsSelect: Locator;
  readonly projectsSelect: Locator;
  readonly backButton: Locator;
  readonly submitButton: Locator;
  readonly botChallenge: Locator;
  readonly successMessage: Locator;
  /** "The value is invalid or wrong format" — shown for bad email or phone. */
  readonly formatError: Locator;
  /** "Too short. Required length is 13. Current length is N." */
  readonly lengthError: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /تسجيل الاهتمام|Register Your Interest/i });
    this.nameInput = page.locator('#name');
    // The mobile field is a masked `type=text` input (`.ar-phone`), not `type=tel`.
    this.phoneInput = page.locator('input.ar-phone').first();
    this.emailInput = page.locator('#email');
    // The preferred-destination pickers are `ng-select` widgets whose inner
    // input carries **no placeholder attribute** — the prompt text is rendered
    // in a sibling element — so they are matched on the widget's visible text.
    this.citySelect = page
      .locator('ng-select')
      .filter({ hasText: /Search for a city|ابحث عن مدينة/i })
      .first();
    this.destinationsSelect = page
      .locator('ng-select')
      .filter({ hasText: /Search for destinations|ابحث عن الوجهات/i })
      .first();
    this.projectsSelect = page
      .locator('ng-select')
      .filter({ hasText: /Search for projects|ابحث عن المشاريع/i })
      .first();
    this.backButton = page.getByRole('button', { name: /^\s*(Back|رجوع)\s*$/i }).first();
    this.submitButton = page
      .getByRole('button', { name: /سجل اهتمامك|Register Your Interest/i })
      .last();
    this.formatError = page.getByText(/The value is invalid or wrong format|صيغة غير صحيحة/i);
    this.lengthError = page.getByText(/Too short\. Required length is \d+|قصير جدا/i);
    this.botChallenge = page.locator(
      'iframe[src*="challenges.cloudflare.com"], iframe[src*="/recaptcha/bframe"]',
    );
    this.successMessage = page.getByText(/تم تسجيل اهتمامك|successfully|شكرا/i);
  }

  async openForProject(projectId: number): Promise<void> {
    await this.gotoUntilReady(this.nameInput, `${this.path}?project_id=${projectId}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.nameInput).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.phoneInput).toBeVisible();
  }

  /**
   * Fill the lead fields. Only name and mobile gate the submit button — email,
   * city, destinations and projects are all optional.
   *
   * The mobile field is masked to `+966 5########`, so the typed digits are
   * reformatted on input; assertions should read `phoneInput.inputValue()`
   * rather than assume the typed string survives verbatim.
   */
  async fillLead(lead: { name?: string; phone?: string; email?: string }): Promise<void> {
    if (lead.name !== undefined) await this.nameInput.fill(lead.name);
    if (lead.phone !== undefined) await this.phoneInput.fill(lead.phone);
    if (lead.email !== undefined) await this.emailInput.fill(lead.email);
    // Commit the last field so its validator runs.
    await this.nameInput.blur().catch(() => {});
  }

  async selectCity(city: string): Promise<void> {
    await this.citySelect.click({ force: true });
    await this.citySelect.locator('input').first().fill(city);
    const option = this.page.locator('.ng-option').first();
    await option.waitFor({ state: 'visible', timeout: 30_000 });
    await option.click({ force: true });
  }

  /** Every validation message currently rendered on the form. */
  async validationMessages(): Promise<string[]> {
    return this.page.evaluate(() => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      return [
        ...new Set(
          [...document.querySelectorAll('*')]
            .filter((e) => visible(e) && e.children.length === 0)
            .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
            .filter((x) => /required|invalid|Too short|wrong format|مطلوب/i.test(x) && x.length < 90),
        ),
      ];
    });
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click({ force: true });
  }

  async isBotChallengeVisible(timeout = 10_000): Promise<boolean> {
    return this.botChallenge
      .first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }
}
