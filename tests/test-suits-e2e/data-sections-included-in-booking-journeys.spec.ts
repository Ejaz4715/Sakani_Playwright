import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DataHelper } from "@helpers/DataHelper";
import testData from "@data/test-data.json";
import { BookingCancellationObjects } from "@objects/BookingCancellationObjects";
const SERVICE = "card-details";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
test.describe("Data Sections Included in Booking Journeys", () => {
    test("TC-01 Verifty the Insights and trends included in the project is available", { annotation: [{ product: "Real Estate Data", type: "non-critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;
        const realEstateDataProjectName = data.realEstateDataProjectName;

        await logStep("Step 01: Open the user portal and login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Verify insight and trends is available in the booking journey");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(realEstateDataProjectName);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.insightAndTrendsSection, true);
        await app.assetAndServiceProvidersPage.clickElement(BookingCancellationObjects.avaragePriceButton)
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.avaragePriceSection, true);
        await app.assetAndServiceProvidersPage.clickElement(BookingCancellationObjects.avaragePricePerM2Button)
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.avaragePricePerM2Section, true);
        await app.assetAndServiceProvidersPage.clickElement(BookingCancellationObjects.monthsDropdownList)
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.monthsOptions, true);
    });
    test("TC-02 Verifty the transactions included in the project is available", { annotation: [{ product: "Real Estate Data", type: "non-critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;
        const realEstateDataProjectName = data.realEstateDataProjectName;

        await logStep("Step 01: Open the user portal and login");
       await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Verify transactios is available in the booking journey");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(realEstateDataProjectName);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.transactionSection, true);
    });
    test("TC-03 Verifty the demographic included in the project is available", { annotation: [{ product: "Real Estate Data", type: "non-critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;
        const realEstateDataProjectName = data.realEstateDataProjectName;

        await logStep("Step 01: Open the user portal and login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Verify demographic is available in the booking journey");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(realEstateDataProjectName);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.demographicSection, true);
    });
});