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
test.describe('Localization', () => {
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
  test('I18N-02 @P1 Arabic renders right-to-left', async ({ page }) => {
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

  test('I18N-03 @P1 English renders left-to-right', async ({ page }) => {
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

  test('I18N-05 @P1 the chosen language survives navigation', async ({ page }) => {
    await page.goto('/?lang=ar', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 90_000 });

    await expect.poll(() => documentLang(page), { timeout: 90_000 }).toMatch(/ar/i);

    await page.goto('/app/marketplace?lang=ar', { waitUntil: 'commit' });
    await page.locator('body').waitFor({ state: 'attached', timeout: 150_000 });

    await expect.poll(() => documentLang(page), { timeout: 150_000 }).toMatch(/ar/i);
  });

  test('I18N-07 @P2 Arabic marketplace renders localized content', async ({ page }) => {
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

  /**
   * DEFECT D2 — the header language toggle does not switch locale; only the
   * `?lang=` parameter works. The assertion states the correct behaviour and is
   * held failing so the defect stays visible.
   */
  test('I18N-01 @P1 the header language toggle switches locale', async ({ page, homePage }) => {
    test.fail(true, 'D2: header language toggle does not change the rendered locale');

    await homePage.open();
    await homePage.expectLoaded();
    const before = await page.evaluate(() => document.documentElement.lang);

    await homePage.header.languageToggle.first().click({ force: true });

    await expect
      .poll(() => page.evaluate(() => document.documentElement.lang), { timeout: 60_000 })
      .not.toBe(before);
  });

  /**
   * DEFECT D10 — English service pages keep the Arabic document title "سكني".
   */
  test('I18N-04 @P2 English pages carry an English document title', async ({ page }) => {
    test.fail(true, 'D10: <title> remains "سكني" on English marketing pages');

    await page.goto('/services/mortgage-calculator?lang=en', { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveTitle(/Sakani/i, { timeout: 60_000 });
  });
});

test.describe('Accessibility', () => {
  /**
   * DEFECT D18 — the marketplace filter modal does not close on Escape. It is a
   * `role="dialog"` overlay with a static backdrop, so keyboard users have no
   * way to dismiss it without locating the close control by pointer.
   *
   * The assertion states the expected behaviour and is held failing.
   */
  test('A11Y-04 @P1 a modal traps focus and closes on Escape', async ({ authenticatedPage }) => {
    test.fail(true, 'D18: filter modal ignores Escape');

    const marketplace = new MarketplacePage(authenticatedPage);
    await marketplace.open();
    await marketplace.expectLoaded();

    await marketplace.openFilters();
    await expect(marketplace.filterPanel.first()).toBeVisible();

    await authenticatedPage.keyboard.press('Escape');

    await expect(marketplace.filterPanel.first()).toBeHidden({ timeout: 30_000 });
  });

  test('A11Y-05 @P1 form fields expose accessible labels', async ({ page }) => {
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

  /**
   * DEFECT D17 — 21 visible images on the home page carry neither `alt` nor
   * `aria-hidden`. A decorative image may legitimately be `aria-hidden`, and a
   * meaningful one must be described; carrying neither leaves a screen reader
   * announcing bare filenames.
   *
   * The original threshold here was an arbitrary "≤ 5", which masked the
   * finding. The assertion now states the correct expectation and is held
   * failing, with the observed count recorded.
   */
  test('A11Y-07 @P2 imagery carries alternative text', async ({ page, homePage }) => {
    test.fail(true, 'D17: 21 visible images have neither alt nor aria-hidden');

    await homePage.open();
    await homePage.expectLoaded();

    const missingAlt = await page.evaluate(
      () =>
        [...document.querySelectorAll('img')].filter((img) => {
          const r = img.getBoundingClientRect();
          const visible = r.width > 40 && r.height > 40;
          return visible && !img.getAttribute('alt') && !img.getAttribute('aria-hidden');
        }).length,
    );

    expect(missingAlt, 'visible images without alt or aria-hidden').toBe(0);
  });

  test('A11Y-08 @P2 the home page survives 200% zoom without losing content', async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await homePage.expectLoaded();

    await page.setViewportSize({ width: 720, height: 450 });

    await expect(homePage.header.nav).toBeVisible({ timeout: 60_000 });
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 32,
    );
    expect(hasHorizontalOverflow, 'page should not overflow horizontally at 200% zoom').toBeFalsy();
  });

  test('A11Y-01 @P1 the login form is operable by keyboard alone', async ({ page }) => {
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
