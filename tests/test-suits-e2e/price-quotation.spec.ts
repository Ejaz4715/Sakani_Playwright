import { test, expect } from "@playwright/test";
const path = require("path");
import { DateUtils } from "@pages/utils/DateUtils";
import { WebApp } from "@base-class/web-app";
import { logStep } from "@helpers/LogSteps";
import offplanTestData from '@data/test-data.json';
import { DataHelper } from "@helpers/DataHelper";



test.describe("Price Quotation", () => {

    test("TC-01 User download the price quotation and verify it", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = offplanTestData.environments;
        const data = offplanTestData.services["offplan-booking"];
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 03: Open completed bookings");
        await app.bookingPage.openCompletedBookings();
        await logStep("Step 04: Capture booked unit code and save to test data");
        const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        DataHelper.updateServiceData("offplan-booking", "bookedUnitCode", bookedUnitCode);
        await logStep("Step 05: Open booking details");
        await app.bookingPage.openBookingDetails();
        await logStep('Step 06: Clear the downloads folder');
        const downloadDirectory = path.join(process.cwd(), "src", "downloads");
        await app.paymentsAndTransactionsPage.clearDownloadsFolder(downloadDirectory);
        await logStep('Step 07: Open the price quotation preview and capture its PDF > Save pdf in download directory');
        const pdfResponsePromise = app.paymentsAndTransactionsPage.waitForPdfResponse();
        await app.bookingPage.clickOnViewOfProcequotationButton();
        const pdfResponse = await pdfResponsePromise;
        const fileName = 'price-quotation.pdf';
        const downloadPath = path.join(downloadDirectory, fileName);
        await logStep('Step 05: Save the invoice and verify it exists');
        await app.paymentsAndTransactionsPage.savePdfResponse(pdfResponse, downloadPath);
        await app.paymentsAndTransactionsPage.verifySavedFile(downloadPath, downloadDirectory);
        await app.bookingPage.verifyPriceQuotationContainsRequiredSections(downloadPath);
    },
    );
});