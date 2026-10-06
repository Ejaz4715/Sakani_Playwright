import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testDataSorting from "@data/test-data.json";


test.describe("Sorting", () => {
    test("TC-01 - Sort projects and verify orders", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const data = testDataSorting.services["sorting"];
        const environments = testDataSorting.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;
        const userID = data.sakaniUserId;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(userID);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Click on sorting based on button and select different sorting options > Verify the order of sorting changes accordingly");
        await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnRecommendedOption();

        let previousProjectNames = await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnMostPopularOption();
        await app.sortingPage.verifyProjectNamesChanged(previousProjectNames);

        previousProjectNames = await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnNewestFirstOption();
        await app.sortingPage.verifyProjectNamesChanged(previousProjectNames);

        previousProjectNames = await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnOldestFirstOption();
        await app.sortingPage.verifyProjectNamesChanged(previousProjectNames);

        previousProjectNames = await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnPriceHighToLowOption();
        await app.sortingPage.verifyProjectNamesChanged(previousProjectNames);

        previousProjectNames = await app.sortingPage.getFirstFiveProjectNames();
        await app.sortingPage.clickOnSortingBasedOnButton();
        await app.sortingPage.clickOnPriceLowToHighOption();
        await app.sortingPage.verifyProjectNamesChanged(previousProjectNames);

    });
});