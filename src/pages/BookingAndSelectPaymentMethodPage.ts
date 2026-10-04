import { expect, Page } from "@playwright/test";
import { BookingAndSelectPaymentMethodObjects } from '@objects/BookingAndSelectPaymentMethodObjects';

export class BookingAndSelectPaymentMethodPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    private async clickVisibleButton(locator: any) {
        await locator.scrollIntoViewIfNeeded().catch(() => {});
        await expect(locator).toBeVisible({ timeout: 90000 });
        await locator.click({ force: true });
    }

    async checkOnTermAndCondition() {
        const termsCheckbox = this.page.locator(
            BookingAndSelectPaymentMethodObjects.termsCheckbox.xpath
        );

        await expect(termsCheckbox).toBeVisible({ timeout: 90000 });
        await termsCheckbox.click();
    }

    async clickOnPayBookingFeesButton() {
        const payBookingFeesButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.payBookingFeesButton.xpath
        );
        await this.page.waitForTimeout(2000); // Wait for 5 seconds before checking visibility
        await this.clickVisibleButton(payBookingFeesButton);
    }

    async clickOnApproveAndContinueIfVisible() {
        const approveAndContinueButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.approveAndcontinueButton.xpath
        );

        await this.page.waitForTimeout(4000); // Wait for 5 seconds before checking visibility
        if (await approveAndContinueButton.isVisible().catch(() => false)) {
            await this.clickVisibleButton(approveAndContinueButton);
        }
    }

    async clickOnSelectPaymentMethodButton() {
        const selectPaymentMethodButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.selectPaymentMehtButton.xpath
        );

        await this.clickVisibleButton(selectPaymentMethodButton);
    }

    async clickOnFlexiblePaymentRadioButton() {
        const flexiblePaymentRadioButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.flexiblePaymentRadioButton.xpath
        );

        await this.clickVisibleButton(flexiblePaymentRadioButton);
    }

    async clickOnSaveAndContinueButton() {
        const saveAndContinueButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.saveAndContinueButton.xpath
        );

        await this.page.waitForTimeout(5000); // Wait for 5 seconds before checking visibility
        await expect(saveAndContinueButton).toBeVisible({ timeout: 90000 });
        await saveAndContinueButton.click();
    }

    async clickOnSignContractButton() {
        const signContractButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.signContractButton.xpath
        );

        await this.clickVisibleButton(signContractButton);
    }

    async clickOnBookingDetailsButton() {
        const bookingDetailsButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.bookingDetailsButton.xpath
        );

        await this.clickVisibleButton(bookingDetailsButton);
    }

    async getUnitCode(): Promise<string> {
        const unitCodeHeading = this.page.locator(
            BookingAndSelectPaymentMethodObjects.unitCode.xpath
        );

        await expect(unitCodeHeading).toBeVisible({ timeout: 90000 });
        const headingText = await unitCodeHeading.innerText();
        const unitCodeMatch = headingText.match(/(\d+(?:\s*-\s*\d+)+)\s*$/);

        if (!unitCodeMatch) {
            throw new Error(`Could not extract unit code from: ${headingText}`);
        }
        return unitCodeMatch[1].replace(/\s+/g, "");
    }
}