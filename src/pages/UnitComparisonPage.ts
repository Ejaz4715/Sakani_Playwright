import { expect, Page } from "@playwright/test";
import { UnitComparisonObjects } from '@objects/UnitComparisonObjects';
import { DataHelper } from '@helpers/DataHelper';

export class UnitComparisonPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickProjectHeaderCompareButton() {
        const projectHeaderCompareButton = this.page
            .locator(UnitComparisonObjects.projectHeaderCompareButton.containerSelector)
            .getByRole(UnitComparisonObjects.projectHeaderCompareButton.role, {
                name: UnitComparisonObjects.projectHeaderCompareButton.name,
            });
        await expect(projectHeaderCompareButton).toBeVisible({ timeout: 90000 });
        await projectHeaderCompareButton.click();
    }

    async clickCompareButton() {
        const compareButton = this.page.getByRole(
            UnitComparisonObjects.compareButton.role,
            { name: UnitComparisonObjects.compareButton.name },
        );
        await expect(compareButton).toBeVisible({ timeout: 90000 });
        await compareButton.click();
    }

    async verifyComparisonHeadingIsVisible() {
        const comparisonHeading = this.page.getByRole(
            UnitComparisonObjects.comparisonHeading.role,
            { name: UnitComparisonObjects.comparisonHeading.name },
        );
        await expect(comparisonHeading).toBeVisible({ timeout: 90000 });
    }
}