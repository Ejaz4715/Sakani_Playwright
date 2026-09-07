import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Booking completion wizard —
 * `/app/user-profile/my-activities/my-bookings/view-booking/<id>/complete-booking`
 *
 * Two stages: (1) Payment method, (2) Sign contract.
 *
 * Stage 1 requires two independent selections before "Save&continue" enables:
 * a payment **method** (`input[name=paymentMethod]`, e.g. `#cashRadio`) and a
 * payment **schedule** (`input[name=paymentSchedule]`). Schedules come in two
 * families whose radio values encode the type and id:
 *   `fixed_payment_schedule___<id>` and `flexible_payment_schedule___<id>`.
 *
 * Which methods appear is eligibility-driven — a non-beneficiary, not-eligible
 * account is offered Cash only, with no lending option.
 */
export class CompleteBookingPage extends BasePage {
  protected readonly path: string;
  readonly bookingId: string;

  readonly heading: Locator;
  readonly stepPaymentMethod: Locator;
  readonly stepSignContract: Locator;

  readonly cashRadio: Locator;
  readonly paymentMethodRadios: Locator;
  readonly paymentScheduleRadios: Locator;
  readonly fixedSchedules: Locator;
  readonly flexibleSchedules: Locator;

  readonly bookingDetailsButton: Locator;
  readonly saveAndContinueButton: Locator;

  constructor(page: Page, bookingId: string) {
    super(page);
    this.bookingId = bookingId;
    this.path = `/app/user-profile/my-activities/my-bookings/view-booking/${bookingId}/complete-booking`;

    this.heading = page.getByRole('heading', { name: /Complete your booking|إكمال حجزك/i });
    this.stepPaymentMethod = page.getByRole('heading', { name: /Select Payment method/i });
    this.stepSignContract = page.getByText(/Sign contract|توقيع العقد/i).first();

    this.cashRadio = page.locator('#cashRadio');
    this.paymentMethodRadios = page.locator('input[name="paymentMethod"]');
    this.paymentScheduleRadios = page.locator('input[name="paymentSchedule"]');
    this.fixedSchedules = page.locator('input[id^="paymentSchedule___fixed_payment_schedule"]');
    this.flexibleSchedules = page.locator('input[id^="paymentSchedule___flexible_payment_schedule"]');

    this.bookingDetailsButton = page.getByRole('button', { name: /Booking details/i });
    this.saveAndContinueButton = page.getByRole('button', { name: /Save\s*&\s*continue/i });
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.heading);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.stepPaymentMethod).toBeVisible();
    await expect(this.paymentScheduleRadios.first()).toBeAttached({ timeout: 60_000 });
  }

  /** Payment methods offered to this account (eligibility-driven). */
  async availablePaymentMethods(): Promise<string[]> {
    return this.paymentMethodRadios.evaluateAll((els) =>
      els.map((e) => (e as HTMLInputElement).id).filter(Boolean),
    );
  }

  async paymentScheduleCount(): Promise<number> {
    return this.paymentScheduleRadios.count();
  }

  async selectCash(): Promise<void> {
    await this.cashRadio.check({ force: true });
    await expect(this.cashRadio).toBeChecked();
  }

  /** Select the first payment schedule of the requested family. */
  async selectPaymentSchedule(kind: 'fixed' | 'flexible' = 'fixed'): Promise<string> {
    const radios = kind === 'fixed' ? this.fixedSchedules : this.flexibleSchedules;
    const first = radios.first();
    await expect(first, `Expected at least one ${kind} payment schedule`).toBeAttached({
      timeout: 60_000,
    });
    await first.scrollIntoViewIfNeeded();
    await first.check({ force: true });
    await expect(first).toBeChecked();
    return first.evaluate((e) => (e as HTMLInputElement).value);
  }

  /** Complete stage 1 and advance to the contract-signing stage. */
  async submitPaymentMethod(): Promise<void> {
    await expect(this.saveAndContinueButton).toBeEnabled({ timeout: 30_000 });
    await this.saveAndContinueButton.scrollIntoViewIfNeeded();
    await this.saveAndContinueButton.click({ force: true });
  }
}
