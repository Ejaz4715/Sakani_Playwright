import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

export interface MortgageInput {
  propertyPrice?: string;
  monthlyIncome?: string;
  monthlyLiabilities?: string;
  financingTerm?: string;
  interestRate?: string;
  downPayment?: string;
  fundingPeriodDropdown?: string;
  firstHome?: 'First house' | 'Second house or more';
  beneficiary?: 'yes' | 'no';
}

export interface MortgageResult {
  monthlyPayment: string;
  totalFunding: string;
  totalInterest: string;
}

export class MortgageCalculatorPage extends BasePage {
  protected readonly path = '/app/mortgage-page';
  private readonly amountFields: Locator;
  private readonly numberFields: Locator;

  readonly propertyPrice: Locator;
  readonly monthlyIncome: Locator;
  readonly monthlyLiabilities: Locator;
  readonly financingTerm: Locator;
  readonly interestRate: Locator;
  readonly downPayment: Locator;
  readonly fundingPeriodDropdown: Locator;
  readonly typOfPropertyListOptions: Locator;
  readonly typOfPropertyDropdown: Locator;
  readonly fundingPeriodListOptions: Locator;

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

    this.propertyPrice = page.locator("//app-label[@label='MORTGAGE.CALCULATOR.PROPERTY_PRICE']/following-sibling::div/child::input");
    this.monthlyIncome = page.locator("//app-label[@label='MORTGAGE.CALCULATOR.MONTHLY_INCOME']/following-sibling::input");
    this.monthlyLiabilities = page.locator("//app-label[@label='MORTGAGE.CALCULATOR.MONTHLY_LIABILITIES']/following-sibling::input");;
    this.financingTerm = this.numberFields.nth(0);
    this.interestRate = page.locator("//app-label[@label='MORTGAGE.CALCULATOR.INTEREST_RATE']/following-sibling::div/child::input");
    this.downPayment = page.locator("//app-label[@label='MORTGAGE.CALCULATOR.DOWN_PAYMENT_AMOUNT']/following-sibling::div/child::input");
    this.fundingPeriodDropdown = page.locator("//app-dropdown[@formcontrolname='fundingPeriod']");
    this.fundingPeriodListOptions = page.locator("//div[@role='option']/descendant::span[text() = '5 Years']");
    this.typOfPropertyDropdown = page.locator("//app-dropdown[@formcontrolname='isFirstHome']");
    this.typOfPropertyListOptions = page.locator("//div[@role='option']/descendant::span[text() = 'First house']");

    this.firstHomeYes = page.locator('#firstHomeYes');
    this.firstHomeNo = page.locator('#firstHomeNo');
    this.beneficiaryYes = page.locator('#beneficiaryYes');
    this.beneficiaryNo = page.locator('#beneficiaryNo');

    this.calculateButton = page
      .getByRole('button', { name: /Calculate Your Mortgage|Update|احسب|تحديث/i })
      .first();
    this.clearButton = page.getByRole('button', { name: /^\s*(Clear all|حذف الكل)\s*$/i }).first();

    // The result block renders "SAR 4,363.058" while the inputs above it still
    // carry the older "SR 0 " placeholder. `SA?R` matches both spellings.
    this.monthlyPaymentValue = page.getByText(/^\s*SAR\s*[\d,]+(?:\.\d+)?\s*\/\s*Month\s*$/i).first();
    this.totalFundingValue = page.getByText(/Total Financing Amount|إجمالي مبلغ التمويل/i);
    this.totalInterestValue = page.getByText(/Total Interest|إجمالي الفائدة/i);
    this.estimateDisclaimer = page.getByText(/Monthly payment|القسط الشهري/i).first();
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

  getOptionByText(optionText: string): Locator {
    return this.page.locator(`//div[@role='option']//span[text()='${optionText}']`);
  }

  /** Fill only the fields present on `data`; omitted fields are left untouched. */
  async fill(data: MortgageInput): Promise<void> {
    if (data.propertyPrice !== undefined) await this.propertyPrice.fill(data.propertyPrice);
    if (data.monthlyIncome !== undefined) await this.monthlyIncome.fill(data.monthlyIncome);
    if (data.monthlyLiabilities !== undefined) await this.monthlyLiabilities.fill(data.monthlyLiabilities);
    if (data.financingTerm !== undefined) await this.financingTerm.fill(data.financingTerm);
    if (data.fundingPeriodDropdown !== undefined) {
      await this.fundingPeriodDropdown.click();
      await this.getOptionByText(data.fundingPeriodDropdown).click();
    }
    if (data.interestRate !== undefined) await this.interestRate.fill(data.interestRate);
    if (data.downPayment !== undefined) await this.downPayment.fill(data.downPayment);

    if (data.firstHome !== undefined) {
      await this.typOfPropertyDropdown.click();
      await this.getOptionByText(data.firstHome).click();
    }
    // if (data.firstHome) {
    //   await (data.firstHome === 'First house' ? this.firstHomeYes : this.firstHomeNo).check({ force: true });
    // }
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
        .filter((t) => /required|must be between|invalid|مطلوب|يجب أن تكون|100,?000 or more|Down payment amount cannot exceed the property price/i.test(t));
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
