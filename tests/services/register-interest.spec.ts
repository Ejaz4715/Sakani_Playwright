import { test, expect } from '@fixtures/pages.fixture';
import { REGISTER_INTEREST_LEAD, PROJECTS } from '@data/testData';

test.describe('Register Interest', () => {
  test.beforeEach(async ({ registerInterestPage }) => {
    await registerInterestPage.openForProject(PROJECTS.registerInterest);
    await registerInterestPage.expectLoaded();
  });

  test('TC_01 The form opens scoped to the originating project', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await expect(page).toHaveURL(
      new RegExp(`project_id=${PROJECTS.registerInterest}`),
    );
    await expect(registerInterestPage.heading.first()).toBeVisible();
    await expect(registerInterestPage.citySelect.first()).toBeVisible();
    await expect(registerInterestPage.destinationsSelect.first()).toBeVisible();
    await expect(registerInterestPage.projectsSelect.first()).toBeVisible();
  });

  test('TC-02 Submit is disabled while the form is empty', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-03 Name alone does not enable submit', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({ name: REGISTER_INTEREST_LEAD.name });

    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-04 Name plus a valid mobile enables submit', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('TC-05 Email is optional', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
      email: '',
    });

    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('TC-06 City selection is optional', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    // No city chosen — the form must still be submittable.
    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  for (const email of REGISTER_INTEREST_LEAD.invalidEmails) {
    test(`TC-07 Invalid email "${email}" blocks submission`, {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
      registerInterestPage,
    }) => {
      await registerInterestPage.fillLead({
        name: REGISTER_INTEREST_LEAD.name,
        phone: REGISTER_INTEREST_LEAD.phone,
        email,
      });

      await expect(registerInterestPage.submitButton).toBeDisabled();
      await expect(registerInterestPage.formatError.first()).toBeVisible();
    });
  }

  test('TC-08 A too-short mobile reports its required length', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.shortPhone,
    });

    await expect(registerInterestPage.submitButton).toBeDisabled();
    const messages = await registerInterestPage.validationMessages();
    expect(messages.join(' | ')).toContain(REGISTER_INTEREST_LEAD.errors.tooShort);
  });

  test('TC-09 The mobile field enforces the Saudi +966 5 mask', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({ phone: REGISTER_INTEREST_LEAD.phone });

    // The mask rewrites the typed digits rather than storing them verbatim.
    expect(await registerInterestPage.phoneInput.inputValue()).toMatch(/^\+966\s?5/);
  });

  test('TC-10 A numeric-only name does not enable submission on its own', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({ name: '1234', phone: '' });

    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('TC-11 An over-long name is accepted or capped without breaking the form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    const longName = 'ا'.repeat(300);
    await registerInterestPage.fillLead({
      name: longName,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    const stored = await registerInterestPage.nameInput.inputValue();
    expect(stored.length).toBeGreaterThan(0);
    // Either capped by a maxlength or accepted in full — never a crashed form.
    await expect(registerInterestPage.nameInput).toBeVisible();
  });

  test('TC-12 Back leaves the form without submitting', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await registerInterestPage.backButton.click({ force: true });

    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 90_000 })
      .not.toMatch(/\/app\/register-interest/);
  });

  test('TC-13 An unknown project id still renders a usable form', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
    page,
  }) => {
    await registerInterestPage.openForProject(99999999);

    // The form must degrade gracefully rather than crash on a bad id.
    await expect(registerInterestPage.nameInput).toBeVisible({ timeout: 150_000 });
    expect(page.url()).toContain('project_id=99999999');
  });

  test('TC-14 Submitting a complete lead reaches a terminal state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
      email: REGISTER_INTEREST_LEAD.email,
    });
    await expect(registerInterestPage.submitButton).toBeEnabled();

    await registerInterestPage.submit();

    // Submission is behind Turnstile/reCAPTCHA. A challenge is an environment
    // blocker, not a product failure, so it is reported rather than failed on.
    const challenged = await registerInterestPage.isBotChallengeVisible(15_000);
    test.skip(challenged, 'BLOCKED: bot challenge presented on submit from this origin');

    await expect(registerInterestPage.successMessage.first()).toBeVisible({ timeout: 60_000 });
  });
});
