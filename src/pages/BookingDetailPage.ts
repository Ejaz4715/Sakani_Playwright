import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Booking detail — `/app/user-profile/my-activities/my-bookings/view-booking/<id>`
 *
 * Shows the created booking (titled by unit code, e.g. "Booking 01-01-0504-999-165")
 * plus a "Steps to complete your booking" tracker with two outstanding stages:
 * Payment method, then Sign contract. The CTA advances to the completion wizard.
 */
export class BookingDetailPage extends BasePage {
  protected readonly path: string;
  readonly bookingId: string;

  readonly heading: Locator;
  readonly bookingDetailsSection: Locator;
  readonly unitDetailsSection: Locator;
  readonly stepsSection: Locator;
  readonly paymentMethodStep: Locator;
  readonly signContractStep: Locator;

  readonly viewUnitDetailsButton: Locator;
  readonly cancelBookingButton: Locator;
  readonly selectPaymentMethodButton: Locator;

  constructor(page: Page, bookingId: string) {
    super(page);
    this.bookingId = bookingId;
    this.path = `/app/user-profile/my-activities/my-bookings/view-booking/${bookingId}?resourceType=bookings`;

    this.heading = page.getByRole('heading', { name: /^Booking\s/i }).first();
    this.bookingDetailsSection = page.getByRole('heading', { name: /Booking details|تفاصيل الحجز/i });
    this.unitDetailsSection = page.getByRole('heading', { name: /Unit details|تفاصيل الوحدة/i });
    this.stepsSection = page.getByRole('heading', {
      name: /Steps to complete your booking|خطوات إكمال الحجز/i,
    });
    this.paymentMethodStep = page.getByText(/Payment method|طريقة الدفع/i).first();
    this.signContractStep = page.getByText(/Sign contract|توقيع العقد/i).first();

    this.viewUnitDetailsButton = page.getByRole('button', { name: /View unit details/i });
    this.cancelBookingButton = page.getByRole('button', { name: /Cancel booking|إلغاء الحجز/i });
    this.selectPaymentMethodButton = page.getByRole('button', { name: /Select Payment Method/i });
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.heading);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.stepsSection).toBeVisible();
  }

  /** Unit code from the page title, e.g. "01-01-0504-999-165". */
  async unitCode(): Promise<string> {
    const text = await this.heading.innerText();
    return text.replace(/^Booking\s*/i, '').trim();
  }

  async goToPaymentMethod(): Promise<void> {
    await this.selectPaymentMethodButton.click({ force: true });
    await this.page.waitForURL(/\/view-booking\/\d+\/complete-booking/, {
      waitUntil: 'commit',
      timeout: 120_000,
    });
  }
}
