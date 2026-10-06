import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import { PublishUnitObjects } from "@objects/PublishUnitObjects";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");
const filePath = path.join(process.cwd(), "src", "data", "Sample image.jpg");

function readTestData() {
    return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function updatePublishUnitTestData(key: string, value: string) {
    const testData = readTestData();
    testData.services["publish-unit"] = {
        ...testData.services["publish-unit"],
        [key]: value,
    };
    writeTestData(testData);
}


test.describe("Publish Unit", () => {
    test("TC-01 - Developer broker publish new unit request", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const testData = readTestData();
        const publishUnitData = testData.services["publish-unit"];

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14);

        DataHelper.updateServiceData("publish-unit", "AdLicenseNumber", timestamp);
        // testDataPublishUnit.services["publish-unit"].adminUsername = publishUnitData;
        // const savedLicenseNumber = String(publishUnitData.AdLicenseNumber ?? "");
        // const savedNumber = Number(
        //     savedLicenseNumber.match(/\d+$/)?.[0] ??
        //         publishUnitData.lastAdLicenseCounter
        // );
        // const currentNumber =
        //     Number.isSafeInteger(savedNumber) && savedNumber >= 1000000000
        //         ? savedNumber
        //         : Math.floor(1000000000 + Math.random() * 8999999999);

        // if (currentNumber >= 9999999999) {
        //     throw new Error("The 10-digit AdLicenseNumber counter has reached its maximum value.");
        // }
        // const nextCounter = currentNumber + 1;
        // const AdLicenseNumber = String(nextCounter);
        // const updatedData = {
        //     ...testData,
        //     services: {
        //       ...testData.services,
        //       "publish-unit": {
        //         ...publishUnitData,
        //         lastAdLicenseCounter: nextCounter,
        //         AdLicenseNumber,
        //       },
        // },
        // };
        // writeTestData(updatedData);
        const app = new WebApp(page);
        const sapaUrl = testData.environments.sapaPortalUrl;
        const developerUserId = publishUnitData.developerUserId;
        const advertiserId = publishUnitData.advertiserId;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.publishUnitPage.switchRoleToDeveloperBroker();
        await logStep("Step 02: Navigate to publish unit page > Select publish unit > Fill request information");
        await app.publishUnitPage.clickOnServicesLink();
        await app.publishUnitPage.clickOnManagePublishButton();
        await app.publishUnitPage.clickOnPublishTab();
        await app.publishUnitPage.clickOnStartButton();
        await app.publishUnitPage.clickOnSingleUnitOption();
        await app.publishUnitPage.clickOnNextButton();
        await app.publishUnitPage.fillAdLicenseNumberInputfield(timestamp);
        await app.publishUnitPage.selectAdvertiserIdType();
        await app.publishUnitPage.fillAdvertiserIdNumberInputfield(advertiserId);
        await app.publishUnitPage.clickOnContinueButton();
        await logStep("Step 03: Fill unit details > Send publish unit request > Verify request sent successfully");
        await app.publishUnitPage.selectPreferredCommunicationType();
        await app.publishUnitPage.fillHeightInputfield(10);
        await app.publishUnitPage.fillWidthInputfield(10);
        await app.publishUnitPage.selectBuildingYear();
        await app.publishUnitPage.fillDescriptionTextarea("test description");
        await app.publishUnitPage.uploadExteriorPhoto(filePath);
        await app.publishUnitPage.uploadInteriorPhoto(filePath);
        await app.publishUnitPage.clickOnDataAccuracyDisclaimerCheckbox();
        await app.publishUnitPage.clickOnSendPublishUnitButton();
        await app.publishUnitPage.verifyPublishUnitSendModalIsVisible();
    });


    test("TC-02  Admin approves publish unit request", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const testData = readTestData();
        const data = testData.services["publish-unit"];
        const environments = testData.environments;
        // const publishUnitData = testData.services["publish-unit"];
        const app = new WebApp(page);
        const adminUrl = environments.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const adLicenseNumber = data.AdLicenseNumber;
        await logStep("Step 01: Navigate to admin platform > Login");

        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );
        await logStep("Step 02: Navigate publish unit requests page");
        await app.publishUnitPage.clickOnExternalInventoryLink();
        await app.publishUnitPage.clickOnReadyMarketUnitsLink();
        await app.publishUnitPage.clickOnRequestTab();
        await logStep("Step 03: Search for the ad license number > View publish unit request");
        await app.publishUnitPage.fillAdminAdLicenseNumberInputfield(adLicenseNumber);
        await app.publishUnitPage.clickOnAdLicenseNumberResultCell(adLicenseNumber);
        await app.publishUnitPage.clickOnViewPublishUnitLink();
        await logStep("Step 04: > Approve the request > Verify approval success message");
        await app.publishUnitPage.clickOnAcceptButton();
        await app.publishUnitPage.verifyPublishUnitApprovalSuccessMessage();
    });


    test("TC-03 - Developer verify the request is finished", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const testData = readTestData();
        const data = testData.services["publish-unit"];
        const environments = testData.environments;
        const app = new WebApp(page);
        const sapaUrl = environments.sapaPortalUrl;
        const developerUserId = data.developerUserId;
        const adLicenseNumber = data.AdLicenseNumber;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.publishUnitPage.switchRoleToDeveloperBroker();
        await logStep("Step 02: Navigate to publish unit page > Search for approved request by ad license number");
        await app.publishUnitPage.clickOnServicesLink();
        await app.publishUnitPage.clickOnManagePublishButton();
        await app.publishUnitPage.fillAdLicenseNumberToSearchInputfield(adLicenseNumber);
        await app.publishUnitPage.clickOnSearchButton();
        await logStep("Step 03: Verify the request status is finished");
        await app.publishUnitPage.verifyAdLicenseStatus("منتهي");
    });
});