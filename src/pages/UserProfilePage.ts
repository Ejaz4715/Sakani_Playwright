import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';
import { PROFILE_ROUTES } from '@data/testData';

/**
 * The account portal's non-Activities pages
 * (`/app/user-profile/...`: dashboard, my information, wallet, financial
 * advisory, payments, favorites, registered interests).
 *
 * These pages share one shell — left navigation, a page heading and a tabbed
 * content area — so a single page object covers them, with a small named
 * locator per page for the controls that differ. Splitting them into seven
 * classes would duplicate the shell handling without adding clarity.
 *
 * The left navigation is built from Angular routerLinks with **no `href`**, so
 * the pages are opened by direct URL rather than by clicking the sidebar. That
 * also keeps each test independent.
 */
export class UserProfilePage extends BasePage {
  protected path: string = PROFILE_ROUTES.dashboard;

  /** Left-navigation entries, addressed by their visible label. */
  readonly sidebar: Locator;

  // --- Dashboard ---
  readonly startServiceButton: Locator;

  // --- My information ---
  readonly profileHeading: Locator;
  readonly verifyEmailButton: Locator;
  readonly updateContactButton: Locator;

  // --- Wallet ---
  readonly walletHeading: Locator;
  readonly walletBalance: Locator;
  readonly withdrawButton: Locator;
  readonly balanceTab: Locator;
  readonly bankAccountTab: Locator;

  // --- Financial advisory ---
  readonly advisoryHeading: Locator;
  readonly updateFinancialInfoButton: Locator;
  readonly overviewTab: Locator;
  readonly financingRequestsTab: Locator;

  // --- Payments and transactions ---
  readonly paymentsHeading: Locator;
  readonly previewInvoiceButton: Locator;
  readonly previewReceiptButton: Locator;

  // --- Favorites / registered interests ---
  readonly favoritesHeading: Locator;
  readonly registeredInterestsHeading: Locator;
  readonly exploreMarketplaceButton: Locator;

  constructor(page: Page) {
    super(page);

    this.sidebar = page.getByText('Dashboard', { exact: true }).first();

    this.startServiceButton = page.getByRole('button', { name: /Start service/i });

    this.profileHeading = page.getByRole('heading', { name: /^\s*Profile\s*$/i });
    this.verifyEmailButton = page.getByRole('button', { name: /Verify Email|تأكيد البريد/i });
    this.updateContactButton = page.getByRole('button', {
      name: /Update contact information|تحديث بيانات التواصل/i,
    });

    this.walletHeading = page.getByRole('heading', { name: /^\s*Wallet\s*$/i });
    // Currency prefix: the app renders balances as "SAR 827,670" while its form
    // inputs still use the older "SR 0" placeholder style. `SA?R` matches both,
    // so the locator survives whichever surface it is pointed at.
    this.walletBalance = page.getByRole('heading', { name: /^\s*SA?R\s*[\d,.]+\s*$/ }).first();
    this.withdrawButton = page.getByRole('button', { name: /^\s*(Withdraw|سحب)\s*$/i });
    this.balanceTab = page.getByRole('button', { name: /Balance & Transactions/i })
      .or(page.getByText('Balance & Transactions', { exact: true }))
      .first();
    this.bankAccountTab = page.getByRole('button', { name: /Bank account/i })
      .or(page.getByText('Bank account', { exact: true }))
      .first();

    this.advisoryHeading = page.getByRole('heading', { name: /Financial Advisory/i });
    this.updateFinancialInfoButton = page.getByRole('button', {
      name: /Update my financial information/i,
    });
    this.overviewTab = page.getByText('Overview', { exact: true }).first();
    this.financingRequestsTab = page.getByText('Financing Requests', { exact: true }).first();

    this.paymentsHeading = page.getByRole('heading', { name: /Payments and transactions/i });
    this.previewInvoiceButton = page.getByRole('button', { name: /Preview invoice/i });
    this.previewReceiptButton = page.getByRole('button', { name: /Preview receipt/i });

    this.favoritesHeading = page.getByRole('heading', { name: /^\s*Favorites\s*$/i });
    this.registeredInterestsHeading = page.getByRole('heading', { name: /Registered interests/i });
    this.exploreMarketplaceButton = page.getByRole('button', {
      name: /Explore Marketplace/i,
    }).or(page.getByRole('link', { name: /Explore Marketplace/i })).first();
  }

  /** Open one of the profile routes and wait for its own readiness signal. */
  async openRoute(route: string, ready: Locator): Promise<void> {
    this.path = route;
    await this.gotoUntilReady(ready, route);
  }

  async openDashboard(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.dashboard, this.startServiceButton.first());
  }

  async openMyInformation(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.myInformation, this.profileHeading);
  }

  async openWallet(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.wallet, this.walletHeading);
  }

  async openFinancialAdvisory(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.financialAdvisory, this.advisoryHeading);
  }

  async openPayments(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.payments, this.paymentsHeading);
  }

  async openFavorites(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.favorites, this.favoritesHeading);
  }

  async openRegisteredInterests(): Promise<void> {
    await this.openRoute(PROFILE_ROUTES.registeredInterests, this.registeredInterestsHeading);
  }

  /** A status/section tab by visible label, within any profile page. */
  tab(label: string): Locator {
    const pattern = new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
    return this.page
      .getByRole('link', { name: pattern })
      .or(this.page.getByRole('button', { name: pattern }))
      .or(this.page.getByText(pattern))
      .first();
  }

  /** Labels from the given set that are actually rendered. */
  async visibleTabLabels(expected: readonly string[]): Promise<string[]> {
    return this.page.evaluate((labels) => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const found = [...document.querySelectorAll('a, button, li, [role="tab"]')]
        .filter(visible)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim());
      return labels.filter((l) => found.includes(l));
    }, [...expected]);
  }

  /** Every left-navigation label currently rendered. */
  async sidebarLabels(): Promise<string[]> {
    return this.page.evaluate(() => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const known = [
        'Dashboard', 'My information', 'My Wallet', 'Financial Advisory', 'Activities',
        'Preferences', 'Payment and transactions', 'Favorites', 'Help & support', 'Logout',
      ];
      const found = [...document.querySelectorAll('a, li, button')]
        .filter(visible)
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim());
      return known.filter((k) => found.includes(k));
    });
  }

  async expectHeading(heading: Locator): Promise<void> {
    await expect(heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }
}
