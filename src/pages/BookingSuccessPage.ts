import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Booking success — `/app/booking/v2/offplan/success/<bookingId>`
 *
 * Terminal state of the *reservation*: the unit is held but the booking is not
 * finished. The copy is explicit — "please complete you booking details to
 * avoid cancellation" — and the CTA continues into the completion wizard
 * (payment method, then contract signing).
 *
 * A satisfaction-survey modal ("Tell us about your impression") auto-opens over
 * the page and must be dismissed before the CTA is clickable.
 */
export class BookingSuccessPage extends BasePage {
  readonly successHeading: Locator;
  readonly successMessage: Locator;
  readonly completeBookingButton: Locator;

  readonly feedbackModal: Locator;
  readonly feedbackClose: Locator;
  readonly feedbackSend: Locator;

  constructor(page: Page) {
    super(page);
    this.successHeading = page.getByRole('heading', { name: /Success!|تم بنجاح/i });
    this.successMessage = page.getByText(/booking has been placed|تم تقديم طلب الحجز/i);
    this.completeBookingButton = page.getByRole('button', { name: /Complete booking|إكمال الحجز/i });

    this.feedbackModal = page
      .locator('ngb-modal-window, .modal.show, [role=dialog]')
      .filter({ hasText: /Tell us about your impression|شاركنا انطباعك/i });
    this.feedbackClose = this.feedbackModal.getByRole('button', { name: /^\s*(Close|إغلاق)\s*$/ });
    this.feedbackSend = this.feedbackModal.getByRole('button', { name: /^\s*(Send|إرسال)\s*$/ });
  }

  async expectLoaded(bookingId?: string): Promise<void> {
    const pattern = bookingId
      ? new RegExp(`/app/booking/v2/offplan/success/${bookingId}`)
      : /\/app\/booking\/v2\/offplan\/success\/\d+/;
    await expect(this.page).toHaveURL(pattern, { timeout: APP_READY_TIMEOUT });
    await expect(this.successHeading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.successMessage).toBeVisible();
  }

  /** Dismiss the satisfaction survey if it opened. No-op otherwise. */
  async dismissFeedback(): Promise<void> {
    const shown = await this.feedbackModal
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (!shown) return;
    await this.feedbackClose.first().click({ force: true }).catch(() => {});
    await this.feedbackModal.first().waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  }

  /** Continue into the booking-completion wizard (lands on the booking detail page). */
  async completeBooking(): Promise<void> {
    await this.dismissFeedback();
    await this.completeBookingButton.click({ force: true });
    await this.page.waitForURL(/\/my-bookings\/view-booking\/\d+/, {
      waitUntil: 'commit',
      timeout: 120_000,
    });
  }
}
