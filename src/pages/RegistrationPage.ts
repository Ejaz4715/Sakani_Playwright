import { Page } from "@playwright/test";
import { DataHelper } from "@helpers/DataHelper";
import { LoginObjects } from "@objects/LoginObjects";
import { RegistrationObjects } from "@objects/RegistrationObjects";

export class RegistrationPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async incrementNewUserId() {
        const registrationData = DataHelper.readData().services?.registration;
        const currentUserId: string = registrationData?.newUserId ?? "";
        const userIdPrefix = "1110004";
        const initialUserId = `${userIdPrefix}000`;

        if (currentUserId && !new RegExp(`^${userIdPrefix}\\d{3}$`).test(currentUserId)) {
            throw new Error(`Invalid registration newUserId: ${currentUserId}`);
        }

        const nextUserId = (BigInt(currentUserId || initialUserId) + 1n).toString();
        DataHelper.updateServiceData("registration", "newUserId", nextUserId);

        const nationalIdInput = this.page.getByRole(
            RegistrationObjects.nationalIdInputfield.role,
            { name: RegistrationObjects.nationalIdInputfield.name },
        );
        await nationalIdInput.fill(nextUserId);
        return nextUserId;
    }

    async fillRandomMobilePhone() {
        const phoneNumber = `5${Math.floor(
            10_000_000 + Math.random() * 90_000_000,
        )}`;
        const mobilePhoneInput = this.page.getByRole(
            RegistrationObjects.mobilePhoneInputfield.role,
            { name: RegistrationObjects.mobilePhoneInputfield.name },
        );
        await mobilePhoneInput.fill(phoneNumber);
        return phoneNumber;
    }

    async fillRandomEmail() {
        const randomText = Math.random().toString(36).slice(2, 7).padEnd(5, "0");
        const email = `${randomText}@a.com`;
        const emailInput = this.page.getByRole(
            RegistrationObjects.emailInputfield.role,
            { name: RegistrationObjects.emailInputfield.name },
        );
        await emailInput.fill(email);
        return email;
    }

    async fillOtp(otp: string) {
        if (!/^\d{4}$/.test(otp)) {
            throw new Error("OTP must be exactly 4 digits");
        }

        const otpFields = [
            RegistrationObjects.otp1,
            RegistrationObjects.otp2,
            RegistrationObjects.otp3,
            RegistrationObjects.otp4,
        ];

        for (const [index, otpField] of otpFields.entries()) {
            const input = this.page.locator(otpField.xpath);
            await input.waitFor({ state: "visible" });
            await input.fill(otp.charAt(index));
        }
    }

    async clickContinueButton() {
        const button = this.page.getByRole(
            RegistrationObjects.continueButton.role,
            { name: RegistrationObjects.continueButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async isNewUserContinueButtonVisible() {
        const button = this.page.getByRole(
            LoginObjects.newUserContinueButton.role,
            { name: LoginObjects.newUserContinueButton.name },
        );
        return button.isVisible();
    }


    async clickExplorePropertiesButton() {
        const button = this.page.getByRole(
            RegistrationObjects.explorePropertiesButton.role,
            { name: RegistrationObjects.explorePropertiesButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async checkTermsAndConditions() {
        const checkbox = this.page.getByRole(
            RegistrationObjects.termsAndConditionsCheckbox.role,
            { name: RegistrationObjects.termsAndConditionsCheckbox.name },
        );
        await checkbox.waitFor({ state: "visible" });
        await checkbox.check();
    }

    async clickEligibilityCheckButton() {
        const button = this.page.getByRole(
            RegistrationObjects.eligibilityCheckButton.role,
            { name: RegistrationObjects.eligibilityCheckButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async checkEligibilityTerms() {
        const checkbox = this.page.getByRole(
            RegistrationObjects.eligibilityTermsCheckbox.role,
            { name: RegistrationObjects.eligibilityTermsCheckbox.name },
        );
        await checkbox.waitFor({ state: "visible" });
        await checkbox.check();
    }

    async clickAcceptTermsButton() {
        const button = this.page.getByRole(
            RegistrationObjects.acceptTermsButton.role,
            { name: RegistrationObjects.acceptTermsButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async clickConfirmButton() {
        const button = this.page.getByRole(
            RegistrationObjects.confirmButton.role,
            { name: RegistrationObjects.confirmButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async checkAdditionalEligibilityCheckboxes() {
        for (const selector of [
            RegistrationObjects.firstCheckbox,
            RegistrationObjects.secondCheckbox,
            RegistrationObjects.thirdCheckbox,
        ]) {
            const checkbox = this.page.locator(selector);
            await checkbox.waitFor({ state: "visible" });
            await checkbox.check();
        }
    }

    async selectDropdownOption(
        dropdownObject: { readonly xpath: string },
        optionObject: { readonly role: "option"; readonly name: string },
    ) {
        const currentRegion = this.page.locator(
            dropdownObject.xpath,
        );
        await currentRegion.waitFor({ state: "visible" });
        await currentRegion.click();

        const option = this.page.getByRole(
            optionObject.role,
            { name: optionObject.name },
        );
        await option.waitFor({ state: "visible" });
        await option.click();
    }

    async fillAllMatchingFields(
        fieldObject: { readonly xpath: string },
        value: string | readonly string[],
    ) {
        const fields = this.page.locator(fieldObject.xpath);
        const fieldCount = await fields.count();

        if (fieldCount === 0) {
            throw new Error(`No fields found for selector: ${fieldObject.xpath}`);
        }

        if (Array.isArray(value) && value.length !== fieldCount) {
            throw new Error(
                `Expected ${fieldCount} values for matching fields, received ${value.length}`,
            );
        }

        for (let index = 0; index < fieldCount; index++) {
            const field = fields.nth(index);
            await field.waitFor({ state: "visible" });
            await field.fill(Array.isArray(value) ? value[index] : value);
        }
        return fieldCount;
    }

    async fillInputField(
        fieldObject: { readonly xpath: string },
        value: string | number,
    ) {
        const field = this.page.locator(fieldObject.xpath);
        const fieldCount = await field.count();

        if (fieldCount !== 1) {
            throw new Error(
                `Expected one field for selector: ${fieldObject.xpath}, found ${fieldCount}`,
            );
        }

        await field.waitFor({ state: "visible" });
        await field.fill(String(value));
    }

    async getEligibilityResult(): Promise<"eligible" | "not eligible"> {
        const eligibleMessage = this.page.getByText(
            RegistrationObjects.eligibilitySuccessMessage,
        );
        const notEligibleMessage = this.page.getByText(
            RegistrationObjects.notEligibilitySuccessMessage.trim(),
        );

        await Promise.race([
            eligibleMessage.waitFor({ state: "visible" }),
            notEligibleMessage.waitFor({ state: "visible" }),
        ]);

        if (await eligibleMessage.isVisible()) {
            return "eligible";
        }
        if (await notEligibleMessage.isVisible()) {
            return "not eligible";
        }
        throw new Error("Eligibility result message did not become visible");
    }
async clickFinancialAdvisoryLink() {
        const link = this.page.locator(
            RegistrationObjects.financialAdvisoryLink.xpath,
        );
        await link.waitFor({ state: "visible" });
        await link.click();
    }

    async clickStartNowButton() {
        const button = this.page.getByRole(
            RegistrationObjects.startNowButton.role,
            { name: RegistrationObjects.startNowButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    async clickStartServiceLink() {
        const link = this.page.getByRole(
            RegistrationObjects.startServiceLink.role,
            { name: RegistrationObjects.startServiceLink.name },
        );
        await link.waitFor({ state: "visible" });
        await link.click();
    }

    async clickReadyUnitsFromMarketText() {
        const text = this.page.getByText(
            RegistrationObjects.readyUnitsFromMarketText,
        );
        await text.waitFor({ state: "visible" });
        await text.click();
    }

    async checkReadyUnitsCheckbox() {
        const checkbox = this.page.getByRole(
            RegistrationObjects.readyUnitsCheckbox.role,
        );
        await checkbox.waitFor({ state: "visible" });
        await checkbox.check();
    }

    async clickSubmitButton() {
        const button = this.page.getByRole(
            RegistrationObjects.submitButton.role,
            { name: RegistrationObjects.submitButton.name },
        );
        await button.waitFor({ state: "visible" });
        await button.click();
    }
    
}