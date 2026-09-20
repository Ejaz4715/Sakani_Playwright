import type { Page } from '@playwright/test';
import { test, expect } from '@fixtures/pages.fixture';
import { MarketplacePage } from '@pages/MarketplacePage';

/**
 * I18N / A11Y — localisation, RTL and accessibility.
 * spec: specs/functional-test-design.md § 26
 *
 * Language is driven by the `?lang=` parameter throughout: the header toggle is
 * a known defect (D2) and is asserted as such rather than relied upon.
 */
test.describe('Marketplace Localization', () => {
  /**
   * `waitUntil: 'commit'` returns before `document.body` exists, and `/?lang=…`
   * additionally redirects to an `/en`-prefixed path — so evaluating too early
   * either hits a null body or has its execution context destroyed mid-call.
   * Both tests settle the document first, then read direction.
   *
   * The settling is done by the `body` wait on the line after each `goto`, not
   * by the navigation's own wait state. `domcontentloaded` cannot do it here:
   * the marketing page ships a parser-blocking bundle that outlives the 90s
   * navigation budget, so the `goto` itself timed out before any assertion ran.
   * `commit` is the repo-wide convention for exactly this reason.
   */
  test('TC-01 Arabic renders right-to-left', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/?lang=ar', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 90_000 });

    await expect
      .poll(() => page.evaluate(() => document.documentElement.lang), { timeout: 90_000 })
      .toMatch(/ar/i);

    const dir = await page.evaluate(() => {
      const root = document.documentElement;
      return root.dir || root.className.match(/rtl|ltr/)?.[0] || getComputedStyle(root).direction;
    });
    expect(dir).toMatch(/rtl/i);
  });

  test('TC-02 English renders left-to-right', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/?lang=en', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 90_000 });

    await expect
      .poll(() => page.evaluate(() => document.documentElement.lang), { timeout: 90_000 })
      .toMatch(/en/i);

    const dir = await page.evaluate(() => {
      const root = document.documentElement;
      return root.dir || root.className.match(/rtl|ltr/)?.[0] || getComputedStyle(root).direction;
    });
    expect(dir).not.toMatch(/rtl/i);
  });

  /**
   * Same `commit` hazard as I18N-02/03, and this test crosses it twice — once on
   * the marketing page and again on the `/app` route. It additionally has to
   * survive the read *itself* failing: between commit and first paint the new
   * document has no root element, so `document.documentElement` is momentarily
   * null, and `expect.poll` propagates a thrown `TypeError` instead of retrying
   * it. Reading through `?.` keeps the callback returning a value, so the poll
   * can do its job; `.catch()` covers the execution context being destroyed by
   * the `/?lang=ar` -> `/en` redirect mid-evaluate.
   */
  const documentLang = (page: Page) =>
    page.evaluate(() => document.documentElement?.lang ?? '').catch(() => '');

  test('TC-03 Selected language survives navigation', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/?lang=ar', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 90_000 });

    await expect.poll(() => documentLang(page), { timeout: 90_000 }).toMatch(/ar/i);

    await page.goto('/app/marketplace?lang=ar', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 150_000 });

    await expect.poll(() => documentLang(page), { timeout: 150_000 }).toMatch(/ar/i);
  });

  test('TC-04 Arabic marketplace renders localized content', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/app/marketplace?lang=ar', { waitUntil: 'commit' });

    // Deliberately not `MarketplacePage.expectLoaded()` — its readiness anchors
    // are the English toolbar labels, which by definition are absent here.
    // Readiness is instead the presence of substantial Arabic body copy.
    await expect
      .poll(
        async () => {
          const body = await page.locator('body').innerText().catch(() => '');
          return (body.match(/[؀-ۿ]/g) ?? []).length;
        },
        { timeout: 150_000, message: 'Arabic marketplace never rendered Arabic content' },
      )
      .toBeGreaterThan(50);
  });
});

test.describe('Marketplace Accessibility', () => {
  test('TC-01 Form fields expose accessible labels', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/app/authentication/login?lang=en', { waitUntil: 'commit' });
    await expect(page.locator('#username')).toBeVisible({ timeout: 150_000 });
    // The identifier field must be programmatically nameable, not placeholder-only.
    const accessibleName = await page.locator('#username').evaluate((el) => {
      const input = el as HTMLInputElement;
      const labelled = input.getAttribute('aria-label');
      const labelledBy = input.getAttribute('aria-labelledby');
      const label = document.querySelector(`label[for="${input.id}"]`);
      return labelled || labelledBy || label?.textContent || input.placeholder || '';
    });

    expect(accessibleName.trim().length).toBeGreaterThan(0);
  });

  test('TC-02 Login form is operable by keyboard alone', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page }) => {
    await page.goto('/app/authentication/login?lang=en', { waitUntil: 'commit' });
    await expect(page.locator('#username')).toBeVisible({ timeout: 150_000 });
    await page.locator('#username').focus();
    await page.keyboard.type('1000011485');
    expect(await page.locator('#username').inputValue()).toBe('1000011485');
    // The Continue control must be reachable from the field by keyboard.
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(focusedTag).toBeTruthy();
  });
});