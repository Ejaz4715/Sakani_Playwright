import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DateUtils } from '@pages/utils/DateUtils';
import { WebApp } from '@base-class/web-app';
import path from 'node:path';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'mega-project';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Mega project journey', () => {
  test('TC-01 Admin creates new offplan Moh land project for mega project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = `Automation Project Offplan ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 02: Navigate to add new project');
    await app.adminProjectPage.clickInternalInventory();
    await app.adminProjectPage.clickProjectsLink();
    await app.adminProjectPage.clickAddNewProjectButton();

    await logStep('Step 03: Enter project details and save');
    await app.adminProjectPage.fillProjectName(projectName);
    await app.adminProjectPage.selectProjectType('مشاريع البيع على الخارطة على أراضي الوزارة');
    await app.adminProjectPage.selectRegion('الرياض');
    await app.adminProjectPage.selectCity('الخرج');
    await app.adminProjectPage.selectDeveloperName('شركة الضاحية المثالية للتطوير والاستثمار العقاري');
    await app.adminProjectPage.toggleBookableOn();
    await app.adminProjectPage.selectProjectStatus('متاح');
    await app.adminProjectPage.fillWafiLicenseExpiryDate(DateUtils.getDateISO(600));
    await app.adminProjectPage.selectSubsidyType('دعم عيني كامل');
    await app.adminProjectPage.fillMaxSubsidyAmount('2');
    await app.adminProjectPage.fillProjectAgreementDate('2026-01-01');
    await app.adminProjectPage.fillProjectLicenseNumber('665334');
    await app.adminProjectPage.fillProjectLicenseDate(DateUtils.getDateWithOffsetAndFormat(600, 'YYYY-MM-DD'));
    await app.adminProjectPage.fillEscrowAccountName('Sakani Test User');
    await app.adminProjectPage.fillEscrowAccountNumber('SA1111111111111111111111');
    await app.adminProjectPage.selectBank('بنك الأهلي السعودي');
    await app.adminProjectPage.fillDeductionPercentage('2');
    await app.adminProjectPage.fillDeedIssueCityArabic('الرياض');
    await app.adminProjectPage.fillDeedIssueCityEnglish('Riyadh');
    await app.adminProjectPage.fillDeedDate('01/01/2026');
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 04: Link the project to AZM');
    await app.adminProjectPage.linkProjectToAzm();

    await logStep('Step 05: Select participating banks');
    await app.adminProjectPage.expectFinancingEntitiesVisible();
    await app.adminProjectPage.clickFinancingEntities();
    await app.adminProjectPage.expectSelectAllRowsVisible();
    await app.adminProjectPage.clickSelectAllRows();
    await app.adminProjectPage.clickSaveButton();

    await logStep('Step 06: Import and commit project units');
    await app.adminProjectPage.clickUnitsTab();
    await app.adminProjectPage.expectImportNewUnitButtonVisible();
    await app.adminProjectPage.clickImportNewUnitButton();
    await app.adminProjectPage.expectResidentialUnitTypeVisible();
    await app.adminProjectPage.openResidentialUnitTypeDropdown();
    await app.adminProjectPage.selectApartmentUnitType();
    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'Offplan_MOH.xlsx');
    await app.adminProjectPage.uploadUnitsFile(unitsImportFilePath);
    await app.adminProjectPage.clickImportSaveButton();
    await app.adminProjectPage.waitForUnitImportCompletion();
    await app.adminProjectPage.clickApproveButton();
    await app.adminProjectPage.clickConfirmButton();
    await app.adminProjectPage.waitForImportConfirmation();
    await app.adminProjectPage.clickBackButton();

    await logStep('Step 07: Upload project media and enter media details');
    await app.adminProjectPage.clickProjectMediaTab();
    const bannerImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image.jpg');
    await app.adminProjectPage.uploadBannerImage(bannerImagePath);
    await app.adminProjectPage.clickUploadButton();
    await app.adminProjectPage.selectDisplayMethod('Hero');
    await app.adminProjectPage.fillDetailsTitleArabic(projectName);
    await app.adminProjectPage.fillDetailsTitleEnglish(projectName);
    await app.adminProjectPage.fillFirstUnitReadyDate('2026-01-01');
    await app.adminProjectPage.fillNameArabic(projectName);
    await app.adminProjectPage.fillNameEnglish(projectName);
    await app.adminProjectPage.fillSummaryArabic('ملخص المشروع'.repeat(10));
    await app.adminProjectPage.fillSummaryEnglish('Project Summary'.repeat(10));
    await app.adminProjectPage.fillDescriptionArabic('الوصف (باللغة العربية)'.repeat(10));
    await app.adminProjectPage.fillDescriptionEnglish('Description EN'.repeat(10));
    await app.adminProjectPage.fillStartingPrice('500000');
    await app.adminProjectPage.fillLatitude('1.1');
    await app.adminProjectPage.fillLongitude('1.1');
    await app.adminProjectPage.expectMediaUploadComplete(0);
    await app.adminProjectPage.fillGuarenteeAfterServices('Test guarantee after services');
    await app.adminProjectPage.clickMediaSaveButton();

    await logStep('Step 08: Approve project media');
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickKeepProjectUnpublishedButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 09: Publish the unit model');
    await app.adminProjectPage.clickUnitModelsSection();
    await app.adminProjectPage.clickUnitModelCell();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickMediaDraftSection();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickPublishUnitButton();
    await app.adminProjectPage.clickUnitModelLink();

    await logStep('Step 10: Set project availability');
    await app.adminProjectPage.clickProjectDetailsText();
    await app.adminProjectPage.selectProjectStatus('متاح');
    await app.adminProjectPage.selectAvailableProjectStatus();
    await app.adminProjectPage.clickSaveButton();

    await logStep('Step 11: Publish the project and validate the toast message');
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.publishProject();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
  });

  test('TC-02 Admin creates new mega project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const megaProjectName = `Mega Project ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    DataHelper.updateServiceData(SERVICE, 'megaProjectName', megaProjectName);

    await logStep('Step 01: Login to admin portal');
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 02: Navigate to mega projects');
    await app.adminProjectPage.clickInternalInventory();
    await app.createMegaProjectPage.clickOnMegaProjects();

    await logStep('Step 03: Add new mega project and enter the details');
    await app.createMegaProjectPage.clickOnAddNewMegaProject();
    await app.createMegaProjectPage.enterMegaProjectInformation(megaProjectName);
    await app.createMegaProjectPage.selectRegion('الرياض');
    await app.createMegaProjectPage.selectCity('الرياض');
    await app.createMegaProjectPage.enterLatitude('10');
    await app.createMegaProjectPage.enterLongitude('10');
    await app.createMegaProjectPage.enterVideoLink('www.test.com');

    await logStep('Step 04: Upload media');
    const filepath = path.join(process.cwd(), 'src', 'data', 'Sample image.jpg');
    await app.createMegaProjectPage.uploadBannerImage(filepath);
    await app.createMegaProjectPage.uploadImageGallery(filepath);
    await app.createMegaProjectPage.clickOnAddMegaProject();
    await app.createMegaProjectPage.searchAndSelectProject(data.projectName);
    await app.createMegaProjectPage.selectSearchedProject(data.projectName);

    await logStep('Step 05: Finish adding the mega project');
    await app.createMegaProjectPage.clickOnAddToMegaProject();
    await app.createMegaProjectPage.clickOnMegaProjectInformationLink();
    await page.waitForTimeout(10000);
  });

  test('TC-03 Verify non-saudi user can not book offplan unit from the mega project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;
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
    await app.projectDetailsPage.openUnits();

    await logStep('Step 03: Navigate to units details page and validate the booking is not available');
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
      const bookingApp = new WebApp(page2);
      await bookingApp.createMegaProjectPage.verifyProjectNotAvailableForNonSaudiMessage();
    }
  });

  test('TC-04 Admin enables the booking for non-saudi users in the mega project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);

    await logStep('Step 01: Login to admin portal');
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);
    await logStep('Step 02: Navigate to mega projects');
    await app.adminProjectPage.clickInternalInventory();
    await app.createMegaProjectPage.clickOnMegaProjects();

    await logStep('Step 03: Search for project and navigate to it');
    await app.createMegaProjectPage.searchForMeagaProject(data.megaProjectName);
    await app.createMegaProjectPage.clickOnSearchButton();
    await app.createMegaProjectPage.selectSearchedMegaProject();

    await logStep('Step 04: Enable booking for non saudi');
    await app.createMegaProjectPage.clickOnEditButton();
    await app.createMegaProjectPage.enableNonSaudiDestinationSwitch();
    await app.createMegaProjectPage.clickOnUpdateButton();
    await page.waitForTimeout(10000);
  });

  test('TC-05 Verify non-saudi user can book offplan unit from mega project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }: { page: Page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;
    const sakaniUserId = data.sakaniUserId;
    const projectName = data.projectName;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Search for project > View units');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnits();

    await logStep('Step 03: Navigate to units details page and validate the booking is available for the user');
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
      const bookingApp = new WebApp(page2);
      await bookingApp.createMegaProjectPage.verifyReserveUnitButtonIsVisible();
    }
  });
});
