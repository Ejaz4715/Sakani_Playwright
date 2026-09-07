import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';
import { Header } from './components/Header';

/**
 * Marketplace listing — `/app/marketplace`
 *
 * Split layout: results on the left, an interactive map on the right. Results
 * are segmented by a Projects / Units toggle and narrowed with a Sort modal,
 * a full Filter panel and a row of quick-filter chips.
 *
 * The backend applies the caller's segment automatically:
 * `filter[user_type]=non_beneficiary` is sent for a non-beneficiary account.
 */
export class MarketplacePage extends BasePage {
  protected readonly path = '/app/marketplace';

  readonly header: Header;

  readonly purposeSelector: Locator;
  readonly searchInput: Locator;
  readonly sortByButton: Locator;
  readonly filterButton: Locator;
  readonly viewMapButton: Locator;

  readonly projectsTab: Locator;
  readonly unitsTab: Locator;
  /** "31 Projects" / "54 Unit Models" — the authoritative signal of which tab is active. */
  readonly resultsSummary: Locator;
  /**
   * Result cards. Both tabs render the SAME element (`app-marketplace-card`) —
   * the Units tab lists unit *models*, not individual units. Only the unit-model
   * page uses `app-marketplace-unit-card`, so counting that here always yields 0.
   */
  readonly resultCards: Locator;

  /** Quick-filter chips above the results. */
  readonly chipForYou: Locator;
  readonly chipRegisterInterested: Locator;
  readonly chipUnderConstruction: Locator;
  readonly chipPropertyType: Locator;
  readonly chipPrice: Locator;
  readonly chipBedrooms: Locator;

  /** A label that only exists inside the open autocomplete dropdown. */
  readonly suggestionPanelAnchor: Locator;

  /** Sort modal. */
  readonly sortModal: Locator;

