
import { test, expect } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));


const testDataPath = path.join(
  process.cwd(), "src",
  "data",
  "test-data.json",
);
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

test("TC-04-user-enable-booking-for-non-saudi-users", async ({ page }) => {
  test.setTimeout(120000);
  const app = new WebApp(page);

  await app.adminProjectPage.login(
    testData.adminPortalUrl,
    testData.adminUsername,
    testData.adminPassword,
  );
  await app.adminProjectPage.clickInternalInventory();
  await app.createMegaProjectPage.clickOnMegaProjects();
  await app.createMegaProjectPage.searchForMeagaProject(testData.megaProjectName);
  await app.createMegaProjectPage.clickOnSearchButton();
  await app.createMegaProjectPage.selectSearchedMegaProject();
  await app.createMegaProjectPage.clickOnEditButton();
  await app.createMegaProjectPage.enableNonSaudiDestinationSwitch();
  await app.createMegaProjectPage.clickOnUpdateButton();
  await page.waitForTimeout(10000);

});
