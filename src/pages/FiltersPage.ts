import { expect, Page } from "@playwright/test";
import { FiltersObjects } from '@objects/FiltersObjects';

type FilterElement =
    | { readonly xpath: string }
    | {
          readonly role: Parameters<Page["getByRole"]>[0];
          readonly name: string;
          readonly exact?: boolean;
      }
    | { readonly text: string; readonly exact?: boolean };
type CheckableFilterElement = {
    readonly xpath: string;
} | {
    readonly role: "checkbox" | "radio";
    readonly name: string;
    readonly exact?: boolean;
};

export class FiltersPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async validateElementExists(elementObject: FilterElement){
        let element;
        if ("xpath" in elementObject) {
            element = this.page.locator(elementObject.xpath);
        } else if ("role" in elementObject) {
            element = this.page.getByRole(elementObject.role, {
                name: elementObject.name,
                exact: elementObject.exact,
            });
        } else {
            element = this.page.getByText(elementObject.text, {
                exact: elementObject.exact,
            });
        }

        await expect(element.first()).toBeVisible({ timeout: 90000 });
    }

    async clickElement(elementObject: FilterElement, index = 0) {
        let element;
        if ("xpath" in elementObject) {
            element = this.page.locator(elementObject.xpath);
        } else if ("role" in elementObject) {
            element = this.page.getByRole(elementObject.role, {
                name: elementObject.name,
                exact: elementObject.exact,
            });
        } else {
            element = this.page.getByText(elementObject.text, {
                exact: elementObject.exact,
            });
        }

        const target = element.nth(index);
        await expect(target).toBeVisible({ timeout: 90000 });
        await target.click();
    }

    async verifyElementValueAttribute(
        elementObject: CheckableFilterElement,
        expectedValue: "true" | "false",
        index = 0,
    ){
        const element = ("xpath" in elementObject
            ? this.page.locator(elementObject.xpath)
            : this.page.getByRole(elementObject.role, {
                  name: elementObject.name,
                  exact: elementObject.exact,
              })
        ).nth(index);

        // await expect(element).toBeVisible({ timeout: 90000 });
        await expect(element).toHaveAttribute("value", expectedValue);
    }

    async fillInputField(
        inputObject: { readonly xpath: string },
        value: string | number,
    ) {
        const input = this.page.locator(inputObject.xpath);
        await expect(input).toBeVisible({ timeout: 90000 });
        await input.fill(String(value));
    }

    async clearInputField(inputObject: { readonly xpath: string }) {
        const input = this.page.locator(inputObject.xpath);
        await expect(input).toBeVisible({ timeout: 90000 });
        await input.fill("");
    }







    async clickOnPropertiesForSaleButton() {
        const button = this.page.getByRole(
            FiltersObjects.propertiesForSaleButton.role,
            { name: FiltersObjects.propertiesForSaleButton.name },
        );
        await expect(button).toBeVisible({ timeout: 90000 });
        await button.click();
    }

    async clickOnOffPlanSaleUnits(){
        const option = this.page.locator(FiltersObjects.offPlanSaleUnits.xpath);
        await expect(option).toBeVisible({ timeout: 90000 });
        await option.click();
    }

    async clickOnFilterResultButton() {
        const button = this.page.locator(FiltersObjects.filterResultButton.xpath);
        await expect(button).toBeVisible({ timeout: 90000 });
        await button.click();
    }

    async clickOnClearFiltersButton() {
        const button = this.page.getByRole(
            FiltersObjects.clearFiltersButton.role,
            { name: FiltersObjects.clearFiltersButton.name },
        );
        await expect(button).toBeVisible({ timeout: 90000 });
        await button.click();
    }

}