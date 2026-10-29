import { test, expect } from '@playwright/test';
import path from 'node:path';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'update-unit';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Add, update or delete the units of an offplan project through SAPA portal', () => {
  test('TC-01 Developer adds new unit to the project', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const filePath = path.join(process.cwd(), 'src', 'data', 'add-unit.xlsx');

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await page.pause();
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for project');
    await app.developerProjectPage.openProjectBySearch(projectName);

    await logStep('Step 03: Navigate to add unit > Upload units file');
    await app.updateUnitsPage.selectManageProjectOption('إضافة وحدات');
    await app.updateUnitsPage.selectApartmentUnitType();
    await app.updateUnitsPage.uploadFile(filePath);

    await logStep('Step 04: Add the file and confirm');
    await app.updateUnitsPage.clickAddUnitFile();
    await page.waitForTimeout(1500);
    await app.updateUnitsPage.clickConfirmYesButton();
    await page.waitForTimeout(3000);
    await app.updateUnitsPage.clickConfirmYesButton();

    await logStep('Step 07: Validate the analysis file is present');
    await app.updateUnitsPage.verifyAddUnitsAnalysisIsVisible();
  });

  test('TC-02 Admin accepts the add new unit request', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const adminUrl = environment.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to projects and search for a project');
    await app.adminProjectPage.openProjects();
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
    await page.waitForTimeout(10000);

    await logStep('Step 03: Navigate to units tab');
    await app.adminProjectPage.expectFinancingEntitiesVisible();
    await app.adminProjectPage.clickUnitsTab();

    await logStep('Step 03: Accpet the add unit request and validate the toast message');
    await app.adminProjectPage.clickAcceptButton();
    await app.adminProjectPage.validateSuccessToastMessageText('لقد قمت بقبول طلب الحذف بنجاح');
  });

  test('TC-03 Developer checks the new unit is reflected under project units', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const unitCode = data.newUnitCode;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await page.pause();
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for project');
    await app.developerProjectPage.openProjectBySearch(projectName);

    await logStep('Step 03: Navigate to project units');
    await app.updateUnitsPage.clickUnitDetailsTab();

    await logStep('Step 04: Search for a unit by unit code');
    await app.updateUnitsPage.selectUnitCodeSearchCriteria();
    await app.updateUnitsPage.fillUnitCode(unitCode);
    await app.updateUnitsPage.clickSearchUnitButton();

    await logStep('Step 05: Validate the added unit is available');
    await page.waitForTimeout(3000);
    await app.updateUnitsPage.validateUnitCodePresence();
  });

  test('TC-04 Sakani user checks the added unit is reflected in the user platform', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environment.userPortalUrl;
    const projectName = data.projectName;
    const unitCode = data.newUnitCode;
    const apartmentNumber = unitCode.split('-').slice(-2).join('-');

    await logStep('Step 01: Open the user portal and login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await page.pause();
    await logStep('Step 02: Find the project and open its unit model');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 03: Open a unit and start the booking');
    const page1Promise = page.waitForEvent('popup');
    await app.marketplaceLandingPage.openResidentialUnit();
    const page1 = await page1Promise;
    {
      const unitApp = new WebApp(page1);
      await unitApp.projectUnitsPage.validateTheUnitPresence(apartmentNumber);
    }
  });

  test(
    'TC-05 Developer update the unit target segment and checks the update is reflected for the targetted unit',
    { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const sapaPortalUrl = environment.sapaPortalUrl;
      const unitCode = data.newUnitCode;
      const filePath = path.join(process.cwd(), 'src', 'data', 'update-unit.xlsx');

      await logStep('Step 01: Login as developer to sapa portal and open the project');
      await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
      await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
      await page.pause();
      await app.partnersLoginPage.switchRoleToDeveloper();

      await logStep('Step 02: Search for project');
      await app.developerProjectPage.openProjectBySearch(projectName);

      await logStep('Step 03: Navigate to project units');
      await app.updateUnitsPage.clickUnitDetailsTab();

      await logStep('Step 04: Search for a unit by unit code');
      await app.updateUnitsPage.selectUnitCodeSearchCriteria();
      await app.updateUnitsPage.fillUnitCode(unitCode);
      await app.updateUnitsPage.clickSearchUnitButton();

      await logStep('Step 05: Get the current channels of the unit');
      await page.waitForTimeout(3000);
      const targetSegmentBefore = await app.updateUnitsPage.getUnitTargetSegment();

      await logStep('Step 06: Navigate to add unit > Upload units file');
      await app.updateUnitsPage.selectManageProjectOption('تحديث وحدات المشروع');
      await app.updateUnitsPage.selectApartmentUnitType();
      await app.updateUnitsPage.uploadFile(filePath);

      await logStep('Step 07: Add the file and confirm');
      await app.updateUnitsPage.clickAddUnitFile();
      await page.waitForTimeout(1500);
      await app.updateUnitsPage.clickConfirmYesButton();
      await page.waitForTimeout(3000);
      await app.updateUnitsPage.clickConfirmYesButton();

      await logStep('Step 08: Validate the analysis file is present');
      await app.updateUnitsPage.verifyAddUnitsAnalysisIsVisible();

      await logStep('Step 09: Confirm the file and approve');
      await page.waitForTimeout(5000);
      await page.reload();
      await page.waitForTimeout(3000);
      await app.updateUnitsPage.clickConfirmUnitPriceUpdateButton();
      await app.updateUnitsPage.clickConfirmYesButton();

      await logStep('Step 10: Validate the unit target segment is updated');
      await app.developerProjectPage.openProjectBySearch(projectName);
      await app.updateUnitsPage.clickUnitDetailsTab();
      await app.updateUnitsPage.selectUnitCodeSearchCriteria();
      await app.updateUnitsPage.fillUnitCode(unitCode);
      await app.updateUnitsPage.clickSearchUnitButton();
      await page.waitForTimeout(3000);
      const targetSegmentAfter = await app.updateUnitsPage.getUnitTargetSegment();
      expect(targetSegmentAfter).not.toEqual(targetSegmentBefore);
    }
  );

  test('TC-06 Developer deletes the unit', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const unitCode = data.newUnitCode;
    const filePath = path.join(process.cwd(), 'src', 'data', 'delete_unit.xlsx');

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await page.pause();
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for project');
    await app.developerProjectPage.openProjectBySearch(projectName);

    await logStep('Step 03: Navigate to add unit > Upload units file');
    await app.updateUnitsPage.selectManageProjectOption('حذف وحدات');
    await app.updateUnitsPage.uploadFile(filePath);

    await logStep('Step 04: Confirm delete unit');
    await app.updateUnitsPage.clickDeleteButton();
    await page.waitForTimeout(1500);
    await app.updateUnitsPage.clickConfirmYesButton();
    await page.waitForTimeout(3000);
    await app.updateUnitsPage.clickConfirmYesButton();

    await logStep('Step 08: Validate the analysis file is present');
    await app.updateUnitsPage.verifyDeleteUnitsAnalysisIsVisible();
  });

  test('TC-07 Admin accepts the delete unit request', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const adminUrl = environment.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to projects and search for a project');
    await app.adminProjectPage.openProjects();
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
    await page.waitForTimeout(10000);

    await logStep('Step 03: Navigate to units tab');
    await app.adminProjectPage.expectFinancingEntitiesVisible();
    await app.adminProjectPage.clickUnitsTab();

    await logStep('Step 03: Accpet the add unit request and validate the toast message');
    await app.adminProjectPage.clickAcceptButton();
    await app.adminProjectPage.validateSuccessToastMessageText('لقد قمت بقبول طلب الحذف بنجاح');
  });

  test('TC-08 Developer checks the deleted unit is not found under project units', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const unitCode = data.newUnitCode;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await page.pause();
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Search for project');
    await app.developerProjectPage.openProjectBySearch(projectName);

    await logStep('Step 03: Navigate to project units');
    await app.updateUnitsPage.clickUnitDetailsTab();

    await logStep('Step 04: Search for a unit by unit code');
    await app.updateUnitsPage.selectUnitCodeSearchCriteria();
    await app.updateUnitsPage.fillUnitCode(unitCode);
    await app.updateUnitsPage.clickSearchUnitButton();

    await logStep('Step 05: Validate the deletd unit is not available');
    await page.waitForTimeout(3000);
    await app.updateUnitsPage.validateUnitCodeIsNotPresent();
  });

  //** // await page.getByRole("button", { name: "رفض" }).nth(1).click();
  // page.getByRole("textbox", { name: "سبب الرفض" }).fill("Test reject reason from admin");
  // await page.locator("//span[normalize-space() = 'رفض']").click(); */
});
