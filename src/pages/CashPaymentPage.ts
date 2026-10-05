
import { expect, Page } from "@playwright/test";
import { CashPaymentObjects } from '@objects/CashPaymentObjects';

export class CashPaymentPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    clickOnSchedulePaymentCard() {
        const schedulePaymentCard = this.page.locator(
            CashPaymentObjects.sechudlePaymentCard.xpath
        );
        expect(schedulePaymentCard).toBeVisible({ timeout: 90000 });
        schedulePaymentCard.click();
    }

    async clickOnCashPaymentLink() {
        const cashPaymentLink = this.page.getByRole(
            CashPaymentObjects.cashPaymentLink.role,
            { name: CashPaymentObjects.cashPaymentLink.name }
        );
        await expect(cashPaymentLink).toBeVisible({ timeout: 90000 });
        await cashPaymentLink.click();
    }

    async selectCustomerType() {
        const customerTypeDropdown = this.page.locator(
            CashPaymentObjects.customerTypeDropdown.xpath);

        await expect(customerTypeDropdown).toBeVisible({ timeout: 90000 });
        await customerTypeDropdown.click();

        const customerTypeOption = this.page.getByRole(
            CashPaymentObjects.customerTypeOption.role,
            { name: CashPaymentObjects.customerTypeOption.name }
        );
        await expect(customerTypeOption).toBeVisible({ timeout: 90000 });
        await customerTypeOption.click();
    }

    async fillIDNumber(idNumber: string) {
        const iDNumberInputfield = this.page.locator(
            CashPaymentObjects.iDNumberInputfield.xpath
        );
        await expect(iDNumberInputfield).toBeVisible({ timeout: 90000 });
        await iDNumberInputfield.fill(idNumber);
    }

    async clickSearchButton() {
        const searchButton = this.page.getByRole(
            CashPaymentObjects.searchButton.role,
            { name: CashPaymentObjects.searchButton.name }
        );
        await expect(searchButton).toBeVisible({ timeout: 90000 });
        await searchButton.click();
    }

    async clickShowPasswordIcon() {
        const showPasswordIcon = this.page.locator(
            CashPaymentObjects.showPasswordIcon.selector
        );
        await this.page.waitForTimeout(4000); // Wait for 5 seconds before checking visibility
        await expect(showPasswordIcon).toBeVisible({ timeout: 90000 });
        await showPasswordIcon.click();
    }

    async clickDocumentCashPaymentButton() {
        const documentCashPaymentButton = this.page.getByRole(
            CashPaymentObjects.documentCashPaymentButton.role,
            { name: CashPaymentObjects.documentCashPaymentButton.name }
        );
        await expect(documentCashPaymentButton).toBeVisible({ timeout: 90000 });
        await documentCashPaymentButton.click();
    }

    async clickConfirmYesButton() {
        const confirmYesButton = this.page.getByRole(
            CashPaymentObjects.confirmYesButton.role,
            { name: CashPaymentObjects.confirmYesButton.name }
        );
        await expect(confirmYesButton).toBeVisible({ timeout: 90000 });
        await confirmYesButton.click();
    }

    async expectCashPaymentSuccess() {
        const successMessage = this.page.getByText(
            CashPaymentObjects.successMessage.text,
            { exact: true }
        );
        await expect(successMessage).toBeVisible({ timeout: 90000 });
    }


    async signSalesContract(otp = ["1", "2", "3", "4"]) {
        await this.page.waitForTimeout(9000);
        await this.page.getByRole("button", { name: "اعتماد" }).click();
        const otpInputs = this.page.getByRole("textbox");
        for (let index = 0; index < otp.length; index++) {
            await otpInputs.nth(index).fill(otp[index]);
        }
        await this.page.getByRole("button", { name: "تحقق", exact: true }).click();
        await this.page.waitForTimeout(7000);
    }


    async verifyUserIsSigned() {
        const bookingDetailsButton = this.page.locator(
            CashPaymentObjects.bookingDetailsButton.xpath
        );

        await expect(bookingDetailsButton).toBeVisible({ timeout: 90000 });

    }

}