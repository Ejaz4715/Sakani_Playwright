import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';

const SERVICE = 'secure-payment-schedules';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Secure Payment Schedules', () => {
  test('TC-01 Verify user viewing payment schedules', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environment.userPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Open the user portal and login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Navigate to project > Verify payment schedules is present');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.onlineLinding, true);
    await app.bookingPage.clickOnViewDetailsButton();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.paymentDetailsPopup, true);
  });
});
