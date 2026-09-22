// @ts-nocheck
import { expect, Page } from "@playwright/test";
import { ElectronicAuctionProjectObjects } from "@objects/ElectronicAuctionProjectObjects";

export class ElectronicAuctionProjectPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillProjectName(projectName: string) {
    const input = this.page.getByRole(ElectronicAuctionProjectObjects.projectNameInput.role, { name: ElectronicAuctionProjectObjects.projectNameInput.name });
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(projectName);
  }

  async selectElectronicAuctionType() {
    const option = this.page.getByRole(ElectronicAuctionProjectObjects.electronicAuctionOption.role, { name: ElectronicAuctionProjectObjects.electronicAuctionOption.name });
    const combobox = this.page.getByRole(ElectronicAuctionProjectObjects.auctionTypeCombobox.role, { name: ElectronicAuctionProjectObjects.auctionTypeCombobox.name });
    while (!(await option.isVisible().catch(() => false))) {
      await expect(combobox).toBeVisible({ timeout: 30000 });
      await combobox.click();
      await this.page.waitForTimeout(1000);
    }
    await expect(option).toBeVisible({ timeout: 30000 });
    await option.click();
  }

  async openHousingSector() {
    const combobox = this.page.getByRole(ElectronicAuctionProjectObjects.sectorCombobox.role, { name: ElectronicAuctionProjectObjects.sectorCombobox.name });
    await expect(combobox).toBeVisible({ timeout: 30000 });
    await combobox.click();
  }

  async selectHousingSector() {
    const option = this.page.getByText(ElectronicAuctionProjectObjects.housingSectorOption.text);
    await expect(option).toBeVisible({ timeout: 30000 });
    await option.click();
  }

  async openRegion() {
    const combobox = this.page.locator("//ng-select[@formcontrolname='region_id']").getByRole("combobox");
    await expect(combobox).toBeVisible({ timeout: 30000 });
    await combobox.click();
  }

  async selectRegion() {
    const option = this.page.getByText(ElectronicAuctionProjectObjects.regionOption.text);
    await expect(option).toBeVisible({ timeout: 30000 });
    await option.click();
  }

  async openCity() {
    const input = this.page.locator(ElectronicAuctionProjectObjects.cityInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.click();
  }

  async selectCity() {
    const option = this.page.getByRole(ElectronicAuctionProjectObjects.cityOption.role, {
       name: ElectronicAuctionProjectObjects.cityOption.name, 
       exact: ElectronicAuctionProjectObjects.cityOption.exact });
    await expect(option).toBeVisible({ timeout: 30000 });
    await option.click();
  }

  async fillAuctionStartDate(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionStartDateInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAuctionStartHour(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionStartHourInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAuctionStartMinute(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionStartMinuteInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAuctionEndDate(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionEndDateInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAuctionEndHour(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionEndHourInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAuctionEndMinute(value: string) {
    const input = this.page.locator(ElectronicAuctionProjectObjects.auctionEndMinuteInput.xpath);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async saveProject() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.saveButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async openProjectMedia() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.projectMediaTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async fillArabicDetailsTitle(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.arabicDetailsTitleInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillEnglishDetailsTitle(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.englishDetailsTitleInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillArabicName(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.arabicNameInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillEnglishName(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.englishNameInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillArabicDescription(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.arabicDescriptionInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillEnglishDescription(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.englishDescriptionInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillLatitude(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.latitudeInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillLongitude(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.longitudeInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async fillAssetCount(value: string) {
    const input = this.getLocator(ElectronicAuctionProjectObjects.assetCountInput);
    await expect(input).toBeVisible({ timeout: 30000 });
    await input.fill(value);
  }

  async expectMediaSaved() {
    const message = this.page.getByText(ElectronicAuctionProjectObjects.mediaSavedMessage.text);
    await expect(message).toBeVisible({ timeout: 30000 });
  }

  async openProjectDetails() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.projectDetailsButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async submitMediaForApproval() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.submitMediaButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async approveProjectMedia() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.approveMediaButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async openUnits() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.unitsTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async openUnitsSubTab() {
    const subTab = this.page.locator(ElectronicAuctionProjectObjects.unitsSubTab.xpath).getByText("الوحدات");
    await expect(subTab).toBeVisible({ timeout: 30000 });
    await subTab.click();
  }

  async openNewUnitImport() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.newUnitImportButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async openUnitType() {
    const combobox = this.getLocator(ElectronicAuctionProjectObjects.unitTypeCombobox);
    await expect(combobox).toBeVisible({ timeout: 30000 });
    await combobox.click();
  }

  async selectApartmentUnitType() {
    const option = this.getLocator(ElectronicAuctionProjectObjects.apartmentOption);
    await expect(option).toBeVisible({ timeout: 30000 });
    await option.click();
  }

  async uploadUnitsFile(filePath: string) {
    await this.upload(ElectronicAuctionProjectObjects.unitFileInput.xpath, filePath);
  }

  async saveUnitImport() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.importSaveButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async expectImportInProgress() {
    const message = this.page.getByText(ElectronicAuctionProjectObjects.importInProgressMessage.name, { 
      exact: true });
    await expect(message).toBeVisible({ timeout: 120000 });
  }

  async waitForUnitImportToComplete() {
    const message = this.page.getByText(ElectronicAuctionProjectObjects.importCompletedMessage.text, { 
      exact: true });
    while (!(await message.isVisible().catch(() => false))) {
      await this.page.reload();
      await this.page.waitForTimeout(3000);
    }
    await expect(message).toBeVisible({ timeout: 30000 });
  }

  async approveUnitImport() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.approveButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async confirmUnitImport() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.confirmButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async returnFromUnitImport() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.backButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async openUnitModels() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.unitModelsTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async openApartmentModel() {
    const cell = this.getLocator(ElectronicAuctionProjectObjects.modelCell);
    await expect(cell).toBeVisible({ timeout: 30000 });
    await cell.click();
  }

  async saveUnitModel() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.saveButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async openUnitVisualMedia() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.visualMediaTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async submitUnitMediaForApproval() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.submitMediaButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async approveUnitMedia() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.approveMediaButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async publishUnitModel() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.unitPublishButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async waitForUnitMediaApproval() {
    await this.waitForApprovedTab(ElectronicAuctionProjectObjects.approvedMediaTab.xpath);
  }

  async openAuctionLegal() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.auctionLegalTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async uploadTerms(filePath: string) {
    await this.upload(ElectronicAuctionProjectObjects.termsFileInput.xpath, filePath);
  }

  async uploadWinnerContract(filePath: string) {
    await this.upload(ElectronicAuctionProjectObjects.winnerContractFileInput.xpath, filePath);
  }

  async expectUnitModelUpdated() {
    const message = this.page.getByText(ElectronicAuctionProjectObjects.modelUpdatedMessage.text);
    await expect(message).toBeVisible({ timeout: 30000 });
  }

  async openAuctionSettings() {
    const tab = this.getLocator(ElectronicAuctionProjectObjects.auctionSettingsTab);
    await expect(tab).toBeVisible({ timeout: 30000 });
    await tab.click();
  }

  async openSettingsEdit() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.editButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async enableGeneralAuctionSetting() {
    const settingSwitch = this.getLocator(ElectronicAuctionProjectObjects.generalSettingSwitch);
    await expect(settingSwitch).toBeVisible({ timeout: 30000 });
    await settingSwitch.click();
  }

  async updateAuctionSettings() {
    const button = this.getLocator(ElectronicAuctionProjectObjects.updateButton);
    await expect(button).toBeVisible({ timeout: 30000 });
    await button.click();
  }

  async expectSettingsUpdated() {
    const message = this.page.getByText(ElectronicAuctionProjectObjects.arabicText.text);
    await expect(message).toBeVisible({ timeout: 30000 });
  }

  async publishUnitModelCategories() {
    await this.setToggle(ElectronicAuctionProjectObjects.publishUnitModelToggle.xpath);
  }

  async openPublishedUnitModel() {
    const modelLink = this.page.locator("a").filter({ hasText: ElectronicAuctionProjectObjects.unitModelLink.text });
    await expect(modelLink).toBeVisible({ timeout: 30000 });
    await modelLink.click();
  }

  async waitForProjectMediaApproval() {
    await this.waitForApprovedTab(ElectronicAuctionProjectObjects.projectApprovedMediaTab.xpath);
  }

  async publishProject() {
    await this.setToggle(ElectronicAuctionProjectObjects.publishProjectToggle.xpath);
  }

  private getLocator(locatorDefinition: any) {
    if (locatorDefinition.xpath) {
      return this.page.locator(locatorDefinition.xpath);
    }

    if (locatorDefinition.text) {
      return this.page.getByText(locatorDefinition.text, {
        exact: locatorDefinition.exact,
      });
    }

    return this.page.getByRole(locatorDefinition.role, {
      name: locatorDefinition.name,
      exact: locatorDefinition.exact,
    });
  }

  private async upload(xpath: string, filePath: string) {
    const locator = this.page.locator(xpath);
    await locator.waitFor({ state: "attached", timeout: 30000 });
    await locator.setInputFiles(filePath);
  }

  private async waitForApprovedTab(xpath: string) {
    while (true) {
      const tab = this.page.locator(xpath);
      await expect(tab).toBeVisible({ timeout: 30000 });
      const text = await tab.textContent();
      if (text && text.includes("تمت الموافقة وتم النشر")) return;
      await this.page.reload();
      await this.page.waitForTimeout(3000);
    }
  }

  private async setToggle(xpath: string) {
    const toggle = this.page.locator(xpath);
    await expect(toggle).toBeVisible({ timeout: 30000 });
    if ((await toggle.getAttribute("aria-checked")) === "false") await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  }
}
