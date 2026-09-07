const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-05 - User signs sales contract", async ({ page }) => {
  test.setTimeout(30000);
  const testData = readTestData();
  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserId;
  const userPortalUrl = testData.userPortalUrl;

  await test.step("Open user portal", async () => {
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
  });

  await test.step("Log in with Nafath", async () => {
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
  });

  await test.step("Open active bookings", async () => {
    await app.bookingCancellationPage.openMyBookings();
  });

  await test.step("Capture booked unit code", async () => {
    const bookedUnitCode =
      await app.bookingCancellationPage.getBookedUnitCode();

    expect(bookedUnitCode).toBeTruthy();
    testData.bookedUnitCode = bookedUnitCode;
    fs.writeFileSync(
      testDataPath,
      JSON.stringify(testData, null, 2) + "\n",
      "utf8",
    );
  });

  await test.step("Open booking details", async () => {
    await app.bookingCancellationPage.openBookingDetails();
  });
  await app.unitDetailsPage.openSalesContract();
  await app.unitBookingPage.signSalesContract();
  await app.unitBookingPage.expectSalesContractSuccess();
});
