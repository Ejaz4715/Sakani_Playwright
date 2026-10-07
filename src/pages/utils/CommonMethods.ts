import { Page } from "playwright";
export class CommonMethods {

    /**
* Clicks on a locator if it is visible.
* @param locator The locator to click.
* @param options Timeout options.
*/
    async clickIfVisible(locator: any, options: { timeout?: number } = {}) {
        const timeout = options.timeout ?? 5000;
        const isVisible = await locator.isVisible({ timeout }).catch(() => false);
        if (isVisible) {
            await locator.click();
        }
    }
}