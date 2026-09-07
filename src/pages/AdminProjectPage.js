const { expect } = require("@playwright/test");

class AdminProjectPage {
  constructor(page) {
    this.page = page;
  }

  async login(url, username, password, otp = "1234") {
    await this.page.goto(url);
    await this.page.locator('input[type="text"]').fill(username);
    await this.page.locator('input[type="password"]').fill(password);
    await this.page.getByRole("button", { name: "تسجيل الدخول" }).click();
    const otpInput = this.page.locator("//app-sakani-otp//input[@type='text']");
    await expect(otpInput).toBeVisible({ timeout: 30000 });
    await otpInput.fill(otp);
    await this.page.getByRole("button", { name: "تأكيد" }).click();
  }

  async openProjectCreation() {
    await this.page.locator("a").filter({ hasText: "المخزون الداخلي" }).click();
    await this.page.getByRole("link", { name: "المشاريع" }).click();
    await this.page.getByRole("button", { name: "إضافة مشروع جديد" }).click();
  }


    async openProjects() {
    await this.page.locator("a").filter({ hasText: "المخزون الداخلي" }).click();
    await this.page.getByRole("link", { name: "المشاريع" }).click();
  }



  async openAuctionCreation() {
    await this.page.locator("a").filter({ hasText: "المزادات" }).click();
    await this.page.getByRole("link", { name: "مشاريع المزاد" }).click();
    await this.page.getByRole("button", { name: "مشروع مزاد جديد" }).click();
  }

  async selectRegionAndCity(region = "الرياض") {
    await this.page
      .locator("//ng-select[@formcontrolname='region_id']")
      .getByRole("combobox")
      .click();
    await this.page.getByText(region).click();
    await this.page.locator("//input[@id='inputCity']").click();
    await this.page.getByRole("option", { name: region, exact: true }).click();
  }

  async saveAndExpectSuccess() {
    await this.page.getByRole("button", { name: "حفظ" }).click();
    await expect(this.page.getByText("تم الحفظ بنجاح!")).toBeVisible({
      timeout: 120000,
    });
  }
}

module.exports = { AdminProjectPage };
