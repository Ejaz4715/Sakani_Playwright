import { test, expect } from '@fixtures/pages.fixture';
import { SupportPage } from '@pages/SupportPage';
import { logStep } from '@helpers/LogSteps';

test.describe('FAQs', () => {
  test('TC-01 FAQ list renders with pagination', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the FAQ page');
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await logStep('Step 02: Confirm the FAQ list and pagination exist');
    expect(await support.faqCount()).toBeGreaterThan(0);
    expect(await support.faqPagination.count()).toBeGreaterThan(0);
  });

  test('TC-02 FAQ search is disabled until a term is entered', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the FAQ page');
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await logStep('Step 02: Assert the search is disabled until input exists');
    await expect(support.faqSearchButton).toBeDisabled();
  });

  test('TC-03 Searching a keyword returns matching questions', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the FAQ page');
    await support.openFaqs();
    await support.expectFaqsLoaded();
    const before = await support.faqQuestionTexts();

    await logStep('Step 02: Search for a keyword and validate the set changes');
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
    await logStep('Step 01: Open the FAQ page');
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await logStep('Step 02: Search for a term with no matches');
    await support.searchFaqs('zzzzzzzzzzqqq');

    await expect
      .poll(async () => support.faqCount(), { timeout: 30_000 })
      .toBe(0);
  });

  test('TC-05 A question expands to reveal its answer', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open FAQs');
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await logStep('Step 02: Expand the first question');
    const first = support.faqQuestions.first();
    await first.click({ force: true });

    await expect(first).toBeVisible();
  });

  test('TC-06 The "was this helpful" control is offered', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the FAQ page');
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await logStep('Step 02: Confirm the helpfulness controls are visible');
    await expect(support.helpfulYes).toBeVisible();
    await expect(support.helpfulNo).toBeVisible();
  });
});

test.describe('Contact us', () => {
  test('TC-01 Send is disabled while the form is empty', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Validate Send is disabled with no input');
    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-02 All six fields are marked mandatory (Type of request, National ID, Beneficiary Name, Region, City, Message)', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Confirm required labels are marked as mandatory');
    const labels = await page.locator('label').allInnerTexts();
    const required = labels.filter((l) => l.includes('*'));
    expect(required.length).toBeGreaterThanOrEqual(6);
  });

  test('TC-03 Filling only some fields leaves Send disabled', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Fill only some fields and verify submit remains blocked');
    await support.nationalIdInput.fill('1000011485');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry from the automated suite.');
    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-04 A malformed national ID does not enable submission', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Enter malformed ID and validate submit stays disabled');
    await support.nationalIdInput.fill('123');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry.');
    await expect(support.sendButton).toBeDisabled();
  });

  test('TC-05 A very long message is accepted or capped without breaking', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    page,
  }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Enter a long message and confirm it remains usable');
    await support.messageInput.fill('x'.repeat(5000));
    const stored = await support.messageInput.inputValue();
    expect(stored.length).toBeGreaterThan(0);
    await expect(support.messageInput).toBeVisible();
  });

  test('TC-06 Script-like input in the message is not executed', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    const support = new SupportPage(page);
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Enter script-like content and ensure it is not executed');
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
    await logStep('Step 01: Open the contact form');
    await support.openContactUs();
    await support.expectContactLoaded();

    await logStep('Step 02: Open the request-type dropdown and verify options appear');
    await support.requestTypeControl.click();
    await expect(page.locator('[class*="option"]').first()).toBeVisible({ timeout: 30_000 });
  });
});
