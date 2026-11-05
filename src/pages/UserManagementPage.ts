import { Page } from "@playwright/test";
import { CommonMethods } from '@pages/utils/CommonMethods';
import { UserManagementObjects } from "@objects/UserManagementObjects";

export class UserManagementPage {
    page: Page;
    readonly commonMethod: CommonMethods;

    constructor(page: Page) {
        this.page = page;
        this.commonMethod = new CommonMethods(page);

    }

    async clickUserManagementLink() {
        const link = this.page.getByRole(
            UserManagementObjects.userManagementLink.role,
            { name: UserManagementObjects.userManagementLink.name },
        );
        await link.waitFor({ state: "visible" });
        await link.click();
    }

    async clickSearchButton() {
        const button = this.page.getByRole(
            UserManagementObjects.searchButton.role,
            { name: UserManagementObjects.searchButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }
    async clickDeleteIconButton(userId: string) {
        await this.page.waitForTimeout(5000);
        const userRow = this.page
            .locator("datatable-body-row")
            .filter({ has: this.page.getByText(userId, { exact: true }) });
        const button = userRow.locator(
            UserManagementObjects.deleteIconButton.xpath,
        );

        if (await button.isVisible()) {
            await button.click();
        }
    }
     async clickPermissionEditButton(userId: string) {
        await this.page.waitForTimeout(5000);
        const userRow = this.page
            .locator("datatable-body-row")
            .filter({ has: this.page.getByText(userId, { exact: true }) });
        const button = userRow.locator(
            UserManagementObjects.permissionEditButton.xpath,
        );

        if (await button.isVisible()) {
            await button.click();
        }
    }
     async clickOnAcceptButton() {
        await this.commonMethod.clickElement(UserManagementObjects.acceptButton);
    }
    async verifyUserDeletedMessageIsPresent() {
        await this.commonMethod.verifyElementVisible(UserManagementObjects.userDeletedMessage);
    }
    async verifyBookingsPermissionIsNotVisible() {
        await this.commonMethod.verifyElementNotVisible(UserManagementObjects.bookingsPermission);
    }
    async verifyBookingsPermissionIsVisible() {
        await this.commonMethod.verifyElementVisible(UserManagementObjects.bookingsPermission);
    }
     async clickOnMainPermissionsDropdownButton() {
        await this.commonMethod.clickElement(UserManagementObjects.mainPermissionsDropdownButton);
    }
     async switchOnBookingsManagementPermissionSwitchButton() {
        await this.commonMethod.clickElement(UserManagementObjects.bookingsManagementPermissionSwitchButton);
    }
    async clickOnIndividualRadioButton() {
        await this.commonMethod.clickElement(UserManagementObjects.individualRadioButton);
    }
    async clickOnContinueButton() {
        await this.commonMethod.clickElement(UserManagementObjects.continueButton);
    }
    async clickOnCompanyRepresentativeRadioButton() {
        await this.commonMethod.clickElement(UserManagementObjects.companyRepresentativeRadioButton);
    }
    async enterCompanyCrNumber(crNumber: string) {
        await this.commonMethod.fill(UserManagementObjects.crNumberInputfield, crNumber);
        await this.commonMethod.press(UserManagementObjects.crNumberInputfield, "Enter");
    }
    async enterUserId(userId: string) {
        await this.commonMethod.fill(UserManagementObjects.idNumberInputfield, userId);
    }
    async enterEmail(email: string) {
        await this.commonMethod.fill(UserManagementObjects.emailInputfield, email);
    }
    async enterPhoneNumber(phoneNumber: string) {
        await this.commonMethod.fill(UserManagementObjects.phoneNumberInputfield, phoneNumber);
    }
    async checkOnTermsAndConditions() {
        await this.commonMethod.clickElement(UserManagementObjects.termsAndConditionsCheckbox);
    }
    async clickOnRegisterButton() {
        await this.commonMethod.clickElement(UserManagementObjects.registerButton);
    }
    async clickOnGoToDashboardButton() {
        await this.commonMethod.clickElement(UserManagementObjects.goToDashboardButton);
    }
    async verifyUserFailedToLoginMessageIsPresent() {
        await this.commonMethod.verifyElementVisible(UserManagementObjects.failToLoginMessage);
    }
    async selectSearchBy() {
        await this.commonMethod.clickElement(UserManagementObjects.usersFilter);
        await this.commonMethod.clickElement(UserManagementObjects.iDNumberOption);
    }
    async enterUserIdPartners(userId: string) {
        await this.commonMethod.fill(UserManagementObjects.idNumberInputfieldPartners, userId);
    }
     async activateTheUser() {
        await this.commonMethod.clickElement(UserManagementObjects.statusDropDownList);
        await this.commonMethod.clickElement(UserManagementObjects.statusOption);
    }
    async verifySuccessActivationMessageIsPresent() {
        await this.commonMethod.verifyElementVisible(UserManagementObjects.successActivationMessage);
    }
}