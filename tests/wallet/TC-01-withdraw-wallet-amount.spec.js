const { test, expect } = require("@playwright/test");
const path = require("path");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-01 - Withdraw funds from wallet", async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const userPortalUrl = testData.userPortalUrl;

  //Navigate to user portal and login
  await app.loginPage.gotoHomePage(userPortalUrl);
  await app.loginPage.acceptCookies();
  await app.loginPage.openLogin();
  await app.loginPage.loginWithNafath("1129051502");
  await app.loginPage.waitForNafathPromptToDisappear();
  await app.loginPage.continueNewUserPopup();
  await app.loginPage.handlePushNotificationPopup();

  //Navigate to my wallet
  await app.bookingCancellationPage.clickProfileIcon();
  await page.getByText('محفظة').click();
  const balanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawBalanceText = await balanceElement.textContent();
  const balanceBeforewithdraw = rawBalanceText ? rawBalanceText.trim() : '';
  const reservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawReservedBalance = await reservedBalanceElement.textContent();
  const reservedBalanceBeforeWithdraw = rawReservedBalance ? rawReservedBalance.trim() : '';
  
  //Withdraw funds from wallet
  await page.getByRole('button', { name: 'استرداد' }).click();
  await page.getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'استرداد' }).click();

  //Enter OTP and confirm withdrawal
  await page.getByRole('textbox').nth(0).fill('1');
  await page.getByRole('textbox').nth(1).fill('2');
  await page.getByRole('textbox').nth(2).fill('3');
  await page.getByRole('textbox').nth(3).fill('4');
  await page.getByRole('button', { name: 'تحقق' }).click();

  //Validate that the withdrawal was successful
  await page.getByRole('heading', { name: 'تهانينا' }).click();
  await page.getByRole('button', { name: 'إغلاق' }).click();

  //Validate that the balance has been updated after withdrawal
  const updatedBalanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawUpdatedBalanceText = await updatedBalanceElement.textContent();
  const balanceAfterWithdraw = rawUpdatedBalanceText ? rawUpdatedBalanceText.trim() : '';
  expect(balanceAfterWithdraw).not.toEqual(balanceBeforewithdraw);

  //Validate that the reserved balance has been updated after withdrawal
  const updatedReservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawUpdatedReservedBalance = await updatedReservedBalanceElement.textContent();
  const reservedBalanceAfterWithdraw = rawUpdatedReservedBalance ? rawUpdatedReservedBalance.trim() : '';
  expect(reservedBalanceBeforeWithdraw).not.toEqual(reservedBalanceAfterWithdraw);

});