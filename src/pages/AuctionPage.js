const { expect } = require("@playwright/test");

class AuctionPage {
  constructor(page) {
    this.page = page;
  }

  async openUnit(unitName = "شقة A8-A9") {
    const unit = this.page.getByText(unitName);
    await unit.waitFor({ state: "visible", timeout: 30000 });
    await unit.click();
  }

  async joinElectronicAuction() {
    await this.page.getByRole("button", { name: "المشاركة في المزاد" }).click();
    await this.page
      .locator("div")
      .filter({ hasText: /^بطاقة ائتمانالدفع باستخدام مدى، فيزا، ماستركارد$/ })
      .first()
      .click();
    await this.acceptTerms();
    await this.page.getByRole("button", { name: "تأكيد" }).click();
  }


  async joinHybridAuction() {
  await this.page.getByRole('button', { name: 'المشاركة في المزاد' }).click();
  await this.page.getByRole('radio', { name: 'متصل' }).check();
  await this.page.getByRole('button', { name: 'تأكيد' }).click();
  await this.page.locator('app-choose-payment-method').filter({ hasText: 'بطاقة ائتمانالدفع باستخدام مدى، فيزا، ماستركارد' }).locator('#id').check();
  await this.page.getByRole('checkbox', { name: 'أؤكد قراءتي وفهمي وموافقتي على الشروط والأحكام' }).check();
  await this.page.getByRole('button', { name: 'تأكيد' }).click();
  }


  async joinHybridAuction() {
    await this.page
      .getByRole("button", { name: "تسجيل الدخول للمزاد" })
      .click();
    await this.page.getByRole("radio", { name: "متصل" }).check();
    await this.page.getByRole("button", { name: "تأكيد" }).click();
    await this.acceptTerms();
    await this.page.getByRole("button", { name: "ابدأ المزايدة" }).click();
    await this.page.getByRole("button", { name: "تأكيد المزايدة" }).click();
    await this.acceptTerms();
    await this.page.getByRole("button", { name: "تأكيد المزايدة" }).click();
  }

  async acceptTerms() {
    await this.page
      .getByRole("checkbox", {
        name: "أؤكد قراءتي وفهمي وموافقتي على الشروط والأحكام",
      })
      .check();
  }

  async returnToAuction(buttonName) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }


  async validateCongratulationsMessaeg() {
    const congratulationsText = this.page.getByText('تهانينا!', { exact: true });
    await expect(congratulationsText).toBeVisible();
  }


  async expectAuctionPaymentPending() {
  await expect(
    this.page.getByText(/تم دفع رسوم المزاد.*/)
  ).toBeVisible();
}

  // async expectAuctionPaymentPending() {
  //   await expect(
  //     this.page.getByText(
  //       "تم دفع رسوم المزاد فاتورتك مدفوعة. يرجى الانتظار حتى يفتح المزاد",
  //     ),
  //   ).toBeVisible();
  // }

  async waitForWinnerAndOpenContract() {
    await this.page.getByText(/الفائز/).waitFor({
      state: "visible",
      timeout: 240000,
    });
    await this.page.getByText("المتابعة").click();
    const contractHeading = this.page.getByRole("heading", {
      name: "توقيع العقد",
    });
    while (!(await contractHeading.isVisible().catch(() => false))) {
      await this.page.reload();
      await contractHeading.waitFor({ state: "attached", timeout: 30000 });
    }
    await contractHeading.click();
  }

  async approveContract() {
    await this.page.getByRole("button", { name: "اعتماد" }).click();
  }

  async expectAuctionSuccess() {
    await expect(this.page.getByText("نجاح!")).toBeVisible();
    await this.page.getByRole("button", { name: "عرض تفاصيل المزاد" }).click();
    await expect(this.page.getByText("ألف مبروك!")).toBeVisible();
  }
}

module.exports = { AuctionPage };
