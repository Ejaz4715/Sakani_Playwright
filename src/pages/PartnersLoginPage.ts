// @ts-nocheck
import { Page, expect, Locator } from "@playwright/test";
const path = require("path");
import { DeveloperObjects } from '@objects/DeveloperObjects'

export class PartnersLoginPage {
    page: Page;
    defaultTimeout: number | undefined;
    constructor(page: Page) {
        this.page = page;
        this.defaultTimeout = 60000;
    }

    async waitForVisible(locator: any) {
        await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
    }

    async clickIfVisible(locator, options = {}) {
        const timeout = options.timeout ?? 5000;
        const isVisible = await locator.isVisible({ timeout }).catch(() => false);
        if (isVisible) {
            await locator.click();
        }
    }
    async gotoAuth(url) {
        await this.page.goto(url);
    }

    async fillNationalId(nationalId) {
        const usernameInput = this.page.getByRole(
            DeveloperObjects.usernameInput.role,
            { name: DeveloperObjects.usernameInput.name },
        );
        await this.waitForVisible(usernameInput);
        await usernameInput.fill(nationalId);
    }

    async clickContinueButton() {
        const continueButton = this.page.getByRole(
            DeveloperObjects.continueButton.role,
            {
                name: DeveloperObjects.continueButton.name,
                exact: DeveloperObjects.continueButton.exact,
            },
        );
        await this.waitForVisible(continueButton);
        await continueButton.click();
    }

    async confirmIdentityIfRequired() {
        const nafathModal = this.page.locator(DeveloperObjects.nafathModel);
        await nafathModal
            .waitFor({ state: "visible", timeout: 10000 })
            .catch(() => { });

        while (await nafathModal.isVisible().catch(() => false)) {
            await this.page.waitForTimeout(3000);
        }

        await this.page.waitForTimeout(3000);
        const verificationButton = this.page.getByRole(
            DeveloperObjects.verifyOTPButton.role,
            { name: DeveloperObjects.verifyOTPButton.name },
        );
        if (await verificationButton.isVisible({ timeout: 15000 }).catch(() => false)) {
            await verificationButton.click();

            const otpInput = this.page.getByRole(
                DeveloperObjects.otpDigitInput.role,
                { name: DeveloperObjects.otpDigitInput.name },
            );
            await otpInput.nth(0).fill("1");
            await otpInput.nth(1).fill("2");
            await otpInput.nth(2).fill("3");
            await otpInput.nth(3).fill("4");

            await this.page.getByRole(
                DeveloperObjects.confirmAndContinueButton.role,
                { name: DeveloperObjects.confirmAndContinueButton.name },
            ).click();
            await this.page.getByRole(
                DeveloperObjects.goToDashboardButton.role,
                { name: DeveloperObjects.goToDashboardButton.name },
            ).click();
        }
    }

    async waitForProfileIcon() {
        const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
        await this.waitForVisible(profileIcon);
    }

    async clickProfileIcon() {
        const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
        await this.waitForVisible(profileIcon);
        await profileIcon.click();
    }

    async clickSwitchRoleButton() {
        const switchRoleButton = this.page.getByRole(
            DeveloperObjects.switchRoleButton.role,
            { name: DeveloperObjects.switchRoleButton.name },
        );
        await this.waitForVisible(switchRoleButton);
        await switchRoleButton.click();
    }

    async clickDeveloperRole() {
        const developerRole = this.page.getByText(DeveloperObjects.developerRoleText);
        await this.waitForVisible(developerRole);
        await developerRole.click();
    }

    async dismissNewServiceAlertPopUp() {
        const cancelButton = this.page.getByRole(DeveloperObjects.cancelButtonOnPopUp.role, 
            {name: DeveloperObjects.cancelButtonOnPopUp.name}
        );
        await this.clickIfVisible(cancelButton.first());
    }

    async loginToSapaPortal(nationalId: string) {
        await this.fillNationalId(nationalId);
        await this.clickContinueButton();
        await this.confirmIdentityIfRequired();
        await this.waitForProfileIcon();
        await this.page.waitForTimeout(3000);
        await this.dismissNewServiceAlertPopUp();
    }

    async switchRoleToDeveloper() {
        await this.clickProfileIcon();
        await this.clickSwitchRoleButton();
        await this.clickDeveloperRole();
        await this.page.waitForTimeout(3000);
        await this.dismissNewServiceAlertPopUp();
    }
}
