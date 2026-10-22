import { CommonMethods } from '@pages/utils/CommonMethods';
import { Page, expect } from '@playwright/test';
import { AdminLoyaltyObjects } from '@objects/AdminLoyaltyObjects';
export class AdminLoyaltyPage {
  private readonly page: Page;
  private readonly commonMethods: CommonMethods;

  constructor(page: Page) {
    this.page = page;
    this.commonMethods = new CommonMethods(page);
  }

  async clickLoyaltyProgram() {
    await this.page.locator(AdminLoyaltyObjects.loyaltyProgramLink.selector).filter({ hasText: AdminLoyaltyObjects.loyaltyProgramLink.text }).click();
  }

  async clickManagePartners() {
    const managePartnersLink = this.page.getByRole(AdminLoyaltyObjects.managePartnersLink.role, { name: AdminLoyaltyObjects.managePartnersLink.name });
    await managePartnersLink.click();
  }

  async clickAddNewPartner() {
    const addPartnerLink = this.page.getByRole(AdminLoyaltyObjects.addPartnerLink.role, { name: AdminLoyaltyObjects.addPartnerLink.name });
    await this.page.waitForTimeout(3000);
    await this.commonMethods.clickIfVisible(addPartnerLink);
  }

  async fillCompanyName(text: string) {
    const companyNameInput = this.page.locator(AdminLoyaltyObjects.companyNameInput);
    await companyNameInput.fill(text);
  }

  async fillActivity(text = 'test activity') {
    const activityInput = this.page.locator(AdminLoyaltyObjects.activityInput);
    await activityInput.fill(text);
  }

  async selectIsActiveOption(optionText: string) {
    const isActiveDropdown = this.page.locator(AdminLoyaltyObjects.isActiveDropdown);
    await isActiveDropdown.click();
    await this.selectListOption(optionText);
  }

  async selectListOption(optionText: string) {
    const dropdownOption = this.page.locator(AdminLoyaltyObjects.dropdownOption).filter({ hasText: new RegExp(`^${optionText}$`) });
    await this.commonMethods.clickIfVisible(dropdownOption);
  }

  async fillContactPerson(text: string) {
    const contactPersonInput = this.page.locator(AdminLoyaltyObjects.contactPersonInput);
    await contactPersonInput.fill(text);
  }

  async fillContactEmail(text: string) {
    const contactEmailInput = this.page.locator(AdminLoyaltyObjects.contactEmailInput);
    await contactEmailInput.fill(text);
  }

  async fillContactPhone(phone = '588938198') {
    const contactPhoneInput = this.page.locator(AdminLoyaltyObjects.contactPhoneInput);
    await contactPhoneInput.fill(phone);
  }

  async fillContactWhatsapp(whatsapp = '58893819') {
    const contactWhatsappInput = this.page.locator(AdminLoyaltyObjects.contactWhatsappInput);
    await contactWhatsappInput.fill(whatsapp);
  }

  async fillIbanNumber(iban = 'SA1111111111111111111111') {
    const ibanInput = this.page.locator(AdminLoyaltyObjects.ibanInput);
    await ibanInput.fill(iban);
  }

  async fillBankAccountName(bankName = 'Al Rajhi') {
    const bankAccountNameInput = this.page.locator(AdminLoyaltyObjects.bankAccountNameInput);
    await bankAccountNameInput.fill(bankName);
  }

  async uploadFile(imageFilePath: string) {
    const fileInput = this.page.locator(AdminLoyaltyObjects.fileInput);
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(imageFilePath);
    await this.page.waitForTimeout(4000);
  }

  async clickSave() {
    const saveButton = this.page.getByRole(AdminLoyaltyObjects.saveButton.role, { name: AdminLoyaltyObjects.saveButton.name });
    await this.commonMethods.clickIfVisible(saveButton);
  }

  async validatePartnerAddedSuccessMessage() {
    const successMessage = this.page.getByText(AdminLoyaltyObjects.partnerAddedSuccessMessage);
    await expect(successMessage, 'Success message is not visible').toBeVisible();
  }

