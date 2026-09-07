import { Page, Locator, expect } from '@playwright/test';

/**
 * Global site header: mega-menu navigation, search, language toggle and the
 * authenticated user menu.
 *
 * The mega-menu panels open on hover and can overlay content beneath the header,
 * which is why forms lower on the page are submitted with the keyboard rather
 * than a mouse click that would travel past the header.
 */
export class Header {
  private readonly page: Page;

  readonly nav: Locator;
  readonly propertiesForSale: Locator;
  readonly propertiesForRent: Locator;
  readonly auctions: Locator;
  readonly services: Locator;
  readonly help: Locator;
  readonly searchButton: Locator;
  readonly languageToggle: Locator;
  readonly loginButton: Locator;
  readonly userMenuButton: Locator;

  /**
   * A header readiness signal that holds at **every** breakpoint.
   *
   * `nav` (`#main_nav`) is the desktop container only: below the desktop
   * breakpoint the header renders a collapsed variant — same links, plus its own
   * "Close menu" control — that carries no such id. The Sakani logo link is
   * present in both, so responsive journeys wait on this instead of `nav`.
   */
  readonly brandLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('#main_nav');
    this.propertiesForSale = this.nav.getByText(/^(Properties for Sale|عقارات للشراء)$/);
    this.propertiesForRent = this.nav.getByText(/^(Properties for Rent|عقارات للإيجار)$/);
    this.auctions = this.nav.getByText(/^(Auctions|المزادات)$/);
    this.services = this.nav.getByText(/^(Services|الخدمات)$/);
    this.help = this.nav.getByText(/^(Help|المساعدة)$/);
    this.searchButton = this.nav.getByText(/^(Search|بحث)$/);
    // Contains-match rather than anchored: the control pairs its label with a
    // globe icon, so the accessible name is not always exactly the word.
    this.languageToggle = page.getByRole('button', { name: /English|عربي|العربية/ });
    this.loginButton = page.getByRole('button', { name: /^(Login|تسجيل الدخول)$/ });
    this.userMenuButton = page.locator('button').filter({ hasText: /ALSHAIKHA|اليامي/ });
    this.brandLink = page.getByRole('link', { name: /Sakani logo|شعار سكني/i }).first();
  }

  /** True once the header renders the authenticated user's name. */
  async isAuthenticated(): Promise<boolean> {
    return this.userMenuButton.first().isVisible().catch(() => false);
  }

  async expectAuthenticated(name: string | RegExp): Promise<void> {
    await expect(this.userMenuButton.first()).toContainText(name, { timeout: 60_000 });
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuButton.first().click({ force: true });
    await this.page.getByText('Logout', { exact: true }).first().waitFor({ state: 'visible' });
  }

  /** Click an entry in the authenticated user dropdown. */
  async openUserMenuItem(label: string | RegExp): Promise<void> {
    await this.openUserMenu();
    await this.page.getByText(label, { exact: typeof label === 'string' }).first().click({ force: true });
  }

  /** Hover a top-level nav item and return the links inside its mega-menu panel. */
  async megaMenuLinks(item: Locator): Promise<string[]> {
    await item.hover();
    await this.page.waitForTimeout(1200);
    const container = item.locator('xpath=ancestor::li[1]');
    return container.evaluate((el: HTMLElement) =>
      [...el.querySelectorAll('a')]
        .map((a) => (a.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter(Boolean),
    );
  }

  /** Hover a top-level nav item and return the `href`s inside its mega-menu panel. */
  async megaMenuHrefs(item: Locator): Promise<string[]> {
    await item.hover();
    const container = item.locator('xpath=ancestor::li[1]');
    // Wait for the panel to populate rather than sleeping a fixed interval.
    await expect
      .poll(async () => container.locator('a').count(), { timeout: 30_000 })
      .toBeGreaterThan(0);
    return container.evaluate((el: HTMLElement) =>
      [...el.querySelectorAll('a')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((h) => h && h !== '#'),
    );
  }

  /**
   * Log out, including the confirmation dialog.
   *
   * Choosing "Logout" in the user menu does not end the session on its own: the
   * app raises a modal — "You are now about to log out, do you agree with that?"
   * — with Cancel / Agree. Without confirming it the session survives and the
   * header keeps rendering the user's name.
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.page.getByText('Logout', { exact: true }).first().click({ force: true });

    const agree = this.page.getByRole('button', { name: /^\s*(Agree|موافق)\s*$/i }).first();
    await agree.waitFor({ state: 'visible', timeout: 30_000 });
    await agree.click({ force: true });

    // Confirming hands off to a cross-domain single-logout endpoint —
    // `…-partners.housingapps.sa/authentication/slo?relay_state=…` — which is
    // supposed to relay back to the app. Wait for that round trip explicitly.
    //
    // Waiting on the *app* state instead (say, the user menu disappearing) is a
    // trap: while the browser sits on the partners domain there is no Sakani
    // header at all, so such a check passes trivially and the real failure then
    // surfaces much later as a missing header control on a blank page. Naming
    // the SLO stage here makes the failure say what actually broke.
    // The chain is `/app/auth/logout?returnUrl=…` -> the partners SLO endpoint ->
    // back to `returnUrl`. When the SLO host cannot be reached the browser ends
    // up on a `chrome-error://` page, so checking only "is no longer the SLO
    // URL" is satisfied by the failure itself. Classify the stage instead, so
    // the message names what broke.
    await expect
      .poll(
        () => {
          const url = this.page.url();
          if (!/^https?:/i.test(url)) return 'navigation-failed';
          if (/\/authentication\/slo|\/auth\/logout/i.test(url)) return 'awaiting-slo-relay';
          return 'returned-to-app';
        },
        {
          timeout: 120_000,
          message:
            'Logout did not return to the application. It hands off to ' +
            '`…-partners.housingapps.sa/authentication/slo`, which must relay back to ' +
            'returnUrl; "navigation-failed" means that host could not be reached at all.',
        },
      )
      .toBe('returned-to-app');
  }
}
