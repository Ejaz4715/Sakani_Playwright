 
 
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
 
 
 
 test("TC-01  Admin enables completion percentage", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const data = testData.services["completion-rate-management"];
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
    ////////////////////////////////////////////////////////////
        await app.paymentTrackingPage.clickOnSaveButton();
        await app.paymentTrackingPage.verifySaveSuccessToast();

    });