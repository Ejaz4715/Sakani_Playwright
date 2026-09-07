const { expect } = require("@playwright/test");
const path = require("path");
const { PaymentGatewayObjects } = require(
  path.join(process.cwd(), "src", "Objects", "PaymentGatewayObjects"),
);
const { UnitBookingObjects } = require(
  path.join(process.cwd(), "src", "Objects", "UnitBookingObjects"),
);

class PaymentGatewayPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async fillCardDetails() {
    const madaPaymentTitle = this.page.getByTitle(
      UnitBookingObjects.madaPaymentTitle.title,
    );
    await expect(madaPaymentTitle).toBeVisible({ timeout: 60000 });
    await this.click(madaPaymentTitle);

    const cardNumber = this.page
      .locator(PaymentGatewayObjects.cardNumberFrame)
      .contentFrame()
      .getByRole(PaymentGatewayObjects.cardNumberInput.role, {
        name: PaymentGatewayObjects.cardNumberInput.name,
      });
    await cardNumber.fill("4464040000000007");

    const expiryDateInput = this.page.getByRole(
      PaymentGatewayObjects.expiryDateInput.role,
      { name: PaymentGatewayObjects.expiryDateInput.name },
    );
    await expiryDateInput.fill("10 / 52");

    const cardHolderNameInput = this.page.getByRole(
      PaymentGatewayObjects.cardHolderNameInput.role,
      { name: PaymentGatewayObjects.cardHolderNameInput.name },
    );
    await cardHolderNameInput.fill("cvv2");

    const cvvInput = this.page
      .locator(PaymentGatewayObjects.cvvFrame)
      .contentFrame()
      .getByRole(PaymentGatewayObjects.cvvInput.role, {
        name: PaymentGatewayObjects.cvvInput.name,
      });
    await cvvInput.fill("222");

    const payNowButton = this.page.getByRole(
      PaymentGatewayObjects.payNowButton.role,
      { name: PaymentGatewayObjects.payNowButton.name },
    );
    await this.click(payNowButton);
  }
}

module.exports = { PaymentGatewayPage };
