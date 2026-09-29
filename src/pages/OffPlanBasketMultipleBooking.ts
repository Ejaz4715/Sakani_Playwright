// @ts-nocheck
import {ProfileManagementObjects} from '@objects/ProfileManagementObjects'
import * as timers from "node:timers";

const {Page, expect} = require("@playwright/test");

export class OffPlanBasketMultipleBookingPage {
    page: Page;
    DEFAULT_TIMEOUT = 30_000;
    constructor(page: Page) {
        this.page = page;
    }

    async clickMyActivities() {
        await this.page.locator(ProfileManagementObjects.activities).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.activities).click();

    }

    async clickOnBookings() {
        await this.page.locator(ProfileManagementObjects.bookings).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.bookings).click();
    }

    async clickOnActiveBooking() {
        await this.page.locator(ProfileManagementObjects.activeBookings).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.activeBookings).click();
    }

    async clickOnNoBilled() {
        await this.page.locator(ProfileManagementObjects.notBilledButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.notBilledButton).click();

    }

    async clickOnReadyForSign() {
        await this.page.locator(ProfileManagementObjects.readyForSignButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.readyForSignButton).click();

    }

    async getUnit1Code() {
         await this.page.locator(ProfileManagementObjects.unit1Code).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
         return this.page.locator(ProfileManagementObjects.unit1Code).textContent();
    }

    async getUnit2Code() {
        await this.page.locator(ProfileManagementObjects.unit2Code).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        return this.page.locator(ProfileManagementObjects.unit2Code).textContent();    }

    async clickOnUnit1CheckBox() {
         await this.page.locator(ProfileManagementObjects.unit1Chckbox).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
         await this.page.locator(ProfileManagementObjects.unit1Chckbox).click();
    }

    async clickOnUnit2CheckBox() {
        await this.page.locator(ProfileManagementObjects.unit2CheckBox).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.unit2CheckBox).click();    }

    async clickOnContinue() {
         await this.page.locator(ProfileManagementObjects.continueButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
         await this.page.locator(ProfileManagementObjects.continueButton).click();
    }

    async clickOnPayBills() {
        await this.page.locator(ProfileManagementObjects.payBillsButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.payBillsButton).click();

    }

    async isSuccessfulPayment() {
         await this.page.locator(ProfileManagementObjects.successfulPaymentMessage).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
         return await this.page.locator(ProfileManagementObjects.successfulPaymentMessage).isVisible();
    }

    async clickOnProjectCheckBox() {
        await this.page.locator(ProfileManagementObjects.projectCheckBox).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.projectCheckBox).click();
    }

    async clickOnAgreeOnAll() {
        await this.page.locator(ProfileManagementObjects.agreeOnAll).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.agreeOnAll).click();

    }

    async typeVerifyOtpCode() {
        await this.page.locator(ProfileManagementObjects.verifyField).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.verifyField).focus();
        await this.page.keyboard.type("1234");
    }

    async clickOnVerify() {
        await this.page.locator(ProfileManagementObjects.verifyButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.verifyButton).click();

    }

    async clickOnAllProjectUnitsToApprove() {
        await this.page.locator(ProfileManagementObjects.allProjectsRadioButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        await this.page.locator(ProfileManagementObjects.allProjectsRadioButton).click();
    }

    async isSuccessfulContractSignMessage() {
         await this.page.locator(ProfileManagementObjects.successfulContractSignMessage).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
        return await this.page.locator(ProfileManagementObjects.successfulContractSignMessage).isVisible();

    }
}