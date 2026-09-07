import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';
import { API } from '@data/testData';

/**
 * Booking summary — `/app/booking/v2/offplan/booking-summary`
 *
 * Step 1 of 3 in the comprehensive off-plan journey. Read-only review of the
 * reserved unit (project, developer, block/building/apartment/floor) and the
 * booking terms (project type, property type, non-subsidised vs subsidised
 * price), with Back and Confirm Booking.
 *
 * Reaching this page means the unit is already soft-reserved via
 * `POST /mainIntermediaryApi/v4/units/reserve`.
 */
export class BookingSummaryPage extends BasePage {
  protected readonly path = '/app/booking/v2/offplan/booking-summary';

  readonly heading: Locator;
  readonly unitDetailsSection: Locator;
  readonly bookingDetailsSection: Locator;
  readonly projectNameLabel: Locator;
  readonly backButton: Locator;
  readonly confirmBookingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Booking summary|ملخص الحجز/i });
    this.unitDetailsSection = page.getByRole('heading', { name: /Units details|تفاصيل الوحدة/i });
    this.bookingDetailsSection = page.getByRole('heading', { name: /Booking details|تفاصيل الحجز/i });
    this.projectNameLabel = page.getByText(/^\s*(Project name|اسم المشروع)\s*$/i).first();
    this.backButton = page.getByRole('button', { name: /^\s*(Back|رجوع)\s*$/ });
    this.confirmBookingButton = page.getByRole('button', { name: /Confirm Booking|تأكيد الحجز/i });
  }

  /**
   * The page chrome — heading and Confirm button — renders before the summary's
   * key/value rows arrive, so waiting on those alone lets a caller read the
   * page while the detail block is still empty. The "Project name" row is the
   * first of the real content and is therefore the readiness signal.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/app\/booking\/v2\/offplan\/booking-summary/, {
      timeout: APP_READY_TIMEOUT,
    });
    await expect(this.heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.projectNameLabel).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.confirmBookingButton).toBeEnabled();
  }

  /** Key/value pairs rendered in the summary, for assertions on the reserved unit. */
  async summaryText(): Promise<string> {
    await expect(this.projectNameLabel).toBeVisible({ timeout: APP_READY_TIMEOUT });
    return this.page.locator('body').innerText();
  }

  /**
   * Confirm the booking and return the created booking id.
   *
   * Asserts the create call succeeded rather than trusting the redirect alone,
   * so a silent backend failure fails the test at the right step.
   */
  async confirmBooking(): Promise<string> {
    const responsePromise = this.page.waitForResponse(
      (r) =>
        r.request().method() === 'POST' &&
        new URL(r.url()).pathname.endsWith(API.createBooking) &&
        r.status() !== 202,
      { timeout: 120_000 },
    );

    await this.confirmBookingButton.scrollIntoViewIfNeeded();
    await this.confirmBookingButton.click({ force: true });

    const response = await responsePromise;
    expect(response.ok(), `Booking API failed with HTTP ${response.status()}`).toBeTruthy();

    await this.page.waitForURL(/\/app\/booking\/v2\/offplan\/success\/\d+/, {
      waitUntil: 'commit',
      timeout: 120_000,
    });

    const match = this.page.url().match(/success\/(\d+)/);
    expect(match, 'Expected a booking id in the success URL').toBeTruthy();
    return match![1];
  }
}
