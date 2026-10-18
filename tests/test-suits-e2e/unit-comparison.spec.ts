import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'waiting-list';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Unit Comparison', () => {
  test('TC-01 - User compare units', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environments.userPortalUrl;
    const userID = data.sakaniUserId;
    const projectName = data.projectName;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userID);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await logStep('Step 02: Search for project > View units');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();
    await logStep('Step 03: Select first unit > Click compare button');
    const page1Promise = page.waitForEvent('popup');
    await app.marketplaceLandingPage.openResidentialUnit();
    const page1 = await page1Promise;
    const page2Promise = page1.waitForEvent('popup');
    {
      const unitApp = new WebApp(page1);
      await unitApp.projectUnitsPage.openUnitInPopup(1);
    }
    const page2 = await page2Promise;
    {
      let bookingPage = page2;
      let bookingApp = new WebApp(bookingPage);
      await bookingApp.unitComparisonPage.clickProjectHeaderCompareButton();
    }
    await page1.bringToFront();
    const page3Promise = page1.waitForEvent('popup');
    const unitApp = new WebApp(page1);
    await unitApp.projectUnitsPage.openUnitInPopup(2);
    const page3 = await page3Promise;
    await logStep('Step 04: Select second unit > Click compare button');
    {
      let bookingPage = page3;
      let bookingApp = new WebApp(bookingPage);
      await bookingApp.unitComparisonPage.clickProjectHeaderCompareButton();
      await logStep('Step 05: Click compare button > Verify comparison units page is visible');
      await bookingApp.unitComparisonPage.clickCompareButton();
      await bookingApp.unitComparisonPage.verifyComparisonHeadingIsVisible();
    }
  });
});
