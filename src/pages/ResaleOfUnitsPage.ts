import { expect, Page } from "@playwright/test";
import { ResaleOfUnitsObjects } from '@objects/ResaleOfUnitsObjects';



export class ResaleOfUnitsPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOnResaleSettingTab() {
        const resaleSettingsTab = this.page.getByText(
            ResaleOfUnitsObjects.resaleSettingTab.text
        )
        await expect(resaleSettingsTab).toBeVisible({ timeout: 90000 });
        await resaleSettingsTab.click();
    }

    async clickOnuseGeneralResaleSettingsSwitch() {
        const useGeneralResaleSettingsSwitch = this.page.getByRole(
            ResaleOfUnitsObjects.useGeneralResaleSettingsSwitch.role, {
            name: ResaleOfUnitsObjects.useGeneralResaleSettingsSwitch.name
        }
        );

        await expect(useGeneralResaleSettingsSwitch).toBeVisible({ timeout: 90000 });
        await useGeneralResaleSettingsSwitch.click();
    }

    async selectResaleFeeType() {
        const resaleFeeTypeDropdownList = this.page.locator(
            ResaleOfUnitsObjects.resaleFeeTypeDropdownList.xpath
        );
        const resaleFeeTypeOption = this.page.getByRole(
            ResaleOfUnitsObjects.resaleTypeOption.role, {
            name: ResaleOfUnitsObjects.resaleTypeOption.name
        }
        );
        await expect(resaleFeeTypeDropdownList).toBeVisible({ timeout: 90000 });
        await resaleFeeTypeDropdownList.click();

        await expect(resaleFeeTypeOption).toBeVisible({ timeout: 90000 });
        await resaleFeeTypeOption.click();

    }

    async fillResaleFeeValue(value: number) {
        const resaleFeeValueInputfield = this.page.locator(
            ResaleOfUnitsObjects.resaleFeeValueInputfield.xpath
        );

        await expect(resaleFeeValueInputfield).toBeVisible({ timeout: 90000 });
        await resaleFeeValueInputfield.fill(String(value));
    }
    async clickOnSaveButton() {
        const saveButton = this.page.getByRole(
            ResaleOfUnitsObjects.saveButton.role, {
            name: ResaleOfUnitsObjects.saveButton.name
        }

        );
        await expect(saveButton).toBeVisible({ timeout: 90000 });
        await saveButton.click();
    }
    async verifyTheToastMessage(){
        const toastMessage = this.page.getByText(
            ResaleOfUnitsObjects.toastMessage.text
        )
         await expect(toastMessage).toBeVisible({ timeout: 120000 });
    }
}