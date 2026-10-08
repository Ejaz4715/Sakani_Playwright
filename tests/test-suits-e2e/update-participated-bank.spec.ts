import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testData from "@data/test-data.json";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

test.describe("Update Participated Bank", () => {
       test("TC-01 Admin update the banks to be hidden", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const data = testData.services["update-participated-bank"];
        const environments = testData.environments;
        const app = new WebApp(page);
        const adminUrl = environments.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const projectName = data.projectName;


        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );

        await app.adminProjectPage.openProjects();

        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);
        // await page.locator('div').filter({ hasText: data.projectName }).click();
        await page.waitForTimeout(10000);

        await logStep("Step 05: Unselect participating banks > Save and verify");
        await app.adminProjectPage.expectFinancingEntitiesVisible();
        await app.adminProjectPage.clickFinancingEntities();
        await app.adminProjectPage.expectSelectAllRowsVisible();
        await app.adminProjectPage.clickSelectAllRowsForBankClassState(false);
         await app.paymentTrackingPage.clickOnSaveButton();
        await app.adminProjectPage.clickProjectDetailsTab();
         await app.paymentTrackingPage.clickOnSaveButton();
        await app.paymentTrackingPage.verifySaveSuccessToast();
    });

    test("TC-02 Verify the banks are hidden", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testData.environments;
        const data = testData.services["update-participated-bank"];
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
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();

        await logStep("Step 03: Open a unit and start the booking");
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

            await logStep("Step 04: Verify the banks are not present");
            await bookingApp.bookingPage.verifyTheAvialabilityOfTheBanks(true);
        }
    });

       test("TC-03 Admin update the banks to be present", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const data = testData.services["update-participated-bank"];
        const environments = testData.environments;
        const app = new WebApp(page);
        const adminUrl = environments.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const projectName = data.projectName;


        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );

        await app.adminProjectPage.openProjects();

        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);
        // await page.locator('div').filter({ hasText: data.projectName }).click();
        await page.waitForTimeout(10000);

        await logStep("Step 05: Unselect participating banks > Save and verify");
        await app.adminProjectPage.expectFinancingEntitiesVisible();
        await app.adminProjectPage.clickFinancingEntities();
        await app.adminProjectPage.expectSelectAllRowsVisible();
        await app.adminProjectPage.clickSelectAllRowsForBankClassState(true);
         await app.paymentTrackingPage.clickOnSaveButton();
        await app.adminProjectPage.clickProjectDetailsTab();
         await app.paymentTrackingPage.clickOnSaveButton();
        await app.paymentTrackingPage.verifySaveSuccessToast();
    });

    test("TC-04 Verify the banks are present", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testData.environments;
        const data = testData.services["update-participated-bank"];
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
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();

        await logStep("Step 03: Open a unit and start the booking");
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

            await logStep("Step 04: Verify the banks are present");
            await bookingApp.bookingPage.verifyTheAvialabilityOfTheBanks(false);
        }
    });
});