  /** Filter panel. */
  readonly filterPanel: Locator;
  readonly filterApply: Locator;
  readonly filterClear: Locator;
  /** All four numeric range fields in the filter panel, in DOM order. */
  private readonly rangeFields: Locator;
  readonly minPrice: Locator;
  readonly maxPrice: Locator;
  readonly minArea: Locator;
  readonly maxArea: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);

    this.purposeSelector = page.getByText(/Property to Buy|Property to Rent|عقار للشراء/).first();
    this.searchInput = page.locator(
      'input[placeholder*="City, Region"], input[placeholder*="المدينة"]',
    );
    // These controls are role-less containers. `getByText` with `exact` normalises
    // whitespace (an anchored regex does not), which is what actually matches here.
    this.sortByButton = page
      .getByText('Sort by', { exact: true })
      .or(page.getByText('ترتيب حسب', { exact: true }))
      .first();
    this.filterButton = page
      .getByText('Filter', { exact: true })
      .or(page.getByText('تصفية', { exact: true }))
      .last();
    this.viewMapButton = page.getByRole('button', { name: /View map|عرض الخريطة/i });

    this.projectsTab = page
      .getByText('Projects', { exact: true })
      .or(page.getByText('المشاريع', { exact: true }))
      .last();
    this.unitsTab = page
      .getByText('Units', { exact: true })
      .or(page.getByText('الوحدات', { exact: true }))
      .last();
    this.resultsSummary = page
      .getByText(/^\s*\d+\s+(Projects|Unit Models|مشروع|نموذج)/)
      .first();
    this.resultCards = page.locator('app-marketplace-card');

    this.chipForYou = page.getByText(/^\s*(For you|لك)\s*$/).first();
    this.chipRegisterInterested = page.getByText(/Register Interested/i).first();
    this.chipUnderConstruction = page.getByText(/Under construction/i).first();
    this.chipPropertyType = page.getByText(/^\s*Property type\s*$/).first();
    this.chipPrice = page.getByText(/^\s*Price\s*$/).first();
    this.chipBedrooms = page.getByText(/^\s*Bedrooms\s*$/).first();

    this.suggestionPanelAnchor = page
      .getByText(/Show more results|نتائج أخرى/i)
      .first();

    this.sortModal = page.locator('.modal.show, ngb-modal-window').filter({ hasText: /Sort/i });

    this.filterPanel = page
      .locator('.modal.show, ngb-modal-window, .offcanvas.show')
      .filter({ hasText: /Filters|Eligibility type/i });
    this.filterApply = this.filterPanel.getByRole('button', { name: /^\s*(Apply|تطبيق)\s*$/ });
    this.filterClear = this.filterPanel.getByRole('button', { name: /^\s*(Clear|مسح)\s*$/ });
    // The panel's four numeric fields carry **no placeholder, id or name** —
    // "Minimum price" / "Maximum price" / "Minimum area" / "Maximum area" are
    // sibling label elements, not placeholders, so `getByPlaceholder` never
    // resolves them. They are the only `input.form-control.fw-bold` in the
    // panel and appear in a fixed DOM order alongside their range sliders:
    //   0 min price · 1 max price · 2 min area · 3 max area
    this.rangeFields = this.filterPanel.locator('input.form-control.fw-bold');
    this.minPrice = this.rangeFields.nth(0);
    this.maxPrice = this.rangeFields.nth(1);
    this.minArea = this.rangeFields.nth(2);
    this.maxArea = this.rangeFields.nth(3);
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.searchInput.first());
  }

  async expectLoaded(): Promise<void> {
    await expect(this.searchInput.first()).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.sortByButton).toBeVisible();
    await expect(this.filterButton).toBeVisible();
  }

  /**
   * Readiness check for viewports below the ~1400px toolbar breakpoint.
   *
   * `expectLoaded()` waits on the "Sort by" and "Filter" *text* labels. Under
   * ~1400px the toolbar collapses both to icon-only controls with no accessible
   * text — the documented behaviour this config pins the desktop viewport to
   * avoid — so a narrow-viewport journey must gate on controls that survive
   * every breakpoint. The search input and the results summary both do, and the
   * summary is the stronger signal of the two: it only renders once the listing
   * has actually resolved.
   */
  async expectLoadedCompact(): Promise<void> {
    await expect(this.searchInput.first()).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.resultsSummary).toBeVisible({ timeout: 60_000 });
  }

  /** Wait for result cards to hydrate — the listing renders skeletons first. */
  async waitForResults(timeout = 60_000): Promise<void> {
    await expect
      .poll(async () => this.resultCards.count(), {
        timeout,
        message: 'Expected the marketplace listing to render at least one card',
      })
      .toBeGreaterThan(0);
  }

  /**
   * The query parameters that define the result set, with the volatile ones removed.
   *
   * The marketplace encodes the **map viewport** into the URL as a `coordinates`
   * polygon which is recomputed on every load, so the raw URL is never byte-identical
   * across a reload or a re-navigation even when the filters are unchanged. Comparing
   * these parameters is the meaningful equivalent of "the same filters are applied".
   *
   * `purchasing_power` is excluded for the same reason: it is derived from the
   * account's financial profile and recomputed on load (observed flipping 0 -> 1
   * across a reload), so it is not filter state the user chose. If the product
   * intent is that it *should* round-trip from the URL, that is an application
   * question — the tests here assert filter state, not derived state.
   */
  async filterParams(): Promise<Record<string, string>> {
    const volatileKeys = new Set(['coordinates', 'mode', 'lang', 'purchasing_power']);
    const url = new URL(this.page.url());
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (!volatileKeys.has(key)) params[key] = value;
    });
    return params;
  }

  /**
   * The active tab's result summary, e.g. "31 Projects" or "54 Unit Models".
   *
   * Note this cannot resolve a **zero**-result listing: the app renders the
   * heading as a bare "Projects" with no leading number in that state, so
   * `resultsSummary` does not match and `resultCount()` throws. Callers testing
   * for emptiness must catch that and fall back to the empty-state copy.
   */
  async resultsSummaryText(): Promise<string> {
    await expect(this.resultsSummary).toBeVisible({ timeout: 60_000 });
    return (await this.resultsSummary.innerText()).replace(/\s+/g, ' ').trim();
  }

  /** Numeric part of the result summary. */
  async resultCount(): Promise<number> {
    const text = await this.resultsSummaryText();
    return Number((text.match(/\d+/) ?? ['0'])[0]);
  }

  async switchToProjects(): Promise<void> {
    await this.projectsTab.click({ force: true });
    await expect(this.resultsSummary).toContainText(/Projects|مشروع/, { timeout: 60_000 });
    await this.waitForResults();
  }

  async switchToUnits(): Promise<void> {
    await this.unitsTab.click({ force: true });
    await expect(this.resultsSummary).toContainText(/Unit Models|نموذج/, { timeout: 60_000 });
    await this.waitForResults();
  }

  // --- Search -------------------------------------------------------------

  /**
   * Type into the location search and pick a suggestion.
   *
   * Pressing Enter alone does **not** apply the search — a suggestion must be
   * selected — so this always resolves through the dropdown.
   */
  async searchLocation(term: string): Promise<void> {
    await this.searchInput.first().click({ force: true });
    await this.searchInput.first().fill(term);
    await this.page.waitForTimeout(3500);
    const suggestion = this.page.getByText(new RegExp(term, 'i')).nth(1);
    if (await suggestion.isVisible().catch(() => false)) {
      await suggestion.click({ force: true });
    }
    await this.page.waitForTimeout(4000);
  }

  /**
   * Type a term and return the autocomplete rows.
   *
   * The dropdown groups results under "Location" / "Property" headings and its
   * rows are role-less `div`s, not list items — so the panel is discovered from
   * one of its own labels and walked upwards, which keeps this independent of
   * the app's generated class names.
   */
  async searchSuggestions(term: string): Promise<string[]> {
    await this.searchInput.first().click({ force: true });
    await this.searchInput.first().fill(term);

    await this.suggestionPanelAnchor
      .waitFor({ state: 'visible', timeout: 30_000 })
      .catch(() => {});

    return this.page.evaluate(() => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const leaves = [...document.querySelectorAll('*')].filter(
        (e) => visible(e) && e.children.length === 0,
      );

      const anchor = leaves.find((e) =>
        /Show more results|^\s*Location\s*$|^\s*الموقع\s*$/i.test(e.textContent ?? ''),
      );
      if (!anchor) return [];

      // Walk up to the dropdown container.
      let panel: Element | null = anchor;
      while (panel && panel.getBoundingClientRect().height < 200) panel = panel.parentElement;
      if (!panel) return [];

      const rows = [...panel.querySelectorAll('*')]
        .filter((e) => visible(e) && e.children.length === 0)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter((t) => t && t.length < 120 && !/^(Location|Property|Show more results)$/i.test(t));

      return [...new Set(rows)];
    });
  }

  // --- Sorting ------------------------------------------------------------

  async openSort(): Promise<void> {
    await this.sortByButton.click({ force: true });
    await expect(this.sortModal.first()).toBeVisible({ timeout: 20_000 });
  }

  async sortOptions(): Promise<string[]> {
    await this.openSort();
    return this.sortModal.first().evaluate((el: HTMLElement) =>
      [...el.querySelectorAll('*')]
        .filter((e) => e.children.length === 0)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter((t) => t && t !== 'Sort'),
    );
  }

  async sortBy(option: string): Promise<void> {
    await this.openSort();
    await this.sortModal.first().getByText(option, { exact: true }).click({ force: true });
    await this.page.waitForTimeout(4000);
  }

  // --- Filtering ----------------------------------------------------------

  async openFilters(): Promise<void> {
    await this.page.mouse.move(600, 600); // step away from the hover mega-menu
    await this.filterButton.click({ force: true });
    await expect(this.filterPanel.first()).toBeVisible({ timeout: 20_000 });
  }

  async filterPanelText(): Promise<string> {
    return this.filterPanel.first().innerText();
  }

  /** Select an option inside the filter panel by its visible label. */
  async selectFilterOption(label: string): Promise<void> {
    await this.filterPanel.first().getByText(label, { exact: true }).first().click({ force: true });
  }

  async setPriceRange(min: string, max: string): Promise<void> {
    await this.minPrice.fill(min);
    await this.maxPrice.fill(max);
  }

  async applyFilters(): Promise<void> {
    await this.filterApply.click({ force: true });
    await this.page.waitForTimeout(5000);
  }

  async clearFilters(): Promise<void> {
    await this.filterClear.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  /** Open a project card; the app opens project details in a new tab. */
  async openProjectCard(index = 0): Promise<Page> {
    const card = this.resultCards.nth(index);
    await expect(card).toBeVisible();
    const popup = this.page.context().waitForEvent('page', { timeout: 60_000 });
    await card.click({ force: true });
    return popup;
  }
}
