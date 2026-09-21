// @ts-nocheck
const { test, expect } = require("@playwright/test");
const path = require("path");
import { WebApp } from "@base-class/web-app";
const fs = require('fs');
const { logStep } = require('@helpers/LogSteps');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test("TC-01 Withdraw funds from wallet", { annotation: [{ product: 'Marketplace', type: 'critical' }] }, async ({ page }) => {
  test.setTimeout(0);
  const testData = readTestData();
  const app = new WebApp(page);
  const userPortalUrl = testData.userPortalUrl;

  await logStep('Step 01: Open the user portal and log in');
  await app.loginPage.gotoHomePage(userPortalUrl);
  await app.loginPage.acceptCookies();
  await app.loginPage.openLogin();
  await app.loginPage.loginWithNafath("1129051502");
  await app.loginPage.waitForNafathPromptToDisappear();
  await app.loginPage.continueNewUserPopup();
  await app.loginPage.handlePushNotificationPopup();

  await logStep('Step 02: Open the wallet page and capture balances');
  await app.bookingCancellationPage.clickProfileIcon();
  await page.getByText('محفظة').click();
  const balanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawBalanceText = await balanceElement.textContent();
  const balanceBeforewithdraw = rawBalanceText ? rawBalanceText.trim() : '';
  const reservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawReservedBalance = await reservedBalanceElement.textContent();
  const reservedBalanceBeforeWithdraw = rawReservedBalance ? rawReservedBalance.trim() : '';
  
  await logStep('Step 03: Submit a withdrawal request');
  await page.getByRole('button', { name: 'استرداد' }).click();
  await page.getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'استرداد' }).click();

  await logStep('Step 04: Confirm the withdrawal with OTP');
  await page.getByRole('textbox').nth(0).fill('1');
  await page.getByRole('textbox').nth(1).fill('2');
  await page.getByRole('textbox').nth(2).fill('3');
  await page.getByRole('textbox').nth(3).fill('4');
  await page.getByRole('button', { name: 'تحقق' }).click();

  await logStep('Step 05: Close the success confirmation');
  await page.getByRole('heading', { name: 'تهانينا' }).click();
  await page.getByRole('button', { name: 'إغلاق' }).click();

  await logStep('Step 06: Validate the wallet balances changed after withdrawal');
  const updatedBalanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawUpdatedBalanceText = await updatedBalanceElement.textContent();
  const balanceAfterWithdraw = rawUpdatedBalanceText ? rawUpdatedBalanceText.trim() : '';
  expect(balanceAfterWithdraw).not.toEqual(balanceBeforewithdraw);

  const updatedReservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
  const rawUpdatedReservedBalance = await updatedReservedBalanceElement.textContent();
  const reservedBalanceAfterWithdraw = rawUpdatedReservedBalance ? rawUpdatedReservedBalance.trim() : '';
  expect(reservedBalanceBeforeWithdraw).not.toEqual(reservedBalanceAfterWithdraw);

});