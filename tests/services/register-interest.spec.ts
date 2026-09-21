import { test, expect } from '@fixtures/pages.fixture';
import { REGISTER_INTEREST_LEAD, PROJECTS } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

test.describe('Register Interest', () => {
  test.beforeEach(async ({ registerInterestPage }) => {
    await registerInterestPage.openForProject(PROJECTS.registerInterest);
    await registerInterestPage.expectLoaded();
  });

  test('TC_01 The form opens scoped to the originating project', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await logStep('Step 01: Open the form for the scoped project');
    await expect(page).toHaveURL(
      new RegExp(`project_id=${PROJECTS.registerInterest}`),
    );

    await logStep('Step 02: Validate the default form fields are visible');
    await expect(registerInterestPage.heading.first()).toBeVisible();
    await expect(registerInterestPage.citySelect.first()).toBeVisible();
    await expect(registerInterestPage.destinationsSelect.first()).toBeVisible();
    await expect(registerInterestPage.projectsSelect.first()).toBeVisible();
  });

  test('TC-02 Submit is disabled while the form is empty', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Verify submit is disabled on an empty form');
    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-03 Name alone does not enable submit', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await logStep('Step 01: Fill only the name field');
    await registerInterestPage.fillLead({ name: REGISTER_INTEREST_LEAD.name });

    await logStep('Step 02: Confirm submit stays disabled');
    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-04 Name plus a valid mobile enables submit', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Fill the name and valid phone number');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await logStep('Step 02: Confirm submit is enabled');
    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('TC-05 Email is optional', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await logStep('Step 01: Fill the required fields without an email');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
      email: '',
    });

    await logStep('Step 02: Validate the form remains submit-ready');
    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('TC-06 City selection is optional', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await logStep('Step 01: Fill the required fields without choosing a city');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await logStep('Step 02: Verify submit still works without a city');
    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  for (const email of REGISTER_INTEREST_LEAD.invalidEmails) {
    test(`TC-07 Invalid email "${email}" blocks submission`, {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
      registerInterestPage,
    }) => {
      await logStep(`Step 01: Fill the form with invalid email ${email}`);
      await registerInterestPage.fillLead({
        name: REGISTER_INTEREST_LEAD.name,
        phone: REGISTER_INTEREST_LEAD.phone,
        email,
      });

      await logStep('Step 02: Confirm the format error blocks submit');
      await expect(registerInterestPage.submitButton).toBeDisabled();
      await expect(registerInterestPage.formatError.first()).toBeVisible();
    });
  }

  test('TC-08 A too-short mobile reports its required length', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Enter a too-short mobile number');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.shortPhone,
    });

    await logStep('Step 02: Validate the validation message prevents submission');
    await expect(registerInterestPage.submitButton).toBeDisabled();
    const messages = await registerInterestPage.validationMessages();
    expect(messages.join(' | ')).toContain(REGISTER_INTEREST_LEAD.errors.tooShort);
  });

  test('TC-09 The mobile field enforces the Saudi +966 5 mask', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Fill the phone field with a valid mobile number');
    await registerInterestPage.fillLead({ phone: REGISTER_INTEREST_LEAD.phone });

    await logStep('Step 02: Confirm the number is masked to the Saudi pattern');
    expect(await registerInterestPage.phoneInput.inputValue()).toMatch(/^\+966\s?5/);
  });

  test('TC-10 A numeric-only name does not enable submission on its own', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Enter a numeric-only name');
    await registerInterestPage.fillLead({ name: '1234', phone: '' });

    await logStep('Step 02: Ensure the form still blocks submit');
    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-11 An over-long name is accepted or capped without breaking the form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    const longName = 'ا'.repeat(300);
    await logStep('Step 01: Enter a very long name');
    await registerInterestPage.fillLead({
      name: longName,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await logStep('Step 02: Confirm the field keeps working without crashing');
    const stored = await registerInterestPage.nameInput.inputValue();
    expect(stored.length).toBeGreaterThan(0);
    await expect(registerInterestPage.nameInput).toBeVisible();
  });

  test('TC-12 Back leaves the form without submitting', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await logStep('Step 01: Fill the form and prepare to leave');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await logStep('Step 02: Click the back action and confirm navigation changes');
    await registerInterestPage.backButton.click({ force: true });

    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 90_000 })
      .not.toMatch(/\/app\/register-interest/);
  });

  test('TC-13 An unknown project id still renders a usable form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await logStep('Step 01: Open the form with an unknown project ID');
    await registerInterestPage.openForProject(99999999);

    await logStep('Step 02: Verify the form still renders gracefully');
    await expect(registerInterestPage.nameInput).toBeVisible({ timeout: 150_000 });
    expect(page.url()).toContain('project_id=99999999');
  });

  test('TC-14 Submitting a complete lead reaches a terminal state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await logStep('Step 01: Fill the form with a complete lead');
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
      email: REGISTER_INTEREST_LEAD.email,
    });
    await expect(registerInterestPage.submitButton).toBeEnabled();

    await logStep('Step 02: Submit the lead and check for bot challenge or success state');
    await registerInterestPage.submit();
    const challenged = await registerInterestPage.isBotChallengeVisible(15_000);
    test.skip(challenged, 'BLOCKED: bot challenge presented on submit from this origin');

    await expect(registerInterestPage.successMessage.first()).toBeVisible({ timeout: 60_000 });
  });
});
