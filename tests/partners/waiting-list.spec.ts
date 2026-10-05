import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testDataWaitingList from "@data/test-data.json"
const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
    return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function readWaitingListData() {
    return readTestData().services["waiting-list"];
}

function updateWaitingListData(updates: Record<string, unknown>) {
    const testData = readTestData();
    testData.services["waiting-list"] = {
        ...testData.services["waiting-list"],
        ...updates,
    };
    writeTestData(testData);
}

test.describe("Waiting List", () => {
    test("TC-01 - Developer add user to a specific project for waiting list", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const data = testDataWaitingList.services["waiting-list"];
        const environments = testDataWaitingList.environments;
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await logStep("Step 02: Navigate to waiting list > Click on new register");
        await app.waitingListPage.clickOnWaitingListSideButton();
        await app.waitingListPage.clickOnNewRegisterButton();
        await logStep("Step 03: Enter user id > Continue to next steps");
        await app.waitingListPage.fillSearchInputfield(data.sakaniUserId);
        await app.waitingListPage.clickOnSearchButton();
        await app.waitingListPage.clickOnNextButton();
        await logStep("Step 04: Select project to register in > Confirm");
        await app.waitingListPage.fillProjectSearchInputfield(projectName);
        await app.waitingListPage.clickOnSelectProjectButton();
        await app.waitingListPage.clickOnNextButton();
        await app.waitingListPage.clickOnProjectRadioCheck();
        await app.waitingListPage.clickOnNextButton();
        await app.waitingListPage.clickOnConfirmButton();
        await app.waitingListPage.clickOnConfirmButtonPopup();
        await logStep("Step 05: Verify the user registered successfully");
        await app.waitingListPage.verifyRegistrationSuccessMessage();

    });


    test("TC-02 - Verify the registered project request is in waiting list then cancel", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const data = testDataWaitingList.services["waiting-list"];
        const environments = testDataWaitingList.environments;
        const app = new WebApp(page);
        const userId = data.sakaniUserId;

        await logStep("Step 01: Navigate to sakani user > Login");
        await app.loginPage.gotoHomePage(environments.userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(userId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Navigate to waiting list request");
        await app.waitingListPage.clickOnUserIcon();
        await app.waitingListPage.ClickOnUserProfile();
        await app.waitingListPage.clickOnMyActivities();
        await app.waitingListPage.clickOnRegisteredWaitingList();
        await logStep("Step 03: Cancel the registered request");
        await app.waitingListPage.clickOnActiveTab();
        await app.waitingListPage.clickOnCancelRequestButton();
        await app.waitingListPage.clickOnConfirmCancellationButton();
        await app.waitingListPage.clickOnActiveTab();
        await logStep("Step 04: Validate that no registered project is exists");
        await app.waitingListPage.verifyNoActiveWaitingListProjectsMessage();

    });  

});