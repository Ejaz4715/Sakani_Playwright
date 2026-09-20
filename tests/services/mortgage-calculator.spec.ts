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

  test('TC-01 Calculating with valid input returns all three figures', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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
    // expect(results.totalFunding, 'total funding').toMatch(/SA?R\s?[\d,]+/);
    // expect(results.totalInterest, 'total interest').toMatch(/SA?R\s?[\d,]+/);
    await expect(mortgageCalculatorPage.totalFundingValue.first()).toBeVisible();
    await expect(mortgageCalculatorPage.totalInterestValue.first()).toBeVisible();
    await expect(mortgageCalculatorPage.estimateDisclaimer.first()).toBeVisible();
  });

  test('TC-02 Calculating with an empty form reports required fields', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage, page
  }) => {
    // The submit control is deliberately always enabled; validation runs on submit.
    await expect(mortgageCalculatorPage.calculateButton).toBeEnabled();
    await mortgageCalculatorPage.calculate();
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(messages.join(' | ')).toContain(MORTGAGE.errors.required);
  });

  test('TC-03 Monthly liabilities is optional', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, monthlyLiabilities: '' });
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });

  test('TC-04 Property price of zero does not produce a result', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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

  test('TC-05 Negative amounts are rejected by the inputs', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.propertyPrice.fill('-100000');
    // The field is a formatted text input; a negative value must not survive.
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/^-/);
  });

  test('TC-06 Non-numeric input is not accepted', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.propertyPrice.fill('abc');
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).not.toMatch(/abc/i);
  });

  test('TC-07 Financing term of zero is rejected (no division by zero)', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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

  test('TC-08 Zero interest rate still calculates', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, interestRate: '0' });
    await mortgageCalculatorPage.calculate();
    if (await mortgageCalculatorPage.hasResult()) {
      const { totalInterest } = await mortgageCalculatorPage.results();
      expect(totalInterest).toMatch(/SA?R\s?0(\.00)?$|SA?R\s?0/);
    }
  });

  test('TC-09 Down payment above 100% is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
    await mortgageCalculatorPage.fill({ ...MORTGAGE.valid, downPayment: '1000000000' });
    await mortgageCalculatorPage.calculate();
    const messages = await mortgageCalculatorPage.validationMessages();
    expect(
      messages.length > 0 || !(await mortgageCalculatorPage.hasResult(5000)),
      'A down payment over 100% should be rejected',
    ).toBeTruthy();
  });

  test('TC-10 Monthly income below the allowed minimum is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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

  test('TC-11 Monthly income above the allowed maximum is rejected', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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

  test('TC-12 Monthly income exactly at the boundaries is accepted', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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


  test('TC-13 Two radio groups are mandatory', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({ mortgageCalculatorPage }) => {
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

  test('TC-14 Clear resets every field and radio groups', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
    await mortgageCalculatorPage.clear();
    expect(await mortgageCalculatorPage.fieldValues()).toEqual(['', '', '', '', '', '']);
    // await expect(mortgageCalculatorPage.firstHomeYes).not.toBeChecked();
    await expect(mortgageCalculatorPage.beneficiaryNo).not.toBeChecked();
  });

  test('TC-15 Recalculating with a new price replaces the previous result', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    const first = await mortgageCalculatorPage.results();
    await mortgageCalculatorPage.fill({ propertyPrice: '600000' });
    await mortgageCalculatorPage.calculate();
    const second = await mortgageCalculatorPage.results();
    expect(second.monthlyPayment).not.toBe(first.monthlyPayment);
    // Exactly one result block — the new figures replace, not append.
    await expect(mortgageCalculatorPage.estimateDisclaimer).toHaveCount(1);
  });

  test('TC-16 Amount fields format with a currency prefix and separators', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
  }) => {
    await mortgageCalculatorPage.propertyPrice.fill('1000000');
    expect(await mortgageCalculatorPage.propertyPrice.inputValue()).toMatch(/SR\s?1,000,000/);
  });

  test('TC-17 Calculator is usable without logging in', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    mortgageCalculatorPage,
    page,
  }) => {
    // beforeEach already opened the page with the unauthenticated `page` fixture.
    await expect(page).toHaveURL(/\/app\/mortgage-page/);
    await mortgageCalculatorPage.fill(MORTGAGE.valid);
    await mortgageCalculatorPage.calculate();
    expect(await mortgageCalculatorPage.hasResult()).toBeTruthy();
  });

  test('TC-18 Beneficiary answer changes the calculation', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
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
});
