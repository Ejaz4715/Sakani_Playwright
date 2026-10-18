import { test, expect } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Marketplace Units', () => {
  test('TC-01 Verify user filter for a unit', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.filtersPage.clickOnPropertiesForSaleButton();
    await app.filtersPage.clickOnReadyMadeUnits();

    await logStep('Step 02: Filter for unit > Verify the unit is present');
    await app.bookingPage.selectPropertyType();
    await app.bookingPage.clickOnSaveButton();
    const unitDetailsPagePromise = page.waitForEvent('popup');
    await app.bookingPage.clickUnitResultCard();
    const unitDetailsPage = await unitDetailsPagePromise;
    await expect(unitDetailsPage.locator(BookingCancellationObjects.unitResultDetailsPage.xpath)).toBeVisible();
  });

  test('TC-02 Verify user filter by register of interest', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.filtersPage.clickOnPropertiesForSaleButton();
    await app.filtersPage.clickOnOffPlanSaleUnits();

    await logStep('Step 02: Filter by register of interest > Verify the unit is present');
    await app.bookingPage.clickOnRegisterOfInterest();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.unitResultCard, true);
  });
});
