const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

const NetworkRecorder = require(path.join(process.cwd(), "src", "helpers", "NetworkRecorder"));

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-04 - Book offplan unit", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const sakaniUserId = testData.sakaniUserId;
  const userPortalUrl = testData.userPortalUrl;
  const projectName = testData.projectName;


  await app.loginPage.gotoHomePage(userPortalUrl);
  await app.loginPage.acceptCookies();
  await app.loginPage.openLogin();
  await app.loginPage.loginWithNafath(sakaniUserId);
  await app.loginPage.waitForNafathPromptToDisappear();
  await app.loginPage.continueNewUserPopup();
  await app.loginPage.handlePushNotificationPopup();
   app.bookingCancellationPage.openMyBookings();

     /**========================================================================
   TRIGGER START: Start recording network traffic NOW (after contract signed)
  ==========================================================================**/
  const recorder = new NetworkRecorder(page);
  recorder.start();

  await app.bookingCancellationPage.openBookingDetails();




  await page.waitForTimeout(30000);

  /**=========================================================================
   TRIGGER STOP: Stop recording & save logs to JSON custom path
  ==========================================================================**/
  await recorder.stopAndSave(path.join(process.cwd(), "src", "network-logs.json"));

  const extractedValues = recorder.findInvoiceAndViban();
  // expect(extractedValues.invoiceNumber).toBeTruthy();
  // expect(extractedValues.viban).toBeTruthy();

  const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");
  await recorder.updateTestDataFile(testDataPath, extractedValues);



  // await fs.writeFile(
  //   path.join(__dirname, 'test_data_exchange.json'),
  //   JSON.stringify({ invoiceNumber, viban }, null, 2)
  // );

  // await app.marketplaceLandingPage.openSearch();
  // await app.marketplaceLandingPage.searchForProject(projectName);
  // await app.projectDetailsPage.openUnitsAndScroll();

  // const page1Promise = page.waitForEvent("popup");
  // await app.marketplaceLandingPage.openResidentialUnit();
  // const page1 = await page1Promise;
  // const page2Promise = page1.waitForEvent("popup");

  // {
  //   const unitApp = new WebApp(page1);
  //   await unitApp.projectUnitsPage.openUnitInPopup(1);
  // }

  // const page2 = await page2Promise;

  // {
  //   let bookingPage = page2;
  //   let bookingApp = new WebApp(bookingPage);
  //   await bookingApp.unitDetailsPage.reserveUnit();

  //   await page.pause();

  //   await bookingApp.unitBookingPage.acceptTermsAndConfirm();
  //   await bookingApp.paymentGatewayPage.fillCardDetails();
  //   await bookingApp.paymentConfirmationPage.closePayment();
  //   await bookingApp.paymentConfirmationPage.expectSuccessMessage();
  // }
});
