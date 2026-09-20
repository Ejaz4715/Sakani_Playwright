const { test } = require("@playwright/test");
import type { Page } from "@playwright/test";
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
    const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-02 - Developer adds flexible payment schedules", async ({ page }: { page: Page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const projectName = testData.projectName;
    const developerUserId = testData.developerUserId;

    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.flexiblePaymentPage.clickOnFinancialManagemnt();
    await app.flexiblePaymentPage.clickOnPaymentSchedules();
    await app.flexiblePaymentPage.clickOnNewSchedulesButton();
    await app.flexiblePaymentPage.enterScheduleNameInArabic("Test");
    await app.flexiblePaymentPage.selectScheduleType("specificPeriod");
    await app.flexiblePaymentPage.selectPalnType();
    await app.flexiblePaymentPage.enterPlanPeriod("36");
    await app.flexiblePaymentPage.clickOnNextButton();
    await app.flexiblePaymentPage.clickOnNextButton();
    await app.flexiblePaymentPage.serachByprojectName(projectName);
    await app.flexiblePaymentPage.checkOnProjectNameSearchedResult();
    await app.flexiblePaymentPage.clickOnNextButton();
    await app.flexiblePaymentPage.clickOnNextButton();
    await app.flexiblePaymentPage.clickOnConfirmButton();
    await app.flexiblePaymentPage.verifyTheSuccessfulMessage();

});