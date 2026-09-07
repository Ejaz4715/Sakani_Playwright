import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Housing Designs catalogue — `/app/housing-designs`
 *
 * Browsable catalogue of engineering designs with room/bathroom chips, a price
 * range and three land-dimension inputs, which are the only fields on the page
 * carrying real ids.
 */
export class HousingDesignsPage extends BasePage {
  protected readonly path = '/app/housing-designs';

  readonly heading: Locator;
  readonly availableDesignsHeading: Locator;
  readonly designCards: Locator;

  readonly minPrice: Locator;
  readonly maxPrice: Locator;
  readonly landWidth: Locator;
  readonly landLength: Locator;
  readonly frontStreetWidth: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', {
      name: /Browse available housing designs|تصفح التصاميم/i,
    });
    this.availableDesignsHeading = page.getByRole('heading', {
      name: /Available designs|التصاميم المتاحة/i,
    });
    // Design tiles are role-less component containers with **no anchor** — the
    // same pattern as marketplace result cards and developer cards. The
    // component element is the stable handle.
    this.designCards = page.locator('app-design-profile-card');

    this.minPrice = page.getByPlaceholder(/^\s*Min\s*$/i).first();
    this.maxPrice = page.getByPlaceholder(/^\s*Max\s*$/i).first();
    this.landWidth = page.locator('#landWidth');
    this.landLength = page.locator('#landLength');
    this.frontStreetWidth = page.locator('#frontStreetWidth');
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.heading);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading.first()).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }

  /** A room / bathroom count chip, e.g. "3" or "5+". */
  chip(label: string): Locator {
    return this.page
      .getByRole('button', { name: new RegExp(`^\\s*${label.replace('+', '\\+')}\\s*$`) })
      .first();
  }

  async designCount(): Promise<number> {
    return this.designCards.count();
  }

  /** Wait for the catalogue to settle on either designs or an empty state. */
  async waitForCatalogue(timeout = 60_000): Promise<void> {
    await expect
      .poll(
        async () => {
          if ((await this.designCards.count()) > 0) return 'populated';
          const body = await this.page.locator('body').innerText().catch(() => '');
          return /no result|no design|not found|لا توجد/i.test(body) ? 'empty' : 'loading';
        },
        { timeout, message: 'Housing designs catalogue never settled' },
      )
      .not.toBe('loading');
  }
}
