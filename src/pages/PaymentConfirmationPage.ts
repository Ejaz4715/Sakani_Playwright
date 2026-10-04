// @ts-nocheck
import { expect } from '@playwright/test';
import { PaymentConfirmationObjects } from '@objects/PaymentConfirmationObjects'

export class PaymentConfirmationPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await expect (locator).toBeVisible(90000);
    await locator.click();
  }

  async check(locator) {
    await expect (locator).toBeVisible(90000);
    await locator.check();
  }

  async closePayment() {
    const closeButton = this.page.getByRole(
      PaymentConfirmationObjects.closeButton.role,
      { name: PaymentConfirmationObjects.closeButton.name },
    );
    await this.click(closeButton);
  }

  async expectSuccessMessage() {
    const successMessage = this.page.locator(
      PaymentConfirmationObjects.successMessage,
    );
    await expect(successMessage).toContainText("تم اكتمال الحجز بنجاح!");
  }
}