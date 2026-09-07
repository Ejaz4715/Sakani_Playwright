import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Unit detail — `/app/units/<id>`
 *
 * Rendered inside the NHC shell ("Back to Sakani" / "Go to NHC Marketplace").
 * Carries the primary booking CTA plus availability state, unit attributes,
 * documents, participating banks and a mortgage-calculator entry point.
 */
export class UnitDetailPage extends BasePage {
  protected readonly path: string;
  readonly unitId: string;

  readonly unitName: Locator;
  readonly unitPrice: Locator;
  readonly bookingsOpenBadge: Locator;
  readonly bookingsClosedNotice: Locator;
  readonly bookUnitButton: Locator;
  readonly compareButton: Locator;
  readonly favoriteButton: Locator;
  readonly shareButton: Locator;
  readonly mortgageCalculatorButton: Locator;
  readonly contactDeveloperButton: Locator;

  /** "Do you want to continue?" interception when a booking already exists. */
  readonly existingBookingHeading: Locator;
  readonly viewExistingBookingLink: Locator;

  /** Blocking modal for the one-booking-per-project rule. */
  readonly oneBookingPerProjectModal: Locator;
  readonly returnToProjectButton: Locator;

  constructor(page: Page, unitId: string) {
    super(page);
    this.unitId = unitId;
    this.path = `/app/units/${unitId}`;

    this.unitName = page.getByRole('heading').first();
    this.unitPrice = page.getByRole('heading', { name: /SAR/ }).first();
    this.bookingsOpenBadge = page.getByText(/Bookings open|الحجز متاح/i).first();
    this.bookingsClosedNotice = page.getByText(/not taking bookings yet|Bookings closed/i).first();
    this.bookUnitButton = page.getByRole('button', { name: /Book a unit|احجز وحدة/i }).first();
    this.compareButton = page.getByRole('button', { name: /Compare|مقارنة/i });
    this.favoriteButton = page.getByRole('button', { name: /Favorite|المفضلة/i });
    this.shareButton = page.getByRole('button', { name: /Share|مشاركة/i });
    this.mortgageCalculatorButton = page.getByRole('button', { name: /Mortgage Calculator/i });
    this.contactDeveloperButton = page.getByRole('button', { name: /Contact Developer/i });

    this.existingBookingHeading = page.getByRole('heading', { name: /هل تود الاستمرار|continue/i });
    this.viewExistingBookingLink = page.getByRole('link', { name: /انقر هنا|click here/i });

    this.oneBookingPerProjectModal = page
      .locator('ngb-modal-window, .modal.show, [role=dialog]')
      .filter({ hasText: /not be able to book more than one unit|أكثر من وحدة/i });
    this.returnToProjectButton = this.oneBookingPerProjectModal.getByText(
      /Return to project|العودة للمشروع/i,
    );
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.bookUnitButton);
  }

  async expectBookable(): Promise<void> {
    await expect(this.bookingsOpenBadge).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.bookUnitButton).toBeVisible();
    await expect(this.bookUnitButton).toBeEnabled();
  }

  /**
   * Activate the booking CTA with the keyboard.
   *
   * This fixed CTA can be painted outside Chromium's coordinate viewport on the
   * RTL layout; keyboard activation invokes the same native click handler
   * without depending on unstable screen coordinates.
   */
  async clickBook(): Promise<void> {
    await this.bookUnitButton.focus();
    await this.bookUnitButton.press('Enter');
  }

  /**
   * Start a booking and report what the app did.
   *
   * `start_booking` returns 202 and the precondition result arrives
   * asynchronously over CQRS, so the outcome is a race between navigating to
   * the summary and a blocking modal appearing.
   */
  async startBooking(): Promise<'summary' | 'blocked-one-per-project' | 'no-response'> {
    const before = this.page.url();
    await this.clickBook();

    const result = await Promise.race([
      this.page
        .waitForURL((u) => u.toString().includes('/booking/'), { waitUntil: 'commit', timeout: 120_000 })
        .then(() => 'summary' as const)
        .catch(() => null),
      this.oneBookingPerProjectModal
        .first()
        .waitFor({ state: 'visible', timeout: 120_000 })
        .then(() => 'blocked-one-per-project' as const)
        .catch(() => null),
    ]);

    if (result) return result;
    return this.page.url() === before ? 'no-response' : 'summary';
  }
}
