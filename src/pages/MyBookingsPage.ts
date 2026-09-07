import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/** Match a status tab however it happens to be rendered. */
function tabLocator(page: Page, name: RegExp): Locator {
  return page
    .getByRole('link', { name })
    .or(page.getByRole('tab', { name }))
    .or(page.getByRole('button', { name }))
    .or(page.getByText(name))
    .first();
}

/**
 * My Bookings — `/app/user-profile/my-activities/my-bookings/listing`
 *
 * Status-tabbed listing of every booking the account has made. Each card shows
 * product type, unit type, unit code, booking or cancellation date, and the
 * booking fee where one applies.
 */
export class MyBookingsPage extends BasePage {
  protected readonly path = '/app/user-profile/my-activities/my-bookings/listing';

  readonly heading: Locator;
  readonly bookingCards: Locator;

  readonly tabAll: Locator;
  readonly tabActive: Locator;
  readonly tabCancelled: Locator;
  readonly tabCompleted: Locator;
  readonly tabUnpaid: Locator;
  readonly tabReadyToSign: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /My bookings|حجوزاتي/i });
    this.bookingCards = page.locator('[class*="booking-card"], .card').filter({
      hasText: /Product type|نوع المنتج/i,
    });

    // The status tabs are not reliably exposed as links — depending on the
    // render they are anchors, `role=tab` elements or plain text nodes — so each
    // is matched across all three, mirroring `ActivitiesPage.tab()`.
    this.tabAll = tabLocator(page, /^\s*(All|الكل)\s*$/);
    this.tabActive = tabLocator(page, /^\s*(Active|نشط)\s*$/);
    this.tabCancelled = tabLocator(page, /^\s*(Cancelled|ملغي)\s*$/);
    this.tabCompleted = tabLocator(page, /^\s*(Completed|مكتمل)\s*$/);
    this.tabUnpaid = tabLocator(page, /^\s*(Unpaid|غير مدفوع)\s*$/);
    this.tabReadyToSign = tabLocator(page, /^\s*(Ready to sign|جاهز للتوقيع)\s*$/);
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.heading);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await this.waitForListing();
  }

  /**
   * Block until the listing has actually hydrated.
   *
   * The heading renders well before `/beneficiary/me/bookings` resolves, so
   * asserting on card content immediately after the heading races the fetch.
   * Resolves on either a populated list or the empty state.
   */
  async waitForListing(timeout = 90_000): Promise<void> {
    await expect
      .poll(() => this.listingState(), {
        timeout,
        message: 'My bookings listing never settled',
      })
      .not.toBe('loading');
  }

  /**
   * Whether the current tab shows bookings, an empty state, or is still loading.
   *
   * Read from the rendered text rather than a single empty-state string: each
   * status tab words its own "nothing here" message differently, so matching one
   * phrase leaves the other tabs hanging until timeout.
   */
  async listingState(): Promise<'empty' | 'populated' | 'loading'> {
    return this.page.evaluate(() => {
      const text = (document.body.innerText || '').replace(/\s+/g, ' ');
      if (/Product type|نوع المنتج/i.test(text)) return 'populated';
      if (/no .{0,40}(booking|found|yet)|don['’]t have any|لا توجد|لا يوجد/i.test(text)) {
        return 'empty';
      }
      return 'loading';
    });
  }

  /** True when the account has at least one booking in the current tab. */
  async hasAnyBooking(): Promise<boolean> {
    return this.page
      .getByText(/Product type|نوع المنتج/i)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async tabLabels(): Promise<string[]> {
    return this.page.evaluate(() =>
      [...document.querySelectorAll('a')]
        .map((a) => (a.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter((t) => ['All', 'Active', 'Cancelled', 'Completed', 'Unpaid', 'Ready to sign'].includes(t)),
    );
  }

  async selectTab(tab: Locator): Promise<void> {
    await tab.scrollIntoViewIfNeeded().catch(() => {});
    await tab.click({ force: true });
    await this.waitForListing();
  }

  /** True when a card for the given unit code is listed. */
  async hasBookingForUnit(unitCode: string): Promise<boolean> {
    return this.page
      .getByText(unitCode, { exact: false })
      .first()
      .isVisible()
      .catch(() => false);
  }

  /**
   * Number of bookings listed in the current tab.
   *
   * Counted from the "Product type" label each card carries, because the card
   * container class is shared with unrelated layout wrappers.
   */
  async bookingCount(): Promise<number> {
    return this.page.getByText(/Product type|نوع المنتج/i).count();
  }

  async openBookingDetails(index = 0): Promise<void> {
    await this.page.getByRole('button', { name: /View details/i }).nth(index).click({ force: true });
    await this.page.waitForURL(/view-booking\/\d+/, { waitUntil: 'commit', timeout: 120_000 });
  }
}
