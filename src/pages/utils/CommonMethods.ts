import { Page } from "playwright";
export class CommonMethods {
    // private readonly page: Page;

    // constructor(page: Page) {
    //     this.page = page;
    // }

    async clickIfVisible(locator: any, options: { timeout?: number } = {}) {
        const timeout = options.timeout ?? 5000;
        const isVisible = await locator.isVisible({ timeout }).catch(() => false);
        if (isVisible) {
            await locator.click();
        }
    }
    
}