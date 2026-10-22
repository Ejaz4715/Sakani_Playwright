import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';
import { AdminObjects } from '@objects/AdminProjectsObjects';

const SERVICE = 'list-of-real-estate-brokers-and-developers';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('List Of Real Estate Brokers And Developers', () => {
  test('TC-01 - Admin view a broker/developer information', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const adminUrl = environments.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const developerName = data.developerName;

    await logStep('Step 01: Navigate to admin platform > Login');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);
    await logStep('Step 02: Navigate to brokers and developers page');
    await app.adminProjectPage.clickPartnerLink();
    await app.filtersPage.clickElement(AdminObjects.realEstateDevelopersLink);

    await logStep('Step 03: Search for developer/broker company');
    await app.adminProjectPage.fillDeveloperName(developerName);
    await app.adminProjectPage.clickOnDeveloperNameResult(developerName);

    await logStep('Step 04: > Verify broker/developer information is present');
    await app.adminProjectPage.verifyDeveloperInformationPageText(developerName);
  });

  test('TC-02 - Verify user viewing the broker/developer information details', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
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

    await logStep('Step 02: Verify broker/developer information details is present');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
    await app.bookingPage.clickOnDeveloperNameSection();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.developerInfoPage, true);
  });

  test('TC-03 - Admin disables developer contact information', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const adminUrl = environments.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const developerName = data.developerName;

    await logStep('Step 01: Navigate to admin platform > Login');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to brokers and developers page');
    await app.adminProjectPage.clickPartnerLink();
    await app.filtersPage.clickElement(AdminObjects.realEstateDevelopersLink);

    await logStep('Step 03: Search for developer/broker company');
    await app.adminProjectPage.fillDeveloperName(developerName);
    await app.adminProjectPage.clickOnDeveloperNameResult(developerName);

    await logStep('Step 04: > Switch off the contact info > Verify the success message');
    await app.adminProjectPage.clickDeveloperContactInfoSwitch(false);
    await app.paymentTrackingPage.clickOnSaveButton();
    await app.paymentTrackingPage.verifySaveSuccessToast();
  });

  test('TC-04 - Verify developer/broker contact information is hidden', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
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

    await logStep('Step 02: Verify broker/developer contact information is hidden');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
    await app.bookingPage.clickOnDeveloperNameSection();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.callButton, false);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.whatsAppButton, false);
  });

  test('TC-05 - Admin enables developer contact information', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const adminUrl = environments.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const developerName = data.developerName;

    await logStep('Step 01: Navigate to admin platform > Login');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to brokers and developers page');
    await app.adminProjectPage.clickPartnerLink();
    await app.filtersPage.clickElement(AdminObjects.realEstateDevelopersLink);

    await logStep('Step 03: Search for developer/broker company');
    await app.adminProjectPage.fillDeveloperName(developerName);
    await app.adminProjectPage.clickOnDeveloperNameResult(developerName);

    await logStep('Step 04: > Switch off the contact info > Verify the success message');
    await app.adminProjectPage.clickDeveloperContactInfoSwitch(true);
    await app.adminProjectPage.fillDeveloperPhoneNumber('550005500');
    await app.paymentTrackingPage.clickOnSaveButton();
    await app.paymentTrackingPage.verifySaveSuccessToast();
  });

  test('TC-06 - Verify developer/broker contact information is present', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
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

    await logStep('Step 02: Verify broker/developer contact information is present');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);
    await app.bookingPage.clickOnDeveloperNameSection();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.callButton, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.whatsAppButton, true);
  });
});
