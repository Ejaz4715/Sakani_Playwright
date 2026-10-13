import { test, expect } from '@playwright/test';
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import { DeveloperProjectPage } from '@pages/DeveloperProjectPage';

const SERVICE = "developer-unit-reservation";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;


test.describe("Update unit price from partners", () => {
    test("TC-01 - Developer books a unit for a non-bene user in offplan private project", {annotation: [{product: 'Marketplace', type: 'critical'}] as any}, async ({ page }) => {
        await logStep("Step 00: Read data from json relative to the service");
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const nationalId = data.sakaniUserIdNonEligible;
        const unitCode = data.unitCodeOffplanPrivate;
        const developerUserId = data.developerUserId;
        const bankName = "بنك الأهلي السعودي";

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Start new individual booking > Enter user id");
        await app.developerProjectPage.bookUnitsForCustomersUsingUnitCode(nationalId, unitCode);
        await page.waitForTimeout(5000);

        await logStep("Step 03: Select unit and move to financial information page");
        await app.developerProjectPage.selectUnitCheckbox(1);
        await app.developerProjectPage.clickOnNextButton();
        await app.developerProjectPage.clickContinueBookingButton();

        await logStep("Step 04: Select the bank and confirm the booking > Verify booking list is visible");
        await app.developerProjectPage.selectBank(bankName);
        await app.developerProjectPage.clickOnNextButton();
        await app.developerProjectPage.clickOnConfirmationButton();

        await logStep("Step 05: Verify the reservation is successful");
        await app.developerProjectPage.validateSuccessReservationPopup();
    });

    test("TC-02 Developer verifies the reservation is present and cancels it (non-bene, offplan private)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        await logStep("Step 00: Read data from json relative to the service");
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const unitCode = data.unitCodeOffplanPrivate;

        await logStep("Step 01: Login as developer to sapa portal");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to individual bookings and validate the booking is available by unit code");
        await app.developerProjectPage.navigateToIndividualBookings();
        await app.developerProjectPage.searchBookingByUnitCode(unitCode);
        await app.developerProjectPage.filterBookingsByStatus("عرض السعر");
        await app.developerProjectPage.viewDetailsOfSearchedBooking();
        
        await logStep("Step 03: Navigate to booking details and cancel the booking");
        await app.discountOnReservedUnitsPage.clickOnBookingsTab();
        await app.discountOnReservedUnitsPage.selectCancellationReasonOption();
        await app.discountOnReservedUnitsPage.clickOnCancelBookingButton();
        await app.discountOnReservedUnitsPage.clickOnContinueCancellationButton();
        await app.discountOnReservedUnitsPage.clickOnNoButton();
        await app.discountOnReservedUnitsPage.fillCancellationOtpCodeInput(1234);
        await app.discountOnReservedUnitsPage.clickOnVerifyCancellationCodeButton();
        await app.discountOnReservedUnitsPage.verifyBeneficiaryCancellationToastSuccessMessage();
    });

    test("TC-03 - Developer books a unit for a beneficiary user in offplan moh land project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        await logStep("Step 00: Read data from json relative to the service");
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const nationalId = data.sakaniUserIdEligible;
        const unitCode = data.unitCodeOffplanMoh;
        const developerUserId = data.developerUserId;
        const bankName = "بنك الأهلي السعودي";

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Start new individual booking > Enter user id");
        await app.developerProjectPage.bookUnitsForCustomersUsingUnitCode(nationalId, unitCode);
        await page.waitForTimeout(5000);

        await logStep("Step 03: Select unit and move to financial information page");
        await app.developerProjectPage.selectUnitCheckbox(1);
        await app.developerProjectPage.clickOnNextButton();
        await app.developerProjectPage.clickSelectAndContinue();
        await app.developerProjectPage.clickContinueBookingButton();

        await logStep("Step 04: Select the bank and confirm the booking > Verify booking list is visible");
        await app.developerProjectPage.selectBank(bankName);
        await app.developerProjectPage.clickOnNextButton();
        await app.developerProjectPage.clickOnConfirmationButton();

        await logStep("Step 05: Verify the reservation is successful");
        await app.developerProjectPage.validateSuccessReservationPopup();
    });

    test("TC-04 Developer verifies the reservation is present and cancels it (beneficiary, offplan moh land)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        await logStep("Step 00: Read data from json relative to the service");
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const unitCode = data.unitCodeOffplanMoh;

        await logStep("Step 01: Login as developer to sapa portal");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to individual bookings and validate the booking is available by unit code");
        await app.developerProjectPage.navigateToIndividualBookings();
        await app.developerProjectPage.searchBookingByUnitCode(unitCode);
        await app.developerProjectPage.filterBookingsByStatus("عرض السعر");
        await app.developerProjectPage.viewDetailsOfSearchedBooking();

        await logStep("Step 03: Navigate to booking details and cancel the booking");
        await app.discountOnReservedUnitsPage.clickOnBookingsTab();
        await app.discountOnReservedUnitsPage.selectCancellationReasonOption();
        await app.discountOnReservedUnitsPage.clickOnCancelBookingButton();
        await app.discountOnReservedUnitsPage.clickOnContinueCancellationButton();
        await app.discountOnReservedUnitsPage.clickOnNoButton();
        await app.discountOnReservedUnitsPage.clickOnYesButton();
        await app.discountOnReservedUnitsPage.fillCancellationOtpCodeInput(1234);
        await app.discountOnReservedUnitsPage.clickOnVerifyCancellationCodeButton();
        await app.discountOnReservedUnitsPage.verifyBeneficiaryCancellationToastSuccessMessage();
    });
});