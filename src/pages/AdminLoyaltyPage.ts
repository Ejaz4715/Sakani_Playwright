
import { CommonMethods } from '@pages/utils/CommonMethods'
import { Page, expect } from '@playwright/test';
export class AdminLoyaltyPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    private commonMethods = new CommonMethods();

    async clickLoyaltyProgram() {
        await this.page.locator('a').filter({ hasText: 'برنامج شراي' }).click();
    }

    async clickManagePartners() {
        const managePartnersLink = this.page.getByRole('link', { name: 'إدارة الشركاء' });
        await managePartnersLink.click();
    }

    async clickAddNewPartner() {
        const addPartnerLink = this.page.getByRole('link', { name: 'إضافة شريك جديد' });
        await this.page.waitForTimeout(3000);
        await this.commonMethods.clickIfVisible(addPartnerLink)
    }

    async fillCompanyName(text: string) {
        const companyNameInput = this.page.locator('//input[@formcontrolname="company_name"]');
        await companyNameInput.fill(text);
    }

    async fillActivity(text = 'test activity') {
        const activityInput = this.page.locator("//input[@formcontrolname='activity']");
        await activityInput.fill(text);
    }

    async selectIsActiveOption(optionText: string) {
        const isActiveDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='is_active']");
        await isActiveDropdown.click();
        await this.selectListOption(optionText);
    }

    async selectListOption(optionText: string) {
        const dropdownOption = this.page.locator("//ng-dropdown-panel/descendant::span").filter({ hasText: new RegExp(`^${optionText}$`) });
        await this.commonMethods.clickIfVisible(dropdownOption)

    }

    async fillContactPerson(text: string) {
        const contactPersonInput = this.page.locator("//input[@formcontrolname='contact_person']");
        await contactPersonInput.fill(text);
    }

    async fillContactEmail(text: string) {
        const contactEmailInput = this.page.locator("//input[@formcontrolname='contact_email']");
        await contactEmailInput.fill(text);
    }


    async fillContactPhone(phone = '588938198') {
        const contactPhoneInput = this.page.locator("//app-phone-input[@formcontrolname='contact_phone']/descendant::input");
        await contactPhoneInput.fill(phone);
    }

    async fillContactWhatsapp(whatsapp = '58893819') {
        const contactWhatsappInput = this.page.locator("//app-phone-input[@formcontrolname='contact_whatsapp']/descendant::input");
        await contactWhatsappInput.fill(whatsapp);
    }

    async fillIbanNumber(iban = 'SA1111111111111111111111') {
        const ibanInput = this.page.locator("//input[@formcontrolname='iban_number']");
        await ibanInput.fill(iban);
    }

    async fillBankAccountName(bankName = 'Al Rajhi') {
        const bankAccountNameInput = this.page.locator("//input[@formcontrolname='bank_account_name']");
        await bankAccountNameInput.fill(bankName);
    }

    async uploadFile(imageFilePath: string) {
        const fileInput = this.page.locator("//input[@type='file']");
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(imageFilePath);
        await this.page.waitForTimeout(4000);
    }

    async clickSave() {
        const saveButton = this.page.getByRole('button', { name: /حفظ/ });
        await this.commonMethods.clickIfVisible(saveButton);
    }

    async validatePartnerAddedSuccessMessage() {
        const successMessage = this.page.getByText('تمت إضافة الشريك الجديد بنجاح');
        await expect(successMessage, "Success message is not visible").toBeVisible();
    }

    async clickManageDeals() {
        await this.page.getByRole('link', { name: 'إدارة الصفقات' }).click();
    }

    async clickAddNewOffer() {
        const addNewOfferLink = this.page.getByRole('link', { name: 'إضافة عرض جديد' });
        await this.page.waitForTimeout(3000);
        await this.commonMethods.clickIfVisible(addNewOfferLink);
    }

    async selectCompanyName(optionText: string) {
        const companyNameDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='promoter_id']");
        await this.commonMethods.clickIfVisible(companyNameDropdown);
        await this.selectListOption(optionText)
    }

    async fillCampaignStartDate(startDate: string) {
        const campaignStartDateInput = this.page.locator("//app-gregorian-datepicker[@formcontrolname='campaign_start_date']/descendant::input").nth(1);
        await campaignStartDateInput.fill(startDate);
    }

    async fillCampaignEndDate(endDate: string) {
        const campaignEndDateInput = this.page.locator("//app-gregorian-datepicker[@formcontrolname='offer_expired_at']/descendant::input").nth(1);
        await campaignEndDateInput.fill(endDate);
    }

    async fillPrice(price = '5000') {
        const priceInput = this.page.locator("//input[@formcontrolname='price']");
        await priceInput.fill(price);
    }

    async fillDiscount(discount = '2') {
        const discountInput = this.page.locator("//input[@formcontrolname='discount']");
        await discountInput.fill(discount);
    }


    async fillAcceptableQuantityPerUser(text: string) {
        const acceptableQuantityInput = this.page.locator("//input[@formcontrolname='acceptable_quantity_per_user']");
        await acceptableQuantityInput.fill(text);
    }

    async selectSakaniCommissionType(optionText: string) {
        const sakaniCommissionTypeDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='sakani_commission_type']");
        await this.commonMethods.clickIfVisible(sakaniCommissionTypeDropdown);
        await this.selectListOption(optionText);
    }


    async fillSakaniCommissionValue(value: string) {
        const sakaniCommissionValueInput = this.page.locator("//input[@formcontrolname='sakani_commission_value']");
        await sakaniCommissionValueInput.fill(value);
    }

    async fillTitle(title: string) {
        const titleInput = this.page.locator("//input[@formcontrolname='title']");
        await titleInput.fill(title);
    }

    async fillDescription(description: string) {
        const descriptionInput = this.page.locator("//input[@formcontrolname='description']");
        await descriptionInput.fill(description);
    }

    async fillDetails(details = 'Test Details') {
        const detailsInput = this.page.locator("//input[@formcontrolname='details']");
        await detailsInput.fill(details);
    }

    async fillTermsAndConditions(termsText = 'Testing terms and condition for sharrai offer') {
        const termsTextarea = this.page.getByRole('region', { name: 'الشروط و الأحكام' }).locator('textarea');
        await termsTextarea.fill(termsText);
    }

    async clickDealIdentifiersTab() {
        const dealIdentifiersTab = this.page.getByRole('tab', { name: 'الرموز التعريفية للصفقة' });
        await this.commonMethods.clickIfVisible(dealIdentifiersTab);
    }

    async clickImportOfferCodes() {
        const importOfferCodesButton = this.page.getByRole('button', { name: 'استيراد رموز العروض' });
        await this.commonMethods.clickIfVisible(importOfferCodesButton);
    }

    async uploadDealFile(filePath: string) {
        const fileInput = this.page.locator("//input[@type='file']");
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(filePath);
        await this.page.waitForTimeout(4000);
    }

    async validateTheFileImportToast() {
        const toastMessage = this.page.getByText(/استيراد/);
        await expect(toastMessage, "Toast message is not present").toBeVisible({ timeout: 10000 });
    }

    async clickFirstProcessedCell() {
        await this.page.waitForTimeout(5000);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
        const statusCell = this.page.getByRole('cell', { name: 'تم إكمال الإجراء' }).first();
        await this.commonMethods.clickIfVisible(statusCell);
    }

    async clickApprove() {
        const approveButton = this.page.getByRole('button', { name: 'اعتماد' });
        await this.commonMethods.clickIfVisible(approveButton);
    }

    async clickConfirm() {
        const confirmButton = this.page.getByRole('button', { name: 'موافق' });
        await this.commonMethods.clickIfVisible(confirmButton);
    }

    async clickSendImportApprovalRequest() {
        const requestText = this.page.getByText('إرسال طلب اعتماد الاستيراد');
        await this.commonMethods.clickIfVisible(requestText);
    }

    async searchAndNavigateToDeal(searchText: string) {
        const searchInput = this.page.getByRole('textbox', { name: 'بحث' });
        const searchButton = this.page.getByRole('button', { name: 'بحث' });
        const resultItem = this.page.locator('div').filter({ hasText: new RegExp(`^${searchText}$`) });
        await searchInput.fill(searchText);
        await this.commonMethods.clickIfVisible(searchButton);
        await this.commonMethods.clickIfVisible(resultItem);
    }

    async clickEdit() {
        const editButton = this.page.getByRole('button', { name: 'تعديل' });
        await this.commonMethods.clickIfVisible(editButton);
    }

    async selectStatusToActive(optionText: string) {
        const statusDropdown = this.page.locator('ng-select').filter({ hasText: 'اختيارغير نشط' }).getByRole('combobox');
        await this.commonMethods.clickIfVisible(statusDropdown);
        await this.selectListOption(optionText);
    }

    async selectActiveStatusOption() {
        const activeOption = this.page.getByRole('option', { name: 'نشط', exact: true });
        await this.commonMethods.clickIfVisible(activeOption);
    }

    async clickYesOnPopUp() {
        const yesButton = this.page.getByRole('button', { name: /نعم/ });
        // Waits up to 3 seconds for the button to show up before evaluating
        if (await yesButton.isVisible({ timeout: 3000 })) {
            await this.commonMethods.clickIfVisible(yesButton);
        }
    }

    async verifyActiveStatusVisible() {
        const activeStatusCell = this.page.getByRole('table').getByText('نشط');
        await expect(activeStatusCell, "Active status is not present").toBeVisible({ timeout: 30000 });
    }

}


