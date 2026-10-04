import { expect, Page } from "@playwright/test";
import { DiscountOnReservedUnitsObjects } from "@objects/DiscountOnReservedUnitsObjects";
import { PDFParse } from "pdf-parse";
import { access, mkdir, readFile, readdir, unlink } from "fs/promises";
import path from "path";


export class DiscountOnReservedUnitsPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    
    async clickOnManageBookingsButton() {
        const manageBookingsButton = this.page.locator(
            DiscountOnReservedUnitsObjects.manageBookingsButton.xpath
        );
        await expect(manageBookingsButton).toBeVisible({ timeout: 90000 });
        await manageBookingsButton.click();
    }

    async clickOnIndividualBookingsButton() {
        const individualBookingsButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.individualBookingsButton.role,
            { name: DiscountOnReservedUnitsObjects.individualBookingsButton.name }
        );
        await expect(individualBookingsButton).toBeVisible({ timeout: 90000 });
        await individualBookingsButton.click();
    }

    async clickOnNewBookingButton() {
        const newBookingButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.newBookingButton.role,
            { name: DiscountOnReservedUnitsObjects.newBookingButton.name }
        );
        await expect(newBookingButton).toBeVisible({ timeout: 90000 });
        await newBookingButton.click();
    }

    async fillUserIdInputfield(userId: string) {
        const userIdInputfield = this.page.getByRole(
            DiscountOnReservedUnitsObjects.userIdInputfield.role
        );
        await expect(userIdInputfield).toBeVisible({ timeout: 90000 });
        await userIdInputfield.fill(userId);
    }

    async fillSearchForUnitOrIDInputfield(searchValue: string) {
        const searchForUnitOrIDInputfield = this.page.getByRole(
            DiscountOnReservedUnitsObjects.searchForUnitOrIDInputfield.role,
            { name: DiscountOnReservedUnitsObjects.searchForUnitOrIDInputfield.name }
        );
        await this.page.waitForTimeout(6000);
        await expect(searchForUnitOrIDInputfield).toBeVisible({ timeout: 90000 });
        await searchForUnitOrIDInputfield.fill(searchValue);
    }

    async selectPriceQuotationStatus() {
        const bookingStatusDropdown = this.page
            .locator(DiscountOnReservedUnitsObjects.bookingStatusDropdown.xpath)
        await this.page.waitForTimeout(6000);
        await expect(bookingStatusDropdown).toBeVisible({ timeout: 90000 });
        await bookingStatusDropdown.click();

        const priceQuotationOption = this.page.getByRole(
            DiscountOnReservedUnitsObjects.priceQuotationStatusOption.role,
            { name: DiscountOnReservedUnitsObjects.priceQuotationStatusOption.name, exact: true },
        );
        await expect(priceQuotationOption).toBeVisible({ timeout: 90000 });
        await priceQuotationOption.click();
    }

    async clickOnSearchButton() {
        const searchButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.searchButton.role,
            { name: DiscountOnReservedUnitsObjects.searchButton.name }
        );
        await expect(searchButton).toBeVisible({ timeout: 90000 });
        await searchButton.click();
    }

    async clickOnNextButton() {
        const nextButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.nextButton.role,
            { name: DiscountOnReservedUnitsObjects.nextButton.name }
        );
        await expect(nextButton).toBeVisible({ timeout: 90000 });
        await nextButton.click();
    }

    async clickOnFirstUnitCheckbox() {
        const firstUnitCheckbox = this.page.locator(
            DiscountOnReservedUnitsObjects.firstUnitCheckbox.xpath
        );
        await this.page.waitForTimeout(6000);
        await expect(firstUnitCheckbox).toBeVisible({ timeout: 90000 });
        await firstUnitCheckbox.click();
    }

    async clickOnContinueBookingButton() {
        const continueBookingButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.continueBtookingButton.role,
            { name: DiscountOnReservedUnitsObjects.continueBtookingButton.name }
        );
        await expect(continueBookingButton).toBeVisible({ timeout: 90000 });
        await continueBookingButton.click();
    }

    async selectBank() {
        const bankDropdown = this.page.locator(
            DiscountOnReservedUnitsObjects.banksDropdownList.css
        );
        const bankCombobox = bankDropdown.getByRole("combobox");
        await expect(bankCombobox).toBeVisible({ timeout: 90000 });
        await bankCombobox.click();

        const bankOption = this.page.getByRole(
            DiscountOnReservedUnitsObjects.bankOption.role,
            { name: DiscountOnReservedUnitsObjects.bankOption.name }
        );
        await expect(bankOption).toBeVisible({ timeout: 90000 });
        await bankOption.click();
    }

    async fillDiscountPercentageInputfield(percentage: string | number) {
        const discountPercentageInputfield = this.page.locator(
            DiscountOnReservedUnitsObjects.descountPercentageInputfield.xpath
        );
        await expect(discountPercentageInputfield).toBeVisible({ timeout: 90000 });
        await discountPercentageInputfield.fill(String(percentage));
    }

    async clickOnConfirmButton() {
        const confirmButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.confirmButton.role,
            { name: DiscountOnReservedUnitsObjects.confirmButton.name }
        );
        await expect(confirmButton).toBeVisible({ timeout: 90000 });
        await confirmButton.click();
    }

    async clickOnPayBookingFeesHeading() {
        const payBookingFeesHeading = this.page.getByRole(
            DiscountOnReservedUnitsObjects.payBookingFees.role,
            {
                name: DiscountOnReservedUnitsObjects.payBookingFees.name,
                exact: true,
            }
        );
        await expect(payBookingFeesHeading).toBeVisible({ timeout: 1200000 });
        await payBookingFeesHeading.click();
    }

     async clickOnTheBookings() {
        const theBookings = this.page.getByText(
            DiscountOnReservedUnitsObjects.theBookings.text
            
        );
        await expect(theBookings).toBeVisible({ timeout: 90000 });
        await theBookings.click();
    }

    async clickOnViewDetailsOfSearchedResultButton() {
        const viewDetailsOfSearchedResultButton = this.page.getByText(
            DiscountOnReservedUnitsObjects.viewDetailsOfSerchedResultButton.text,
            { exact: true }
        );
        await this.page.waitForTimeout(9000);
        await expect(viewDetailsOfSearchedResultButton).toBeVisible({ timeout: 90000 });
        await viewDetailsOfSearchedResultButton.click();
    }
    

    async verifyTheUnitIsBooked() {
        const viewDetailsButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.viewDetailsButton.role,
            { name: DiscountOnReservedUnitsObjects.viewDetailsButton.name }
        );
        await expect(viewDetailsButton).toBeVisible({ timeout: 1200000 });
        
    }

    async clickOnBookingsTab() {
        const bookingsTab = this.page.getByRole(
            DiscountOnReservedUnitsObjects.bookingsTab.role,
            { name: DiscountOnReservedUnitsObjects.bookingsTab.name }
        );
        await expect(bookingsTab).toBeVisible({ timeout: 90000 });
        await bookingsTab.click();
    }

    async selectCancellationReasonOption() {
        const cancellationReasonDropdownList = this.page.locator(
            DiscountOnReservedUnitsObjects.cancellationReasonDropdownList.xpath
        );
        await expect(cancellationReasonDropdownList).toBeVisible({ timeout: 90000 });
        await cancellationReasonDropdownList.click();

        const cancellationReasonOption = this.page.getByRole(
            DiscountOnReservedUnitsObjects.cancellationReasonOption.role,
            { name: DiscountOnReservedUnitsObjects.cancellationReasonOption.name }
        );
        await expect(cancellationReasonOption).toBeVisible({ timeout: 90000 });
        await cancellationReasonOption.click();
    }

    async clickOnCancelBookingButton() {
        const cancelBookingButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.cancelBookingButton.role,
            { name: DiscountOnReservedUnitsObjects.cancelBookingButton.name }
        );
        await expect(cancelBookingButton).toBeVisible({ timeout: 90000 });
        await cancelBookingButton.click();
    }

    async clickOnContinueCancellationButton() {
        const continueButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.continueCancellationButton.role,
            { name: DiscountOnReservedUnitsObjects.continueCancellationButton.name }
        );
        await expect(continueButton).toBeVisible({ timeout: 90000 });
        await continueButton.click();
    }

    async clickOnNoButton() {
        const noButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.noButton.role,
            { name: DiscountOnReservedUnitsObjects.noButton.name }
        );
        await expect(noButton).toBeVisible({ timeout: 90000 });
        await noButton.click();
    }

    async clickOnYesButton() {
        const yesButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.yesButton.role,
            { name: DiscountOnReservedUnitsObjects.yesButton.name }
        );
        await expect(yesButton).toBeVisible({ timeout: 90000 });
        await yesButton.click();
    }

    async fillCancellationOtpCodeInput(code: string | number) {
        const cancellationOtpCodeInput = this.page.getByRole(
            DiscountOnReservedUnitsObjects.cancellationOtpCodeInput.role
        );
        await expect(cancellationOtpCodeInput).toBeVisible({ timeout: 90000 });
        await cancellationOtpCodeInput.fill(String(code));
    }

    async clickOnVerifyCancellationCodeButton() {
        const verifyCancellationCodeButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.verifyCancellationCodeButton.role,
            { name: DiscountOnReservedUnitsObjects.verifyCancellationCodeButton.name }
        );
        await expect(verifyCancellationCodeButton).toBeVisible({ timeout: 90000 });
        await verifyCancellationCodeButton.click();
    }

    async verifyBeneficiaryCancellationToastSuccessMessage() {
        const successMessage = this.page.getByText(
            DiscountOnReservedUnitsObjects.beneficiaryCancellationToastSuccessMessage.text,
            { exact: true }
        );
        await expect(successMessage).toBeVisible({ timeout: 90000 });
    }

    async clickOnPriceQuotationTab() {
        const priceQuotationTab = this.page.getByRole(
            DiscountOnReservedUnitsObjects.priceQuotationTab.role,
            { name: DiscountOnReservedUnitsObjects.priceQuotationTab.name }
        );
        await expect(priceQuotationTab).toBeVisible({ timeout: 90000 });
        await priceQuotationTab.click();
    }
     

    async clickOnReissuePriceQuotationButton() {
        const reissuePriceQuotationButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.reissuePriceQuotationButton.role,
            { name: DiscountOnReservedUnitsObjects.reissuePriceQuotationButton.name, exact: true },
        );
        await expect(reissuePriceQuotationButton).toBeVisible({ timeout: 90000 });
        await reissuePriceQuotationButton.click();
    }

    async verifyPriceQuotationReissueSuccessMessage() {
        const successMessage = this.page.getByText(
            DiscountOnReservedUnitsObjects.reissuePriceQuotationSuccessMessage.text,
            { exact: true },
        );
        await expect(successMessage).toBeVisible({ timeout: 90000 });
    }



 async clickOnExtendPriceQuotationButton() {
        const extendPriceQuotationButton = this.page.getByRole(
            DiscountOnReservedUnitsObjects.extendPriceQuotationButton.role,
            { name: DiscountOnReservedUnitsObjects.extendPriceQuotationButton.name, exact: true },
        );
        await expect(extendPriceQuotationButton).toBeVisible({ timeout: 90000 });
        await extendPriceQuotationButton.click();
    }

    async verifyPriceQuotationExtendSuccessMessage() {
        const successMessage = this.page.getByText(
            DiscountOnReservedUnitsObjects.extendPriceQuotationSuccessMessage.text,
            { exact: true },
        );
        await expect(successMessage).toBeVisible({ timeout: 90000 });
    }



    async clickOnDownloadIcon(fileName?: string): Promise<string> {
        const downloadIcon = this.page.locator(
            DiscountOnReservedUnitsObjects.downloadIcon.css
        );
        await expect(downloadIcon).toBeVisible({ timeout: 90000 });

        const downloadsDirectory = path.resolve(process.cwd(), "src", "downloads");
        await mkdir(downloadsDirectory, { recursive: true });
        const existingEntries = await readdir(downloadsDirectory, { withFileTypes: true });
        await Promise.all(
            existingEntries
                .filter((entry) => entry.isFile())
                .map((entry) => unlink(path.join(downloadsDirectory, entry.name)))
        );

        const downloadPromise = this.page.waitForEvent("download");
        await downloadIcon.click();

        const download = await downloadPromise;
        const suggestedFilename = path.basename(download.suggestedFilename());
        const requestedFilename = fileName?.trim();
        const baseFilename = requestedFilename
            ? path.basename(requestedFilename)
            : suggestedFilename;
        const targetFilename = path.extname(baseFilename)
            ? baseFilename
            : `${baseFilename}${path.extname(suggestedFilename)}`;
        const targetPath = path.join(downloadsDirectory, targetFilename);

        if ((await readdir(downloadsDirectory)).includes(targetFilename)) {
            throw new Error(`Download file already exists: ${targetPath}`);
        }

        await download.saveAs(targetPath);
        await access(targetPath);
        return targetPath;
    }

    async getUnitPriceBeforeDiscount(): Promise<string> {
        const unitPriceBeforeDiscount = this.page.locator(
            DiscountOnReservedUnitsObjects.unitPriceBeforeDiscount.xpath
        );
        await expect(unitPriceBeforeDiscount).toBeVisible({ timeout: 90000 });
        const priceText = await unitPriceBeforeDiscount.innerText();
        return priceText.replace(/\D/g, "");
    }

    async getUnitPriceAfterDiscount(): Promise<string> {
        const unitPriceAfterDiscount = this.page.locator(
            DiscountOnReservedUnitsObjects.unitPriceAfterDiscount.xpath
        );
        await expect(unitPriceAfterDiscount).toBeVisible({ timeout: 90000 });
        const priceText = await unitPriceAfterDiscount.innerText();
        return priceText.replace(/\D/g, "");
    }

    async verifyTheUnitAmountSameAfterDiscount(
        pdfPath: string,
        expectedAmount: string | number,
    ) {
        const parser = new PDFParse({ data: await readFile(pdfPath) });
        try {
            const { text } = await parser.getText();
            const normalizedText = text.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
            const amounts = normalizedText.match(/[\d٠-٩][\d٠-٩,٬]*(?:[.٫][\d٠-٩]+)?/g) ?? [];
            const normalizeAmount = (amount: string | number) =>
                Number(
                    String(amount)
                        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
                        .replace(/[٬,]/g, "")
                        .replace("٫", "."),
                );
            const expectedValue = normalizeAmount(expectedAmount);

            expect(
                amounts.some((amount) => normalizeAmount(amount) === expectedValue),
                `PDF property value should match the expected amount ${expectedAmount}. Found: ${amounts.join(", ")}`,
            ).toBe(true);
        } finally {
            await parser.destroy();
        }
    }

    async verifyUnitPricesAreDifferent() {
        const priceBeforeDiscount = await this.getUnitPriceBeforeDiscount();
        const priceAfterDiscount = await this.getUnitPriceAfterDiscount();
        expect(priceAfterDiscount.trim()).not.toBe(priceBeforeDiscount.trim());
    }

    async searchAndSelectProject(projectName: string) {
        const projectNameInputfield = this.page.locator(
            DiscountOnReservedUnitsObjects.projectNameInputfield.xpath
        );
        await this.page.waitForTimeout(5000);
        await expect(projectNameInputfield).toBeVisible({ timeout: 90000 });
        await projectNameInputfield.fill(projectName);

        const projectOption = DiscountOnReservedUnitsObjects.projectOption(projectName);
        const matchingProjectOption = this.page.getByRole(projectOption.role, {
            name: projectOption.name,
        });
        await expect(matchingProjectOption).toBeVisible({ timeout: 90000 });
        await matchingProjectOption.click();
    }
    
}