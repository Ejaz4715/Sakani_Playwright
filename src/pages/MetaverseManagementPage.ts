import {Page} from "@playwright/test";
import {MetaverseManagementObjects} from "@objects/MetaverseManagementObjects";

const DEFAULT_TIMEOUT = 30_000;

export class MetaverseManagementPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnMetaverseManagement() {
        await this.page.locator(MetaverseManagementObjects.metaverseManagementButton).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.metaverseManagementButton).click();

    }

    async clickOnMetaverseManagementAccess() {
        await this.page.locator(MetaverseManagementObjects.metaverseManagementButton).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.metaverseManagementButton).click();

        const metaverseAccess = this.page.getByRole(MetaverseManagementObjects.metaversAccessLink.role, {name: MetaverseManagementObjects.metaversAccessLink.name});
        await metaverseAccess.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await metaverseAccess.click();
    }

    async clickOnFirstActiveUser() {
        const activeUser = this.page.getByRole(MetaverseManagementObjects.firstUserRow.role, {name: MetaverseManagementObjects.firstUserRow.name}).first();
        await activeUser.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await activeUser.click();
    }

    async blockUser() {
        const blockButton = this.page.getByRole(MetaverseManagementObjects.blockButton.role, {name: MetaverseManagementObjects.blockButton.name});
        await blockButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await blockButton.click();

        const confirmButton = this.page.getByRole(MetaverseManagementObjects.confirmButton.role, {name: MetaverseManagementObjects.confirmButton.name});
        await confirmButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await confirmButton.click();
    }

    async isUserBlocked() {
        const blockingButton = this.page.getByRole(MetaverseManagementObjects.blockingCancelButton.role, {name: MetaverseManagementObjects.blockingCancelButton.name});
        await blockingButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await blockingButton.isVisible();
    }

    async isUserActive() {
        const blockingButton = this.page.getByRole(MetaverseManagementObjects.blockButton.role, {name: MetaverseManagementObjects.blockButton.name});
        await blockingButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await blockingButton.isVisible();
    }

    async clickOnSakaniMetaverse() {
        await this.page.locator(MetaverseManagementObjects.sakniMetaverseLink).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.sakniMetaverseLink).click();

    }

    async clickOnSakaniMetaverseAccessButton() {
        await this.page.locator(MetaverseManagementObjects.sakaniMetverseAccessButton).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.sakaniMetverseAccessButton).click();

    }

    async clickOnSakaniMetaverseRequests() {
        await this.page.locator(MetaverseManagementObjects.metaverseRequests).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.metaverseRequests).click();

    }

    async fillIdentityNumber(identityNumber: string) {
        await this.page.locator(MetaverseManagementObjects.identityNumberTextField).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(MetaverseManagementObjects.identityNumberTextField).fill(identityNumber);

    }

    async clickOnSearch() {
        const searchButton = this.page.getByRole(MetaverseManagementObjects.searchButton.role, {name: MetaverseManagementObjects.searchButton.name});
        await searchButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await searchButton.click();
        await this.page.waitForTimeout(3000);

    }

    async clickOnUnBlockedFromCompanyAdminView() {
        const unBlockedButton = this.page.getByText(MetaverseManagementObjects.unBlockedRadioButtonText);
        await unBlockedButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await unBlockedButton.check();
    }

    async confirmUnBlockingFromCompanyAdminView() {
        const unBlockedButton = this.page.locator(MetaverseManagementObjects.unBlockingConfirmationButton);
        await unBlockedButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await unBlockedButton.click();
        await this.page.waitForTimeout(3000);
    }

    async isSapaUserBlocked() {
        await this.page.waitForTimeout(3000);
        return await this.page.locator(MetaverseManagementObjects.userBlockingText).isVisible();
    }

    async isSapaUserBlockedFromCompanyAdminView() {
        const blockingRadioButton = this.page.getByText(MetaverseManagementObjects.blockedRadioButtonText);
        return blockingRadioButton.isChecked();
    }


}
