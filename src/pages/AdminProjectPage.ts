import { AdminObjects } from "@objects/AdminProjectsObjects";
import { expect, Page } from "@playwright/test";

export class AdminProjectPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async login(url: string, username: string, password: string, otp = "1234") {
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

  async clickProjectsLink() {
    await this.page.getByRole("link", { name: "المشاريع" }).click();
  }

  async clickAddNewProjectButton() {
    await this.page.getByRole("button", { name: "إضافة مشروع جديد" }).click();
  }

  async fillProjectName(projectName: string) {
    await this.page
      .locator(AdminObjects.projectNameField.container)
      .filter({ hasText: AdminObjects.projectNameField.label })
      .getByPlaceholder(AdminObjects.projectNameField.placeholder)
      .fill(projectName);
  }

  async selectProjectType(projectType: string) {
    const projectTypeDropdown = this.page.locator(AdminObjects.projectTypeDropdown);
    const projectTypeOption = this.page.locator(await AdminObjects.projectTypeOption(projectType));
    for (let attempt = 0; attempt < 5; attempt++) {
      await projectTypeDropdown.click();
      if (await projectTypeOption.isVisible().catch(() => false)) {
        break;
      }
      await this.page.waitForTimeout(2000);
    }
    await expect(projectTypeOption).toBeVisible({ timeout: 30000 });
    await projectTypeOption.click();
  }

  async selectRegion(region: string) {
    await this.page.locator(AdminObjects.regionDropdown).click();
    const regionOption = await AdminObjects.regionOption(region);
    await this.page.waitForTimeout(2000);
    await this.page.locator(regionOption).click();
  }

  async selectCity(city: string) {
    await this.page.locator(AdminObjects.cityDropdown).click();
    const cityOption = await AdminObjects.cityOption(city);
    await this.page.locator(cityOption).click();
  }

  async selectDeveloperName(developerName: string) {
    await this.page.locator(AdminObjects.developerInput).fill(developerName);
    const developerOption = await AdminObjects.developerOption(developerName);
    await this.page.locator(developerOption).click();
  }

  async toggleBookableOn() {
    await this.page
      .getByRole(AdminObjects.bookableSwitch.role, {
        name: AdminObjects.bookableSwitch.name,
      })
      .click();
  }

  async selectProjectStatus(status: string) {
    await this.page.locator(AdminObjects.statusDropdown).click();
    const projectStatusOption = await AdminObjects.projectStatusOption(status);
    await this.page.locator(projectStatusOption).click();
  }

  async fillWafiLicenseExpiryDate(date: string) {
    await this.page
      .getByRole(AdminObjects.wafiExpiryDate.role, {
        name: AdminObjects.wafiExpiryDate.name,
      })
      .fill(date);
  }

  async selectSubsidyType(option: string) {
    await this.page.locator(AdminObjects.subsidyTypeDropdown).click();
    const subsidyTypeOption = await AdminObjects.subsidyTypeOption(option);
    await this.page.locator(subsidyTypeOption).click();
  }

  async fillMaxSubsidyAmount(amount: string) {
    await this.page.locator(AdminObjects.maxSubsidyAmountField).fill(amount);
  }

  async fillProjectAgreementDate(date: string) {
    await this.page
      .getByRole(AdminObjects.projectAgreementDate.role, {
        name: AdminObjects.projectAgreementDate.name,
      })
      .fill(date);
  }

  async fillProjectLicenseNumber(licenseNumber: string) {
    await this.page
      .getByRole(AdminObjects.projectLicenseNumber.role, {
        name: AdminObjects.projectLicenseNumber.name,
      })
      .fill(licenseNumber);
  }

  async fillProjectLicenseDate(date: string) {
    await this.page
      .getByRole(AdminObjects.projectLicenseDate.role, {
        name: AdminObjects.projectLicenseDate.name,
      })
      .fill(date);
  }

  async fillEscrowAccountName(accountName: string) {
    await this.page
      .getByRole(AdminObjects.escrowAccountName.role, {
        name: AdminObjects.escrowAccountName.name,
      })
      .fill(accountName);
  }

  async fillEscrowAccountNumber(accountNumber: string) {
    await this.page
      .getByRole(AdminObjects.escrowAccountNumber.role, {
        name: AdminObjects.escrowAccountNumber.name,
      })
      .fill(accountNumber);
  }

  async selectBank(bankName: string) {
    await this.page.locator(AdminObjects.bankDropdown).first().click();
    const bankOption = await AdminObjects.bankOption(bankName);
    await this.page.locator(bankOption).click();
  }

  async fillDeductionPercentage(percentage: string) {
    await this.page.locator(AdminObjects.deductionPercentageField).fill(percentage);
  }

