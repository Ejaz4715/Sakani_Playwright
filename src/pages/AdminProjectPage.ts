import { AdminProjectObjects } from '@objects/AdminProjectsObjects';
import { expect, Page } from '@playwright/test';

export class AdminProjectPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async login(url: string, username: string, password: string, otp = '1234') {
    await this.page.goto(url);
    await this.page.locator(AdminProjectObjects.loginUsernameInput).fill(username);
    await this.page.locator(AdminProjectObjects.loginPasswordInput).fill(password);
    await this.page
      .getByRole(AdminProjectObjects.loginButton.role, {
        name: AdminProjectObjects.loginButton.name,
      })
      .click();
    const otpInput = this.page.locator(AdminProjectObjects.otpInput);
    await expect(otpInput).toBeVisible({ timeout: 30000 });
    await otpInput.fill(otp);
    await this.page
      .getByRole(AdminProjectObjects.otpConfirmButton.role, {
        name: AdminProjectObjects.otpConfirmButton.name,
      })
      .click();
  }

  async openProjectCreation() {
    await this.clickInternalInventory();
    await this.clickProjectsLink();
    await this.clickAddNewProjectButton();
  }

  async clickProjectsLink() {
    await this.page
      .getByRole(AdminProjectObjects.projectsLink.role, {
        name: AdminProjectObjects.projectsLink.name,
      })
      .click();
  }

  async clickAddNewProjectButton() {
    await this.page
      .getByRole(AdminProjectObjects.addNewProjectButton.role, {
        name: AdminProjectObjects.addNewProjectButton.name,
      })
      .click();
  }

  async fillProjectName(projectName: string) {
    await this.page
      .locator(AdminProjectObjects.projectNameField.container)
      .filter({ hasText: AdminProjectObjects.projectNameField.label })
      .getByPlaceholder(AdminProjectObjects.projectNameField.placeholder)
      .fill(projectName);
  }

  async selectProjectType(projectType: string) {
    const projectTypeDropdown = this.page.locator(AdminProjectObjects.projectTypeDropdown);
    const projectTypeOption = this.page.locator(await AdminProjectObjects.projectTypeOption(projectType));
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
    await this.page.locator(AdminProjectObjects.regionDropdown).click();
    const regionOption = await AdminProjectObjects.regionOption(region);
    await this.page.waitForTimeout(2000);
    await this.page.locator(regionOption).click();
  }

  async selectCity(city: string) {
    await this.page.locator(AdminProjectObjects.cityDropdown).click();
    const cityOption = await AdminProjectObjects.cityOption(city);
    await this.page.locator(cityOption).click();
  }

  async selectDeveloperName(developerName: string) {
    await this.page.locator(AdminProjectObjects.developerInput).fill(developerName);
    const developerOption = await AdminProjectObjects.developerOption(developerName);
    await this.page.locator(developerOption).click();
  }

  async toggleBookableOn() {
    await this.page
      .getByRole(AdminProjectObjects.bookableSwitch.role, {
        name: AdminProjectObjects.bookableSwitch.name,
      })
      .click();
  }

  async selectProjectStatus(status: string) {
    await this.page.locator(AdminProjectObjects.statusDropdown).click();
    const projectStatusOption = await AdminProjectObjects.projectStatusOption(status);
    await this.page.locator(projectStatusOption).click();
  }

  async fillWafiLicenseExpiryDate(date: string) {
    await this.page
      .getByRole(AdminProjectObjects.wafiExpiryDate.role, {
        name: AdminProjectObjects.wafiExpiryDate.name,
      })
      .fill(date);
  }

  async selectSubsidyType(option: string) {
    await this.page.locator(AdminProjectObjects.subsidyTypeDropdown).click();
    const subsidyTypeOption = await AdminProjectObjects.subsidyTypeOption(option);
    await this.page.locator(subsidyTypeOption).click();
  }

  async fillMaxSubsidyAmount(amount: string) {
    await this.page.locator(AdminProjectObjects.maxSubsidyAmountField).fill(amount);
  }

  async fillProjectAgreementDate(date: string) {
    await this.page
      .getByRole(AdminProjectObjects.projectAgreementDate.role, {
        name: AdminProjectObjects.projectAgreementDate.name,
      })
      .fill(date);
  }

  async fillProjectLicenseNumber(licenseNumber: string) {
    await this.page
      .getByRole(AdminProjectObjects.projectLicenseNumber.role, {
        name: AdminProjectObjects.projectLicenseNumber.name,
      })
      .fill(licenseNumber);
  }

  async fillProjectLicenseDate(date: string) {
    await this.page
      .getByRole(AdminProjectObjects.projectLicenseDate.role, {
        name: AdminProjectObjects.projectLicenseDate.name,
      })
      .fill(date);
  }

  async fillEscrowAccountName(accountName: string) {
    await this.page
      .getByRole(AdminProjectObjects.escrowAccountName.role, {
        name: AdminProjectObjects.escrowAccountName.name,
      })
      .fill(accountName);
  }

  async fillEscrowAccountNumber(accountNumber: string) {
    await this.page
      .getByRole(AdminProjectObjects.escrowAccountNumber.role, {
        name: AdminProjectObjects.escrowAccountNumber.name,
      })
      .fill(accountNumber);
  }

  async selectBank(bankName: string) {
    await this.page.locator(AdminProjectObjects.bankDropdown).first().click();
    const bankOption = await AdminProjectObjects.bankOption(bankName);
    await this.page.locator(bankOption).click();
  }

  async fillDeductionPercentage(percentage: string) {
    await this.page.locator(AdminProjectObjects.deductionPercentageField).fill(percentage);
  }

  async fillDeedIssueCityArabic(city: string) {
    await this.page
      .getByRole(AdminProjectObjects.deedIssueCityArabic.role, {
        name: AdminProjectObjects.deedIssueCityArabic.name,
      })
      .fill(city);
  }

  async fillDeedIssueCityEnglish(city: string) {
    await this.page
      .getByRole(AdminProjectObjects.deedIssueCityEnglish.role, {
        name: AdminProjectObjects.deedIssueCityEnglish.name,
      })
      .fill(city);
  }

  async fillDeedDate(date: string) {
    await this.page
      .getByRole(AdminProjectObjects.deedDate.role, {
        name: AdminProjectObjects.deedDate.name,
      })
      .fill(date);
  }

  async clickSaveButton() {
    await this.page
      .getByRole(AdminProjectObjects.saveButton.role, {
        name: AdminProjectObjects.saveButton.name,
      })
      .click();
  }

  async validateProjectSavedToastMessage() {
    await expect(this.page.locator(AdminProjectObjects.successToast).getByText(AdminProjectObjects.saveSuccessMessage.text), 'Project saved message is not displayed').toBeVisible({ timeout: 120000 });
  }

  async linkProjectToAzm() {
    await this.page.waitForTimeout(3000);
    const azmToggle = this.page.locator(AdminProjectObjects.azmToggle);
    if ((await azmToggle.getAttribute('aria-checked')) === 'false') {
      await azmToggle.click();
      await this.page.waitForTimeout(5000);
    }
    await expect(azmToggle).toHaveAttribute('aria-checked', 'true');
  }

  async expectFinancingEntitiesVisible() {
    await expect(this.page.getByText(AdminProjectObjects.financingEntitiesHeading.text)).toBeVisible({ timeout: 30000 });
  }

  async clickFinancingEntities() {
    await this.page.getByText(AdminProjectObjects.financingEntitiesHeading.text).click();
  }

  async expectBankNameVisibility(targetName: string) {
    const targetCell = this.page.locator(AdminProjectObjects.financialEntitiesBankNameCell(targetName));
    await expect(targetCell, 'The updated bank name is not present').toBeVisible({ timeout: 30000 });
  }

  async expectSelectAllRowsVisible() {
    await expect(
      this.page.getByRole(AdminProjectObjects.selectAllRowsCheckbox.role, {
        name: AdminProjectObjects.selectAllRowsCheckbox.name,
      })
    ).toBeVisible({ timeout: 30000 });
  }

  async clickSelectAllRows() {
    await this.page
      .getByRole(AdminProjectObjects.selectAllRowsCheckbox.role, {
        name: AdminProjectObjects.selectAllRowsCheckbox.name,
      })
      .click();
  }

  async clickUnitsTab() {
    await this.page
      .getByRole(AdminProjectObjects.unitsTab.role, {
        name: AdminProjectObjects.unitsTab.name,
        exact: AdminProjectObjects.unitsTab.exact,
      })
      .click();
  }

  async expectImportNewUnitButtonVisible() {
    await expect(
      this.page.getByRole(AdminProjectObjects.importNewUnitButton.role, {
        name: AdminProjectObjects.importNewUnitButton.name,
      })
    ).toBeVisible({ timeout: 30000 });
  }

  async clickImportNewUnitButton() {
    await this.page
      .getByRole(AdminProjectObjects.importNewUnitButton.role, {
        name: AdminProjectObjects.importNewUnitButton.name,
      })
      .click();
  }

  async expectResidentialUnitTypeVisible() {
    this.page.waitForTimeout(3000);
    await expect(
      this.page.getByRole(AdminProjectObjects.residentialUnitType.role, {
        name: AdminProjectObjects.residentialUnitType.name,
      })
    ).toBeVisible({ timeout: 30000 });
  }

  async openResidentialUnitTypeDropdown() {
    this.page.waitForTimeout(7000);
    await this.page
      .getByRole(AdminProjectObjects.residentialUnitType.role, {
        name: AdminProjectObjects.residentialUnitType.name,
      })
      .click();
  }

  async selectApartmentUnitType() {
    this.page.waitForTimeout(1000);
    await this.page
      .getByRole(AdminProjectObjects.apartmentOption.role, {
        name: AdminProjectObjects.apartmentOption.name,
      })
      .click();
  }

  async uploadUnitsFile(filePath: string) {
    const fileInput = this.page.locator(AdminProjectObjects.unitsFileInput);
    await fileInput.setInputFiles(filePath);
  }

  async clickImportSaveButton() {
    await this.page
      .getByRole(AdminProjectObjects.importSaveButton.role, {
        name: AdminProjectObjects.importSaveButton.name,
      })
      .click();
  }

  async waitForUnitImportCompletion() {
    await this.page.waitForTimeout(12000);
    let completed = false;
    while (!completed) {
      await this.page.reload();
      await this.page.waitForTimeout(3000);
      completed = await this.page
        .getByText(AdminProjectObjects.importCompleteMessage.text)
        .isVisible()
        .catch(() => false);
      if (!completed) {
        await this.page.waitForTimeout(3000);
      }
    }
  }

  async clickApproveButton() {
    await this.page
      .getByRole(AdminProjectObjects.approveButton.role, {
        name: AdminProjectObjects.approveButton.name,
      })
      .click();
  }

  async clickConfirmButton() {
    await this.page
      .getByRole(AdminProjectObjects.confirmButton.role, {
        name: AdminProjectObjects.confirmButton.name,
      })
      .click();
  }

  async waitForImportConfirmation() {
    await this.page.waitForTimeout(3000);
  }

  async clickBackButton() {
    await this.page
      .getByRole(AdminProjectObjects.backButton.role, {
        name: AdminProjectObjects.backButton.name,
      })
      .click();
  }

  async clickProjectMediaTab() {
    await this.page.locator(AdminProjectObjects.visualContentTab.selector).filter({ hasText: AdminProjectObjects.visualContentTab.text }).first().click();
  }

  async uploadBannerImage(filePath: string) {
    const bannerImageInput = this.page.locator(AdminProjectObjects.bannerImageInput);
    await bannerImageInput.setInputFiles(filePath);
  }

  async uploadMasterPlanImage(filePath: string) {
    const masterPlanImageInput = this.page.locator(AdminProjectObjects.masterPlanImageInput);
    await masterPlanImageInput.setInputFiles(filePath);
  }

  async uploadAerialImage(filePath: string) {
    const aerialImageInput = this.page.locator(AdminProjectObjects.aerialImageInput);
    await aerialImageInput.setInputFiles(filePath);
  }

  async clickUploadButton() {
    await this.page.locator(AdminProjectObjects.uploadButton).click();
    await this.page.waitForTimeout(2000);
  }

  async selectDisplayMethod(option: string) {
    await this.page.locator(AdminProjectObjects.displayMethodDropdown.selector).filter({ hasText: AdminProjectObjects.displayMethodDropdown.text }).first().click();
    const displayMethodOption = await AdminProjectObjects.displayMethodOption(option);
    await this.page.locator(displayMethodOption).click();
  }

  async fillDetailsTitleArabic(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.detailsTitleArabic.role, {
        name: AdminProjectObjects.detailsTitleArabic.name,
      })
      .fill(value);
  }

  async fillDetailsTitleEnglish(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.detailsTitleEnglish.role, {
        name: AdminProjectObjects.detailsTitleEnglish.name,
      })
      .fill(value);
  }

  async fillFirstUnitReadyDate(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.firstUnitReadyDate.role, {
        name: AdminProjectObjects.firstUnitReadyDate.name,
      })
      .fill(value);
  }

  async fillNameArabic(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.nameArabic.role, {
        name: AdminProjectObjects.nameArabic.name,
      })
      .fill(value);
  }

  async fillNameEnglish(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.nameEnglish.role, {
        name: AdminProjectObjects.nameEnglish.name,
      })
      .fill(value);
  }

  async fillSummaryArabic(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.summaryArabic.role, {
        name: AdminProjectObjects.summaryArabic.name,
      })
      .fill(value);
  }

  async fillSummaryEnglish(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.summaryEnglish.role, {
        name: AdminProjectObjects.summaryEnglish.name,
      })
      .fill(value);
  }

  async fillDescriptionArabic(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.descriptionArabic.role, {
        name: AdminProjectObjects.descriptionArabic.name,
      })
      .fill(value);
  }

  async fillDescriptionEnglish(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.descriptionEnglish.role, {
        name: AdminProjectObjects.descriptionEnglish.name,
      })
      .fill(value);
  }

  async fillStartingPrice(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.startingPrice.role, {
        name: AdminProjectObjects.startingPrice.name,
      })
      .fill(value);
  }

  async fillLatitude(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.latitude.role, {
        name: AdminProjectObjects.latitude.name,
      })
      .fill(value);
  }

  async fillLongitude(value: string) {
    await this.page
      .getByRole(AdminProjectObjects.longitude.role, {
        name: AdminProjectObjects.longitude.name,
      })
      .fill(value);
  }
  async expectMediaUploadComplete(index: number) {
    await expect(this.page.locator(AdminProjectObjects.uploadStatus).nth(index)).toBeVisible({
      timeout: 120000,
    });
    await this.page.waitForTimeout(1500);
  }

  async fillGuaranteeAfterServices(value: string) {
    await this.page.locator(AdminProjectObjects.guarenteeAfterServices).fill(value);
  }

  async clickMediaSaveButton() {
    await this.page.locator(AdminProjectObjects.mediaSaveButton).click();
    await this.page.waitForTimeout(3000);
  }

  async clickProjectDetailsTab() {
    await this.page
      .getByRole(AdminProjectObjects.projectDetailsTab.role, {
        name: AdminProjectObjects.projectDetailsTab.name,
      })
      .click();
  }

  async clickProjectDetailsText() {
    await this.page.getByText(AdminProjectObjects.projectDetailsText.text).click();
  }

  async clickRequestMediaApprovalButton() {
    await this.page
      .getByRole(AdminProjectObjects.requestMediaApprovalButton.role, {
        name: AdminProjectObjects.requestMediaApprovalButton.name,
      })
      .click();
  }

  async clickAcceptUploadedMediaButton() {
    await this.page
      .getByRole(AdminProjectObjects.acceptUploadedMediaButton.role, {
        name: AdminProjectObjects.acceptUploadedMediaButton.name,
      })
      .click();
  }

  async clickKeepProjectUnpublishedButton() {
    await this.page
      .getByRole(AdminProjectObjects.keepProjectUnpublishedButton.role, {
        name: AdminProjectObjects.keepProjectUnpublishedButton.name,
      })
      .click();
  }

  async clickUnitModelsSection() {
    await this.page.getByText(AdminProjectObjects.unitModelsSection.text).click();
  }

  async clickUnitModelCell() {
    await this.page
      .getByRole(AdminProjectObjects.unitModelCell.role, {
        name: AdminProjectObjects.unitModelCell.name,
      })
      .click();
  }

  async clickMediaDraftSection() {
    await this.page.getByText(AdminProjectObjects.mediaDraftSection.text).click();
  }

  async clickPublishUnitButton() {
    this.checkMediaApproveButton();
    const publishButton = this.page.getByRole(AdminProjectObjects.publishUnitButton.role, {
      name: AdminProjectObjects.publishUnitButton.name,
    });
    await publishButton.click();
    while (true) {
      await this.page.waitForTimeout(3000);
      if (!(await publishButton.isVisible().catch(() => false))) break;
      await this.page.reload();
    }
  }

  async checkMediaApproveButton() {
    const approveMediaButton = this.page.getByRole(AdminProjectObjects.acceptUploadedMediaButton.role, {
      name: AdminProjectObjects.acceptUploadedMediaButton.name,
    });
    while (true) {
      await this.page.waitForTimeout(3000);
      if (!(await approveMediaButton.isVisible().catch(() => false))) break;
      await approveMediaButton.click();
    }
  }

  async clickUnitModelLink() {
    const unitModelLink = this.page.locator(AdminProjectObjects.unitModelLink.selector).filter({ hasText: AdminProjectObjects.unitModelLink.text });
    await unitModelLink.waitFor({ state: 'visible' });
    await unitModelLink.click();
    await this.page.waitForTimeout(3000);
    const chevronElement = this.page.locator(AdminProjectObjects.rightTabArrow);
    if (await chevronElement.isVisible().catch(() => false)) await chevronElement.click();
  }

  async waitForMediaApproval() {
    const visualContentTab = this.page.getByRole(AdminProjectObjects.mediaApprovalText.role, {
      name: AdminProjectObjects.mediaApprovalText.name,
    });
    while (!(await visualContentTab.isVisible().catch(() => false))) {
      await this.page.reload();
      await this.page.waitForTimeout(2000);
    }
    await expect(visualContentTab).toBeVisible();
  }

  async selectAvailableProjectStatus() {
    await this.page.locator(AdminProjectObjects.statusDropdown).click();
    await this.page
      .getByRole(AdminProjectObjects.projectStatusAvailableOption.role, {
        name: AdminProjectObjects.projectStatusAvailableOption.name,
      })
      .click();
  }

  async enableAvailableForBookingToggle() {
    const bookingToggle = this.page.locator(AdminProjectObjects.bookingAvailableToggle);
    await expect(bookingToggle).toBeVisible({ timeout: 30000 });
    if ((await bookingToggle.getAttribute('aria-checked')) === 'false') {
      await bookingToggle.click();
    }
    await expect(bookingToggle).toHaveAttribute('aria-checked', 'true');
  }

  async publishProject() {
    await this.waitForMediaApproval();
    const publishedToggle = this.page.locator(AdminProjectObjects.projectPublishedToggle);
    await expect(publishedToggle).toBeVisible({ timeout: 30000 });
    if ((await publishedToggle.getAttribute('aria-checked')) === 'false') {
      await publishedToggle.click();
    }
    await expect(publishedToggle).toHaveAttribute('aria-checked', 'true');
  }

  async expandProjectSettings() {
    await this.page.locator("//span[contains(text(),'إعدادات المشاريع')]").click();
  }

  async enableRefundToggle() {
    const RefundubleToggel = this.page.locator("//label[contains (text(), 'قابل للاسترداد')]/preceding-sibling::button");
    await expect(RefundubleToggel).toBeVisible({ timeout: 30000 });
    const isRefundbleChecked = await RefundubleToggel.getAttribute('aria-checked');
    if (isRefundbleChecked === 'false') {
      await RefundubleToggel.click();
      await expect(RefundubleToggel).toHaveAttribute('aria-checked', 'true');
    } else {
      await expect(RefundubleToggel).toHaveAttribute('aria-checked', 'true');
    }
  }

  async openProjects() {
    await this.clickInternalInventory();
    await this.clickProjectsLink();
  }

  async openResaleRequests() {
    await this.clickInternalInventory();
    await this.page
      .getByRole(AdminProjectObjects.resaleRequestsLink.role, {
        name: AdminProjectObjects.resaleRequestsLink.name,
      })
      .click();
  }

  async clickInternalInventory() {
    await this.page.locator(AdminProjectObjects.internalInventoryLink.selector).filter({ hasText: AdminProjectObjects.internalInventoryLink.hasText }).click();
  }

  async openAuctionCreation() {
    await this.page.locator(AdminProjectObjects.auctionsLink.selector).filter({ hasText: AdminProjectObjects.auctionsLink.hasText }).click();
    await this.page
      .getByRole(AdminProjectObjects.auctionProjectsLink.role, {
        name: AdminProjectObjects.auctionProjectsLink.name,
      })
      .click();
    await this.page
      .getByRole(AdminProjectObjects.newAuctionProjectButton.role, {
        name: AdminProjectObjects.newAuctionProjectButton.name,
      })
      .click();
  }

  async clickPartner() {
    await this.clickPartnerLink();
  }

  async clickNeighbourGreeting() {
    await this.page.locator(AdminProjectObjects.neighbourGreetingLink.selector).filter({ hasText: AdminProjectObjects.neighbourGreetingLink.hasText }).click();
  }

  async openVoucherManagement() {
    await this.page
      .getByRole(AdminProjectObjects.voucherManagementLink.role, {
        name: AdminProjectObjects.voucherManagementLink.name,
      })
      .click();
  }

  async openFinancialInstitutes() {
    await this.clickPartner();
    await this.page
      .getByRole(AdminProjectObjects.financialInstitutesLink.role, {
        name: AdminProjectObjects.financialInstitutesLink.name,
      })
      .click();
  }

  async selectRegionAndCity(region = 'الرياض') {
    await this.page.locator(AdminProjectObjects.regionDropdown).getByRole(AdminProjectObjects.regionSelectCombobox.role).click();
    await this.page.getByText(region).click();
    await this.page.locator(AdminProjectObjects.cityDropdown).click();
    await this.page
      .getByRole(AdminProjectObjects.genericOption.role, {
        name: region,
        exact: AdminProjectObjects.genericOption.exact,
      })
      .click();
  }

  async saveAndExpectSuccess() {
    await this.clickSaveButton();
    await expect(this.page.getByText(AdminProjectObjects.saveSuccessMessage.text)).toBeVisible({
      timeout: 120000,
    });
  }

  async clickCompletionPercentageSwitch(shouldBeChecked: boolean) {
    const completionPercentageSwitch = this.page.getByRole(AdminProjectObjects.completionPercentageSwitch.role, { name: AdminProjectObjects.completionPercentageSwitch.name });

    const completionPercentageValue = this.page.locator(AdminProjectObjects.completionPercentageValue.xpath);

    await expect(completionPercentageValue).toBeVisible();
    const isChecked = (await completionPercentageValue.getAttribute('aria-checked')) === 'true';
    if (isChecked !== shouldBeChecked) {
      await completionPercentageSwitch.click();
    }
    await expect(completionPercentageValue).toHaveAttribute('aria-checked', String(shouldBeChecked));
  }

  async clickSelectAllRowsForBankClassState(shouldNotContainActive: boolean) {
    const bankRows = this.page.locator(AdminProjectObjects.banksCheckboxesValue.xpath);
    await expect(bankRows.first()).toBeVisible({ timeout: 30000 });
    const rowCount = await bankRows.count();

    for (let index = 0; index < rowCount; index++) {
      const rowClass = await bankRows.nth(index).getAttribute('class');
      const isActive = rowClass?.split(/\s+/).includes('active') ?? false;

      if (shouldNotContainActive && !isActive) {
        await this.expectSelectAllRowsVisible();
        await this.clickSelectAllRows();
        return;
      }

      if (!shouldNotContainActive && isActive) {
        await this.expectSelectAllRowsVisible();
        await this.clickSelectAllRows();
        await this.clickSelectAllRows();
        return;
      }
    }
  }

  async clickPartnerLink() {
    await this.page.locator(AdminProjectObjects.partnerLink.selector).filter({ hasText: AdminProjectObjects.partnerLink.hasText }).click();
  }
  async fillDeveloperName(developerName: string) {
    const developerNameInputfield = this.page.locator(AdminProjectObjects.devloperNameInputField.xpath);
    await this.page.waitForTimeout(2000);
    await expect(developerNameInputfield).toBeVisible({ timeout: 90000 });
    await developerNameInputfield.fill(developerName);
    await this.page.waitForTimeout(2000);
    await developerNameInputfield.press('Enter');
  }

  async clickOnDeveloperNameResult(value: string | number) {
    const developerNameResult = this.page.locator(AdminProjectObjects.devloperNameResult.xpath).getByText(String(value), {
      exact: AdminProjectObjects.devloperNameResult.exact,
    });
    await expect(developerNameResult).toBeVisible({ timeout: 90000 });
    await developerNameResult.click();
  }

  async verifyDeveloperInformationPageText(expectedText: string) {
    await expect(this.page.locator(AdminProjectObjects.developerInformationPage.xpath)).toHaveText(expectedText);
  }
  async fillDeveloperPhoneNumber(developerPhoneNumber: string) {
    const developerPhoneNumberInputfiled = this.page.locator(AdminProjectObjects.developerPhoneNumberInputfiled.xpath);

    await expect(developerPhoneNumberInputfiled).toBeVisible({ timeout: 90000 });
    await developerPhoneNumberInputfiled.fill(developerPhoneNumber);
  }

  async clickDeveloperContactInfoSwitch(shouldBeChecked: boolean) {
    const developarContactInofSwitch = this.page.getByRole(AdminProjectObjects.developarContactInofSwitch.role, { name: AdminProjectObjects.developarContactInofSwitch.name });

    const developarContactInofValue = this.page.locator(AdminProjectObjects.developarContactInofValue.xpath);
    await expect(developarContactInofValue).toBeVisible();
    const isChecked = (await developarContactInofValue.getAttribute('aria-checked')) === 'true';
    if (isChecked !== shouldBeChecked) {
      await developarContactInofSwitch.click();
    }
    await expect(developarContactInofValue).toHaveAttribute('aria-checked', String(shouldBeChecked));
  }

  async searchFinancialInstitute(targetName: string) {
    while (true) {
      const targetCell = this.page.locator(AdminProjectObjects.financialInstituteNameCell(targetName));

      // 2. Check if the cell is visible on the current page
      const isPresent = await targetCell.isVisible({ timeout: 20000 });
      if (isPresent) {
        await targetCell.click();
        break;
      }

      // 3. Move to the next page using your exact Arabic locator
      const nextButton = this.page.getByRole(AdminProjectObjects.financialInstitutesNextPageButton.role, { name: AdminProjectObjects.financialInstitutesNextPageButton.name });
      await nextButton.click();
      await this.page.waitForTimeout(3000);
    }
  }

  async fillFinancialInstituteArabicName(name: string) {
    await this.page.locator(AdminProjectObjects.financialInstituteArabicNameInput).fill(name);
  }

  async fillFinancialInstituteEnglishName(name: string) {
    await this.page.locator(AdminProjectObjects.financialInstituteEnglishNameInput).fill(name);
  }

  async fillFinancialInstituteRealName(name: string) {
    await this.page.locator(AdminProjectObjects.financialInstituteRealNameInput).fill(name);
  }

  async clickFinancialInstituteSaveButton() {
    await this.page
      .getByRole(AdminProjectObjects.saveButton.role, {
        name: AdminProjectObjects.saveButton.name,
      })
      .click();
  }

  async expectFinancialInstituteSavedToast() {
    await expect(this.page.locator(AdminProjectObjects.financialInstituteSavedToast)).toHaveText(AdminProjectObjects.saveSuccessMessage.text);
  }

  async clickAcceptButton() {
    await this.page
      .getByRole(AdminProjectObjects.accpetButton.role, {
        name: AdminProjectObjects.accpetButton.name,
      })
      .click();
  }

  async validateSuccessToastMessageText(text: string) {
    await expect(this.page.locator(AdminProjectObjects.successToast).getByText(text), 'Success toast message is not preset').toBeVisible({ timeout: 120000 });
  }

  async expandProjectSettingsSection() {
    const settings = this.page.locator(AdminProjectObjects.settingsSectionHeading);
    await settings.waitFor({ state: 'visible', timeout: 20000 });
    await settings.click();
  }

  async activateMultipleBookingToggles() {
    const partnerMultipleBooking = this.page.locator(AdminProjectObjects.activateMultipleBookingToggleMob);
    const mobMultipleBooking = this.page.locator(AdminProjectObjects.activateMultipleBookingTogglePartner);
    await partnerMultipleBooking.waitFor({ state: 'visible', timeout: 20000 });
    await partnerMultipleBooking.click();
    await mobMultipleBooking.click();
  }

  async fillMaxBookingPerNonBene(maxBookings: string) {
    const maxBookingTextbox = this.page.locator(AdminProjectObjects.maxBookingsPerNonBeneInput);
    await maxBookingTextbox.waitFor({ state: 'visible', timeout: 20000 });
    await maxBookingTextbox.fill(maxBookings);
  }
}
