import { expect, Page } from "@playwright/test";
import { FlexiblePaymentObjects } from '@objects/FlexiblePaymentObjects';
import { BookingAndSelectPaymentMethodObjects } from '@objects/BookingAndSelectPaymentMethodObjects';

export class FlexiblePaymentPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOnFinancialManagemnt() {
        const finacialManagemnt = this.page.locator(
            FlexiblePaymentObjects.finacialManagemnt.xpath
        );
        await expect(finacialManagemnt).toBeVisible({ timeout: 90000 });
        await finacialManagemnt.click();
    }

    async clickOnPaymentSchedules() {
        const paymentSchedules = this.page.getByRole(
            FlexiblePaymentObjects.paymentSchedules.role, {
            name: FlexiblePaymentObjects.paymentSchedules.name
        }
        );

        await expect(paymentSchedules).toBeVisible({ timeout: 90000 });
        await paymentSchedules.click();
    }

    async clickOnNewSchedulesButton() {
        const newScheduleButton = this.page.getByRole(
            FlexiblePaymentObjects.newScheduleButton.role, {
            name: FlexiblePaymentObjects.newScheduleButton.name
        }
    );
        await expect(newScheduleButton).toBeVisible({ timeout: 90000 });
        await newScheduleButton.click();
    }
    async enterScheduleNameInArabic(arabicName: string) {
        const scheduleNameInArabicInputfield = this.page.locator(
            FlexiblePaymentObjects.scheduleNameInArabicInputfield.xpath
        );
        await expect(scheduleNameInArabicInputfield).toBeVisible({ timeout: 90000 });
        await scheduleNameInArabicInputfield.fill(arabicName);
    }

    async selectScheduleType(scheduleType: "completionPercentage" | "specificPeriod") {
        const scheduleTypeDropdownList = this.page.locator(
            FlexiblePaymentObjects.scheduleTypeDropdownList.xpath
        );
        const scheduleTypeOptions = {
            completionPercentage: FlexiblePaymentObjects.completionPercentageOption,
            specificPeriod: FlexiblePaymentObjects.specificPeriodOption,
        };
        const scheduleTypeOption = this.page.getByRole(
            scheduleTypeOptions[scheduleType].role,
            { name: scheduleTypeOptions[scheduleType].name }
        );

        await expect(scheduleTypeDropdownList).toBeVisible({ timeout: 90000 });
        await scheduleTypeDropdownList.click();

        await expect(scheduleTypeOption).toBeVisible({ timeout: 90000 });
        await scheduleTypeOption.click();
    }

    async fillFirstPaymentPaidPercentage(value: string | number) {
        const firstPaymentPaidPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.firstPaymentPaidPercentageInputfield.xpath
        );

        await expect(firstPaymentPaidPercentageInputfield).toBeVisible({ timeout: 90000 });
        await firstPaymentPaidPercentageInputfield.fill(String(value));
    }

    async fillFirstPaymentCompletionPercentage(value: string | number) {
        const firstPaymentCompletionPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.firstPaymentCompletionPercentageInputfield.xpath
        );

        await expect(firstPaymentCompletionPercentageInputfield).toBeVisible({ timeout: 90000 });
        await firstPaymentCompletionPercentageInputfield.fill(String(value));
    }

    async fillSecondPaymentPaidPercentage(value: string | number) {
        const secondPaymentPaidPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.secondPaymentPaidPercentageInputfield.xpath
        );

        await expect(secondPaymentPaidPercentageInputfield).toBeVisible({ timeout: 90000 });
        await secondPaymentPaidPercentageInputfield.fill(String(value));
    }

    async fillSecondPaymentCompletionPercentage(value: string | number) {
        const secondPaymentCompletionPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.secondPaymentCompletionPercentageInputfield.xpath
        );

        await expect(secondPaymentCompletionPercentageInputfield).toBeVisible({ timeout: 90000 });
        await secondPaymentCompletionPercentageInputfield.fill(String(value));
    }

    async fillThirdPaymentPaidPercentage(value: string | number) {
        const thirdPaymentPaidPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.thirdPaymentPaidPercentageInputfield.xpath
        );

        await expect(thirdPaymentPaidPercentageInputfield).toBeVisible({ timeout: 90000 });
        await thirdPaymentPaidPercentageInputfield.fill(String(value));
    }

    async fillThirdPaymentCompletionPercentage(value: string | number) {
        const thirdPaymentCompletionPercentageInputfield = this.page.locator(
            FlexiblePaymentObjects.thirdPaymentCompletionPercentageInputfield.xpath
        );

        await expect(thirdPaymentCompletionPercentageInputfield).toBeVisible({ timeout: 90000 });
        await thirdPaymentCompletionPercentageInputfield.fill(String(value));
    }

    async clickOnNextButton() {
        const nextButton = this.page.getByRole(
            FlexiblePaymentObjects.nextButton.role, {
            name: FlexiblePaymentObjects.nextButton.name
        }
        );

        await expect(nextButton).toBeVisible({ timeout: 90000 });
        await nextButton.click();
    }
    async serachByprojectName(value: string) {
        const projectNameInputfield = this.page.getByRole(
            FlexiblePaymentObjects.projectNameInputfield.role, {
            name: FlexiblePaymentObjects.projectNameInputfield.name
        }
        );

        await expect(projectNameInputfield).toBeVisible({ timeout: 90000 });
        await projectNameInputfield.fill(String(value));
    }
    async checkOnProjectNameSearchedResult() {
        const projectResultChecbox = this.page.locator(
            FlexiblePaymentObjects.projectResultChecbox.xpath
        );

        await expect(projectResultChecbox).toBeVisible({ timeout: 90000 });
        await projectResultChecbox.click();
    }

    async clickOnConfirmButton() {
        const confirmButton = this.page.getByRole(
            FlexiblePaymentObjects.confirmButton.role, {
            name: FlexiblePaymentObjects.confirmButton.name
        }
        );

        await expect(confirmButton).toBeVisible({ timeout: 90000 });
        await confirmButton.click();
    }

    async verifyTheSuccessfulMessage() {
        const successfulMessage = this.page.locator(
            FlexiblePaymentObjects.successfulMessage.xpath


        );

        await expect(successfulMessage).toBeVisible({ timeout: 90000 });
    }


    async selectPalnType() {
        const planTypeDropdownList = this.page.locator(
            FlexiblePaymentObjects.planTypeDropdownList.xpath
        );

        const planTypeOption = this.page.getByRole(
            FlexiblePaymentObjects.planTypeOption.role,
            { name: FlexiblePaymentObjects.planTypeOption.name }
        );

        await expect(planTypeDropdownList).toBeVisible({ timeout: 90000 });
        await planTypeDropdownList.click();

        await expect(planTypeOption).toBeVisible({ timeout: 90000 });
        await planTypeOption.click();
    }

    async enterPlanPeriod(value: string) {
        const planPeriodInputfield = this.page.locator(
            FlexiblePaymentObjects.planPeriodInputfield.xpath
        );

        await expect(planPeriodInputfield).toBeVisible({ timeout: 90000 });
        await planPeriodInputfield.fill(value);
    }
}

// module.exports = { FlexiblePaymentPage };