  async fillDeedIssueCityArabic(city: string) {
    await this.page
      .getByRole(AdminObjects.deedIssueCityArabic.role, {
        name: AdminObjects.deedIssueCityArabic.name,
      })
      .fill(city);
  }

  async fillDeedIssueCityEnglish(city: string) {
    await this.page
      .getByRole(AdminObjects.deedIssueCityEnglish.role, {
        name: AdminObjects.deedIssueCityEnglish.name,
      })
      .fill(city);
  }

  async fillDeedDate(date: string) {
    await this.page
      .getByRole(AdminObjects.deedDate.role, {
        name: AdminObjects.deedDate.name,
      })
      .fill(date);
  }

  async clickSaveButton() {
    await this.page
      .getByRole(AdminObjects.saveButton.role, {
        name: AdminObjects.saveButton.name,
      })
      .click();
  }

  async validateToastMessage() {
    await expect(
      this.page.locator(AdminObjects.saveSuccessToast).getByText(AdminObjects.saveSuccessMessage.text),
      "Project saved message is not displayed",
    ).toBeVisible({ timeout: 120000 });
  }

  async linkProjectToAzm() {
    await this.page.waitForTimeout(3000);
    const azmToggle = this.page.locator(AdminObjects.azmToggle);
    if ((await azmToggle.getAttribute("aria-checked")) === "false") {
      await azmToggle.click();
      await this.page.waitForTimeout(5000);
    }
    await expect(azmToggle).toHaveAttribute("aria-checked", "true");
  }

  async expectFinancingEntitiesVisible() {
    await expect(this.page.getByText(AdminObjects.financingEntitiesHeading.text)).toBeVisible({ timeout: 30000 });
  }

  async clickFinancingEntities() {
    await this.page.getByText(AdminObjects.financingEntitiesHeading.text).click();
  }

  async expectSelectAllRowsVisible() {
    await expect(
      this.page.getByRole(AdminObjects.selectAllRowsCheckbox.role, {
        name: AdminObjects.selectAllRowsCheckbox.name,
      }),
    ).toBeVisible({ timeout: 30000 });
  }

  async clickSelectAllRows() {
    await this.page
      .getByRole(AdminObjects.selectAllRowsCheckbox.role, {
        name: AdminObjects.selectAllRowsCheckbox.name,
      })
      .click();
  }

  async clickUnitsTab() {
    await this.page
      .getByRole(AdminObjects.unitsTab.role, {
        name: AdminObjects.unitsTab.name,
        exact: AdminObjects.unitsTab.exact,
      })
      .click();
  }

  async expectImportNewUnitButtonVisible() {
    await expect(
      this.page.getByRole(AdminObjects.importNewUnitButton.role, {
        name: AdminObjects.importNewUnitButton.name,
      }),
    ).toBeVisible({ timeout: 30000 });
  }

  async clickImportNewUnitButton() {
    await this.page
      .getByRole(AdminObjects.importNewUnitButton.role, {
        name: AdminObjects.importNewUnitButton.name,
      })
      .click();
  }

  async expectResidentialUnitTypeVisible() {
    await expect(
      this.page.getByRole(AdminObjects.residentialUnitType.role, {
        name: AdminObjects.residentialUnitType.name,
      }),
    ).toBeVisible({ timeout: 30000 });
  }

  async openResidentialUnitTypeDropdown() {
    await this.page
      .getByRole(AdminObjects.residentialUnitType.role, {
        name: AdminObjects.residentialUnitType.name,
      })
      .click();
  }

  async selectApartmentUnitType() {
    await this.page
      .getByRole(AdminObjects.apartmentOption.role, {
        name: AdminObjects.apartmentOption.name,
      })
      .click();
  }

  async uploadUnitsFile(filePath: string) {
    const fileInput = this.page.locator(AdminObjects.unitsFileInput);
    await fileInput.setInputFiles(filePath);
  }

  async clickImportSaveButton() {
    await this.page
      .getByRole(AdminObjects.importSaveButton.role, {
        name: AdminObjects.importSaveButton.name,
      })
      .click();
  }

  async expectUnitImportInProgress() {
    await expect(
      this.page.getByText(AdminObjects.importInProgressMessage.text, {
        exact: AdminObjects.importInProgressMessage.exact,
      }),
    ).toBeVisible({ timeout: 120000 });
  }

  async waitForUnitImportCompletion() {
    await this.page.waitForTimeout(7000);
    let completed = false;
    while (!completed) {
      await this.page.reload();
      completed = await this.page
        .getByText(AdminObjects.importCompleteMessage.text, {
          exact: AdminObjects.importCompleteMessage.exact,
        })
        .isVisible()
        .catch(() => false);
      if (!completed) {
        await this.page.waitForTimeout(3000);
      }
    }
  }

  async clickApproveButton() {
    await this.page
      .getByRole(AdminObjects.approveButton.role, {
        name: AdminObjects.approveButton.name,
      })
      .click();
  }

