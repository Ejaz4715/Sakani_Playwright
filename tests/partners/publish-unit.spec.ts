import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
    return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function updatePublishUnitTestData(key: string, value: string) {
    const testData = readTestData();
    testData["publish-unit"] = {
        ...testData["publish-unit"],
        [key]: value,
    };
    writeTestData(testData);
}


test.describe("Publish Unit", () => {

    test("TC-01 - Developer broker publish new unit request", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {

        test.setTimeout(0);
        const testData = readTestData();

        const publishUnitData = testData["publish-unit"];
        const savedLicenseNumber = String(publishUnitData.AdLicenseNumber ?? "");
        const savedNumber = Number(
            savedLicenseNumber.match(/\d+$/)?.[0] ??
                publishUnitData.lastAdLicenseCounter
        );
        const currentNumber =
            Number.isSafeInteger(savedNumber) && savedNumber >= 1000000000
                ? savedNumber
                : Math.floor(1000000000 + Math.random() * 8999999999);

        if (currentNumber >= 9999999999) {
            throw new Error("The 10-digit AdLicenseNumber counter has reached its maximum value.");
        }

        const nextCounter = currentNumber + 1;
        const AdLicenseNumber = String(nextCounter);

        const updatedData = {
            ...testData,
            "publish-unit": {
                ...publishUnitData,
                lastAdLicenseCounter: nextCounter,
                AdLicenseNumber,
            },
        };

        writeTestData(updatedData);

        const app = new WebApp(page);
        const sapaUrl = testData.environments.sapaPortalUrl;
        const developerUserId = publishUnitData.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.publishUnitPage.switchRoleToDeveloperBroker();


    });










//   await page.getByRole('link', { name: 'الخدمات' }).click();
//   await page.getByRole('tab', { name: 'نشر' }).click();
//   await page.getByRole('button', { name: 'البدء' }).click();
//   await page.locator('label').filter({ hasText: 'نشر وحدة واحدة حدد وحدة واحدة من الصكوك ليتم نشرها في منصة سكني' }).click();
//   await page.getByRole('button', { name: 'التالي' }).click();

   
//  //input[@placeholder='قم ترخيص الإعلان']
//  //app-sapa-dropdown[@formcontrolname='id_type']/descendant::ng-select
//  //input[@placeholder='رقم هوية المعلن']
  
//   await page.getByRole('button', { name: 'المتابعة' }).click();
//   await page.locator('#preferred_communication_type').getByRole('combobox').click();
//   await page.getByRole('option', { name: 'الواتساب' }).click();
//   //label[@for='height']/parent::div/descendant::input
// //label[@for='width']/parent::div/descendant::input
// //label[@for='building_year']/parent::div/descendant::ng-select
//  //label[@for='description']/following-sibling::textarea


//  //label[@for='exterior_photo_form']/parent::div/descendant::input
// //label[@for='interior_photo_form']/parent::div/descendant::input
//  //span[contains(text(),'قر على صحة البيانات المدخلة')]/parent::div/preceding-sibling::app-sapa-checkbox

 
//   await page.getByRole('button', { name: 'إرسال نشر وحدة' }).click();
//   await expect(page.locator('app-publish-unit-send-modal')).toBeVisible();
// });





    test("TC-02  Admin approves publish unit request", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const testData = readTestData();

        const publishUnitData = testData["publish-unit"];
        const app = new WebApp(page);
        const adminUrl = testData.environments.adminPortalUrl;
        const adminUsername = publishUnitData.adminUsername;
        const adminPassword = publishUnitData.adminPassword;
        const adLicenseNumber = publishUnitData.AdLicenseNumber;


        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );

        await app.adminProjectPage.openProjects();

        await app.resaleOfUnitsPage.fillProjectName(adLicenseNumber);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(testData.projectName);
        // await page.locator('div').filter({ hasText: testData.projectName }).click();
        await page.waitForTimeout(10000);
        await app.paymentTrackingPage.clickOnProjectSettings();
        await app.paymentTrackingPage.clickOnUseGeneralSettingSwitch();
        await app.paymentTrackingPage.clickOnSaveButton();
        await app.paymentTrackingPage.verifySaveSuccessToast();

    });
});