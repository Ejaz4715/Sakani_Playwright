import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'completion-rate-management';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Completion Rate Management', () => {
  test('TC-01  Admin enables completion percentage', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const adminUrl = environments.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to projects page');
    await app.adminProjectPage.openProjects();

    await logStep("Step 03: Search for project and navigate to project's details page");
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);
    // await page.locator('div').filter({ hasText: data.projectName }).click();
    await page.waitForTimeout(10000);

    await logStep('Step 04: Enable the completion percenage and Save');
    await app.adminProjectPage.clickCompletionPercentageSwitch(true);
    await app.paymentTrackingPage.clickOnSaveButton();
    await app.paymentTrackingPage.verifySaveSuccessToast();
  });

  test('TC-02 Verify the completion percentage is present', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
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
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 03: Open a unit and start the booking');
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

      await logStep('Step 04: Verify the completion percentage is present');
      await bookingApp.bookingPage.verifyCompletionPercentageProgressIsVisible(true);
    }
  });

  test('TC-03  Admin disables completion percentage', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const adminUrl = environments.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to projects page');
    await app.adminProjectPage.openProjects();

    await logStep("Step 03: Search for project and navigate to project's details page");
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);
    // await page.locator('div').filter({ hasText: data.projectName }).click();
    await page.waitForTimeout(10000);

    await logStep('Step 04: Disable the completion percenage and Save');
    await app.adminProjectPage.clickCompletionPercentageSwitch(false);
    await app.paymentTrackingPage.clickOnSaveButton();
    await app.paymentTrackingPage.verifySaveSuccessToast();
  });

  test('TC-04 Verify the completion percentage is hidden', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
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
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 03: Open a unit and start the booking');
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
      await logStep('Step 04: Verify the completion percentage is hidden');
      await bookingApp.bookingPage.verifyCompletionPercentageProgressIsVisible(false);
    }
  });
});
