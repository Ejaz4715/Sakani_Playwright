
import { AdminObjects } from '@objects/AdminObjects'
import { Page, expect } from '@playwright/test';
export class AdminLoyaltyPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async clickLoyaltyProgram() {
        const shareeProgramLink = this.page.locator('a').filter({ hasText: 'برنامج شراي' });
        await shareeProgramLink.waitFor({ state: 'visible' });
        await shareeProgramLink.click();
    }

    async clickManagePartners() {
        const managePartnersLink = this.page.getByRole('link', { name: 'إدارة الشركاء' });
        await managePartnersLink.scrollIntoViewIfNeeded();
        await managePartnersLink.waitFor({ state: 'visible' });
        await managePartnersLink.click();
    }

    async clickAddNewPartner() {
        const addPartnerLink = this.page.getByRole('link', { name: 'إضافة شريك جديد' });
        await addPartnerLink.waitFor({ state: 'visible' });
        await addPartnerLink.click();
    }

    async fillCompanyName(text: string) {
        const companyNameInput = this.page.locator('//input[@formcontrolname="company_name"]');
        await companyNameInput.scrollIntoViewIfNeeded();
        await companyNameInput.waitFor({ state: 'visible' });
        await companyNameInput.fill(text);
    }

    async fillActivity(text = 'test activity') {
        const activityInput = this.page.locator("//input[@formcontrolname='activity']");

        await activityInput.scrollIntoViewIfNeeded();
        await activityInput.waitFor({ state: 'visible' });
        await activityInput.fill(text);
    }

    async selectIsActiveOption(optionText: string) {
        const isActiveDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='is_active']");
        await isActiveDropdown.waitFor({ state: 'visible' });
        await isActiveDropdown.click();
        this.selectListOption(optionText);
    }

    async selectListOption(optionText: string) {
        const dropdownOption = this.page.locator("//ng-dropdown-panel/descendant::span").filter({ hasText: new RegExp(`^${optionText}$`) });
        await dropdownOption.scrollIntoViewIfNeeded();
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();
    }

    async fillContactPerson(text: string) {
        const contactPersonInput = this.page.locator("//input[@formcontrolname='contact_person']");
        await contactPersonInput.scrollIntoViewIfNeeded();
        await contactPersonInput.waitFor({ state: 'visible' });
        await contactPersonInput.fill(text);
    }

    async fillContactEmail(text: string) {
        const contactEmailInput = this.page.locator("//input[@formcontrolname='contact_email']");
        await contactEmailInput.scrollIntoViewIfNeeded();
        await contactEmailInput.waitFor({ state: 'visible' });
        await contactEmailInput.fill(text);
    }


    async fillContactPhone(phone = '588938198') {
        const contactPhoneInput = this.page.locator("//app-phone-input[@formcontrolname='contact_phone']/descendant::input");
        await contactPhoneInput.waitFor({ state: 'visible' });
        await contactPhoneInput.fill(phone);
    }

    async fillContactWhatsapp(whatsapp = '58893819') {
        const contactWhatsappInput = this.page.locator("//app-phone-input[@formcontrolname='contact_whatsapp']/descendant::input");
        await contactWhatsappInput.waitFor({ state: 'visible' });
        await contactWhatsappInput.fill(whatsapp);
    }

    async fillIbanNumber(iban = 'SA1111111111111111111111') {
        const ibanInput = this.page.locator("//input[@formcontrolname='iban_number']");
        await ibanInput.waitFor({ state: 'visible' });
        await ibanInput.fill(iban);
    }

    async fillBankAccountName(bankName = 'Al Rajhi') {
        const bankAccountNameInput = this.page.locator("//input[@formcontrolname='bank_account_name']");
        await bankAccountNameInput.waitFor({ state: 'visible' });
        await bankAccountNameInput.fill(bankName);
    }

    async uploadFile(imageFilePath: string) {
        const fileInput = this.page.locator("//input[@type='file']");
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(imageFilePath);
    }

    async clickSave() {
        const saveButton = this.page.getByRole('button', { name: /حفظ/ });
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
    }

    async validatePartnerAddedSuccessMessage() {
        const successMessage = this.page.getByText('تمت إضافة الشريك الجديد بنجاح');
        await successMessage.scrollIntoViewIfNeeded();
        await expect(successMessage).toBeVisible();
    }

    async clickManageDeals() {
        const manageDealsLink = this.page.getByRole('link', { name: 'إدارة الصفقات' });

        await manageDealsLink.scrollIntoViewIfNeeded();
        await expect (manageDealsLink).toBeVisible();
        await manageDealsLink.click();
    }

    async clickAddNewOffer() {
        const addNewOfferLink = this.page.getByRole('link', { name: 'إضافة عرض جديد' });
        await addNewOfferLink.waitFor({ state: 'visible' });
        await addNewOfferLink.click();
    }

    async selectCompanyName(optionText: string) {
        const companyNameDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='promoter_id']");
        await companyNameDropdown.waitFor({ state: 'visible' });
        await companyNameDropdown.click();
        this.selectListOption(optionText)
    }

    async fillCampaignStartDate(startDate: string) {
        const campaignStartDateInput = this.page.locator("//app-gregorian-datepicker[@formcontrolname='campaign_start_date']/descendant::input").nth(0);

        await campaignStartDateInput.waitFor({ state: 'visible' });
        await campaignStartDateInput.fill(startDate);
    }

    async fillCampaignEndDate(endDate: string) {
        const campaignEndDateInput = this.page.locator("//app-gregorian-datepicker[@formcontrolname='campaign_start_date']/descendant::input").nth(1);

        await campaignEndDateInput.waitFor({ state: 'visible' });
        await campaignEndDateInput.fill(endDate);
    }

    async fillPrice(price = '5000') {
        const priceInput = this.page.locator("//input[@formcontrolname='price']");

        await priceInput.waitFor({ state: 'visible' });
        await priceInput.fill(price);
    }

    async fillDiscount(discount = '2') {
        const discountInput = this.page.locator("//input[@formcontrolname='discount']");

        await discountInput.waitFor({ state: 'visible' });
        await discountInput.fill(discount);
    }


    async fillAcceptableQuantityPerUser(text: string) {
        const acceptableQuantityInput = this.page.locator("//input[@formcontrolname='acceptable_quantity_per_user']");
        await acceptableQuantityInput.waitFor({ state: 'visible' });
        await acceptableQuantityInput.fill(text);
    }

    async selectSakaniCommissionType(optionText: string) {
        const sakaniCommissionTypeDropdown = this.page.locator("//app-nsar-dropdown[@formcontrolname='sakani_commission_type']");
        await sakaniCommissionTypeDropdown.waitFor({ state: 'visible' });
        await sakaniCommissionTypeDropdown.click();
        this.selectListOption(optionText);
    }


    async fillSakaniCommissionValue(value: string) {
        const sakaniCommissionValueInput = this.page.locator("//input[@formcontrolname='sakani_commission_value']");
        await sakaniCommissionValueInput.waitFor({ state: 'visible' });
        await sakaniCommissionValueInput.fill(value);
    }

    async fillTitle(title: string) {
        const titleInput = this.page.locator("//input[@formcontrolname='title']");
        await titleInput.waitFor({ state: 'visible' });
        await titleInput.fill(title);
    }

    async fillDescription(description: string) {
        const descriptionInput = this.page.locator("//input[@formcontrolname='description']");

        await descriptionInput.waitFor({ state: 'visible' });
        await descriptionInput.fill(description);
    }

    async fillDetails(details = 'Test Details') {
        const detailsInput = this.page.locator("//input[@formcontrolname='details']");

        await detailsInput.waitFor({ state: 'visible' });
        await detailsInput.fill(details);
    }

    async fillTermsAndConditions(termsText = 'Testing terms and condition for sharrai offer') {
        const termsTextarea = this.page.getByRole('region', { name: 'الشروط و الأحكام' }).locator('textarea');

        await termsTextarea.waitFor({ state: 'visible' });
        await termsTextarea.fill(termsText);
    }

    async clickDealIdentifiersTab() {
        const dealIdentifiersTab = this.page.getByRole('tab', { name: 'الرموز التعريفية للصفقة' });

        await dealIdentifiersTab.waitFor({ state: 'visible' });
        await dealIdentifiersTab.click();
    }

    async clickImportOfferCodes() {
        const importOfferCodesButton = this.page.getByRole('button', { name: 'استيراد رموز العروض' });

        await importOfferCodesButton.waitFor({ state: 'visible' });
        await importOfferCodesButton.click();
    }

    async uploadDealFile(filePath: string) {
        const fileInput = this.page.locator("//input[@type='file']");
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(filePath);
    }

    async validateTheFileImportToast() {
        const toastMessage = this.page.getByText(/استيراد/);
        await expect(toastMessage).toBeVisible();
    }

    async clickFirstProcessedCell() {
        await this.page.waitForTimeout(5000);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
        const statusCell = this.page.getByRole('cell', { name: 'تم إكمال الإجراء' }).first();
        await statusCell.waitFor({ state: 'visible' });
        await statusCell.click();
    }

    async clickApprove() {
        const approveButton = this.page.getByRole('button', { name: 'اعتماد' });

        await approveButton.waitFor({ state: 'visible' });
        await approveButton.click();
    }

    async clickConfirm() {
        const confirmButton = this.page.getByRole('button', { name: 'موافق' });

        await confirmButton.waitFor({ state: 'visible' });
        await confirmButton.click();
    }

    async clickSendImportApprovalRequest() {
        const requestText = this.page.getByText('إرسال طلب اعتماد الاستيراد');

        await requestText.waitFor({ state: 'visible' });
        await requestText.click();
    }

    async searchAndNavigateToDeal(searchText: string) {
        const searchInput = this.page.getByRole('textbox', { name: 'بحث' });
        const searchButton = this.page.getByRole('button', { name: 'بحث' });
        const resultItem = this.page.locator('div').filter({ hasText: new RegExp(`^${searchText}$`) });
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(searchText);
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await resultItem.waitFor({ state: 'visible' });
        await resultItem.click();
    }

    async clickEdit() {
        const editButton = this.page.getByRole('button', { name: 'تعديل' });
        await editButton.waitFor({ state: 'visible' });
        await editButton.click();
    }

    async selectStatusToActive(optionText: string) {
        const statusDropdown = this.page.locator('ng-select').filter({ hasText: 'اختيارغير نشط' }).getByRole('combobox');

        await statusDropdown.waitFor({ state: 'visible' });
        await statusDropdown.click();
        this.selectListOption(optionText);
    }

    async selectActiveStatusOption() {
        const activeOption = this.page.getByRole('option', { name: 'نشط', exact: true });
        await activeOption.waitFor({ state: 'visible' });
        await activeOption.click();
    }

    async clickYesOnPopUp() {
        const yesButton = this.page.getByRole('button', { name: /نعم/ });
        // Waits up to 3 seconds for the button to show up before evaluating
        if (await yesButton.isVisible({ timeout: 3000 })) {
            await yesButton.click();
        }
    }

    async verifyActiveStatusVisible() {
        const activeStatusCell = this.page.getByRole('table').getByText('نشط');
        await expect(activeStatusCell).toBeVisible();
    }

}


