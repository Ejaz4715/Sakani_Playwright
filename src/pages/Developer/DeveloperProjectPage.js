const { expect } = require("@playwright/test");
const path = require("path");
const { DeveloperObjects } = require(
  path.join(process.cwd(), "src", "Objects", "Developer", "DeveloperObjects"),
);
const testData = require(
  path.join(process.cwd(), "src", "data", "test-data.json"),
);

class DeveloperProjectPage {
  constructor(page) {
    this.page = page;
    this.defaultTimeout = 60000;
  }

  async waitForVisible(locator) {
    await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
  }

  async clickIfVisible(locator, options = {}) {
    const timeout = options.timeout ?? 5000;
    const isVisible = await locator.isVisible({ timeout }).catch(() => false);
    if (isVisible) {
      await locator.click();
    }
  }

  async gotoAuth(url) {
    await this.page.goto(url);
  }

  async loginDeveloper(nationalId = testData.developerUserId) {
    const usernameInput = this.page.getByRole(
      DeveloperObjects.usernameInput.role,
      { name: DeveloperObjects.usernameInput.name },
    );
    await this.waitForVisible(usernameInput);
    await usernameInput.fill(nationalId);

    const continueButton = this.page.getByRole(
      DeveloperObjects.continueButton.role,
      {
        name: DeveloperObjects.continueButton.name,
        exact: DeveloperObjects.continueButton.exact,
      },
    );
    await this.waitForVisible(continueButton);
    await continueButton.click();

    const nafathModal = this.page.locator("//app-nafath-login-modal");

    await nafathModal
      .waitFor({ state: "visible", timeout: 10000 })
      .catch(() => {});
    await nafathModal
      .waitFor({ state: "hidden", timeout: 15000 })
      .catch(() => {});

    const verificationButton = this.page.getByRole("button", { name: "تحقق" });
    if (
      await verificationButton.isVisible({ timeout: 15000 }).catch(() => false)
    ) {
      await verificationButton.click();
      await this.page.getByRole("spinbutton", { name: "X" }).nth(0).fill("1");
      await this.page.getByRole("spinbutton", { name: "X" }).nth(1).fill("2");
      await this.page.getByRole("spinbutton", { name: "X" }).nth(2).fill("3");
      await this.page.getByRole("spinbutton", { name: "X" }).nth(3).fill("4");
      await this.page.getByRole("button", { name: "تأكيد ومتابعة" }).click();
      await this.page
        .getByRole("button", { name: "انتقل إلى لوحة المعلومات" })
        .click();
    }
    const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
    await this.waitForVisible(profileIcon);
    await this.page.waitForTimeout(3000); // Wait for 3 seconds to ensure the page is fully loaded
    const cancelButton = this.page.getByRole("button", { name: "إلغاء" });
    await this.clickIfVisible(cancelButton.first());
  }

  async switchRoleToDeveloper() {
    const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
    await this.waitForVisible(profileIcon);
    await profileIcon.click();

    const switchRoleButton = this.page.getByRole(
      DeveloperObjects.switchRoleButton.role,
      { name: DeveloperObjects.switchRoleButton.name },
    );
    await this.waitForVisible(switchRoleButton);
    await switchRoleButton.click();

    const developerRole = this.page.getByText(
      DeveloperObjects.developerRoleText,
    );
    await this.waitForVisible(developerRole);
    await developerRole.click();
    await this.page.waitForTimeout(3000); // Wait for 3 seconds to ensure the page is fully loaded
    const cancelButton = this.page.getByRole("button", { name: "إلغاء" });
    await this.clickIfVisible(cancelButton.first());
  }

  async openProjectsPage() {
    // const menuIcon = this.page.locator(DeveloperObjects.menuIcon);
    // await this.waitForVisible(menuIcon);
    // await menuIcon.click();

    const projectsLink = this.page.getByRole(
      DeveloperObjects.projectsLink.role,
      { name: DeveloperObjects.projectsLink.name },
    );
    await this.waitForVisible(projectsLink);
    await projectsLink.click();
  }

  async searchProject(projectName) {
    const projectFilter = this.page
      .locator(DeveloperObjects.projectFilter)
      .first();
    await this.waitForVisible(projectFilter);
    await projectFilter.click();

    const projectNameOption = this.page.getByRole(
      DeveloperObjects.projectNameOption.role,
      { name: DeveloperObjects.projectNameOption.name },
    );
    await this.waitForVisible(projectNameOption);
    await projectNameOption.click();

    const projectSearchInput = this.page
      .locator(DeveloperObjects.projectSearchInput)
      .getByRole("combobox");
    await this.waitForVisible(projectSearchInput);
    await projectSearchInput.click();
    await projectSearchInput.fill(projectName);

    const projectOption = this.page.getByRole("option", { name: projectName });
    await expect(projectOption).toBeVisible({ timeout: this.defaultTimeout });
    await projectOption.click({ force: true });
  }

