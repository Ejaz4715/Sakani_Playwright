import {StampManagementObjects} from '@objects/StampManagementObjects'
import {Page} from "@playwright/test";

const DEFAULT_TIMEOUT = 30_000;

export class StampManagementPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnStampManagement() {
        const stampButton = this.page.getByRole(StampManagementObjects.stampManagementButton.role, {name: StampManagementObjects.stampManagementButton.name});
        await stampButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await stampButton.click();
    }

    async clickOnViewLastStamp() {
        const lastStapmViewIcon = this.page.getByRole(StampManagementObjects.lastStampViewButton.role).nth(StampManagementObjects.lastStampViewButton.child);
        await lastStapmViewIcon.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await lastStapmViewIcon.click();
        await this.page.waitForTimeout(5000);
    }

    async isLastStampImageVisible() {
        const lastStapmViewImage = this.page.getByRole(StampManagementObjects.lastStampImage.role);
        await lastStapmViewImage.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await lastStapmViewImage.isVisible();
    }

    async closeImagePopUp() {
        const stampImagePopUp = this.page.getByRole(StampManagementObjects.imagePopUp.role, {name: StampManagementObjects.imagePopUp.name});
        await stampImagePopUp.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await stampImagePopUp.click();
    }

    async clickOnStampUpdateButton() {
        const stampImagePopUp = this.page.getByRole(StampManagementObjects.stampUpdateButton.role, {name: StampManagementObjects.stampUpdateButton.name});
        await stampImagePopUp.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await stampImagePopUp.click();
    }

    async clickOnUploadNewStamp() {
        const uploadButton = this.page.locator(StampManagementObjects.uploadAreaButton);
        await uploadButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await uploadButton.click();
    }

    async uploadNewStampImage(filePath: string) {
        const uploadButton = this.page.locator(StampManagementObjects.uploadFileSelector);
        await uploadButton.setInputFiles(filePath);
        await this.page.waitForTimeout(5000);
    }

    async clickOnAddNewStamp() {
        const uploadButton = this.page.getByRole(StampManagementObjects.newStampButton.role, {name: StampManagementObjects.newStampButton.name});
        await uploadButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await uploadButton.click();
    }

    async fillTheOtp() {
        const otpField = this.page.getByRole(StampManagementObjects.otpVerifyField.role);
        await otpField.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await otpField.fill("1234");
    }

    async clickOnVerify() {
        const otpButton = this.page.getByRole(StampManagementObjects.otpVerifyButton.role, {name: StampManagementObjects.otpVerifyButton.name});
        await otpButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await otpButton.click();
    }

    async isTheNewStampAddedSuccessfully() {
        const stampSuccessfulMessage = this.page.getByText(StampManagementObjects.stampSuccessfulMessage);
        await stampSuccessfulMessage.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await stampSuccessfulMessage.isVisible();
    }

}
