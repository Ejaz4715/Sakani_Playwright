import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Developers directory — `/app/developers`
 *
 * A searchable, sortable list of licensed developers. Cards carry the developer
 * name, service type and location, and open `/app/developers/<crNumber>`.
 */
export class DevelopersPage extends BasePage {
  protected readonly path = '/app/developers';

  readonly searchInput: Locator;
  readonly sortByButton: Locator;
  /**
   * Developer cards.
   *
   * Like the marketplace's project cards these are **role-less containers with
   * no anchor** — the whole card is the click target and navigation to
   * `/app/developers/<crNumber>` happens in code. The component element
   * `app-dx-partner-card` is therefore the stable handle.
   */
  readonly developerCards: Locator;
  readonly pagination: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.getByPlaceholder(/Search name\/location|ابحث بالاسم/i);
    this.sortByButton = page
      .getByText('Sort by', { exact: true })
      .or(page.getByText('ترتيب حسب', { exact: true }))
      .first();
    this.developerCards = page.locator('app-dx-partner-card');
    this.pagination = page.getByRole('link', { name: /^(First|Last|\d+)$/ });
    this.noResultsMessage = page.getByText(/No results were found for your search|لم يتم العثور على نتائج/i);
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.searchInput);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }

  /** Wait for the directory to render at least one developer. */
  async waitForResults(timeout = 60_000): Promise<void> {
    await expect
      .poll(async () => this.developerCards.count(), {
        timeout,
        message: 'Expected the developers directory to render at least one developer',
      })
      .toBeGreaterThan(0);
  }

  async developerCount(): Promise<number> {
    return this.developerCards.count();
  }

  /** Open a developer's profile by clicking its card. */
  async openDeveloper(index = 0): Promise<void> {
    await this.developerCards.nth(index).click({ force: true });
    await this.page.waitForURL(/\/app\/developers\/\w+/, {
      waitUntil: 'commit',
      timeout: 90_000,
    });
  }

  /**
   * Run a directory search.
   *
   * Typing alone does **not** filter — the control only applies on `Enter`,
   * which pushes `?page=1&search=<term>` into the URL and re-queries. This
   * mirrors the marketplace's location search, which also ignores input until
   * the query is committed.
   */
  async search(term: string): Promise<void> {
    await this.searchInput.click({ force: true });
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForURL(/[?&]search=/, { waitUntil: 'commit', timeout: 30_000 });
    // NB: the URL commits immediately but the listing empties while the new
    // query loads, so this returns with a transient zero-card state on screen.
    // Callers expecting results must `waitForResults()`; callers expecting none
    // (DEV-04) must not, or they would wait out the full timeout.
  }

  /** Clear the query and return to the unfiltered directory. */
  async clearSearch(): Promise<void> {
    await this.searchInput.click({ force: true });
    await this.searchInput.fill('');
    await this.searchInput.press('Enter');
    await expect
      .poll(async () => this.developerCards.count(), { timeout: 30_000 })
      .toBeGreaterThan(0);
  }

  /** Visible developer names currently listed. */
  async developerNames(): Promise<string[]> {
    return this.developerCards.evaluateAll((els) =>
      els
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 40),
    );
  }
}
