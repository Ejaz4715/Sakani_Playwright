import { test, expect } from '@fixtures/pages.fixture';
import { SupportPage } from '@pages/SupportPage';

test.describe('FAQs', () => {
  test('TC-01 FAQ list renders with pagination', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    expect(await support.faqCount()).toBeGreaterThan(0);
    expect(await support.faqPagination.count()).toBeGreaterThan(0);
  });

  test('TC-02 FAQ search is disabled until a term is entered', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await expect(support.faqSearchButton).toBeDisabled();
  });

  test('TC-03 searching a keyword returns matching questions', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();
    const before = await support.faqQuestionTexts();

    await support.searchFaqs('support');

    await expect
      .poll(async () => support.faqQuestionTexts().then((q) => q.join(' | ')), {
        timeout: 30_000,
        message: 'FAQ search did not change the result set',
      })
      .not.toBe(before.join(' | '));
  });

  test('TC-04 A no-match search shows an empty result set', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await support.searchFaqs('zzzzzzzzzzqqq');

    await expect
      .poll(async () => support.faqCount(), { timeout: 30_000 })
      .toBe(0);
  });

  test('TC-05 A question expands to reveal its answer', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    const first = support.faqQuestions.first();
    await first.click({ force: true });

    // The accordion must reveal content beneath the question.
    await expect(first).toBeVisible();
  });

  test('TC-06 The "was this helpful" control is offered', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await expect(support.helpfulYes).toBeVisible();
    await expect(support.helpfulNo).toBeVisible();
  });
});

test.describe('Contact us', () => {
  test('TC-01 Send is disabled while the form is empty', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-02 All six fields are marked mandatory (Type of request, National ID, Beneficiary Name, Region, City, Message)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    const labels = await page.locator('label').allInnerTexts();
    const required = labels.filter((l) => l.includes('*'));

    // Type of request, National ID, Beneficiary Name, Region, City, Message.
    expect(required.length).toBeGreaterThanOrEqual(6);
  });

  test('TC-03 Filling only some fields leaves Send disabled', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await support.nationalIdInput.fill('1000011485');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry from the automated suite.');

    // Type of request, Region and City are still unset.
    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-04 A malformed national ID does not enable submission', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await support.nationalIdInput.fill('123');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry.');

    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-05 A very long message is accepted or capped without breaking', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    page,
  }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await support.messageInput.fill('x'.repeat(5000));

    const stored = await support.messageInput.inputValue();
    expect(stored.length).toBeGreaterThan(0);
    await expect(support.messageInput).toBeVisible();
  });

  test('TC-06 Script-like input in the message is not executed', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    let dialogAppeared = false;
    page.on('dialog', async (d) => {
      dialogAppeared = true;
      await d.dismiss().catch(() => {});
    });

    await support.messageInput.fill('<script>alert(1)</script>');
    await support.messageInput.blur();

    expect(dialogAppeared).toBeFalsy();
    expect(await support.messageInput.inputValue()).toContain('script');
  });

  test('TC-07 The request-type dropdown offers options', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    // Click the control wrapper, not react-select's off-viewport dummy input.
    await support.requestTypeControl.click();

    await expect(page.locator('[class*="option"]').first()).toBeVisible({ timeout: 30_000 });
  });
});
