const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-03 - Developer approves sales contract", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const projectName = testData.projectName;
  const developerUserId = testData.developerUserId;

  await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
  await app.developerProjectPage.loginDeveloper(developerUserId);
  await app.developerProjectPage.switchRoleToDeveloper();
  await app.developerProjectPage.openProjectBySearch(projectName);

  await app.developerProjectPage.openSalesContractsTab();
  await app.developerProjectPage.viewAndApproveSalesContract();
  await app.developerProjectPage.approveUnitSpecification();
  await app.developerProjectPage.fillOtp("1234");
  await app.developerProjectPage.verifyOtp();
  await app.developerProjectPage.verifyApprovalSuccessMessage();
});
