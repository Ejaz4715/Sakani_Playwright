import { test, expect } from '@fixtures/pages.fixture';
import { REGISTER_INTEREST_LEAD, PROJECTS } from '@data/testData';

/**
 * RGI — Register Interest guest lead form.
 * spec: specs/functional-test-design.md § 19
 *
 * The form is public, so these use the plain `page` fixture. Verified gating:
 * only **name + mobile** enable the submit button; email, city, destinations
 * and projects are optional. Bad input disables submit and surfaces
 * "The value is invalid or wrong format" (plus a length message for the mask).
 *
 * Only RGI-03 actually submits — it creates a real lead and is subject to the
 * Turnstile/reCAPTCHA gate, so it asserts the outcome tolerantly and reports a
 * challenge as a documented blocker rather than a failure.
 */
test.describe('Register Interest', () => {
  test.beforeEach(async ({ registerInterestPage }) => {
    await registerInterestPage.openForProject(PROJECTS.registerInterest);
    await registerInterestPage.expectLoaded();
  });

  test('RGI-01 @P1 the form opens scoped to the originating project', async ({
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

  test('RGI-02 @P0 submit is disabled while the form is empty', async ({
    registerInterestPage,
  }) => {
    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('RGI-04 @P1 name alone does not enable submit', async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({ name: REGISTER_INTEREST_LEAD.name });

    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('RGI-02b @P0 name plus a valid mobile enables submit', async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('RGI-12 @P2 email is optional', async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
      email: '',
    });

    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  test('RGI-13 @P1 city selection is optional', async ({ registerInterestPage }) => {
    await registerInterestPage.fillLead({
      name: REGISTER_INTEREST_LEAD.name,
      phone: REGISTER_INTEREST_LEAD.phone,
    });

    // No city chosen — the form must still be submittable.
    await expect(registerInterestPage.submitButton).toBeEnabled();
  });

  for (const email of REGISTER_INTEREST_LEAD.invalidEmails) {
    test(`RGI-11 @P1 invalid email "${email}" blocks submission`, async ({
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

  test('RGI-10 @P1 a too-short mobile reports its required length', async ({
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

  test('RGI-09 @P1 the mobile field enforces the Saudi +966 5 mask', async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({ phone: REGISTER_INTEREST_LEAD.phone });

    // The mask rewrites the typed digits rather than storing them verbatim.
    expect(await registerInterestPage.phoneInput.inputValue()).toMatch(/^\+966\s?5/);
  });

  test('RGI-05 @P2 a numeric-only name does not enable submission on its own', async ({
    registerInterestPage,
  }) => {
    await registerInterestPage.fillLead({ name: '1234', phone: '' });

    await expect(registerInterestPage.submitButton).toBeDisabled();
  });

  test('RGI-06 @P2 an over-long name is accepted or capped without breaking the form', async ({
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

  test('RGI-15 @P2 Back leaves the form without submitting', async ({
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

  test('RGI-22 @P2 an unknown project id still renders a usable form', async ({
    registerInterestPage,
    page,
  }) => {
    await registerInterestPage.openForProject(99999999);

    // The form must degrade gracefully rather than crash on a bad id.
    await expect(registerInterestPage.nameInput).toBeVisible({ timeout: 150_000 });
    expect(page.url()).toContain('project_id=99999999');
  });

  test('RGI-03 @P0 submitting a complete lead reaches a terminal state', async ({
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
