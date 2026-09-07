const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-02 - Developer adds annex", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const projectName = testData.projectName;
  const developerUserId = testData.developerUserId;

  await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
  await app.developerProjectPage.loginDeveloper(developerUserId);
  await app.developerProjectPage.switchRoleToDeveloper();

  await app.developerProjectPage.confirmBooking(testData.bookedUnitCode);

  await app.developerProjectPage.openProjectBySearch(projectName);
  await app.developerProjectPage.openSalesContractsTab();

  const unitsImportFilePath = path.join(
    process.cwd(), "src",
    "data",
    "Sample pdf.pdf",
  );
  await app.developerProjectPage.openAddAnnexDialog();
  await app.developerProjectPage.searchUnitByCode(testData.bookedUnitCode);
  await app.developerProjectPage.selectFirstUnit();
  await app.developerProjectPage.openSelectedUnitsAnnexDialog();
  await app.developerProjectPage.uploadAnnexFile(unitsImportFilePath);
  await app.developerProjectPage.uploadAnnex();
  await app.developerProjectPage.approveAnnex();
  await app.developerProjectPage.fillOtp();
  await app.developerProjectPage.verifyOtp();
  await app.developerProjectPage.expectAnnexSuccess();
});
