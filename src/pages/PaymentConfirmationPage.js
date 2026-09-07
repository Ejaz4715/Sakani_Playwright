const { expect } = require("@playwright/test");
const path = require("path");
const { PaymentConfirmationObjects } = require(
  path.join(process.cwd(), "src", "Objects", "PaymentConfirmationObjects"),
);

class PaymentConfirmationPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
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

module.exports = { PaymentConfirmationPage };
