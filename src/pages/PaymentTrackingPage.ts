import { expect, Page } from "@playwright/test";
import { PaymentTrackingObjects } from '@objects/PaymentTrackingObjects';

export class PaymentTrackingPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOnPaymentTrackingTab() {
        const paymentTrackingTab = this.page.locator(
            PaymentTrackingObjects.paymntTrackingTab.xpath
        );

        await expect(paymentTrackingTab).toBeVisible({ timeout: 90000 });
        await paymentTrackingTab.click();
    }

    async fillUnitCode(unitCodeNew: string) {
        const unitCodeInputfield = this.page.locator(
            PaymentTrackingObjects.unitCodeInputfield.xpath
        );

        await expect(unitCodeInputfield).toBeVisible({ timeout: 90000 });
        await unitCodeInputfield.fill(unitCodeNew);
    }

    async fillSearchUnit(unitCodeNew: string) {
        const searchUnitInputfield = this.page.locator(
            PaymentTrackingObjects.searchUnitInputfield.xpath
        );

        await expect(searchUnitInputfield).toBeVisible({ timeout: 90000 });
        await searchUnitInputfield.fill(unitCodeNew);
    }

    async clickOnSearchButton() {
        const searchButton = this.page.locator(
            PaymentTrackingObjects.searchButton.xpath
        );

        await expect(searchButton).toBeVisible({ timeout: 90000 });
        await searchButton.click();
    }

    async clickOnSearchedUnit() {
        const searchedUnit = this.page.locator(
            PaymentTrackingObjects.searchedUnit.xpath
        );

        await expect(searchedUnit).toBeVisible({ timeout: 90000 });
        await searchedUnit.click();
    }

    async clickOnBeneficiariesSideMenu() {
        const beneficiariesSideMenu = this.page.locator(
            PaymentTrackingObjects.beneficiariesSideMenu.xpath
        );

        await expect(beneficiariesSideMenu).toBeVisible({ timeout: 90000 });
        await beneficiariesSideMenu.click();
    }

    async clickOnBeneficiariesListSideMenu() {
        const beneficiariesListSideMenu = this.page.locator(
            PaymentTrackingObjects.beneficiariesListSideMenu.xpath
        );

        await expect(beneficiariesListSideMenu).toBeVisible({ timeout: 90000 });
        await beneficiariesListSideMenu.click();
    }

    async clickOnSearchButtonForUnit() {
        const searchButtonForUnit = this.page.locator(
            PaymentTrackingObjects.searchButtonForUnit.xpath
        );

        await expect(searchButtonForUnit).toBeVisible({ timeout: 90000 });
        await searchButtonForUnit.click();
    }

    async clickOnSearchResult() {
        const searchedResult = this.page.locator(
            PaymentTrackingObjects.searchedresult.xpath
        );

        await this.page.waitForTimeout(7000);
        await expect(searchedResult).toBeVisible({ timeout: 120000 });
        await searchedResult.click();
    }

    async clickOnBookingDetailsTab() {
        const bookingDetailsTab = this.page.locator(
            PaymentTrackingObjects.bookingDetailsTab.xpath
        );

        await expect(bookingDetailsTab).toBeVisible({ timeout: 90000 });
        await bookingDetailsTab.click();
    }

    async waitForCompletionPercentageVisible() {
        const completionPercentage = this.page.locator(
            PaymentTrackingObjects.competionPercentage.xpath
        );

        await expect(completionPercentage).toBeVisible({ timeout: 90000 });
    }

    async waitForSpecifiedPeriodVisible() {
        const specifiedPeriod = this.page.locator(
            PaymentTrackingObjects.specifiedPeriod.xpath
        );

        await expect(specifiedPeriod).toBeVisible({ timeout: 90000 });
    }

    async selectSearchByOption() {
        const searchByDropdownList = this.page.locator(
            PaymentTrackingObjects.searchByDropdownList.xpath
        );
        const searchedOption = this.page.getByRole(
            PaymentTrackingObjects.searchedOption.role,
            { name: PaymentTrackingObjects.searchedOption.name }
        );

        await expect(searchByDropdownList).toBeVisible({ timeout: 90000 });
        await searchByDropdownList.click();
        await expect(searchedOption).toBeVisible({ timeout: 90000 });
        await searchedOption.click();
    }
}