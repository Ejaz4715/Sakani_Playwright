const path = require("path");
const { UnitBookingObjects } = require(
  path.join(process.cwd(), "src", "Objects", "UnitBookingObjects"),
);

class UnitBookingPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async acceptTermsAndConfirm() {
    const termsCheckbox = this.page.locator(UnitBookingObjects.termsCheckbox);
    await this.click(termsCheckbox);

    const confirmButton = this.page.getByRole(
      UnitBookingObjects.confirmButton.role,
      { name: UnitBookingObjects.confirmButton.name },
    );
    await this.click(confirmButton);

    const payBookingFeeButton = this.page.getByRole(
      UnitBookingObjects.payBookingFeeButton.role,
      { name: UnitBookingObjects.payBookingFeeButton.name },
    );
    await this.click(payBookingFeeButton);
  }

  async acceptAuctionTerms() {
    await this.page
      .getByRole("checkbox", {
        name: "أؤكد قراءتي وفهمي وموافقتي على الشروط والأحكام",
      })
      .check();
  }

  async signMohLandBooking(otp = ["1", "2", "3", "4"]) {
    await this.page
      .getByRole("checkbox", {
        name: "لقد قرأت وفهمت الشروط والأحكام الخاصة بالعقد *",
      })
      .check();
    await this.page.getByRole("button", { name: "قبول وتوقيع" }).click();
    const otpInputs = this.page.getByRole("textbox", { name: "-" });
    for (let index = 0; index < otp.length; index++) {
      await otpInputs.nth(index).fill(otp[index]);
    }
    await this.page.getByRole("button", { name: "تحقق" }).click();
    await this.page.getByRole("button", { name: "إغلاق" }).click();
  }

  async signSalesContract(otp = ["1", "2", "3", "4"]) {
    await this.page.getByRole("button", { name: "اعتماد" }).click();
    const otpInputs = this.page.getByRole("textbox");
    for (let index = 0; index < otp.length; index++) {
      await otpInputs.nth(index).fill(otp[index]);
    }
    await this.page.getByRole("button", { name: "تحقق", exact: true }).click();
    await this.page.getByRole("button", { name: "إغلاق" }).click();
  }

  async expectSalesContractSuccess() {
    const { expect } = require("@playwright/test");
    await expect(
      this.page.getByRole("heading", { name: "تهانينا" }),
    ).toBeVisible();
  }
}

module.exports = { UnitBookingPage };
