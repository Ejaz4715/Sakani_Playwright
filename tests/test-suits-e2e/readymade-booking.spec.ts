import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import { BookingCancellationObjects } from "@objects/BookingCancellationObjects";
import { AdminObjects } from "@objects/AdminProjectsObjects";



const SERVICE = "readymade";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;



test.describe("ReadyMade Booking", () => {

    test("TC-01 User books readymade unit", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;
        const projectName = data.projectName;

        await logStep("Step 01: Open the user portal and login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 02: Find the project and open its unit model");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();

        await logStep("Step 03: Open a unit and start the booking");
        const page1Promise = page.waitForEvent("popup");
        // await app.marketplaceLandingPage.openResidentialUnit();
        const page1 = await page1Promise;
        const page2Promise = page1.waitForEvent("popup");
        {
            const unitApp = new WebApp(page1);
            await unitApp.projectUnitsPage.openUnitInPopup(1);
        }
        const page2 = await page2Promise;
        {
            let bookingPage = page2;
            let bookingApp = new WebApp(bookingPage);

            await logStep("Step 04: Confirm terms and conditons");
            await bookingApp.unitDetailsPage.reserveUnit();
            await bookingApp.unitBookingPage.acceptTermsAndConfirm();

            await logStep("Step 05: Validate payment success");
            //   await bookingApp.paymentGatewayPage.fillCardDetails();
            await bookingApp.paymentConfirmationPage.closePayment();
            await bookingApp.paymentConfirmationPage.expectSuccessMessage();
        }
    });

});