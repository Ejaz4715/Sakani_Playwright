import { expect, Page } from "@playwright/test";
import { PublishUnitObjects } from '@objects/PublishUnitObjects';
import { DeveloperObjects } from '@objects/DeveloperObjects'

export class PublishUnitPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

async switchRoleToDeveloperBroker() {
    const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
    await expect(profileIcon).toBeVisible({ timeout: 90000 });
    await profileIcon.click();

    const switchRoleButton = this.page.getByRole(
      DeveloperObjects.switchRoleButton.role,
      { name: DeveloperObjects.switchRoleButton.name },
    );
    await expect(switchRoleButton).toBeVisible({ timeout: 90000 });
    await switchRoleButton.click();

    const developerBrokerRole = this.page.getByText(
      PublishUnitObjects.developerBrokerRoleText,
    );
    await expect(developerBrokerRole).toBeVisible({ timeout: 90000 });
    await developerBrokerRole.click();
    await this.page.waitForTimeout(3000); // Wait for 3 seconds to ensure the page is fully loaded
    // const cancelButton = this.page.getByRole("button", { name: "إلغاء" });
    // await expect(cancelButton).toBeVisible({ timeout: 90000 });
    // await cancelButton.first().click();
  }



}