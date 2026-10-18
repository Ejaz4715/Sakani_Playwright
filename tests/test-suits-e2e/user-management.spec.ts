import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { UserManagementObjects } from '@objects/UserManagementObjects';

const SERVICE = 'user-management';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('User Management', () => {
  test('TC-01 - Verify the user if exist then remove him', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const userId = data.userId;
    const crNumber = data.crNumber;
    const email = data.email;
    const phoneNumber = data.phoneNumber;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();
    await logStep('Step 02: Search for the user > Check if exists remove him');
    await app.userManagementPage.clickUserManagementLink();
    await app.registrationPage.selectDropdownOption(UserManagementObjects.usersFilter, UserManagementObjects.iDNumberOption);
    await app.registrationPage.fillAllMatchingFields(UserManagementObjects.idNumberInputfield, userId);
    await app.userManagementPage.clickSearchButton();
    await app.userManagementPage.clickDeleteIconButton(userId);
  });
});
