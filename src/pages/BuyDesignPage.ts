import { expect, Page } from "@playwright/test";
import { BuyDesignObjects } from '@objects/BuyDesignObjects';
import fs from "fs";
import path from "path";

export class BuyDesignPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    //Click on services button
    async clickOnServicesButton() {
        const servicesButton = this.page.getByRole(
            BuyDesignObjects.servicesButton.role,
            {
                name: BuyDesignObjects.servicesButton.name,
                exact: BuyDesignObjects.servicesButton.exact,
            }
        );

        await expect(servicesButton).toBeVisible({ timeout: 90000 });
        await servicesButton.click();
    }

    //Click on view all services button
    async clickOnViewAllServicesButton() {
        const viewAllServicesButton = this.page.getByRole(
            BuyDesignObjects.viewAllServicesButton.role,
            { name: BuyDesignObjects.viewAllServicesButton.name }
        );

        await expect(viewAllServicesButton).toBeVisible({ timeout: 90000 });
        await viewAllServicesButton.click();
    }

    //Click on self construction service link/card
    async clickOnSelfConstructionServiceLink() {
        const selfConstructionServiceLink = this.page.getByRole(
            BuyDesignObjects.selfConstructionServiceLink.role,
            { name: BuyDesignObjects.selfConstructionServiceLink.name }
        );

        await expect(selfConstructionServiceLink).toBeVisible({ timeout: 90000 });
        await selfConstructionServiceLink.click();
    }

    //Click on view details - first one
    async clickOnViewDetailsLink() {
        const viewDetailsLink = this.page.getByRole(
            BuyDesignObjects.viewDetailsLink.role,
            { name: BuyDesignObjects.viewDetailsLink.name }
        );

        const firstViewDetailsLink = viewDetailsLink.first();

        await expect(firstViewDetailsLink).toBeVisible({ timeout: 90000 });
        await firstViewDetailsLink.click();
    }

    //Switch on advanced search
    async checkAdvancedSearchToggle() {
        const advancedSearchToggle = this.page.getByRole(
            BuyDesignObjects.advancedSearchToggle.role
        );
        await this.page.waitForTimeout(5000);
        await expect(advancedSearchToggle).toBeVisible({ timeout: 90000 });
        await advancedSearchToggle.check();
    }

    //Select design - Testcrew test
    async selectDesign() {
        const designCrewCombobox = this.page.getByRole(
            BuyDesignObjects.combobox.role
        ).nth(1);
        const designCrewOption = this.page.getByRole(
            BuyDesignObjects.designCrewOption.role,
            { name: BuyDesignObjects.designCrewOption.name }
        );

        await expect(designCrewCombobox).toBeVisible({ timeout: 90000 });
        await designCrewCombobox.click();
        await designCrewCombobox.fill(BuyDesignObjects.designCrewOption.name);
        await this.page.waitForTimeout(3000);
        await expect(designCrewOption).toBeVisible({ timeout: 90000 });
        await designCrewOption.click();
    }

    //Click on view design profile button
    async clickOnViewDesignProfileText() {
        const viewDesignProfileText = this.page.getByText(
            BuyDesignObjects.viewDesignProfileText.text
        );
        await this.page.waitForTimeout(5000);
        await expect(viewDesignProfileText).toBeVisible({ timeout: 90000 });
        await viewDesignProfileText.click();
    }

    //Click on view button
    async clickOnViewText() {
        const viewText = this.page.getByText(BuyDesignObjects.viewText.text).nth(5);

        await expect(viewText).toBeVisible({ timeout: 90000 });
        await viewText.click();
    }

    //Click on buy design button
    async clickOnBuyDesignButton() {
        const buyDesignButton = this.page.getByRole(
            BuyDesignObjects.buyDesignButton.role,
            { name: BuyDesignObjects.buyDesignButton.name }
        );

        await expect(buyDesignButton).toBeVisible({ timeout: 90000 });
        await buyDesignButton.click();
    }

    //Select only design radio button
    async clickOnDesignOnlyOption() {
        const designOnlyText = this.page.getByText(BuyDesignObjects.designOnlyText.text);

        await expect(designOnlyText).toBeVisible({ timeout: 90000 });
        await designOnlyText.click();
    }

    //Select design with fitting radio button
    async clickOnDesignWithFittingOption() {
        const designWithFittingOption = this.page.getByText(
            BuyDesignObjects.designWithFittingOption.text,
            { exact: BuyDesignObjects.designWithFittingOption.exact }
        );

        await expect(designWithFittingOption).toBeVisible({ timeout: 90000 });
        await designWithFittingOption.click();
    }

    //Select design with fitting and building permit radio button
    async clickOnDesignWithFittingAndBuildingPermitOption() {
        const designWithFittingAndBuildingPermitOption = this.page.getByText(
            BuyDesignObjects.designWithFittingAndBuildingPermitOption.text
        );

        await expect(designWithFittingAndBuildingPermitOption).toBeVisible({ timeout: 90000 });
        await designWithFittingAndBuildingPermitOption.click();
    }

    //Check on disclamer aligmnet
    async checkAlignmentCheckbox() {
        const alignmentCheckbox = this.page.locator(
            BuyDesignObjects.alignmentCheckbox.selector
        );

        await expect(alignmentCheckbox).toBeVisible({ timeout: 90000 });
        await alignmentCheckbox.check();
    }

    
    async fillFirstAlignmentInput(value: string) {
        const alignmentInput = this.page.getByRole(
            BuyDesignObjects.alignmentInput.role,
            { name: BuyDesignObjects.alignmentInput.name }
        ).first();

        await expect(alignmentInput).toBeVisible({ timeout: 90000 });
        await alignmentInput.fill(value);
    }

    async fillSecondAlignmentInput(value: string) {
        const alignmentInput = this.page.getByRole(
            BuyDesignObjects.alignmentInput.role,
            { name: BuyDesignObjects.alignmentInput.name }
        ).nth(1);

        await expect(alignmentInput).toBeVisible({ timeout: 90000 });
        await alignmentInput.fill(value);
    }

    async fillThirdAlignmentInput(value: string) {
        const alignmentInput = this.page.getByRole(
            BuyDesignObjects.alignmentInput.role,
            { name: BuyDesignObjects.alignmentInput.name }
        ).nth(2);

        await expect(alignmentInput).toBeVisible({ timeout: 90000 });
        await alignmentInput.fill(value);
    }

    async clickOnWantFittingServiceButton() {
        const wantFittingServiceButton = this.page.getByRole(
            BuyDesignObjects.wantFittingServiceButton.role,
            { name: BuyDesignObjects.wantFittingServiceButton.name }
        );

        await expect(wantFittingServiceButton).toBeVisible({ timeout: 90000 });
        await wantFittingServiceButton.click();
    }

    async clickOnContinueButton() {
        const continueButton = this.page.getByRole(
            BuyDesignObjects.continueButton.role,
            { name: BuyDesignObjects.continueButton.name }
        );

        await expect(continueButton).toBeVisible({ timeout: 90000 });
        await continueButton.click();
    }

    async checkTermsAndConditionsCheckbox() {
        const termsAndConditionsCheckbox = this.page.getByRole(
            BuyDesignObjects.termsAndConditionsCheckbox.role,
            { name: BuyDesignObjects.termsAndConditionsCheckbox.name }
        );

        await expect(termsAndConditionsCheckbox).toBeVisible({ timeout: 90000 });
        await termsAndConditionsCheckbox.check();
    }

    async clickOnPayNowButton() {
        const payNowButton = this.page.getByRole(
            BuyDesignObjects.payNowButton.role,
            { name: BuyDesignObjects.payNowButton.name }
        );

        await expect(payNowButton).toBeVisible({ timeout: 90000 });
        await payNowButton.click();
    }

    async verifyPaymentSuccess() {
        const paymentSuccessHeading = this.page.getByRole(
            BuyDesignObjects.paymentSuccessHeading.role,
            { name: BuyDesignObjects.paymentSuccessHeading.name }
        );

        await expect(paymentSuccessHeading).toBeVisible({ timeout: 120000 });
    }
}