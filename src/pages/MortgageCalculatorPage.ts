import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

export interface MortgageInput {
  propertyPrice?: string;
  monthlyIncome?: string;
  monthlyLiabilities?: string;
  financingTerm?: string;
  interestRate?: string;
  downPayment?: string;
  firstHome?: 'yes' | 'no';
  beneficiary?: 'yes' | 'no';
}

export interface MortgageResult {
  monthlyPayment: string;
  totalFunding: string;
  totalInterest: string;
}

/**
 * Mortgage Calculator — `/app/mortgage-page`
 *
 * Reached from the Services menu ("Get started" on `/services/mortgage-calculator`)
 * and from the "Mortgage Calculator" CTA on a unit page.
 *
 * Locator note: the six amount/number fields carry **no id, name or `for`
 * attribute** on their labels, so `getByLabel` does not resolve them. They are
 * addressed by placeholder plus DOM order instead, which is stable because the
 * two placeholder styles partition the form exactly:
 *   `SR 0 ` → Property Price, Monthly Income, Monthly Liabilities
 *   `0`     → Financing Term, Annual Interest Rate, Down Payment Percentage
 * The two radio groups DO have proper ids and are addressed directly.
 *
 * Behaviour note: the submit button is **always enabled** — validation runs on
 * submit rather than gating the button — and its label changes from
 * "Calculate Your Mortgage" to "Update" once a result has been produced.
 */
export class MortgageCalculatorPage extends BasePage {
  protected readonly path = '/app/mortgage-page';

  /** Currency fields, in DOM order. */
  private readonly amountFields: Locator;
  /** Plain-number fields (years / percentages), in DOM order. */
  private readonly numberFields: Locator;

  readonly propertyPrice: Locator;
  readonly monthlyIncome: Locator;
  readonly monthlyLiabilities: Locator;
  readonly financingTerm: Locator;
  readonly interestRate: Locator;
  readonly downPayment: Locator;

  readonly firstHomeYes: Locator;
  readonly firstHomeNo: Locator;
  readonly beneficiaryYes: Locator;
  readonly beneficiaryNo: Locator;

  /** Matches both states of the submit control ("Calculate Your Mortgage" / "Update"). */
  readonly calculateButton: Locator;
  readonly clearButton: Locator;

  readonly monthlyPaymentValue: Locator;
  readonly totalFundingValue: Locator;
  readonly totalInterestValue: Locator;
  readonly estimateDisclaimer: Locator;
  readonly exploreMatchingOptions: Locator;

  readonly requiredFieldError: Locator;
  readonly rangeError: Locator;

