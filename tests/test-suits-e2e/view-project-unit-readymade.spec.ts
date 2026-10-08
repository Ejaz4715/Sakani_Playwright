


import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testData from "@data/test-data.json";
import { BookingCancellationObjects } from "@objects/BookingCancellationObjects";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

test.describe("View Proejct and unit of Readymade", () => {
    test("TC-01 Verify user viewing the project", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testData.environments;
        const data = testData.services["view-project-unit-readymade"];
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

        await logStep("Step 02: Verify project sections are present");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectInfoSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.brochureAndMasterplanSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectUnitsTypesSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectFacilitiesSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectInsightSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.participatinBanksSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectContactsSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectUnitsSection, true);
    });

    test("TC-02 Verify user viewing the unit", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testData.environments;
        const data = testData.services["view-project-unit-readymade"];
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
        await app.marketplaceLandingPage.openReadyMadeUniy();
        await logStep("Step 04: Verify unit sections are present");
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectInfoSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.brochureCard, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.masterplanCard, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.licenseAndAdvertismentSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.unitDetailsSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectFacilitiesSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.husngAssistancentSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.participatinBanksSection, true);
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectContactsSection, true);

    });
});