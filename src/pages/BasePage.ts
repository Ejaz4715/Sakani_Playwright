import { Page, Locator, expect } from '@playwright/test';
import { LANG } from '@data/testData';

/**
 * How long to wait for a page's first meaningful element after navigation.
 * Sized for Angular bootstrap on this app, which is gated on a multi-megabyte
 * bundle that can take close to two minutes to arrive from pre-production.
 */
export const APP_READY_TIMEOUT = 150_000;

/**
 * Shared behaviour for every page object. Concrete pages extend it and expose
 * their own locators and actions.
 */
export abstract class BasePage {
  readonly page: Page;

  /** Path relative to `baseURL`, overridden by each page. */
  protected readonly path: string = '/';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Append the language query parameter.
   *
   * The header's language toggle does not reliably switch locale, so every
   * navigation pins the language explicitly instead of clicking the control.
   */
  protected withLang(url: string): string {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}lang=${LANG}`;
  }

  /**
   * Navigate using `commit` rather than `load`.
   *
   * The app ships a parser-blocking Angular bundle that routinely outlives any
   * sane navigation budget, while the document itself responds in 1-3s.
   * Committing the navigation decouples it from bundle download; each page
   * object then waits on its own first meaningful element, which is the real
   * readiness signal.
   */
  async goto(url: string = this.path): Promise<void> {
    await this.page.goto(this.withLang(url), { waitUntil: 'commit' });
  }

  /**
   * Navigate, then block until `ready` is visible. Reloads once if Angular
   * fails to bootstrap on the first attempt, which this environment does
   * intermittently under slow bundle delivery.
   */
  protected async gotoUntilReady(ready: Locator, url: string = this.path): Promise<void> {
    await this.goto(url);
    try {
      await expect(ready).toBeVisible({ timeout: APP_READY_TIMEOUT });
    } catch {
      await this.page.reload({ waitUntil: 'commit' });
      await expect(ready).toBeVisible({ timeout: APP_READY_TIMEOUT });
    }
  }

  async expectTitleContains(text: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(text);
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }

  protected byRole(role: Parameters<Page['getByRole']>[0], name: string | RegExp): Locator {
    return this.page.getByRole(role, { name });
  }
}
