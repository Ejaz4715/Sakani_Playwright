const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-05 - Book , pay and select payment method", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserId;
  const userPortalUrl = testData.userPortalUrl;
  const projectName = testData.projectName;
  const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

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

  const page1Promise = page.waitForEvent("popup");
  await app.marketplaceLandingPage.openResidentialUnit();
  const page1 = await page1Promise;
  const page2Promise = page1.waitForEvent("popup");

  {
    const unitApp = new WebApp(page1);
    await unitApp.projectUnitsPage.openUnitInPopup(1);
  }

  const page2 = await page2Promise;
  const bookingApp = new WebApp(page2);

  await bookingApp.unitDetailsPage.reserveUnit();
  await bookingApp.bookingAndSelectPaymentMethodPage.checkOnTermAndCondition();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnApproveAndContinueIfVisible();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnPayBookingFeesButton();
  await bookingApp.paymentGatewayPage.fillCardDetails();
  await bookingApp.paymentConfirmationPage.closePayment();
  await bookingApp.paymentConfirmationPage.expectSuccessMessage();

  const unitCodeNew =
    await bookingApp.bookingAndSelectPaymentMethodPage.getUnitCode();
  expect(unitCodeNew).toBeTruthy();
  testData.unitCodeNew = unitCodeNew;
  fs.writeFileSync(
    testDataPath,
    JSON.stringify(testData, null, 2) + "\n",
    "utf8",
  );
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnFlexiblePaymentRadioButton();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSaveAndContinueButton();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSignContractButton();
  await bookingApp.unitBookingPage.signSalesContract();
  await bookingApp.unitBookingPage.expectSalesContractSuccess();
  await bookingApp.bookingAndSelectPaymentMethodPage.clickOnBookingDetailsButton();
  await bookingApp.page.waitForTimeout(10000);

});

// await page.pause();


