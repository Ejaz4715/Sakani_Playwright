import { expect, Page } from "@playwright/test";
import { PublishUnitObjects } from '@objects/PublishUnitObjects';
import { DeveloperObjects } from '@objects/DeveloperObjects'
import { DataHelper } from '@helpers/DataHelper';

export class PublishUnitPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOnServicesLink() {
        const servicesLink = this.page.getByRole(
            PublishUnitObjects.servicesLink.role,
            { name: PublishUnitObjects.servicesLink.name },
        );
        await expect(servicesLink).toBeVisible({ timeout: 90000 });
        await servicesLink.click();
    }
    async clickOnManagePublishButton() {
        const managePublishButton = this.page.getByRole(
            PublishUnitObjects.managePublishButton.role,
            { name: PublishUnitObjects.managePublishButton.name },
        );
        await expect(managePublishButton).toBeVisible({ timeout: 90000 });
        await managePublishButton.click();
    }

    async clickOnPublishTab() {
        const publishTab = this.page.getByRole(
            PublishUnitObjects.publishTab.role,
            { name: PublishUnitObjects.publishTab.name },
        );
        await expect(publishTab).toBeVisible({ timeout: 90000 });
        await publishTab.click();
    }

    async clickOnStartButton() {
        const startButton = this.page.getByRole(
            PublishUnitObjects.startButton.role,
            { name: PublishUnitObjects.startButton.name },
        );
        await expect(startButton).toBeVisible({ timeout: 90000 });
        await startButton.click();
    }

    async clickOnSingleUnitOption() {
        const singleUnitOption = this.page
            .locator("label")
            .filter({ hasText: PublishUnitObjects.singleUnitOption.name });
        await expect(singleUnitOption).toBeVisible({ timeout: 90000 });
        await singleUnitOption.click();
    }

    async clickOnNextButton() {
        const nextButton = this.page.getByRole(
            PublishUnitObjects.nextButton.role,
            { name: PublishUnitObjects.nextButton.name },
        );
        await expect(nextButton).toBeVisible({ timeout: 90000 });
        await nextButton.click();
    }

    async clickOnContinueButton() {
        const continueButton = this.page.getByRole(
            PublishUnitObjects.continueButton.role,
            { name: PublishUnitObjects.continueButton.name },
        );
        await expect(continueButton).toBeVisible({ timeout: 90000 });
        await continueButton.click();
    }

    async fillAdLicenseNumberInputfield(value: string | number) {
        const adLicenseNumber = String(value);
        if (!/^\d+$/.test(adLicenseNumber)) {
            throw new Error("Ad license number must contain digits only.");
        }
        const adLicenseNumberInputfield = this.page.locator(
            PublishUnitObjects.adLicenseNumberInputfield.xpath,
        );
        await expect(adLicenseNumberInputfield).toBeVisible({ timeout: 90000 });
        await adLicenseNumberInputfield.fill(adLicenseNumber);
        await expect(adLicenseNumberInputfield).toHaveValue(adLicenseNumber);
    }

    async selectAdvertiserIdType() {
        const advertiserIdTypeDropdown = this.page.locator(
            PublishUnitObjects.advertiserIdTypeDropdownList.xpath,
        );
        await expect(advertiserIdTypeDropdown).toBeVisible({ timeout: 90000 });
        await advertiserIdTypeDropdown.click();

        const advertiserIdTypeOption = this.page.getByRole(
            PublishUnitObjects.advertiserIdTypeOption.role,
            { name: PublishUnitObjects.advertiserIdTypeOption.name },
        );
        await expect(advertiserIdTypeOption).toBeVisible({ timeout: 90000 });
        await advertiserIdTypeOption.click();
    }

    async fillAdvertiserIdNumberInputfield(value: string | number) {
        const advertiserIdNumber = String(value);
        if (!/^\d+$/.test(advertiserIdNumber)) {
            throw new Error("Advertiser ID number must contain digits only.");
        }

        const advertiserIdNumberInputfield = this.page.locator(
            PublishUnitObjects.advertiserIdNumberInputfield.xpath,
        );
        await expect(advertiserIdNumberInputfield).toBeVisible({ timeout: 90000 });
        await advertiserIdNumberInputfield.fill(advertiserIdNumber);
        await expect(advertiserIdNumberInputfield).toHaveValue(advertiserIdNumber);
    }

    async fillHeightInputfield(value: string | number) {
        const height = String(value);
        if (!/^\d+(\.\d+)?$/.test(height)) {
            throw new Error("Height must be a valid numeric value.");
        }

        const heightInputfield = this.page.locator(
            PublishUnitObjects.heightInputfield.xpath,
        );
        await expect(heightInputfield).toBeVisible({ timeout: 90000 });
        await heightInputfield.fill(height);
        await expect(heightInputfield).toHaveValue(height);
    }

    async fillWidthInputfield(value: string | number) {
        const width = String(value);
        if (!/^\d+(\.\d+)?$/.test(width)) {
            throw new Error("Width must be a valid numeric value.");
        }

        const widthInputfield = this.page.locator(
            PublishUnitObjects.widthInputfield.xpath,
        );
        await expect(widthInputfield).toBeVisible({ timeout: 90000 });
        await widthInputfield.fill(width);
        await expect(widthInputfield).toHaveValue(width);
    }

    async fillDescriptionTextarea(value: string) {
        const descriptionTextarea = this.page.locator(
            PublishUnitObjects.descriptionTextarea.xpath,
        );
        await expect(descriptionTextarea).toBeVisible({ timeout: 90000 });
        await descriptionTextarea.fill(value);
        await expect(descriptionTextarea).toHaveValue(value);
    }

    async uploadExteriorPhoto(filePath: string) {
        const exteriorPhotoInputfield = this.page.locator(
            PublishUnitObjects.exteriorPhotoInputfield.xpath,
        );
        await exteriorPhotoInputfield.setInputFiles(filePath);
    }

    async uploadInteriorPhoto(filePath: string) {
        const interiorPhotoInputfield = this.page.locator(
            PublishUnitObjects.interiorPhotoInputfield.xpath,
        );
        await interiorPhotoInputfield.setInputFiles(filePath);
    }

    async clickOnDataAccuracyDisclaimerCheckbox() {
        const dataAccuracyDisclaimerCheckbox = this.page.locator(
            PublishUnitObjects.dataAccuracyDisclaimerCheckbox.xpath,
        );
        await expect(dataAccuracyDisclaimerCheckbox).toBeVisible({ timeout: 90000 });
        await dataAccuracyDisclaimerCheckbox.click();
    }

    async clickOnSendPublishUnitButton() {
        const sendPublishUnitButton = this.page.getByRole(
            PublishUnitObjects.sendPublishUnitButton.role,
            { name: PublishUnitObjects.sendPublishUnitButton.name },
        );
        await expect(sendPublishUnitButton).toBeVisible({ timeout: 90000 });
        await sendPublishUnitButton.click();
    }

    async verifyPublishUnitSendModalIsVisible() {
        const publishUnitSendModal = this.page.locator(
            PublishUnitObjects.publishUnitSendModal.selector,
        );
        await expect(publishUnitSendModal).toBeVisible({ timeout: 90000 });
    }

    async fillAdLicenseNumberToSearchInputfield(value: string | number) {
        const adLicenseNumber = String(value);
        if (!/^\d+$/.test(adLicenseNumber)) {
            throw new Error("Ad license number must contain digits only.");
        }

        const adLicenseNumberToSearchInputfield = this.page.locator(
            PublishUnitObjects.adLicenseNumberToSearchInputfield.xpath,
        );
        await expect(adLicenseNumberToSearchInputfield).toBeVisible({ timeout: 90000 });
        await adLicenseNumberToSearchInputfield.fill(adLicenseNumber);
        await expect(adLicenseNumberToSearchInputfield).toHaveValue(adLicenseNumber);
    }

    async verifyAdLicenseStatus(expectedStatus: string) {
        const adLicenseStatus = this.page.locator(
            PublishUnitObjects.adLicenseStatus.xpath,
        );
        await expect(adLicenseStatus).toBeVisible({ timeout: 90000 });
        const actualStatus = await adLicenseStatus.innerText();
        expect(actualStatus.trim()).toBe(expectedStatus);
    }

    async selectPreferredCommunicationType() {
    const preferredCommunicationTypeDropdown = this.page.locator(
        PublishUnitObjects.preferredCommunicationTypeDropdownList.selector,
    );
    await expect(preferredCommunicationTypeDropdown).toBeVisible({ timeout: 90000 });
    await preferredCommunicationTypeDropdown.click();

    const preferredCommunicationTypeOption = this.page.getByRole(
        PublishUnitObjects.preferredCommunicationTypeOption.role,
        { name: PublishUnitObjects.preferredCommunicationTypeOption.name },
    );
    await expect(preferredCommunicationTypeOption).toBeVisible({ timeout: 90000 });
    await preferredCommunicationTypeOption.click();
}

    async selectBuildingYear() {
        const buildingYearDropdown = this.page.locator(
            PublishUnitObjects.buildingYearDropdownList.xpath,
        );
        await expect(buildingYearDropdown).toBeVisible({ timeout: 90000 });
        await buildingYearDropdown.click();

        const buildingYearOption = this.page.getByRole(
            PublishUnitObjects.buildingYearOption.role,
            { name: PublishUnitObjects.buildingYearOption.name },
        );
        await expect(buildingYearOption).toBeVisible({ timeout: 90000 });
        await buildingYearOption.click();
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

//Admin

 async clickOnExternalInventoryLink() {
        const externalInventoryLink = this.page
            .locator(PublishUnitObjects.externalInventoryLink.selector)
            .filter({ hasText: PublishUnitObjects.externalInventoryLink.hasText });
        await expect(externalInventoryLink).toBeVisible({ timeout: 90000 });
        await externalInventoryLink.click();
    }

    async clickOnReadyMarketUnitsLink() {
        const readyMarketUnitsLink = this.page.getByRole(
            PublishUnitObjects.readyMarketUnitsLink.role,
            { name: PublishUnitObjects.readyMarketUnitsLink.name },
        );
        await expect(readyMarketUnitsLink).toBeVisible({ timeout: 90000 });
        await readyMarketUnitsLink.click();
    }

    async clickOnRequestTab() {
        const requestTab = this.page.getByRole(
            PublishUnitObjects.requestTab.role,
            { name: PublishUnitObjects.requestTab.name },
        );
        await expect(requestTab).toBeVisible({ timeout: 90000 });
        await requestTab.click();
    }

     async fillAdminAdLicenseNumberInputfield(value: string | number) {
        const adLicenseNumber = String(value);
        if (!/^\d+$/.test(adLicenseNumber)) {
            throw new Error("Ad license number must contain digits only.");
        }

        const adminAdLicenseNumberInputfield = this.page.getByRole(
            PublishUnitObjects.adminAdLicenseNumberInputfield.role,
            { name: PublishUnitObjects.adminAdLicenseNumberInputfield.name },
        );
        await expect(adminAdLicenseNumberInputfield).toBeVisible({ timeout: 90000 });
        await adminAdLicenseNumberInputfield.fill(adLicenseNumber);
        await expect(adminAdLicenseNumberInputfield).toHaveValue(adLicenseNumber);
    }

}