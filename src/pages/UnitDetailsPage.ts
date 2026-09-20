// @ts-nocheck
import { UnitDetailsObjects } from '@objects/UnitDetailsObjects'

export class UnitDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async reserveUnit() {
    const reserveButton = this.page.getByRole(
      UnitDetailsObjects.reserveButton.role,
      { name: UnitDetailsObjects.reserveButton.name },
    );
    await this.page.waitForTimeout(3000);
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);
    await reserveButton.waitFor({ state: "visible", timeout: 30000 });
    await this.click(reserveButton);
  }

  async openSalesContract() {
    const contractHeading = this.page.getByRole("heading", {
      name: "توقيع عقد البيع",
    });
    await contractHeading.waitFor({ state: "visible", timeout: 30000 });
    await contractHeading.click();
  }

  async approveSalesContract(otp = ["1", "2", "3", "4"]) {
    await this.page.getByRole("button", { name: "اعتماد" }).click();
    const otpInputs = this.page.getByRole("textbox");
    for (let index = 0; index < otp.length; index++) {
      await otpInputs.nth(index).fill(otp[index]);
    }
    await this.page.getByRole("button", { name: "تحقق", exact: true }).click();
    await this.page.getByRole("button", { name: "إغلاق" }).click();
  }

  async validateUnavailableMessage() {
    const unavailableMessageLocator = this.page.locator(
      "//app-offplan-buttons-tpl//span[text()='هذا المشروع غير متاح للحجز حالياً']"
    );
    try {
      await expect(unavailableMessageLocator).toBeVisible({ timeout });
      return true;
    } catch (error) {
      return false;
    }
  }
}