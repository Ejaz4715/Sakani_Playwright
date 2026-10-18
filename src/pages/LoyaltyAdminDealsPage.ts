import {LoyaltyAdminDealsObjects} from '@objects/LoyaltyAdminDealsObjects'
import {Locator, Page} from "@playwright/test";

const DEFAULT_TIMEOUT = 30_000;

export class LoyaltyAdminDealsPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ---------- shared helpers ----------

    private async waitVisible(locator: Locator) {
        await locator.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return locator;
    }

    private async clickWhenVisible(locator: Locator) {
        await (await this.waitVisible(locator)).click();
    }

    private async fillWhenVisible(locator: Locator, text: string) {
        await (await this.waitVisible(locator)).fill(text);
    }

    private async isShown(locator: Locator) {
        return await (await this.waitVisible(locator)).isVisible();
    }

    private async textWhenVisible(locator: Locator) {
        return (await (await this.waitVisible(locator)).innerText()).trim();
    }

    // Clicks an option of the opened dropdown list by its exact name
    private async clickDropdownOption(optionName: string) {
        await this.clickWhenVisible(this.page.getByRole(LoyaltyAdminDealsObjects.dropdownOption.role, {name: optionName, exact: true}));
    }

    // ---------- locators used by more than one step ----------

    private get deleteModal() {
        return this.page.locator(LoyaltyAdminDealsObjects.deleteModal);
    }

    private get cancelButton() {
        return this.page.getByRole(LoyaltyAdminDealsObjects.modalCancelButton.role, {name: LoyaltyAdminDealsObjects.modalCancelButton.name});
    }

    private get filterSearchTextbox() {
        return this.page.getByRole(LoyaltyAdminDealsObjects.filterSearchTextbox.role, {name: LoyaltyAdminDealsObjects.filterSearchTextbox.name});
    }

    private get filterForm() {
        return this.page.locator(LoyaltyAdminDealsObjects.filterForm);
    }

    // ---------- add / edit deal form ----------

    async selectOfficeName(officeName: string) {
        const officeNameDropdown = await this.waitVisible(this.page.locator(LoyaltyAdminDealsObjects.officeNameDropdown));
        await officeNameDropdown.click();
        await officeNameDropdown.fill(officeName);
        await this.clickDropdownOption(officeName);
    }

    async selectStatus(status: string) {
        await this.clickWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.statusDropdown));
        await this.clickDropdownOption(status);
    }

    async selectCampaignStartDate(date: Date) {
        await this.selectDateFromCalendar(LoyaltyAdminDealsObjects.campaignStartDateCalendarIcon, date);
    }

    async selectCampaignEndDate(date: Date) {
        await this.selectDateFromCalendar(LoyaltyAdminDealsObjects.campaignEndDateCalendarIcon, date);
    }

    // Opens the calendar and clicks the day, "Saturday, October 24, 2026"; if the day is not visible, clicks the previous or next month button until it is
    private async selectDateFromCalendar(calendarIconLocator: string, date: Date) {
        await this.clickWhenVisible(this.page.locator(calendarIconLocator));

        const dayName = date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
        const day = this.page.getByRole(LoyaltyAdminDealsObjects.calendarDay.role, {name: dayName});
        // past dates are in earlier months, future dates in later months
        const monthButton = date < new Date() ? LoyaltyAdminDealsObjects.calendarPreviousMonthButton : LoyaltyAdminDealsObjects.calendarNextMonthButton;
        const changeMonthButton = this.page.getByRole(monthButton.role, {name: monthButton.name});
        for (let i = 0; i < 2 && !(await day.isVisible()); i++) {
            await changeMonthButton.click();
        }
        await this.clickWhenVisible(day);
    }

    // Fills title, description and details (used when creating and when updating a deal)
    async fillDealTexts(texts: { title: string, description: string, details: string }) {
        await this.fillDealTitle(texts.title);
        await this.fillDealDescription(texts.description);
        await this.fillDealDetails(texts.details);
    }

    async fillDealTitle(title: string) {
        await this.fillWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.dealTitleField), title);
    }

    async fillDealDescription(description: string) {
        await this.fillWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.dealDescriptionField), description);
    }

    async fillDealDetails(details: string) {
        await this.fillWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.dealDetailsField), details);
    }

    async uploadDealImage(imageFilePath: string) {
        await this.uploadFile(LoyaltyAdminDealsObjects.dealImageUploadText, imageFilePath);
    }

    async uploadDealPdf(pdfFilePath: string) {
        await this.uploadFile(LoyaltyAdminDealsObjects.dealPdfUploadText, pdfFilePath);
    }

    // Selects the file in the upload box with the given text and waits until it is fully uploaded to storage, so Save sends it with the deal
    private async uploadFile(uploadBoxText: string, filePath: string) {
        const fileInput = this.page.locator(LoyaltyAdminDealsObjects.uploadFilesComponent).filter({hasText: uploadBoxText}).locator(LoyaltyAdminDealsObjects.fileInput);
        await fileInput.waitFor({state: "attached", timeout: DEFAULT_TIMEOUT});

        const uploadFinished = this.page.waitForResponse(
            response => response.url().includes(LoyaltyAdminDealsObjects.fileStorageUrl) && response.request().method() === 'PUT',
            {timeout: DEFAULT_TIMEOUT},
        );
        await fileInput.setInputFiles(filePath);
        await uploadFinished;
    }

    // ---------- deal record ----------

    async isDealCompanyHeadingVisible(companyName: string) {
        return await this.isShown(this.page.getByRole(LoyaltyAdminDealsObjects.dealCompanyHeading.role, {name: companyName}));
    }

    async getOfficeNameInRecord() {
        return await this.textWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.recordOfficeNameField));
    }

    async getStatusInRecord() {
        const statusText = await this.textWhenVisible(this.page.locator(LoyaltyAdminDealsObjects.recordStatusField));
        // "غير نشط" is checked first so an inactive deal is never read as "نشط"
        return statusText.match(/غير نشط|نشط/)?.[0] ?? statusText;
    }

    async clickBackToList() {
        await this.clickWhenVisible(this.page.getByText(LoyaltyAdminDealsObjects.backToListLink));
    }

    // ---------- deals list ----------

    // The deal's row in the list, without waiting for it (used to assert it is gone)
    getDealRow(companyName: string, price: string) {
        return this.page.getByRole(LoyaltyAdminDealsObjects.dealsListRow.role).filter({hasText: companyName}).filter({hasText: this.toListPrice(price)}).first();
    }

    // The list shows prices with a thousands separator, e.g. 4077 -> "4,077"
    toListPrice(price: string) {
        return Number(price).toLocaleString('en-US');
    }

    // Finds the deal row by company name and its unique price
    private async findDealRowInList(companyName: string, price: string) {
        return await this.waitVisible(this.getDealRow(companyName, price));
    }

    // Returns the exact text of the deal's status cell
    async getDealStatusInList(companyName: string, price: string) {
        const dealRow = await this.findDealRowInList(companyName, price);
        return (await dealRow.getByRole('cell').filter({hasText: LoyaltyAdminDealsObjects.dealStatusCell}).innerText()).trim();
    }

    // Returns all the text of the deal's row (title, description, prices, date and status)
    async getDealRowInList(companyName: string, price: string) {
        return (await (await this.findDealRowInList(companyName, price)).innerText()).trim();
    }

    async clickEditDealInList(companyName: string, price: string) {
        const dealRow = await this.findDealRowInList(companyName, price);
        await this.clickWhenVisible(dealRow.getByText(LoyaltyAdminDealsObjects.editDealInList, {exact: true}));
    }

    // All the data rows of the list (the header row has no cells)
    private async getListDataRows() {
        const rows = this.page.getByRole(LoyaltyAdminDealsObjects.dealsListRow.role).filter({has: this.page.getByRole('cell')});
        await this.waitVisible(rows.first());
        return rows;
    }

    // Company name and status of the first deal in the list (cells: id, company, title, description, prices, date, status, actions)
    async getFirstDealInList() {
        const firstRow = (await this.getListDataRows()).first();
        const companyCell = firstRow.getByRole('cell').nth(1);
        const statusCell = firstRow.getByRole('cell').filter({hasText: LoyaltyAdminDealsObjects.dealStatusCell});
        return {
            companyName: (await this.textWhenVisible(companyCell)).replace(/\s+/g, " "),
            status: await this.textWhenVisible(statusCell),
        };
    }

    // Row count once the list has finished loading (the count is the same on 3 reads in a row, 500ms apart)
    async getLoadedListRowsCount() {
        let count = await this.getListRowsCount();
        for (let sameReads = 0; sameReads < 3;) {
            await this.page.waitForTimeout(500);
            const newCount = await this.getListRowsCount();
            sameReads = newCount === count ? sameReads + 1 : 0;
            count = newCount;
        }
        return count;
    }

    async getListRowsCount() {
        return await (await this.getListDataRows()).count();
    }

    async getListRowsTexts() {
        return await (await this.getListDataRows()).allInnerTexts();
    }

    // ---------- delete ----------

    // Clicks the delete button of the deal's row, which opens the confirmation modal
    async clickDeleteDealInList(companyName: string, price: string) {
        const dealRow = await this.findDealRowInList(companyName, price);
        await dealRow.getByRole('button').click();
        await this.waitVisible(this.deleteModal);
    }

    async isDeletePopupVisible() {
        return await this.isShown(this.deleteModal);
    }

    async isCancelButtonVisibleInModal() {
        return await this.isShown(this.cancelButton);
    }

    async clickCancelInModal() {
        await this.cancelButton.click();
        await this.deleteModal.waitFor({state: "hidden", timeout: DEFAULT_TIMEOUT});
    }

    async clickRemoveInModal() {
        await this.clickWhenVisible(this.page.getByRole(LoyaltyAdminDealsObjects.modalConfirmButton.role, {name: LoyaltyAdminDealsObjects.modalConfirmButton.name}));
    }

    // ---------- filter ----------

    async fillFilterSearch(text: string) {
        await this.fillWhenVisible(this.filterSearchTextbox, text);
    }

    async selectFilterStatus(status: string) {
        await this.clickWhenVisible(this.filterForm.locator(LoyaltyAdminDealsObjects.filterDropdown).first());
        await this.clickDropdownOption(status);
    }

    async clickFilterSearch() {
        await this.page.getByRole(LoyaltyAdminDealsObjects.filterSearchButton.role, {name: LoyaltyAdminDealsObjects.filterSearchButton.name, exact: true}).click();
    }

    async clickFilterReset() {
        await this.page.getByRole(LoyaltyAdminDealsObjects.filterResetButton.role, {name: LoyaltyAdminDealsObjects.filterResetButton.name}).click();
    }

    async getFilterSearchValue() {
        return await this.filterSearchTextbox.inputValue();
    }

    // Number of values selected in the filter dropdowns (0 when the filter is empty)
    async getFilterSelectedValuesCount() {
        return await this.filterForm.locator(LoyaltyAdminDealsObjects.filterSelectedValue).count();
    }

    // ---------- expected status ----------

    // Offer status is "نشط" only when it is saved as active and today is between the start and end dates; otherwise "غير نشط"
    getExpectedStatus(startDate: Date, endDate: Date, savedStatus: string) {
        const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const today = startOfDay(new Date());
        const isRunningToday = startOfDay(startDate) <= today && today <= startOfDay(endDate);
        return savedStatus === LoyaltyAdminDealsObjects.activeStatus && isRunningToday
            ? LoyaltyAdminDealsObjects.activeStatus
            : LoyaltyAdminDealsObjects.inactiveStatus;
    }
}
