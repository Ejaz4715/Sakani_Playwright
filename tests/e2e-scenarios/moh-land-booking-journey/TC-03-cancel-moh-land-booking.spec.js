const { test, expect } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const testData = require(
  path.join(process.cwd(), "src", "data", "test-data.json"),
);

test("TC-03 - Cancel moh land booking", async ({ page }) => {
  test.setTimeout(0);

  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserIdMoh;
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
  await app.bookingCancellationPage.cancelMohLandBooking();
});
