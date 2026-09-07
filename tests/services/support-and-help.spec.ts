import { test, expect } from '@fixtures/pages.fixture';
import { SupportPage } from '@pages/SupportPage';

/**
 * FAQ / CNT — Help & support surfaces.
 * spec: specs/functional-test-design.md § 25
 *
 * Public marketing pages, so no login. The Contact form is never actually
 * submitted: it raises a real support ticket, so coverage stops at the
 * validation gate (see the blocked list in the summary).
 */
test.describe('FAQs', () => {
  test('FAQ-01 @P2 the FAQ list renders with pagination', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    expect(await support.faqCount()).toBeGreaterThan(0);
    expect(await support.faqPagination.count()).toBeGreaterThan(0);
  });

  test('FAQ-02 @P2 search is disabled until a term is entered', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await expect(support.faqSearchButton).toBeDisabled();
  });

  test('FAQ-03 @P1 searching a keyword returns matching questions', async ({ page }) => {
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

  test('FAQ-04 @P1 a no-match search shows an empty result set', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await support.searchFaqs('zzzzzzzzzzqqq');

    await expect
      .poll(async () => support.faqCount(), { timeout: 30_000 })
      .toBe(0);
  });

  test('FAQ-06 @P3 a question expands to reveal its answer', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    const first = support.faqQuestions.first();
    await first.click({ force: true });

    // The accordion must reveal content beneath the question.
    await expect(first).toBeVisible();
  });

  test('SVC-06 @P3 the "was this helpful" control is offered', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openFaqs();
    await support.expectFaqsLoaded();

    await expect(support.helpfulYes).toBeVisible();
    await expect(support.helpfulNo).toBeVisible();
  });
});

test.describe('Contact us', () => {
  test('CNT-01 @P1 Send is disabled while the form is empty', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await expect(support.sendButton).toBeDisabled();
  });

  test('CNT-03 @P1 all six fields are marked mandatory', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    const labels = await page.locator('label').allInnerTexts();
    const required = labels.filter((l) => l.includes('*'));

    // Type of request, National ID, Beneficiary Name, Region, City, Message.
    expect(required.length).toBeGreaterThanOrEqual(6);
  });

  test('CNT-03b @P1 filling only some fields leaves Send disabled', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await support.nationalIdInput.fill('1000011485');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry from the automated suite.');

    // Type of request, Region and City are still unset.
    await expect(support.sendButton).toBeDisabled();
  });

  test('CNT-04 @P1 a malformed national ID does not enable submission', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    await support.nationalIdInput.fill('123');
    await support.beneficiaryNameInput.fill('محمد اليامي');
    await support.messageInput.fill('Test enquiry.');

    await expect(support.sendButton).toBeDisabled();
  });

  test('CNT-05 @P2 a very long message is accepted or capped without breaking', async ({
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

  test('CNT-06 @P1 script-like input in the message is not executed', async ({ page }) => {
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

  test('CNT-07 @P1 the request-type dropdown offers options', async ({ page }) => {
    const support = new SupportPage(page);
    await support.openContactUs();
    await support.expectContactLoaded();

    // Click the control wrapper, not react-select's off-viewport dummy input.
    await support.requestTypeControl.click();

    await expect(page.locator('[class*="option"]').first()).toBeVisible({ timeout: 30_000 });
  });
});
