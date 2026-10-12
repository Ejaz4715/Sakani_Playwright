import { expect, Page } from "@playwright/test";
import { SortingObjects } from '@objects/SortingObjects';

export class SortingPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async getFirstFiveProjectNames(): Promise<string[]> {
        const projectNames = this.page.locator(SortingObjects.projectsNames.xpath);
        await expect(projectNames.nth(4)).toBeVisible({ timeout: 90000 });

        const names = await projectNames.allTextContents();
        return names.slice(0, 5).map((name) => name.trim());
    }

    async verifyProjectNamesChanged(previousProjectNames: string[]): Promise<void> {
        await expect.poll(
            () => this.getFirstFiveProjectNames(),
            { timeout: 90000 },
        ).not.toEqual(previousProjectNames);
    }

    async clickOnSortingBasedOnButton() {
        const sortingButton = this.page.locator(SortingObjects.sortingBasedOnButton.xpath);
        await expect(sortingButton).toBeVisible({ timeout: 90000 });
        await sortingButton.click();
    }

    async clickOnRecommendedOption() {
        const recommendedOption = this.page.getByText(
            SortingObjects.recommendedOption.text
        );
        await expect(recommendedOption).toBeVisible({ timeout: 90000 });
        await recommendedOption.click();
    }

    async clickOnMostPopularOption(){
        const mostPopularOption = this.page.getByText(
            SortingObjects.mostPopularOption.text
        );
        await expect(mostPopularOption).toBeVisible({ timeout: 90000 });
        await mostPopularOption.click();
    }

    async clickOnNewestFirstOption() {
       const newestFirstOption = this.page.getByText(
            SortingObjects.newestFirstOption.text
        );
        await expect(newestFirstOption).toBeVisible({ timeout: 90000 });
        await newestFirstOption.click();
    }

    async clickOnOldestFirstOption() {
        const oldestFirstOption = this.page.getByText(
            SortingObjects.oldestFirstOption.text
        );
        await expect(oldestFirstOption).toBeVisible({ timeout: 90000 });
        await oldestFirstOption.click();
    }

    async clickOnPriceHighToLowOption() {
         const priceHighToLowOption = this.page.getByText(
            SortingObjects.priceHighToLowOption.text
        );
        await expect(priceHighToLowOption).toBeVisible({ timeout: 90000 });
        await priceHighToLowOption.click();
    }

    async clickOnPriceLowToHighOption() {
       const priceLowToHighOption = this.page.getByText(
            SortingObjects.priceLowToHighOption.text
        );
        await expect(priceLowToHighOption).toBeVisible({ timeout: 90000 });
        await priceLowToHighOption.click();
    }
}