import { expect, Page } from "@playwright/test";
import { TagsObjects } from '@objects/TagsObjects';

export class TagsPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async verifyAvailableSoonTag() {
        const availableSoonTag = this.page.locator(TagsObjects.availableSoonTage.xpath);
        await this.page.waitForTimeout(6000)
        await expect(availableSoonTag).toBeVisible({ timeout: 90000 });
    }

    async verifyLastUnitsRemainingTag() {
        const lastUnitsRemainingTag = this.page.locator(TagsObjects.lastUnitsRemainingTag.xpath);
        await this.page.waitForTimeout(6000)
        await expect(lastUnitsRemainingTag).toBeVisible({ timeout: 90000 });
    }
}