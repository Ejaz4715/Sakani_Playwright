import { expect, Page } from "@playwright/test";
import { RequestPublishProjectObjects } from '@objects/RequestPublishProjectObjects';

export class RequestPublishProjectPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickProjectsLink() {
        const projectsLink = this.page.getByRole(
            RequestPublishProjectObjects.projectsLink.role,
            { name: RequestPublishProjectObjects.projectsLink.name },
        );
        await expect(projectsLink).toBeVisible({ timeout: 90000 });
        await projectsLink.click();
    }

    async clickNewProjectButton() {
        const newProjectButton = this.page.getByRole(
            RequestPublishProjectObjects.newProjectButton.role,
            { name: RequestPublishProjectObjects.newProjectButton.name },
        );
        await expect(newProjectButton).toBeVisible({ timeout: 90000 });
        await newProjectButton.click();
    }

    async fillAnyInputField(
        inputObject: { readonly xpath: string },
        value: string | number,
    ) {
        const input = this.page.locator(inputObject.xpath);
        await expect(input).toBeVisible({ timeout: 90000 });
        await input.fill(String(value));
    }

    async selectAnyDropdownOption(
        dropdownObject: { readonly xpath: string },
        optionObject: {
            readonly role: "option";
            readonly name: string;
            readonly exact?: boolean;
        },
    ) {
        const dropdown = this.page.locator(dropdownObject.xpath);
        await expect(dropdown).toBeVisible({ timeout: 90000 });
        await dropdown.click();

        const option = this.page.getByRole(optionObject.role, {
            name: optionObject.name,
            ...(optionObject.exact !== undefined && { exact: optionObject.exact }),
        });
        await expect(option).toBeVisible({ timeout: 90000 });
        await option.click();
    }

    async clickBookableToggle() {
        const bookableToggle = this.page.locator(
            RequestPublishProjectObjects.bookableToggle.xpath,
        );
        await expect(bookableToggle).toBeVisible({ timeout: 90000 });
        await bookableToggle.click();
    }

    async clickNextButton() {
        const nextButton = this.page.getByRole(
            RequestPublishProjectObjects.nextButton.role,
            { name: RequestPublishProjectObjects.nextButton.name },
        );
        await expect(nextButton).toBeVisible({ timeout: 90000 });
        await nextButton.click();
    }

    async clickBankCheckbox() {
        const bankCheckbox = this.page.locator(
            RequestPublishProjectObjects.bankCheckbox.xpath,
        );
        await expect(bankCheckbox).toBeVisible({ timeout: 90000 });
        await bankCheckbox.click();
    }

    async clickLendingPaymentDropdownButton() {
        const lendingPaymentDropdownButton = this.page.locator(
            RequestPublishProjectObjects.lendingPaymentDropdownButton.xpath,
        );
        await expect(lendingPaymentDropdownButton).toBeVisible({ timeout: 90000 });
        await lendingPaymentDropdownButton.click();
    }

    async clickCashPaymentDropdownButton() {
        const cashPaymentDropdownButton = this.page.locator(
            RequestPublishProjectObjects.cashPaymentDropdwonButton.xpath,
        );
        await expect(cashPaymentDropdownButton).toBeVisible({ timeout: 90000 });
        await cashPaymentDropdownButton.click();
    }

    async clickConfirmAndSendButton() {
        const confirmAndSendButton = this.page.getByRole(
            RequestPublishProjectObjects.confirmAndSendButton.role,
            { name: RequestPublishProjectObjects.confirmAndSendButton.name },
        );
        await expect(confirmAndSendButton).toBeVisible({ timeout: 90000 });
        await confirmAndSendButton.click();
    }

    async clickSendButton() {
        const sendButton = this.page.getByRole(
            RequestPublishProjectObjects.sendButton.role,
            { name: RequestPublishProjectObjects.sendButton.name },
        );
        await expect(sendButton).toBeVisible({ timeout: 90000 });
        await sendButton.click();
    }
    async verifySuccessMessageIsVisible() {
        const successMessage = this.page.getByText(
            RequestPublishProjectObjects.successMessage.name,
        );
        await expect(successMessage).toBeVisible({ timeout: 90000 });
    }
    async clickDeveloperProjectsTab() {
        const developerProjectsTab = this.page.getByText(
            RequestPublishProjectObjects.developerProjectsTab.text,
        );
        await expect(developerProjectsTab).toBeVisible({ timeout: 90000 });
        await developerProjectsTab.click();
    }
    async clickApproveButton() {
        const approveButton = this.page.getByRole(
            RequestPublishProjectObjects.approveButton.role,
            { name: RequestPublishProjectObjects.approveButton.name },
        );
        await expect(approveButton).toBeVisible({ timeout: 90000 });
        await approveButton.click();
    }
    async verifySuccessApprovedToastMessageIsVisible() {
        const approvedSuccessToast = this.page.getByText(
            RequestPublishProjectObjects.approvedSuccessToast.text,
        );
        await expect(approvedSuccessToast).toBeVisible({ timeout: 90000 });
    }
    async verifySuccessApprovedUnitsToastMessageIsVisible() {
        const approvedUnitSuccessToast = this.page.getByText(
            RequestPublishProjectObjects.approvedUnitSuccessToast.text,
        );
        await expect(approvedUnitSuccessToast).toBeVisible({ timeout: 90000 });
    }

    async verifyProjectName(expectedProjectName: string) {
        const projectName = this.page.locator(
            RequestPublishProjectObjects.projectName.xpath,
        );
        await expect(projectName).toHaveText(expectedProjectName, {
            timeout: 90000,
        });
    }
    
}