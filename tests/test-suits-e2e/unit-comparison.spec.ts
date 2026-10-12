import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testDataUnitComparison from "@data/test-data.json";


test.describe("Unit Comparison", () => {
    test("TC-01 - User compare units", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const data = testDataUnitComparison.services["unit-comparison"];
        const environments = testDataUnitComparison.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;
        const userID = data.sakaniUserId;
        const projectName = data.projectName;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(userID);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Search for project > View units");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();
        await logStep("Step 03: Select first unit > Click compare button");
        const page1Promise = page.waitForEvent("popup");
        await app.marketplaceLandingPage.openResidentialUnit();
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
            await bookingApp.unitComparisonPage.clickProjectHeaderCompareButton();
        }
        await page1.bringToFront();
        const page3Promise = page1.waitForEvent("popup");
        const unitApp = new WebApp(page1);
        await unitApp.projectUnitsPage.openUnitInPopup(2);
        const page3 = await page3Promise;
        await logStep("Step 04: Select second unit > Click compare button");
        {
            let bookingPage = page3;
            let bookingApp = new WebApp(bookingPage);
            await bookingApp.unitComparisonPage.clickProjectHeaderCompareButton();
            await logStep("Step 05: Click compare button > Verify comparison units page is visible");
            await bookingApp.unitComparisonPage.clickCompareButton();
            await bookingApp.unitComparisonPage.verifyComparisonHeadingIsVisible();
        }
    });
});