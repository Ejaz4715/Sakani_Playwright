const { test, expect } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');
// const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
// const testData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-02 - Book moh land", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserIdMoh;
  const userPortalUrl = testData.userPortalUrl;
  const projectName = testData.projectName;
  
  await app.loginPage.gotoHomePage(userPortalUrl);
  await app.loginPage.acceptCookies();
  await app.loginPage.openLogin();
  await app.loginPage.loginWithNafath(sakaniUserId);
  await app.loginPage.waitForNafathPromptToDisappear();
  await app.loginPage.continueNewUserPopup();
  await app.loginPage.handlePushNotificationPopup();
  await app.marketplaceLandingPage.openSearch();
  await app.marketplaceLandingPage.searchForProject(projectName);
  await app.projectDetailsPage.openUnitsAndScroll();
  await app.projectUnitsPage.selectLand(1);
  await app.unitDetailsPage.reserveUnit();
  await app.unitBookingPage.signMohLandBooking();
  await expect(page.getByText("تهانينا!")).toBeVisible();
});