  async clickManageDeals() {
    await this.page.getByRole(AdminLoyaltyObjects.manageDealsLink.role, { name: AdminLoyaltyObjects.manageDealsLink.name }).click();
  }

  async clickAddNewOffer() {
    const addNewOfferLink = this.page.getByRole(AdminLoyaltyObjects.addNewOfferLink.role, { name: AdminLoyaltyObjects.addNewOfferLink.name });
    await this.page.waitForTimeout(3000);
    await this.commonMethods.clickIfVisible(addNewOfferLink);
  }

  async selectCompanyName(optionText: string) {
    const companyNameDropdown = this.page.locator(AdminLoyaltyObjects.companyNameDropdown);
    await this.commonMethods.clickIfVisible(companyNameDropdown);
    await this.selectListOption(optionText);
  }

  async fillCampaignStartDate(startDate: string) {
    const campaignStartDateInput = this.page.locator(AdminLoyaltyObjects.campaignStartDateInput).nth(1);
    await campaignStartDateInput.fill(startDate);
  }

  async fillCampaignEndDate(endDate: string) {
    const campaignEndDateInput = this.page.locator(AdminLoyaltyObjects.campaignEndDateInput).nth(1);
    await campaignEndDateInput.fill(endDate);
  }

  async fillPrice(price = '5000') {
    const priceInput = this.page.locator(AdminLoyaltyObjects.priceInput);
    await priceInput.fill(price);
  }

  async fillDiscount(discount = '2') {
    const discountInput = this.page.locator(AdminLoyaltyObjects.discountInput);
    await discountInput.fill(discount);
  }

  async fillAcceptableQuantityPerUser(text: string) {
    const acceptableQuantityInput = this.page.locator(AdminLoyaltyObjects.acceptableQuantityInput);
    await acceptableQuantityInput.fill(text);
  }

  async selectSakaniCommissionType(optionText: string) {
    const sakaniCommissionTypeDropdown = this.page.locator(AdminLoyaltyObjects.sakaniCommissionTypeDropdown);
    await this.commonMethods.clickIfVisible(sakaniCommissionTypeDropdown);
    await this.selectListOption(optionText);
  }

  async fillSakaniCommissionValue(value: string) {
    const sakaniCommissionValueInput = this.page.locator(AdminLoyaltyObjects.sakaniCommissionValueInput);
    await sakaniCommissionValueInput.fill(value);
  }

  async fillTitle(title: string) {
    const titleInput = this.page.locator(AdminLoyaltyObjects.titleInput);
    await titleInput.fill(title);
  }

  async fillDescription(description: string) {
    const descriptionInput = this.page.locator(AdminLoyaltyObjects.descriptionInput);
    await descriptionInput.fill(description);
  }

  async fillDetails(details = 'Test Details') {
    const detailsInput = this.page.locator(AdminLoyaltyObjects.detailsInput);
    await detailsInput.fill(details);
  }

  async fillTermsAndConditions(termsText = 'Testing terms and condition for sharrai offer') {
    const termsTextarea = this.page
      .getByRole(AdminLoyaltyObjects.termsAndConditionsRegion.role, { name: AdminLoyaltyObjects.termsAndConditionsRegion.name })
      .locator(AdminLoyaltyObjects.termsTextarea);
    await termsTextarea.fill(termsText);
  }

  async clickDealIdentifiersTab() {
    const dealIdentifiersTab = this.page.getByRole(AdminLoyaltyObjects.dealIdentifiersTab.role, { name: AdminLoyaltyObjects.dealIdentifiersTab.name });
    await this.commonMethods.clickIfVisible(dealIdentifiersTab);
  }

  async clickImportOfferCodes() {
    const importOfferCodesButton = this.page.getByRole(AdminLoyaltyObjects.importOfferCodesButton.role, { name: AdminLoyaltyObjects.importOfferCodesButton.name });
    await this.commonMethods.clickIfVisible(importOfferCodesButton);
  }

