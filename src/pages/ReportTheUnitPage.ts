import { expect, Page } from "@playwright/test";
import { ReportTheUnitObjects } from '@objects/ReportTheUnitObjects';

export class ReportTheUnitPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async selectRentalProperty() {
        const marketPlaceDropdownList = this.page
            .locator(ReportTheUnitObjects.marketPlaceDropdownList.xpath)
        await expect(marketPlaceDropdownList).toBeVisible({ timeout: 90000 });
        await marketPlaceDropdownList.click();

        const rentalPurposeOption = this.page
            .locator(ReportTheUnitObjects.rentalPurposeOption.xpath)
        await expect(rentalPurposeOption).toBeVisible({ timeout: 90000 });
        await rentalPurposeOption.click();
    }

    async openFirstMarketUnit(): Promise<Page> {
        const popupPromise = this.page.waitForEvent('popup');
        const firstMarketUnit = this.page
            .locator(ReportTheUnitObjects.marketUnitCard)
            .first();
        await expect(firstMarketUnit).toBeVisible({ timeout: 90000 });
        await firstMarketUnit.click();
        return popupPromise;
    }

    async clickReportUnitLink() {
        const reportUnitLink = this.page.getByText(
            ReportTheUnitObjects.reportUnitLink,
            { exact: true },
        );
        await expect(reportUnitLink).toBeVisible({ timeout: 90000 });
        await reportUnitLink.click();
    }

    async selectReportCategory() {
        const reportCategoryDropdown = this.page.getByRole(
            ReportTheUnitObjects.reportCategoryDropdown.role,
        );
        await expect(reportCategoryDropdown).toBeVisible({ timeout: 90000 });
        await reportCategoryDropdown.selectOption(
            ReportTheUnitObjects.reportCategoryDropdown.value,
        );
    }

    async selectIncorrectPropertyPriceReason() {
        const incorrectPropertyPriceOption = this.page.getByRole(
            ReportTheUnitObjects.incorrectPropertyPriceOption.role,
            { name: ReportTheUnitObjects.incorrectPropertyPriceOption.name },
        );
        await expect(incorrectPropertyPriceOption).toBeVisible({ timeout: 90000 });
        await incorrectPropertyPriceOption.check();
    }

    async clickSubmitButton() {
        const submitButton = this.page.getByRole(
            ReportTheUnitObjects.submitButton.role,
            { name: ReportTheUnitObjects.submitButton.name },
        );
        await expect(submitButton).toBeVisible({ timeout: 90000 });
        await submitButton.click();
    }

    async verifyReportSubmittedSuccessfully() {
        const successHeading = this.page.getByRole(
            ReportTheUnitObjects.successHeading.role,
            { name: ReportTheUnitObjects.successHeading.name },
        );
        await expect(successHeading).toBeVisible({ timeout: 90000 });
    }
}