  async clickConfirmButton() {
    await this.page
      .getByRole(AdminObjects.confirmButton.role, {
        name: AdminObjects.confirmButton.name,
      })
      .click();
  }

  async waitForImportConfirmation() {
    await this.page.waitForTimeout(3000);
  }

  async clickBackButton() {
    await this.page
      .getByRole(AdminObjects.backButton.role, {
        name: AdminObjects.backButton.name,
      })
      .click();
  }

  async clickProjectMediaTab() {
    await this.page.locator(AdminObjects.visualContentTab.selector).filter({ hasText: AdminObjects.visualContentTab.text }).first().click();
  }

  async uploadBannerImage(filePath: string) {
    const bannerImageInput = this.page.locator(AdminObjects.bannerImageInput);
    await bannerImageInput.setInputFiles(filePath);
  }

  async uploadMasterPlanImage(filePath: string) {
    const masterPlanImageInput = this.page.locator(AdminObjects.masterPlanImageInput);
    await masterPlanImageInput.setInputFiles(filePath);
  }

  async uploadAerialImage(filePath: string) {
    const aerialImageInput = this.page.locator(AdminObjects.aerialImageInput);
    await aerialImageInput.setInputFiles(filePath);
  }

  async clickUploadButton() {
    await this.page.locator(AdminObjects.uploadButton).click();
    await this.page.waitForTimeout(2000);
  }

  async selectDisplayMethod(option: string) {
    await this.page.locator(AdminObjects.displayMethodDropdown.selector).filter({ hasText: AdminObjects.displayMethodDropdown.text }).first().click();
    const displayMethodOption = await AdminObjects.displayMethodOption(option);
    await this.page.locator(displayMethodOption).click();
  }

  async fillDetailsTitleArabic(value: string) {
    await this.page
      .getByRole(AdminObjects.detailsTitleArabic.role, {
        name: AdminObjects.detailsTitleArabic.name,
      })
      .fill(value);
  }

  async fillDetailsTitleEnglish(value: string) {
    await this.page
      .getByRole(AdminObjects.detailsTitleEnglish.role, {
        name: AdminObjects.detailsTitleEnglish.name,
      })
      .fill(value);
  }

  async fillFirstUnitReadyDate(value: string) {
    await this.page
      .getByRole(AdminObjects.firstUnitReadyDate.role, {
        name: AdminObjects.firstUnitReadyDate.name,
      })
      .fill(value);
  }

  async fillNameArabic(value: string) {
    await this.page
      .getByRole(AdminObjects.nameArabic.role, {
        name: AdminObjects.nameArabic.name,
      })
      .fill(value);
  }

  async fillNameEnglish(value: string) {
    await this.page
      .getByRole(AdminObjects.nameEnglish.role, {
        name: AdminObjects.nameEnglish.name,
      })
      .fill(value);
  }

  async fillSummaryArabic(value: string) {
    await this.page
      .getByRole(AdminObjects.summaryArabic.role, {
        name: AdminObjects.summaryArabic.name,
      })
      .fill(value);
  }

  async fillSummaryEnglish(value: string) {
    await this.page
      .getByRole(AdminObjects.summaryEnglish.role, {
        name: AdminObjects.summaryEnglish.name,
      })
      .fill(value);
  }

  async fillDescriptionArabic(value: string) {
    await this.page
      .getByRole(AdminObjects.descriptionArabic.role, {
        name: AdminObjects.descriptionArabic.name,
      })
      .fill(value);
  }

  async fillDescriptionEnglish(value: string) {
    await this.page
      .getByRole(AdminObjects.descriptionEnglish.role, {
        name: AdminObjects.descriptionEnglish.name,
      })
      .fill(value);
  }

  async fillStartingPrice(value: string) {
    await this.page
      .getByRole(AdminObjects.startingPrice.role, {
        name: AdminObjects.startingPrice.name,
      })
      .fill(value);
  }

  async fillLatitude(value: string) {
    await this.page
      .getByRole(AdminObjects.latitude.role, {
        name: AdminObjects.latitude.name,
      })
      .fill(value);
  }

  async fillLongitude(value: string) {
    await this.page
      .getByRole(AdminObjects.longitude.role, {
        name: AdminObjects.longitude.name,
      })
      .fill(value);
  }
  async expectMediaUploadComplete(index: number) {
    await expect(this.page.locator(AdminObjects.uploadStatus).nth(index)).toBeVisible({
      timeout: 120000,
    });
    await this.page.waitForTimeout(1500);
  }

  async fillGuarenteeAfterServices(value: string) {
    await this.page.locator(AdminObjects.guarenteeAfterServices).fill(value);
  }