  async uploadDealFile(filePath: string) {
    const fileInput = this.page.locator(AdminLoyaltyObjects.fileInput);
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(4000);
  }

  async validateTheFileImportToast() {
    const toastMessage = this.page.getByText(AdminLoyaltyObjects.importToastMessage);
    await expect(toastMessage, 'Toast message is not present').toBeVisible({ timeout: 10000 });
  }

  async clickFirstProcessedCell() {
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.waitForTimeout(2000);
    const statusCell = this.page.getByRole(AdminLoyaltyObjects.processedStatusCell.role, { name: AdminLoyaltyObjects.processedStatusCell.name }).first();
    await this.commonMethods.clickIfVisible(statusCell);
  }

  async clickApprove() {
    const approveButton = this.page.getByRole(AdminLoyaltyObjects.approveButton.role, { name: AdminLoyaltyObjects.approveButton.name });
    await this.commonMethods.clickIfVisible(approveButton);
  }

  async clickConfirm() {
    const confirmButton = this.page.getByRole(AdminLoyaltyObjects.confirmButton.role, { name: AdminLoyaltyObjects.confirmButton.name });
    await this.commonMethods.clickIfVisible(confirmButton);
  }

  async validateSendImportApprovalRequestToastMessageIsDisplayed() {
    const requestText = this.page.getByText(AdminLoyaltyObjects.importApprovalRequestText);
    await expect(requestText, 'Toast message is not present').toBeVisible({ timeout: 20000 });
  }

  async searchAndNavigateToDeal(searchText: string) {
    const searchInput = this.page.getByRole(AdminLoyaltyObjects.searchInput.role, { name: AdminLoyaltyObjects.searchInput.name });
    const searchButton = this.page.getByRole(AdminLoyaltyObjects.searchButton.role, { name: AdminLoyaltyObjects.searchButton.name });
    const resultItem = this.page.locator(AdminLoyaltyObjects.searchResultContainer).filter({ hasText: new RegExp(`^${searchText}$`) });
    await searchInput.fill(searchText);
    await this.commonMethods.clickIfVisible(searchButton);
    await this.commonMethods.clickIfVisible(resultItem);
  }

  async clickEdit() {
    const editButton = this.page.getByRole(AdminLoyaltyObjects.editButton.role, { name: AdminLoyaltyObjects.editButton.name });
    await this.commonMethods.clickIfVisible(editButton);
  }

  async selectStatusToActive(optionText: string) {
    const statusDropdown = this.page
      .locator(AdminLoyaltyObjects.statusDropdown.selector)
      .filter({ hasText: AdminLoyaltyObjects.statusDropdown.text })
      .getByRole(AdminLoyaltyObjects.statusDropdownCombobox.role);
    await this.commonMethods.clickIfVisible(statusDropdown);
    await this.selectListOption(optionText);
  }

  async selectActiveStatusOption() {
    const activeOption = this.page.getByRole(AdminLoyaltyObjects.activeStatusOption.role, { name: AdminLoyaltyObjects.activeStatusOption.name, exact: AdminLoyaltyObjects.activeStatusOption.exact });
    await this.commonMethods.clickIfVisible(activeOption);
  }

  async clickYesOnPopUp() {
    const yesButton = this.page.getByRole(AdminLoyaltyObjects.yesButton.role, { name: AdminLoyaltyObjects.yesButton.name });
    if (await yesButton.isVisible({ timeout: 3000 })) {
      await this.commonMethods.clickIfVisible(yesButton);
    }
  }

  async verifyActiveStatusVisible() {
    const activeStatusCell = this.page.getByRole(AdminLoyaltyObjects.activeStatusTable.role).getByText(AdminLoyaltyObjects.activeStatusText);
    await expect(activeStatusCell, 'Active status is not present').toBeVisible({ timeout: 30000 });
  }
}
