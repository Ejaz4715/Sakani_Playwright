import {Page} from "@playwright/test";
import {UnitsDeliveryObjects} from "@objects/UnitsDeliveryObjects";
import page from "playwright/test";

let DEFAULT_TIMEOUT = 30_000;

export class UnitsDeliveryPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnUnitsDelivery() {
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryLink.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryLink.xpath).click();
    }

    async clickOnStartForPreparingUnitDelivery() {
        await this.page.locator(UnitsDeliveryObjects.startForPreparingUnitsForDelivery.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.startForPreparingUnitsForDelivery.xpath).click();
    }

    async clickOnStartForReadyUnitDelivery() {
        await this.page.locator(UnitsDeliveryObjects.startForReadyUnitsForDelivery.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.startForReadyUnitsForDelivery.xpath).click();
    }

    async selectSearchingUsingProjectName() {
        await this.page.locator(UnitsDeliveryObjects.searchDropdownMenu.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.searchDropdownMenu.xpath).click();

        await this.page.locator(UnitsDeliveryObjects.projectNameSelectorForSearch.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.projectNameSelectorForSearch.xpath).click();
    }

    async selectSearchingUsingUnitCode() {
        await this.page.locator(UnitsDeliveryObjects.searchDropdownMenu.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.searchDropdownMenu.xpath).click();

        await this.page.locator(UnitsDeliveryObjects.unitCodeSelectorForSearch.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitCodeSelectorForSearch.xpath).click();
        await this.page.waitForTimeout(3000);
    }

    async fillProjectName(projectName: string) {
        await this.page.locator(UnitsDeliveryObjects.projectNameTextField.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.projectNameTextField.xpath).fill(projectName);

        await this.page.waitForTimeout(3000);
        await this.page.locator(UnitsDeliveryObjects.projectNameDropdownOption.xpath).click();
        await this.page.waitForTimeout(3000);
    }

    async fillUnitCode(unitCode: string) {
        await this.page.locator(UnitsDeliveryObjects.unitCodeTextField.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitCodeTextField.css).fill(unitCode);
        await this.page.waitForTimeout(3000);
    }

    async clickOnSearch() {
        await this.page.locator(UnitsDeliveryObjects.searchButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.searchButton.xpath).click();
    }

    async clickOnSelectProject() {
        await this.page.locator(UnitsDeliveryObjects.selectProjectButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.selectProjectButton.xpath).click();
    }

    async clickOnSelectUnit() {
        await this.page.locator(UnitsDeliveryObjects.selectUnitButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.selectUnitButton.xpath).click();
    }

    async clickOnReadyForDelivery() {
        await this.page.locator(UnitsDeliveryObjects.readyForDeliveryCheckbox.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.waitForTimeout(3000);
        await this.page.locator(UnitsDeliveryObjects.readyForDeliveryCheckbox.css).click();
    }

    async selectDeliveryDate() {
        await this.page.locator(UnitsDeliveryObjects.calendarIcon.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.calendarIcon.css).click();

        await this.page.waitForTimeout(3000);
        await this.page.locator(UnitsDeliveryObjects.visibleAllowedDataLocator.css).first().waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });

        await this.page.locator(UnitsDeliveryObjects.visibleAllowedDataLocator.css).first().click();
    }

    async selectDeliveryTime() {
        await this.page.locator(UnitsDeliveryObjects.timeDropdownMenu.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.timeDropdownMenu.xpath).click();

        await this.page.locator(UnitsDeliveryObjects.firstAvailableDeliveryTime.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });

        await this.page.locator(UnitsDeliveryObjects.firstAvailableDeliveryTime.css).click();
    }

    async clickOnSend() {
        await this.page.locator(UnitsDeliveryObjects.sendButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.sendButton.xpath).click();
    }

    async isUnitReadyForDelivery() {
        await this.page.locator(UnitsDeliveryObjects.deliveryReadinessSuccessfulMessage.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        return await this.page.locator(UnitsDeliveryObjects.deliveryReadinessSuccessfulMessage.xpath).isVisible();
    }

    async sendToCustomerForDelivery() {
        await this.page.locator(UnitsDeliveryObjects.unitCheckBox.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitCheckBox.css).click();
        await this.page.locator(UnitsDeliveryObjects.sendAllMarkedUnitsButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.sendAllMarkedUnitsButton.xpath).click();
        await this.page.locator(UnitsDeliveryObjects.agreePopUpButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.agreePopUpButton.xpath).click();
    }

    async isUnitDelivered() {
        await this.page.locator(UnitsDeliveryObjects.deliverySuccessMessage.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        return await this.page.locator(UnitsDeliveryObjects.deliverySuccessMessage.xpath).isVisible();
    }

    async clickOnUnitDeliveryFromSakani() {
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryLinkFromSakani.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryLinkFromSakani.xpath).click();
    }

    async clickUnitDeliveryConfirmationFromSakani() {
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryConfirmationFromSakani.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.unitDeliveryConfirmationFromSakani.xpath).click();
    }

    async clickOnPendingUnitsForDelivery() {
        await this.page.locator(UnitsDeliveryObjects.pendingUnitDelivery.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.pendingUnitDelivery.xpath).click();
    }

    async clickOnShowDeliveryUnitModel() {
        await this.page.locator(UnitsDeliveryObjects.showDeliveryUnitModelButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.showDeliveryUnitModelButton.xpath).click();
    }

    async agreeOnUnitDeliveryState() {
        await this.page.locator(UnitsDeliveryObjects.agreeCheckbox.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.agreeCheckbox.xpath).click();
        await this.page.locator(UnitsDeliveryObjects.continueButton.xpath).click();

    }

    async agreeOnUnitDelivery() {
        await this.page.locator(UnitsDeliveryObjects.agreeOnDeliveryUnit.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.agreeOnDeliveryUnit.xpath).click();

        await this.page.locator(UnitsDeliveryObjects.continueButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.continueButton.xpath).click();

    }

    async agreeOnTermsAndConditions() {
        await this.page.locator(UnitsDeliveryObjects.termsAndConditionsCheckbox.css).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.termsAndConditionsCheckbox.css).click();
    }

    async typeVerifyOtpCode() {
        const otpInputs = this.page.locator(UnitsDeliveryObjects.verifyField.xpath);
        const inputsArray = await otpInputs.all();
        const otpCode = "1234";

        for (let i = 0; i < inputsArray.length; i++) {
            const character = otpCode[i];
            await inputsArray[i].fill(character);
        }
        await this.page.waitForTimeout(5000);
    }

    async clickOnVerify() {
        await this.page.locator(UnitsDeliveryObjects.verifyButton.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(UnitsDeliveryObjects.verifyButton.xpath).click();
    }

    async isUnitDeliveredAndAcceptedFromSakani() {
        await this.page.locator(UnitsDeliveryObjects.unitDeliverySuccessMessage.xpath).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        return await this.page.locator(UnitsDeliveryObjects.unitDeliverySuccessMessage.xpath).isVisible();
    }

}