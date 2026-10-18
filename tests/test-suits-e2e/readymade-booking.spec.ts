import { test, expect, Page } from '@playwright/test';
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { DataHelper } from '@helpers/DataHelper';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';
import { AdminObjects } from '@objects/AdminProjectsObjects';

const SERVICE = 'readymade';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('ReadyMade Booking', () => {
  test('TC-01 User books readymade unit', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
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

    await logStep('Step 02: Find the project and open its unit model');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 03: Open a unit and start the booking');

    // await app.marketplaceLandingPage.openResidentialUnit();

    await app.projectUnitsPage.selectLand(1);
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    // const page2Promise = page1.waitForEvent("popup");

    const unitApp = new WebApp(page1);

    await logStep('Step 05: Complete the booking and sign contract');
    await app.unitDetailsPage.reserveUnit();
    await app.unitBookingPage.signMohLandBookingContract();
    await logStep('Step 05: Validate the success page');
    await expect(page.getByText('تهانينا!')).toBeVisible();
  });
});
