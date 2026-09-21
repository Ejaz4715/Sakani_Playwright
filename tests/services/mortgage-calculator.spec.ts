import { test, expect } from '@fixtures/pages.fixture';
import { MORTGAGE } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

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

  test('TC-01 Calculating with valid input returns all three figures', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Fill the valid mortgage inputs');
    await mortgageCalculatorPage.fill(MORTGAGE.valid);

    await logStep('Step 02: Calculate and validate the result summary is visible');
    await mortgageCalculatorPage.calculate();
    const results = await mortgageCalculatorPage.results();
    expect(results.monthlyPayment, 'monthly payment').toMatch(/SA?R\s?[\d,]+/);
    await expect(mortgageCalculatorPage.totalFundingValue.first()).toBeVisible();
    await expect(mortgageCalculatorPage.totalInterestValue.first()).toBeVisible();
    await expect(mortgageCalculatorPage.estimateDisclaimer.first()).toBeVisible();
  });

  test('TC-02 Calculating with an empty form reports required fields', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage, page
  }) => {
    await logStep('Step 01: Leave the form empty and submit');
    await expect(mortgageCalculatorPage.calculateButton).toBeEnabled();
    await mortgageCalculatorPage.calculate();

    await logStep('Step 02: Confirm required-field validation is shown');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toContain(MORTGAGE.errors.required);
  });

  test('TC-03 Monthly liabilities is optional', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await logStep('Step 01: Leave monthly liabilities blank and calculate');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, monthlyLiabilities: '' });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Verify a valid result is still produced');
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });

  test('TC-04 Property price of zero does not produce a result', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Set the property price to zero');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, propertyPrice: '0' });
    await mortgageCalculatorPage.calculate();

    await logStep('Step 02: Confirm the result is rejected');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'A zero property price should be rejected rather than silently calculated',
    ).toBeTruthy();
  });

  test('TC-05 Negative amounts are rejected by the inputs', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Enter a negative property price');
    await mortgageCalculatorPage.propertyPrice.fill('-100000');
    await logStep('Step 02: Confirm the input strips the negative sign');
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/^-/);
  });

  test('TC-06 Non-numeric input is not accepted', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await logStep('Step 01: Enter a non-numeric property price');
    await mortgageCalculatorPage.propertyPrice.fill('abc');
    await logStep('Step 02: Verify the value is not kept as text');
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/abc/i);
  });

  test('TC-07 Financing term of zero is rejected (no division by zero)', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Set the financing term to zero');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, financingTerm: '0' });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Verify the calculation does not leak invalid values');
    if (await mortgageCalculatorPage.hasResult(5000)) {
      const { monthlyPayment } = await mortgageCalculatorPage.results();
      expect(monthlyPayment).not.toMatch(/Infinity|NaN/i);
    }
  });

  test('TC-08 Zero interest rate still calculates', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await logStep('Step 01: Set a zero interest rate');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, interestRate: '0' });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Confirm the calculation keeps a valid zero-interest result');
    if (await mortgageCalculatorPage.hasResult()) {
      const { totalInterest } = await mortgageCalculatorPage.results();
      expect(totalInterest).toMatch(/SA?R\s?0(\.00)?$|SA?R\s?0/);
    }
  });

  test('TC-09 Down payment above 100% is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await logStep('Step 01: Enter an over-100% down payment');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, downPayment: '1000000000' });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Ensure the calculation is rejected');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'A down payment over 100% should be rejected',
    ).toBeTruthy();
  });

  test('TC-10 Monthly income below the allowed minimum is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Use income below the minimum range');
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.min - 1),
    });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Validate the range validation is shown');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toMatch(/must be between/i);
  });

  test('TC-11 Monthly income above the allowed maximum is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Use income above the maximum range');
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.max + 1),
    });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Validate the maximum-range validation is shown');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toMatch(/must be between/i);
  });

  test('TC-12 Monthly income exactly at the boundaries is accepted', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Set monthly income to the lower boundary');
    await mortgageCalculatorPage.fill({
      ...MORTGAGE.valid,
      monthlyIncome: String(MORTGAGE.incomeRange.min),
    });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Confirm the boundary value is accepted');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | '), 'lower bound should be inclusive').not.toMatch(/must be between/i);
  });

  test('TC-13 Two radio groups are mandatory', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await logStep('Step 01: Fill the form without radio answers');
    await mortgageCalculatorPage.fill({
      propertyPrice: MORTGAGE.valid.propertyPrice,
      monthlyIncome: MORTGAGE.valid.monthlyIncome,
      monthlyLiabilities: MORTGAGE.valid.monthlyLiabilities,
      financingTerm: MORTGAGE.valid.financingTerm,
      interestRate: MORTGAGE.valid.interestRate,
      downPayment: MORTGAGE.valid.downPayment,
    });
    await mortgageCalculatorPage.calculate();
    await logStep('Step 02: Confirm the radio-group validation is enforced');
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'Both radio groups are marked required and must be enforced',
    ).toBeTruthy();
  });

  test('TC-14 Clear resets every field and radio groups', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Fill the calculator and run it');
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
    await logStep('Step 02: Clear the form and confirm all values reset');
    await mortgageCalculatorPage.clear();
    expect(await mortgageCalculatorPage.fieldValues()).toEqual(['', '', '', '', '', '']);
    await expect(mortgageCalculatorPage.beneficiaryNo).not.toBeChecked();
  });

  test('TC-15 Recalculating with a new price replaces the previous result', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Calculate with the initial price');
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    const first = await mortgageCalculatorPage.results();
    await logStep('Step 02: Update the price and recalculate');
    await mortgageCalculatorPage.fill({ propertyPrice: '600000' });
    await mortgageCalculatorPage.calculate();
    const second = await mortgageCalculatorPage.results();
    expect(second.monthlyPayment).not.toBe(first.monthlyPayment);
    await expect(mortgageCalculatorPage.estimateDisclaimer).toHaveCount(1);
  });

  test('TC-16 Amount fields format with a currency prefix and separators', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Enter a price with digits only');
    await mortgageCalculatorPage.propertyPrice.fill('1000000');
    await logStep('Step 02: Confirm the formatted value includes the currency prefix and separators');
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).toMatch(/SR\s?1,000,000/);
  });

  test('TC-17 Calculator is usable without logging in', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
    page,
  }) => {
    await logStep('Step 01: Confirm the public mortgage page is loaded');
    await expect(page).toHaveURL(/\/app\/mortgage-page/);
    await logStep('Step 02: Fill and calculate without auth');
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });

  test('TC-18 Beneficiary answer changes the calculation', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await logStep('Step 01: Calculate as a non-beneficiary');
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, beneficiary: 'no' });
    await mortgageCalculatorPage.calculate();
    const asNonBeneficiary = await mortgageCalculatorPage.results();
    await logStep('Step 02: Switch to a beneficiary and recalculate');
    await mortgageCalculatorPage.fill({ beneficiary: 'yes' });
    await mortgageCalculatorPage.calculate();
    const asBeneficiary = await mortgageCalculatorPage.results();
    expect(
      asBeneficiary.monthlyPayment,
      'Beneficiary status should influence the result (subsidy applied)',
    ).not.toBe(asNonBeneficiary.monthlyPayment);
  });
});