  async openProjectBySearch(projectName) {
    await this.openProjectsPage();
    await this.searchProject(projectName);

    const searchButton = this.page.getByRole(
      DeveloperObjects.searchButton.role,
      { name: DeveloperObjects.searchButton.name },
    );
    await this.page.waitForTimeout(3000);
    await this.waitForVisible(searchButton);
    await searchButton.click();

    const passwordEyeIcon = this.page.locator(DeveloperObjects.passwordEyeIcon);
    await this.page.waitForTimeout(3000); // Wait for the password eye icon to be visible
    await this.waitForVisible(passwordEyeIcon);
    await passwordEyeIcon.click();
  }

  async openPaymentSchedulesTab() {
    const paymentScheduleTab = this.page
      .getByRole("tab", { name: /جداول الدفع/ })
      .or(this.page.getByText("جداول الدفع", { exact: true }))
      .first();
    await this.waitForVisible(paymentScheduleTab);
    await paymentScheduleTab.click();
  }

  async openSalesContractsTab() {
    const salesContractsTab = this.page.getByRole(
      DeveloperObjects.salesContractsTab.role,
      { name: DeveloperObjects.salesContractsTab.name },
    );
    await this.waitForVisible(salesContractsTab);
    await salesContractsTab.click();
  }

  async viewAndApproveSalesContract() {
    const viewAndApproveButton = this.page.getByRole(
      DeveloperObjects.viewAndApproveButton.role,
      { name: DeveloperObjects.viewAndApproveButton.name },
    );
    await this.waitForVisible(viewAndApproveButton);
    await viewAndApproveButton.click();
  }

  async approveUnitSpecification() {
    const addUnitSpecificationButton = this.page.locator(
      DeveloperObjects.addUnitSpecificationButton,
    );
    await this.waitForVisible(addUnitSpecificationButton);
    await addUnitSpecificationButton.click();
  }

  async fillOtp(code = "1234") {
    const otpInput = this.page.locator(DeveloperObjects.otpInput);
    await this.waitForVisible(otpInput);
    await otpInput.fill(code);
  }

  async verifyOtp() {
    const verifyCodeButton = this.page.getByRole(
      DeveloperObjects.verifyCodeButton.role,
      { name: DeveloperObjects.verifyCodeButton.name },
    );
    await this.waitForVisible(verifyCodeButton);
    await verifyCodeButton.click();
  }

  async openAddAnnexDialog() {
    const addAnnexButton = this.page.getByRole(
      DeveloperObjects.addAnnexButton.role,
      { name: DeveloperObjects.addAnnexButton.name },
    );
    await this.waitForVisible(addAnnexButton);
    await addAnnexButton.click();
  }

  async searchUnitByCode(unitCode) {
    const unitCodeInput = this.page.locator(
      "//app-sapa-input-with-icon[@formcontrolname='unit_code']/descendant::input",
    );
    await this.waitForVisible(unitCodeInput);
    await unitCodeInput.fill(unitCode);

    const searchButton = this.page.getByRole(
      DeveloperObjects.searchButton.role,
      { name: DeveloperObjects.searchButton.name },
    );
    await searchButton.click();
  }

  async selectFirstUnit() {
    const firstUnit = this.page.getByRole("cell").first();
    await this.waitForVisible(firstUnit);
    await firstUnit.click();
  }

  async openSelectedUnitsAnnexDialog() {
    const addAnnexButton = this.page.getByRole(
      DeveloperObjects.addAnnexToSelectedUnitsButton.role,
      { name: DeveloperObjects.addAnnexToSelectedUnitsButton.name },
    );
    await this.waitForVisible(addAnnexButton);
    await addAnnexButton.click();
  }

  async uploadAnnexFile(filePath) {
    const fileInput = this.page.locator("//input[@type='file']");
    await fileInput.setInputFiles(filePath);
    const attachmentText = this.page.getByText("الملف المرفق", { exact: true });
    await attachmentText.waitFor({ state: "visible" });
  }

  async uploadAnnex() {
    const uploadButton = this.page.getByRole(
      DeveloperObjects.uploadButton.role,
      { name: DeveloperObjects.uploadButton.name },
    );
    await this.waitForVisible(uploadButton);

    await uploadButton.click();
  }

