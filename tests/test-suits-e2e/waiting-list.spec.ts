import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'waiting-list';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Waiting List', () => {
  test('TC-01 Developer add user to a specific project for waiting list', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to waiting list > Click on new register');
    await app.waitingListPage.clickOnWaitingListSideButton();
    await app.waitingListPage.clickOnNewRegisterButton();

    await logStep('Step 03: Enter user id > Continue to next steps');
    await app.waitingListPage.fillSearchInputfield(data.sakaniUserId);
    await app.waitingListPage.clickOnSearchButton();
    await app.waitingListPage.clickOnNextButton();

    await logStep('Step 04: Select project to register in > Confirm');
    await app.waitingListPage.fillProjectSearchInputfield(projectName);
    await app.waitingListPage.clickOnSelectProjectButton();
    await app.waitingListPage.clickOnNextButton();
    await app.waitingListPage.clickOnProjectRadioCheck();
    await app.waitingListPage.clickOnNextButton();
    await app.waitingListPage.clickOnConfirmButton();
    await app.waitingListPage.clickOnConfirmButtonPopup();

    await logStep('Step 05: Verify the user registered successfully');
    await app.waitingListPage.verifyRegistrationSuccessMessage();
  });

  test('TC-02 Verify the registered project request is in waiting list then cancel', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const userId = data.sakaniUserId;

    await logStep('Step 01: Navigate to sakani user > Login');
    await app.loginPage.gotoHomePage(environments.userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Navigate to waiting list request');
    await app.waitingListPage.clickOnUserIcon();
    await app.waitingListPage.ClickOnUserProfile();
    await app.waitingListPage.clickOnMyActivities();
    await app.waitingListPage.clickOnRegisteredWaitingList();

    await logStep('Step 03: Cancel the registered request');
    await app.waitingListPage.clickOnActiveTab();
    await app.waitingListPage.clickOnCancelRequestButton();
    await app.waitingListPage.clickOnConfirmCancellationButton();
    await app.waitingListPage.clickOnActiveTab();

    await logStep('Step 04: Validate that no registered project is exists');
    await app.waitingListPage.verifyNoActiveWaitingListProjectsMessage();
  });
});
