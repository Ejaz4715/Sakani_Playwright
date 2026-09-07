const { test } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-02 - User joins hybrid auction and signs contract", async ({
  page,
}) => {
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
  await app.marketplaceLandingPage.openSearch();
  await app.marketplaceLandingPage.searchForProject(projectName);
  await app.auctionPage.openUnit();
  // await page.getByRole('button', { name: 'المشاركة في المزاد' }).click();
  // await page.getByRole('radio', { name: 'متصل' }).check();
  // await page.getByRole('button', { name: 'تأكيد' }).click();
  // await page.locator('app-choose-payment-method').filter({ hasText: 'بطاقة ائتمانالدفع باستخدام مدى، فيزا، ماستركارد' }).locator('#id').check();
  // await page.getByRole('checkbox', { name: 'أؤكد قراءتي وفهمي وموافقتي على الشروط والأحكام' }).check();
  // await page.getByRole('button', { name: 'تأكيد' }).click();
  await app.auctionPage.joinHybridAuction();
  await app.paymentGatewayPage.fillCardDetails();
  await app.auctionPage.validateCongratulationsMessaeg();
  await app.auctionPage.returnToAuction("العودة إلى وحدة المزاد");
  await app.auctionPage.expectAuctionPaymentPending();
});
