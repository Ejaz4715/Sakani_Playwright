import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';
import { CookieConsent } from './components/CookieConsent';
import { Header } from './components/Header';

/** A hero product tab, addressed by its wrapper so `active` can be asserted. */
function heroTab(page: Page, label: RegExp): Locator {
  return page.locator('.property-tab').filter({ hasText: label }).first();
}

/**
 * Marketing home page (server-rendered Rails, not the Angular app).
 *
 * Hosts the hero search with four product tabs, the personalised-services
 * selector, the Khuzam destination panel, a best-selling carousel and an
 * embedded deferred-subsidy iframe.
 */
export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly cookies: CookieConsent;
  readonly header: Header;

  readonly heroHeading: Locator;
  readonly citySearchInput: Locator;
  readonly searchSubmit: Locator;
  readonly aiSearchButton: Locator;

  /** Hero product tabs. */
  readonly tabOffplan: Locator;
  readonly tabReadyUnits: Locator;
  readonly tabRentalUnits: Locator;

  /** Hero filter dropdowns. */
  readonly unitTypeFilter: Locator;
  readonly priceRangeFilter: Locator;
  readonly roomsFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.cookies = new CookieConsent(page);
    this.header = new Header(page);

    this.heroHeading = page.getByText(/استكشف خياراتك السكنية|Explore your housing options/);
    this.citySearchInput = page.locator('input[placeholder*="مدينة"], input[placeholder*="city" i]');
    this.searchSubmit = page.getByRole('button', { name: /^(بحث|Search)$/ }).last();
    // English labels this "AI Search", Arabic "ابحث مع AI".
    this.aiSearchButton = page.getByRole('button', { name: /AI Search|ابحث مع AI/i });

    // The hero product tabs are **not** buttons: each is a `div.property-tab`
    // wrapping a `span.tab-text`, and the `active` class lands on the wrapper.
    // The tab text also appears in a hidden mega-menu entry, so scoping to
    // `.property-tab` is what keeps these off the invisible duplicate. English
    // copy is not a literal translation ("Readymade units", "Units for rent").
    this.tabOffplan = heroTab(page, /Offplan|البيع على الخارطة/);
    this.tabReadyUnits = heroTab(page, /Readymade units|وحدات جاهزة/);
    this.tabRentalUnits = heroTab(page, /Units for rent|وحدات للإيجار/);

    this.unitTypeFilter = page.getByRole('button', { name: /نوع الوحدة|Unit type/i });
    this.priceRangeFilter = page.getByRole('button', { name: /نطاق السعر|Price range/i });
    this.roomsFilter = page.getByRole('button', { name: /الغرف|Rooms/i });
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.header.nav);
    await this.cookies.accept();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/سكني|Sakani/);
    await expect(this.header.nav).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }

  /**
   * Open the page without assuming the desktop header.
   *
   * `open()` and `expectLoaded()` gate on `#main_nav`, which the layout renders
   * only at desktop width — below that breakpoint the header collapses to a
   * variant without that id. A responsive journey that used them would time out
   * on a control the layout deliberately removes, testing the gate rather than
   * the page. These wait on the brand link, which survives every breakpoint.
   */
  async openResponsive(): Promise<void> {
    await this.gotoUntilReady(this.header.brandLink);
    await this.cookies.accept();
  }

  async expectLoadedResponsive(): Promise<void> {
    await expect(this.page).toHaveTitle(/سكني|Sakani/);
    await expect(this.header.brandLink).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }

  async goToLogin(): Promise<void> {
    await this.header.loginButton.first().click();
    await this.page.waitForURL(/\/app\/authentication\/login/, { waitUntil: 'commit' });
  }

  /** A persona chip in the "Services tailored for you" selector. */
  persona(name: 'Broker' | 'Developer' | 'Self-Build' | 'Buyer' | 'Tenant'): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^\\s*${name}\\s*$`, 'i') }).first();
  }

  /** Select a hero product tab and confirm it became the active one. */
  async selectHeroTab(tab: Locator): Promise<void> {
    await tab.click({ force: true });
    await expect(tab).toHaveClass(/active|selected/, { timeout: 15_000 });
  }

  /**
   * Submit the hero search. The marketing page hands off to the Angular
   * marketplace, so the wait is on the route change rather than on any element.
   */
  async submitSearch(): Promise<void> {
    await this.searchSubmit.click({ force: true });
    await this.page.waitForURL(/\/app\/marketplace/, {
      waitUntil: 'commit',
      timeout: 90_000,
    });
  }
}
