import { test, expect } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const { DateUtils } = require(
  path.join(process.cwd(), "src", "Pages", "utils", "DateUtils"),
);
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));

const testDataPath = path.join(
  process.cwd(), "src",
  "data",
  "test-data.json",
);
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

test("TC-07  Verify same payment schedle in payment tracking and booking details", async ({ page }) => {
  test.setTimeout(120000);
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
  // await page.locator('div').filter({ hasText: testData.projectName }).click();
  await page.waitForTimeout(10000);

  await app.paymentTrackingPage.clickOnPaymentTrackingTab();
  await app.paymentTrackingPage.fillUnitCode(testData.unitCodeNew);
  await app.paymentTrackingPage.clickOnSearchButton();
  await app.paymentTrackingPage.clickOnSearchedUnit();
  await app.paymentTrackingPage.waitForCompletionPercentageVisible();
  await app.paymentTrackingPage.clickOnBeneficiariesSideMenu();
  await app.paymentTrackingPage.clickOnBeneficiariesListSideMenu();
  // await app.paymentTrackingPage.selectSearchByOption();
  await app.paymentTrackingPage.fillSearchUnit(testData.sakaniUserId);
  await app.paymentTrackingPage.clickOnSearchButtonForUnit();
  await app.paymentTrackingPage.clickOnSearchResult();
  await app.paymentTrackingPage.clickOnBookingDetailsTab();
  await app.paymentTrackingPage.clickOnSearchResult();
  await app.paymentTrackingPage.clickOnPaymentTrackingTab();
  await app.paymentTrackingPage.waitForSpecifiedPeriodVisible();
});
