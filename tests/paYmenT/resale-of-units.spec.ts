import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}


test.describe("Offplan basket multiple booking", () => {
     test("TC_07 Admin configures project-level of resale settings", { annotation: [{ product: 'Marketplace', type: 'critical' }]as any }, async ({ page }) => {
    test.setTimeout(120000);
    const testData = readTestData();
    const app = new WebApp(page);
  
    await app.adminProjectPage.login(
      testData.adminPortalUrl,
      testData.adminUsername,
      testData.adminPassword,
    );
  
    await app.adminProjectPage.openProjects();
    await page.locator("//input[@formcontrolname='name']").fill(testData.projectName);
    await page.getByRole('button', { name: 'بحث' }).click();
    await page.getByRole('cell', { name: testData.projectName, exact: true }).click();
    await app.resaleOfUnitsPage.clickOnResaleSettingTab();
    await app.resaleOfUnitsPage.clickOnuseGeneralResaleSettingsSwitch();
    await app.resaleOfUnitsPage.selectResaleFeeType();
    await app.resaleOfUnitsPage.fillResaleFeeValue(10);
    await app.resaleOfUnitsPage.clickOnSaveButton();
    await app.resaleOfUnitsPage.verifyTheToastMessage();
  });
});