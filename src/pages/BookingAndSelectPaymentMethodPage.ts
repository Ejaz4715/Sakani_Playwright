import { expect, Page } from "@playwright/test";
import { BookingAndSelectPaymentMethodObjects } from '@objects/User/BookingAndSelectPaymentMethodObjects';
const path = require("path");


export class BookingAndSelectPaymentMethodPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
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

        await expect(payBookingFeesButton).toBeVisible({ timeout: 90000 });
        await payBookingFeesButton.click();
    }

    async clickOnApproveAndContinueIfVisible() {
        const approveAndContinueButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.approveAndcontinueButton.xpath
        );

        if (await approveAndContinueButton.isVisible().catch(() => false)) {
            await approveAndContinueButton.click();
        }
    }

    async clickOnSelectPaymentMethodButton() {
        const selectPaymentMethodButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.selectPaymentMehtButton.xpath
        );

        await expect(selectPaymentMethodButton).toBeVisible({ timeout: 90000 });
        await selectPaymentMethodButton.click();
    }

    async clickOnFlexiblePaymentRadioButton() {
        const flexiblePaymentRadioButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.flexiblePaymentRadioButton.xpath
        );

        await expect(flexiblePaymentRadioButton).toBeVisible({ timeout: 90000 });
        await flexiblePaymentRadioButton.click();
    }

    async clickOnSaveAndContinueButton() {
        const saveAndContinueButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.saveAndContinueButton.xpath
        );

        await expect(saveAndContinueButton).toBeVisible({ timeout: 90000 });
        await saveAndContinueButton.click();
    }

    async clickOnSignContractButton() {
        const signContractButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.signContractButton.xpath
        );

        await expect(signContractButton).toBeVisible({ timeout: 90000 });
        await signContractButton.click();
    }

    async clickOnBookingDetailsButton() {
        const bookingDetailsButton = this.page.locator(
            BookingAndSelectPaymentMethodObjects.bookingDetailsButton.xpath
        );

        await expect(bookingDetailsButton).toBeVisible({ timeout: 90000 });
        await bookingDetailsButton.click();
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