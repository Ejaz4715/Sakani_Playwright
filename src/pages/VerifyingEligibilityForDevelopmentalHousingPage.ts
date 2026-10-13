import { expect, Page } from "@playwright/test";
import { VerifyingEligibilityForHevelopmentalHousingObjects } from '@objects/VerifyingEligibilityForDevelopmentalHousingObjects';

export class VerifyingEligibilityForDevelopmentalHousingPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickDevelopmentalHousingEligibilityLink() {
        const eligibilityLink = this.page.getByRole(
            VerifyingEligibilityForHevelopmentalHousingObjects.developmentalHousingEligibilityLink.role,
            {
                name: VerifyingEligibilityForHevelopmentalHousingObjects
                    .developmentalHousingEligibilityLink.name,
            },
        );
        await expect(eligibilityLink).toBeVisible({ timeout: 90000 });
        await eligibilityLink.click();
    }

    async clickCheckStatusButton() {
        const checkStatusButton = this.page.getByRole(
            VerifyingEligibilityForHevelopmentalHousingObjects.checkStatusButton.role,
            {
                name: VerifyingEligibilityForHevelopmentalHousingObjects
                    .checkStatusButton.name,
            },
        );
        await expect(checkStatusButton).toBeVisible({ timeout: 90000 });
        await checkStatusButton.click();
    }

    async fillNationalIdInputfield(value: string | number) {
        const nationalIdInputfield = this.page.getByRole(
            VerifyingEligibilityForHevelopmentalHousingObjects.nationalIdInputfield.role,
        );
        await expect(nationalIdInputfield).toBeVisible({ timeout: 90000 });
        await nationalIdInputfield.fill(String(value));
    }

    async verifyWrongNationalIdMessageIsVisible() {
        const message = this.page.getByText(
            VerifyingEligibilityForHevelopmentalHousingObjects
                .WrongNationalIdMessage.text,
        );
        await expect(message).toBeVisible({ timeout: 90000 });
    }

    async verifyWrongIdMessageIsVisible() {
        const message = this.page.getByText(
            VerifyingEligibilityForHevelopmentalHousingObjects.WrongIdMessage.text,
        );
        await expect(message).toBeVisible({ timeout: 90000 });
    }
}