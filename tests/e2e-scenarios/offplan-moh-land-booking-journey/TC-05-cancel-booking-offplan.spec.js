const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-05 - User cancels a booking", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserId;
  const userPortalUrl = testData.userPortalUrl;

  await app.loginPage.gotoHomePage(userPortalUrl);
  await app.loginPage.acceptCookies();
  await app.loginPage.openLogin();
  await app.loginPage.loginWithNafath(sakaniUserId);
  await app.loginPage.waitForNafathPromptToDisappear();
  await app.loginPage.continueNewUserPopup();
  await app.loginPage.handlePushNotificationPopup();

  await app.bookingCancellationPage.openMyBookings();
  await app.bookingCancellationPage.openBookingDetails();
  await app.bookingCancellationPage.cancelBooking();
  await app.bookingCancellationPage.expectCancellationSuccess();
});
