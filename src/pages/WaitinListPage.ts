import { expect, Page } from "@playwright/test";
import { WaitinListObjects } from '@objects/WaitinListObjects';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';
import fs from "fs";
import path from "path";

export class WaitingListPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOnWaitingListSideButton() {
        const waitingListSideButton = this.page.getByRole(
            WaitinListObjects.waitingListSideButton.role,
            { name: WaitinListObjects.waitingListSideButton.name }
        );

        await expect(waitingListSideButton).toBeVisible({ timeout: 90000 });
        await waitingListSideButton.click();
    }

    async clickOnNewRegisterButton() {
        const newRegisterButton = this.page.getByRole(
            WaitinListObjects.newRegisterButton.role,
            { name: WaitinListObjects.newRegisterButton.name }
        );

        await expect(newRegisterButton).toBeVisible({ timeout: 90000 });
        await newRegisterButton.click();
    }

    async fillSearchInputfield(value: string) {
        const searchInputfield = this.page.getByRole(
            WaitinListObjects.searchInputfield.role
        );

        await expect(searchInputfield).toBeVisible({ timeout: 90000 });
        await searchInputfield.fill(value);
    }

    async clickOnSearchButton() {
        const searchButton = this.page.getByRole(
            WaitinListObjects.searchButton.role,
            { name: WaitinListObjects.searchButton.name }
        );

        await expect(searchButton).toBeVisible({ timeout: 90000 });
        await searchButton.click();
    }

    async clickOnNextButton() {
        const nextButton = this.page.getByRole(
            WaitinListObjects.nextButton.role,
            { name: WaitinListObjects.nextButton.name }
        );

        await expect(nextButton).toBeVisible({ timeout: 90000 });
        await nextButton.click();
    }

    async fillProjectSearchInputfield(value: string) {
        const projectSearchInputfield = this.page.getByRole(
            WaitinListObjects.projectSearchInputfield.role,
            { name: WaitinListObjects.projectSearchInputfield.name }
        );
        await this.page.waitForTimeout(6000);
        await expect(projectSearchInputfield).toBeVisible({ timeout: 90000 });
        await projectSearchInputfield.fill(value);
    }

    async clickOnSelectProjectButton() {
        const selectProjectButton = this.page.getByRole(
            WaitinListObjects.selectProjectButton.role,
            { name: WaitinListObjects.selectProjectButton.name }
        );

        await this.page.waitForTimeout(5000);
        await expect(selectProjectButton).toBeVisible({ timeout: 90000 });
        await selectProjectButton.click();
    }

    async clickOnProjectRadioCheck() {
        const projectRadioCheck = this.page.locator(
            WaitinListObjects.projectRadioCheck.css
        );

        await expect(projectRadioCheck).toBeVisible({ timeout: 90000 });
        await projectRadioCheck.click();
    }

    async clickOnConfirmButton() {
        const confirmButton = this.page.getByRole(
            WaitinListObjects.confirmButton.role,
            { name: WaitinListObjects.confirmButton.name }
        )

        await expect(confirmButton).toBeVisible({ timeout: 90000 });
        await confirmButton.click();
    }
    async clickOnConfirmButtonPopup() {
        const confirmButtonPopup = this.page.locator(
            WaitinListObjects.confirmButtonPopup.xpath,
    
        )

        await expect(confirmButtonPopup).toBeVisible({ timeout: 90000 });
        await confirmButtonPopup.click();
    }

    async verifyRegistrationSuccessMessage() {
        const registrationSuccessMessage = this.page.getByText(
            WaitinListObjects.registrationSuccessMessage.text
        );

        await expect(registrationSuccessMessage).toBeVisible({ timeout: 90000 });
    }

    async clickOnMyActivities() {
        const myActivities = this.page.getByText(
            WaitinListObjects.myActivities.text
        );

        await expect(myActivities).toBeVisible({ timeout: 90000 });
        await myActivities.click();
    }

    async clickOnRegisteredWaitingList() {
        const registeredWaitingList = this.page.getByText(
            WaitinListObjects.registeredWaitingList.text
        );

        await expect(registeredWaitingList).toBeVisible({ timeout: 90000 });
        await registeredWaitingList.click();
    }

    async clickOnActiveTab() {
        const activeTab = this.page.getByRole(
            WaitinListObjects.activeTab.role,
            { name: WaitinListObjects.activeTab.name }
        );

        await expect(activeTab).toBeVisible({ timeout: 90000 });
        await activeTab.click();
    }

    async clickOnCancelRequestButton() {
        const cancelRequestButton = this.page.getByRole(
            WaitinListObjects.cancelRequestButton.role,
            { name: WaitinListObjects.cancelRequestButton.name }
        );

        await expect(cancelRequestButton).toBeVisible({ timeout: 90000 });
        await cancelRequestButton.click();
    }

    async clickOnConfirmCancellationButton() {
        const confirmCancellationButton = this.page.getByRole(
            WaitinListObjects.confirmCancellationButton.role,
            { name: WaitinListObjects.confirmCancellationButton.name }
        );

        await expect(confirmCancellationButton).toBeVisible({ timeout: 90000 });
        await confirmCancellationButton.click();
    }

    async verifyNoActiveWaitingListProjectsMessage() {
        const noActiveWaitingListProjectsMessage = this.page.getByRole(
            WaitinListObjects.noActiveWaitingListProjectsMessage.role,
            { name: WaitinListObjects.noActiveWaitingListProjectsMessage.name }
        );

        await expect(noActiveWaitingListProjectsMessage).toBeVisible({ timeout: 90000 });
    }



    async clickOnUserIcon() {
        const userProfileButton = this.page.locator(
            BookingCancellationObjects.userProfileButton,

        );
        await expect(userProfileButton).toBeVisible({ timeout: 90000 });
        await userProfileButton.click();

    }

    async ClickOnUserProfile() {
        const userProfile = this.page.getByText(
            WaitinListObjects.userProfile.text,
        );

        await expect(userProfile).toBeVisible({ timeout: 90000 });
        await userProfile.click();
    }
}