  async clickMediaSaveButton() {
    await this.page.locator(AdminObjects.mediaSaveButton).click();
  }

  async clickProjectDetailsTab() {
    await this.page
      .getByRole(AdminObjects.projectDetailsTab.role, {
        name: AdminObjects.projectDetailsTab.name,
      })
      .click();
  }

  async clickProjectDetailsText() {
    await this.page.getByText(AdminObjects.projectDetailsText.text).click();
  }

  async clickRequestMediaApprovalButton() {
    await this.page
      .getByRole(AdminObjects.requestMediaApprovalButton.role, {
        name: AdminObjects.requestMediaApprovalButton.name,
      })
      .click();
  }

  async clickAcceptUploadedMediaButton() {
    await this.page
      .getByRole(AdminObjects.acceptUploadedMediaButton.role, {
        name: AdminObjects.acceptUploadedMediaButton.name,
      })
      .click();
  }

  async clickKeepProjectUnpublishedButton() {
    await this.page
      .getByRole(AdminObjects.keepProjectUnpublishedButton.role, {
        name: AdminObjects.keepProjectUnpublishedButton.name,
      })
      .click();
  }

  async clickUnitModelsSection() {
    await this.page.getByText(AdminObjects.unitModelsSection.text).click();
  }

  async clickUnitModelCell() {
    await this.page
      .getByRole(AdminObjects.unitModelCell.role, {
        name: AdminObjects.unitModelCell.name,
      })
      .click();
  }

  async clickMediaDraftSection() {
    await this.page.getByText(AdminObjects.mediaDraftSection.text).click();
  }

  async clickPublishUnitButton() {
    const publishButton = this.page.getByRole(
      AdminObjects.publishUnitButton.role, {
      name: AdminObjects.publishUnitButton.name,
    });
    await publishButton.click();
    while (true) {
      await this.page.waitForTimeout(3000);
      if (!await publishButton.isVisible().catch(() => false)) break;
      await this.page.reload();
    }
  }

  async clickUnitModelLink() {
    await this.page.locator(AdminObjects.unitModelLink.selector).filter({ hasText: AdminObjects.unitModelLink.text }).click();
    await this.page.waitForTimeout(3000);
    const chevronElement = this.page.locator(AdminObjects.rightTabArrow);
    if (await chevronElement.isVisible().catch(() => false)) await chevronElement.click();
  }

  async waitForMediaApproval() {
    const visualContentTab = this.page.getByRole(AdminObjects.mediaApprovalText.role, {
      name: AdminObjects.mediaApprovalText.name,
    });
    while (!await visualContentTab.isVisible().catch(() => false)) {
      await this.page.reload();
      await this.page.waitForTimeout(2000);
    }
    await expect(visualContentTab).toBeVisible();
  }

  async selectAvailableProjectStatus() {
    await this.page.locator(AdminObjects.statusDropdown).click();
    await this.page
      .getByRole(AdminObjects.projectStatusAvailableOption.role, {
        name: AdminObjects.projectStatusAvailableOption.name,
      })
      .click();
  }

  async enableAvailableForBookingToggle() {
    const bookingToggle = this.page.locator(AdminObjects.bookingAvailableToggle);
    await expect(bookingToggle).toBeVisible({ timeout: 30000 });
    if ((await bookingToggle.getAttribute("aria-checked")) === "false") {
      await bookingToggle.click();
    }
    await expect(bookingToggle).toHaveAttribute("aria-checked", "true");
  }

  async publishProject() {
    await this.waitForMediaApproval();
    const publishedToggle = this.page.locator(AdminObjects.projectPublishedToggle);
    await expect(publishedToggle).toBeVisible({ timeout: 30000 });
    if ((await publishedToggle.getAttribute("aria-checked")) === "false") {
      await publishedToggle.click();
    }
    await expect(publishedToggle).toHaveAttribute("aria-checked", "true");
  }

  async openProjects() {
    await this.page.locator("a").filter({ hasText: "المخزون الداخلي" }).click();
    await this.page.getByRole("link", { name: "المشاريع" }).click();
  }

  async openResaleRequests() {
    await this.page.locator("a").filter({ hasText: "المخزون الداخلي" }).click();
    await this.page.getByRole("link", { name: " طلب إعادة البيع " }).click();
  }

  async clickInternalInventory() {
    await this.page.locator("a").filter({ hasText: "المخزون الداخلي" }).click();
  }

  async openAuctionCreation() {
    await this.page.locator("a").filter({ hasText: "المزادات" }).click();
    await this.page.getByRole("link", { name: "مشاريع المزاد" }).click();
    await this.page.getByRole("button", { name: "مشروع مزاد جديد" }).click();
  }

  async selectRegionAndCity(region = "الرياض") {
    await this.page.locator("//ng-select[@formcontrolname='region_id']").getByRole("combobox").click();
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
