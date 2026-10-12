const path = require("path");
import { test, expect } from "@playwright/test";
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import testDataPaymentsAndTransactions from '@data/test-data.json'


test.describe("Payments and transactions", () => {
  test("TC-01 User preview and download the invoice and receipt", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    const sakaniUserId = testDataPaymentsAndTransactions.services['payments-and-transactions'].sakaniUserId;
    const userPortalUrl = testDataPaymentsAndTransactions.environments.userPortalUrl;

    await logStep('Step 01: Login to the user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await app.bookingPage.clickProfileIcon();
    await app.bookingPage.clickManageProfile();

    await logStep('Step 02: Open payments history');
    await app.paymentsAndTransactionsPage.clickPaymentHistoryLink();
    
    await logStep('Step 03: Clear the downloads folder');
    const downloadDirectory = path.join(process.cwd(), "src", "downloads");
    await app.paymentsAndTransactionsPage.clearDownloadsFolder(downloadDirectory);

    await logStep('Step 04: Open the invoice preview and capture its PDF > Save pdf in download directory');
    const pdfResponsePromise = app.paymentsAndTransactionsPage.waitForPdfResponse();
    await app.paymentsAndTransactionsPage.clickInvoicePreviewButton();
    const pdfResponse = await pdfResponsePromise;
    const fileName = 'payment-invoice.pdf';
    const downloadPath = path.join(downloadDirectory, fileName);

    await logStep('Step 05: Save the invoice and verify it exists');
    await app.paymentsAndTransactionsPage.savePdfResponse(pdfResponse, downloadPath);
    await app.paymentsAndTransactionsPage.verifySavedFile(downloadPath, downloadDirectory);
  })

  test("TC-02 Withdraw funds from wallet", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    const environment = testDataPaymentsAndTransactions.environments;
    const data = testDataPaymentsAndTransactions.services['payments-and-transactions'];

    await logStep('Step 01: Open the user portal and log in');
    await app.loginPage.gotoHomePage(environment.userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath("1129051502");
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Open the wallet page and capture balances');
    await app.bookingPage.clickProfileIcon();
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
});