  constructor(page: Page) {
    super(page);

    this.amountFields = page.locator('input[placeholder="SR 0 "]');
    this.numberFields = page.locator('input[placeholder="0"]');

    this.propertyPrice = this.amountFields.nth(0);
    this.monthlyIncome = this.amountFields.nth(1);
    this.monthlyLiabilities = this.amountFields.nth(2);
    this.financingTerm = this.numberFields.nth(0);
    this.interestRate = this.numberFields.nth(1);
    this.downPayment = this.numberFields.nth(2);

    this.firstHomeYes = page.locator('#firstHomeYes');
    this.firstHomeNo = page.locator('#firstHomeNo');
    this.beneficiaryYes = page.locator('#beneficiaryYes');
    this.beneficiaryNo = page.locator('#beneficiaryNo');

    this.calculateButton = page
      .getByRole('button', { name: /Calculate Your Mortgage|Update|احسب|تحديث/i })
      .first();
    this.clearButton = page.getByRole('button', { name: /^\s*(Clear|مسح)\s*$/i }).first();

    // The result block renders "SAR 4,363.058" while the inputs above it still
    // carry the older "SR 0 " placeholder. `SA?R` matches both spellings.
    this.monthlyPaymentValue = page.getByText(/^\s*SA?R[\d,.\s]+$/).first();
    this.totalFundingValue = page.getByText(/Total amount of funding|إجمالي مبلغ التمويل/i);
    this.totalInterestValue = page.getByText(/Total Interest|إجمالي الفائدة/i);
    this.estimateDisclaimer = page.getByText(/This result is an estimate|هذه النتيجة تقديرية/i);
    this.exploreMatchingOptions = page.getByRole('button', { name: /Explore Matching Options/i })
      .or(page.getByRole('link', { name: /Explore Matching Options/i }));

    this.requiredFieldError = page.getByText(/This field is required|هذا الحقل مطلوب/i);
    this.rangeError = page.getByText(/must be between|يجب أن تكون القيمة بين/i);
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.propertyPrice);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.propertyPrice).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.calculateButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
  }

  /** Fill only the fields present on `data`; omitted fields are left untouched. */
  async fill(data: MortgageInput): Promise<void> {
    if (data.propertyPrice !== undefined) await this.propertyPrice.fill(data.propertyPrice);
    if (data.monthlyIncome !== undefined) await this.monthlyIncome.fill(data.monthlyIncome);
    if (data.monthlyLiabilities !== undefined) await this.monthlyLiabilities.fill(data.monthlyLiabilities);
    if (data.financingTerm !== undefined) await this.financingTerm.fill(data.financingTerm);
    if (data.interestRate !== undefined) await this.interestRate.fill(data.interestRate);
    if (data.downPayment !== undefined) await this.downPayment.fill(data.downPayment);
    if (data.firstHome) {
      await (data.firstHome === 'yes' ? this.firstHomeYes : this.firstHomeNo).check({ force: true });
    }
    if (data.beneficiary) {
      await (data.beneficiary === 'yes' ? this.beneficiaryYes : this.beneficiaryNo).check({ force: true });
    }
  }

  async calculate(): Promise<void> {
    await this.calculateButton.scrollIntoViewIfNeeded();
    await this.calculateButton.click({ force: true });
  }

  async clear(): Promise<void> {
    await this.clearButton.scrollIntoViewIfNeeded();
    await this.clearButton.click({ force: true });
  }

  /** True once the calculator has produced a result block. */
  async hasResult(timeout = 20_000): Promise<boolean> {
    return this.estimateDisclaimer
      .first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Read the three result figures.
   *
   * The values are not individually addressable by role or test id, so they are
   * parsed out of the result block's text, which is the same surface the user reads.
   */
  async results(): Promise<MortgageResult> {
    await expect(this.estimateDisclaimer.first()).toBeVisible({ timeout: 30_000 });
    return this.page.evaluate(() => {
      const text = (document.body.innerText || '').replace(/\s+/g, ' ');
      const grab = (label: string) => {
        const i = text.indexOf(label);
        if (i < 0) return '';
        // "SAR 4,363.058" in the result block; older surfaces still say "SR".
        // Matching only `SR` silently yields '' here rather than failing at the
        // locator, which is what made this drift hard to spot.
        return (text.slice(i, i + 80).match(/SA?R\s?[\d,]+(?:\.\d+)?/) ?? [''])[0].trim();
      };
      return {
        monthlyPayment: grab('Monthly payment'),
        totalFunding: grab('Total amount of funding'),
        totalInterest: grab('Total Interest'),
      };
    });
  }

  /** Every validation message currently rendered on the form. */
  async validationMessages(): Promise<string[]> {
    return this.page.evaluate(() => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const out = [...document.querySelectorAll('*')]
        .filter((e) => visible(e) && e.children.length === 0)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter((t) => /required|must be between|invalid|مطلوب|يجب أن تكون/i.test(t));
      return [...new Set(out)];
    });
  }

  /** Current values of all six numeric fields, for reset assertions. */
  async fieldValues(): Promise<string[]> {
    const values: string[] = [];
    for (const field of [
      this.propertyPrice,
      this.monthlyIncome,
      this.monthlyLiabilities,
      this.financingTerm,
      this.interestRate,
      this.downPayment,
    ]) {
      values.push(await field.inputValue());
    }
    return values;
  }
}
