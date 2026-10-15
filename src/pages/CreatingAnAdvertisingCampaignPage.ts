import { expect, Page } from "@playwright/test";
import { DataHelper } from "@helpers/DataHelper";

type CampaignElement =
    | { readonly xpath: string }
    | {
          readonly role: Parameters<Page["getByRole"]>[0];
          readonly name: string;
          readonly exact?: boolean;
      }
    | {
          readonly text: string;
          readonly exact?: boolean;
      };
type CampaignInput =
    | { readonly xpath: string }
    | {
          readonly role: "textbox";
          readonly name: string;
          readonly exact?: boolean;
      };

export class CreatingAnAdvertisingCampaignPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickElement(elementObject: CampaignElement) {
        const element = "xpath" in elementObject
            ? this.page.locator(elementObject.xpath)
            : "role" in elementObject
              ? this.page.getByRole(elementObject.role, {
                  name: elementObject.name,
                  exact: elementObject.exact,
                })
              : this.page.getByText(elementObject.text, {
                    exact: elementObject.exact,
                });

        await element.waitFor({ state: "visible" });
        await element.click();
    }

    async verifyElementVisible(elementObject: CampaignElement) {
        const element = "xpath" in elementObject
            ? this.page.locator(elementObject.xpath)
            : "role" in elementObject
              ? this.page.getByRole(elementObject.role, {
                    name: elementObject.name,
                    exact: elementObject.exact,
                })
              : this.page.getByText(elementObject.text, {
                    exact: elementObject.exact,
                });

        await expect(element).toBeVisible();
    }

    async fillInputField(
        inputObject: CampaignInput,
        value: string | number,
    ) {
        const input = "xpath" in inputObject
            ? this.page.locator(inputObject.xpath)
            : this.page.getByRole(inputObject.role, {
                  name: inputObject.name,
                  exact: inputObject.exact,
              });
        await input.waitFor({ state: "visible" });
        await input.fill(String(value));
    }

    async selectAllInputFieldText(inputObject: { readonly xpath: string }) {
        const input = this.page.locator(inputObject.xpath);
        await input.waitFor({ state: "visible" });
        await input.press("Control+A");
    }

    async saveRequestNumber(requestNumberObject: { readonly xpath: string }) {
        const requestNumberElement = this.page.locator(requestNumberObject.xpath);
        await requestNumberElement.waitFor({ state: "visible" });
        const requestNumber = (await requestNumberElement.innerText()).trim();

        if (!requestNumber) {
            throw new Error("The request number element is empty.");
        }

        DataHelper.updateServiceData(
            "creating-an-advertising-campaign",
            "requestNumber",
            requestNumber,
        );
        
    }
}