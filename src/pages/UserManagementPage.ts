import { Page } from "@playwright/test";
import { UserManagementObjects } from "@objects/UserManagementObjects";

export class UserManagementPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
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
}