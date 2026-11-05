import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { UserManagementObjects } from '@objects/UserManagementObjects';

const SERVICE = 'user-management';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('User Management', () => {
  test('TC-01 Verify the user if exist then remove him', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for the user > Check if exists remove him');
    await app.userManagementPage.clickUserManagementLink();
    await app.userManagementPage.selectSearchBy();
    await app.userManagementPage.enterUserIdPartners(userId);
    await app.userManagementPage.clickSearchButton();
    await app.userManagementPage.clickDeleteIconButton(userId);
    await app.userManagementPage.clickOnAcceptButton();
    await app.userManagementPage.verifyUserDeletedMessageIsPresent();
  });
  test('TC-02 Add a new delegate user and validate the deactivated user can not login', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;
    const crNumber = data.crNumber;
    const email = data.email;
    const phoneNumber = data.phoneNumber;

    await logStep('Step 01: Register with new user > Select individual > Click on continue');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.registerNewUser(userId);
    await app.userManagementPage.clickOnIndividualRadioButton();
    await app.userManagementPage.clickOnContinueButton();

    await logStep('Step 02: Select company representative > Click on continue');
    await app.userManagementPage.clickOnCompanyRepresentativeRadioButton();
    await app.userManagementPage.clickOnContinueButton();

    await logStep('Step 03: Enter company cr number > Click on continue');
    await app.userManagementPage.enterCompanyCrNumber(crNumber);
    await app.userManagementPage.clickOnContinueButton();

    await logStep('Step 04: Enter user id > Click on continue');
    await app.userManagementPage.enterUserId(userId);
    await app.userManagementPage.clickOnContinueButton();
    await app.partnersLoginPage.confirmIdentityIfRequired();

    await logStep('Step 05: Enter email and phoneNumber > Check terms and conditions > Click on register');
    await app.userManagementPage.enterEmail(email);
    await app.userManagementPage.enterPhoneNumber(phoneNumber);
    await app.userManagementPage.checkOnTermsAndConditions();
    await app.userManagementPage.clickOnRegisterButton();

    await logStep('Step 06: Click on go to dashboard button > Verify the user can not login');
    await app.userManagementPage.clickOnGoToDashboardButton();
    await app.userManagementPage.verifyUserFailedToLoginMessageIsPresent();
  });
    test('TC-03 Developer Activate the new user', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for the user > Activate the user > Verify the success activation message is present');
    await app.userManagementPage.clickUserManagementLink();
    await app.userManagementPage.selectSearchBy();
    await app.userManagementPage.enterUserIdPartners(userId);
    await app.userManagementPage.clickSearchButton();
    await app.userManagementPage.activateTheUser();
    await app.userManagementPage.verifySuccessActivationMessageIsPresent();
  });
    test('TC-04 Verify the activated user able to login and have no permission', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(userId);

    await logStep('Step 02: Verify the user logged in and have no permission');
    await app.userManagementPage.verifyBookingsPermissionIsNotVisible();
  });
  test('TC-05 Developer add permission to a user', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for the user > Click on permission edit button');
    await app.userManagementPage.clickUserManagementLink();
    await app.userManagementPage.selectSearchBy();
    await app.userManagementPage.enterUserIdPartners(userId);
    await app.userManagementPage.clickSearchButton();
    await app.userManagementPage.clickPermissionEditButton(userId);
    await logStep('Step 03: Add permission to the user > Verify the success message is present');
    await app.userManagementPage.clickOnMainPermissionsDropdownButton();
    await app.userManagementPage.switchOnBookingsManagementPermissionSwitchButton();
    await app.userManagementPage.verifySuccessActivationMessageIsPresent();
  });
      test('TC-06 Verify the user have permission', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(userId);

    await logStep('Step 02: Verify the user have permission');
    await app.userManagementPage.verifyBookingsPermissionIsVisible();
  });
  test('TC-07 Developer delete a user', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for the user > Check if exists remove him');
    await app.userManagementPage.clickUserManagementLink();
    await app.userManagementPage.selectSearchBy();
    await app.userManagementPage.enterUserIdPartners(userId);
    await app.userManagementPage.clickSearchButton();
    await app.userManagementPage.clickDeleteIconButton(userId);
    await app.userManagementPage.clickOnAcceptButton();
    await app.userManagementPage.verifyUserDeletedMessageIsPresent();
  });
});