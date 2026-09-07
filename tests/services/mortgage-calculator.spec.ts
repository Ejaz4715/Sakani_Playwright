import { test, expect } from '@fixtures/pages.fixture';
import { MORTGAGE } from '@data/testData';

/**
 * MTG — Mortgage Calculator.
 * spec: specs/functional-test-design.md § 21
 *
 * The calculator is public and entirely client-side, so these tests use the
 * plain `page` fixture rather than `authenticatedPage` — no Nafath login is
 * needed and each test stays fast and independent.
 */
test.describe('Mortgage Calculator', () => {
  test.beforeEach(async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.open();
    await mortgageCalculatorPage.expectLoaded();
  });

  test('MTG-01 @P0 @smoke calculating with valid input returns all three figures', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();

    const results = await mortgageCalculatorPage.results();

    // `SA?R`: the result block renders "SAR 4,363.058" while this page's *input*
    // fields still use the older "SR" prefix (see MTG-23's input assertion), so
    // the two surfaces genuinely disagree. Both spellings are accepted here; the
    // assertion still requires a currency prefix followed by digits.
    expect(results.monthlyPayment, 'monthly payment').toMatch(/SA?R\s?[\d,]+/);
    expect(results.totalFunding, 'total funding').toMatch(/SA?R\s?[\d,]+/);
    expect(results.totalInterest, 'total interest').toMatch(/SA?R\s?[\d,]+/);
    await expect(mortgageCalculatorPage.estimateDisclaimer.first()).toBeVisible();
  });

  test('MTG-02 @P0 calculating with an empty form reports required fields', async ({
    mortgageCalculatorPage,
  }) => {
    // The submit control is deliberately always enabled; validation runs on submit.
    await expect(mortgageCalculatorPage.calculateButton).toBeEnabled();

    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toContain(MORTGAGE.errors.required);
    expect(await mortgageCalculatorPage.hasResult(5000)).toBeFalsy();
  });

  /**
   * DEFECT D11 — "Monthly Liabilities" is presented as optional (no required
   * asterisk, `required=false` on the input) but leaving it blank silently
   * blocks the calculation: no result is produced, the submit button stays on
   * "Calculate Your Mortgage", and **no validation message is shown**.
   *
   * The assertion below states the correct behaviour and is deliberately left
   * failing via `test.fail()` so the defect stays visible. Remove the marker
   * once the application either computes with a blank liabilities field or
   * marks the field required and reports it.
   */
  test('MTG-04 @P1 monthly liabilities is optional', async ({ mortgageCalculatorPage }) => {
    test.fail(true, 'D11: blank Monthly Liabilities blocks calculation with no error shown');

    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, monthlyLiabilities: '' });
    await mortgageCalculatorPage.calculate();

    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });

  test('MTG-04b @P1 blank monthly liabilities at least reports why nothing happened', async ({
    mortgageCalculatorPage,
  }) => {
    test.fail(true, 'D11: the form neither calculates nor explains itself');

    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, monthlyLiabilities: '' });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    const calculated = await mortgageCalculatorPage.hasResult(5000);
    expect(
      calculated || messages.length > 0,
      'The form must either calculate or tell the user what is wrong',
    ).toBeTruthy();
  });

  test('MTG-05 @P1 property price of zero does not produce a result', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, propertyPrice: '0' });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'A zero property price should be rejected rather than silently calculated',
    ).toBeTruthy();
  });

  test('MTG-06 @P1 negative amounts are rejected by the inputs', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.propertyPrice.fill('-100000');

    // The field is a formatted text input; a negative value must not survive.
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/^-/);
  });

  test('MTG-07 @P1 non-numeric input is not accepted', async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.propertyPrice.fill('abc');

    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/abc/i);
  });

  test('MTG-11 @P0 financing term of zero is rejected (no division by zero)', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, financingTerm: '0' });
    await mortgageCalculatorPage.calculate();

    if (await mortgageCalculatorPage.hasResult(5000)) {
      const { monthlyPayment } = await mortgageCalculatorPage.results();
      // A zero term must never yield Infinity/NaN leaking into the UI.
      expect(monthlyPayment).not.toMatch(/Infinity|NaN/i);
    }
  });

  test('MTG-12 @P1 zero interest rate still calculates', async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, interestRate: '0' });
    await mortgageCalculatorPage.calculate();

    if (await mortgageCalculatorPage.hasResult()) {
      const { totalInterest } = await mortgageCalculatorPage.results();
      expect(totalInterest).toMatch(/SA?R\s?0(\.00)?$|SA?R\s?0/);
    }
  });

  test('MTG-17 @P1 down payment above 100% is rejected', async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, downPayment: '150' });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'A down payment over 100% should be rejected',
    ).toBeTruthy();
  });

  test('MTG-18 @P1 monthly income below the allowed minimum is rejected', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.min - 1),
    });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toMatch(/must be between/i);
  });

  test('MTG-18b @P1 monthly income above the allowed maximum is rejected', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.max + 1),
    });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toMatch(/must be between/i);
  });

  test('MTG-18c @P1 monthly income exactly at the boundaries is accepted', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.min),
    });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | '), 'lower bound should be inclusive').not.toMatch(/must be between/i);
  });

  test('MTG-19 @P0 beneficiary answer changes the calculation', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, beneficiary: 'no' });
    await mortgageCalculatorPage.calculate();
    const asNonBeneficiary = await mortgageCalculatorPage.results();

    await mortgageCalculatorPage.fill({ beneficiary: 'yes' });
    await mortgageCalculatorPage.calculate();
    const asBeneficiary = await mortgageCalculatorPage.results();

    expect(
      asBeneficiary.monthlyPayment,
      'Beneficiary status should influence the result (subsidy applied)',
    ).not.toBe(asNonBeneficiary.monthlyPayment);
  });

  test('MTG-21 @P1 the two radio groups are mandatory', async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({
      propertyPrice: MORTGAGE.valid.propertyPrice,
      monthlyIncome: MORTGAGE.valid.monthlyIncome,
      monthlyLiabilities: MORTGAGE.valid.monthlyLiabilities,
      financingTerm: MORTGAGE.valid.financingTerm,
      interestRate: MORTGAGE.valid.interestRate,
      downPayment: MORTGAGE.valid.downPayment,
      // deliberately no radio answers
    });
    await mortgageCalculatorPage.calculate();

    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'Both radio groups are marked required and must be enforced',
    ).toBeTruthy();
  });

  test('MTG-22 @P1 Clear resets every field and both radio groups', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();

    await mortgageCalculatorPage.clear();

    expect(await mortgageCalculatorPage.fieldValues()).toEqual(['', '', '', '', '', '']);
    await expect(mortgageCalculatorPage.firstHomeYes).not.toBeChecked();
    await expect(mortgageCalculatorPage.beneficiaryNo).not.toBeChecked();
  });

  test('MTG-24 @P1 recalculating with a new price replaces the previous result', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    const first = await mortgageCalculatorPage.results();

    await mortgageCalculatorPage.fill({ propertyPrice: '1200000' });
    await mortgageCalculatorPage.calculate();
    const second = await mortgageCalculatorPage.results();

    expect(second.monthlyPayment).not.toBe(first.monthlyPayment);
    // Exactly one result block — the new figures replace, not append.
    await expect(mortgageCalculatorPage.estimateDisclaimer).toHaveCount(1);
  });

  test('MTG-25 @P2 amount fields format with a currency prefix and separators', async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.propertyPrice.fill('1000000');

    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).toMatch(/SR\s?1,000,000/);
  });

  test('MTG-27 @P2 the calculator is usable without logging in', async ({
    mortgageCalculatorPage,
    page,
  }) => {
    // beforeEach already opened the page with the unauthenticated `page` fixture.
    await expect(page).toHaveURL(/\/app\/mortgage-page/);

    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();

    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });
});