  async approveAnnex() {
    const approveButton = this.page.getByRole(
      DeveloperObjects.approveButton.role,
      { name: DeveloperObjects.approveButton.name },
    );
    await this.waitForVisible(approveButton);
    await approveButton.click();
  }

  async expectAnnexSuccess() {
    const successMessage = this.page.getByText(
      DeveloperObjects.annexSuccessMessage,
    );
    await this.waitForVisible(successMessage);
  }

  async verifyApprovalSuccessMessage() {
    const successMessage = this.page.getByText(
      DeveloperObjects.approvalSuccessMessage,
      { exact: false },
    );
    await this.waitForVisible(successMessage);

    const modal = this.page.locator(DeveloperObjects.approvalModal);
    await expect(modal).toContainText(DeveloperObjects.approvalSuccessMessage);
  }

  async addPaymentSchedule({
    type,
    scheduleName,
    completionPercentageOneValue,
    percentageOneValue,
    completionPercentageTwoValue,
    percentageTwoValue,
  }) {
    const addScheduleButton = this.page
      .getByRole("button", { name: /إضافة جدول جديد/ })
      .or(this.page.getByText("إضافة جدول جديد", { exact: true }))
      .first();
    await this.waitForVisible(addScheduleButton);
    await addScheduleButton.click();

    const scheduleType =
      type === "cash"
        ? this.page.getByText(DeveloperObjects.cashOption)
        : this.page.getByText(DeveloperObjects.lendingOption);
    await this.waitForVisible(scheduleType);
    await scheduleType.click();

    const scheduleNameInput = this.page.getByRole(
      DeveloperObjects.scheduleNameInput.role,
      { name: DeveloperObjects.scheduleNameInput.name },
    );
    await this.waitForVisible(scheduleNameInput);
    await scheduleNameInput.fill(scheduleName);

    const completionPercentageZero = this.page
      .locator(DeveloperObjects.completionPercentageZero)
      .getByRole("textbox", { name: "مثال: 15٪" });
    await this.waitForVisible(completionPercentageZero);
    await completionPercentageZero.fill("50");

    const percentageZero = this.page
      .locator(DeveloperObjects.percentageZero)
      .getByRole("textbox", { name: "مثال: 15٪" });
    await this.waitForVisible(percentageZero);
    await percentageZero.fill("50");

    const completionPercentageOne = this.page
      .locator(DeveloperObjects.completionPercentageOne)
      .getByRole("textbox", { name: "مثال: 15٪" });
    await this.waitForVisible(completionPercentageOne);
    await completionPercentageOne.fill(completionPercentageOneValue);

    const percentageOne = this.page
      .locator(DeveloperObjects.percentageOne)
      .getByRole("textbox", { name: "مثال: 15٪" });
    await this.waitForVisible(percentageOne);
    await percentageOne.fill(percentageOneValue);

    const normalConfirmButton = this.page.getByRole(
      DeveloperObjects.confirmButton.role,
      { name: DeveloperObjects.confirmButton.name },
    );
    await this.waitForVisible(normalConfirmButton);
    await normalConfirmButton.click({ force: true });

    const popupConfirmButton = this.page.locator(
      DeveloperObjects.confirmButtonPopup,
    );
    await this.waitForVisible(popupConfirmButton);
    await popupConfirmButton.click({ force: true });

    const updateButton = this.page.getByRole(
      DeveloperObjects.updateButton.role,
      { name: /تحديث/ },
    );
    await this.waitForVisible(updateButton);
  }

  async confirmBooking(unitCode) {
    await this.page.locator("a").filter({ hasText: "إدارة الحجوزات" }).click();
    await this.page.getByRole("link", { name: "الحجوزات الفردية" }).click();
    const searchInput = this.page.getByRole("textbox", {
      name: "ابحث برمز الوحدة أو رقم الهوية",
    });
    await this.waitForVisible(searchInput);
    await searchInput.fill(unitCode);
    await this.page.getByText("إظهار التفاصيل").click();
    await this.page.getByRole("tab", { name: "حجوزات" }).click();
    await this.page
      .getByRole("button", { name: "تأكيد الحجز" })
      .first()
      .click();
    await this.page.getByRole("button", { name: "تأكيد الحجز" }).last().click();
    await this.page.getByRole("button", { name: "نعم" }).click();
    await this.page.getByText("تهانينا!").click();
  }
}

module.exports = { DeveloperProjectPage };
