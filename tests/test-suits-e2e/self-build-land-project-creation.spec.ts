import { test } from '@playwright/test';
const path = require('path');
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { SelfConstructionObjects } from '@objects/SelfConstructionObjects';

const SERVICE = 'self-build-land-project-creation';

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

test.describe('Self-Build Land Project Creation', () => {
  test('TC-01 Admin creates self construction project', { annotation: [{ product: 'Self-Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const projectName = `SelfConstruction Prject Name ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    writeServiceData('projectName', projectName);

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to add new project');
    await app.adminProjectPage.clickInternalInventory();
    await app.adminProjectPage.clickProjectsLink();
    await app.adminProjectPage.clickAddNewProjectButton();

    await logStep('Step 03: Enter project details and save');
    await app.adminProjectPage.fillProjectName(projectName);
    await app.adminProjectPage.selectProjectType('البناء المطور');
    await app.adminProjectPage.selectRegion('الرياض');
    await app.adminProjectPage.selectCity('الخرج');
    await app.adminProjectPage.selectDeveloperName('شركة الضاحية المثالية للتطوير والاستثمار العقاري');
    await app.adminProjectPage.selectSubsidyType('دعم عيني كامل');
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 04: Import and commit project units');
    await app.adminProjectPage.clickUnitsTab();
    await app.adminProjectPage.expectImportNewUnitButtonVisible();
    await app.adminProjectPage.clickImportNewUnitButton();
    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'Self_Construction_sample.xlsx');
    await app.adminProjectPage.uploadUnitsFile(unitsImportFilePath);
    await app.adminProjectPage.clickImportSaveButton();
    await app.adminProjectPage.waitForUnitImportCompletion();
    await app.adminProjectPage.clickApproveButton();
    await app.adminProjectPage.clickConfirmButton();
    await app.adminProjectPage.waitForImportConfirmation();
    await app.adminProjectPage.clickBackButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 05: Upload booking document templates');
    const bookingDocumentTemplate = path.join(process.cwd(), 'src', 'data', 'Sample word file.docx');
    await app.commonMethods.clickElement(SelfConstructionObjects.bookingDocumentTemplateSection);
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadBookingDocumentTemplate(bookingDocumentTemplate);
    await app.selfConstructionPage.selectFirstDocumentTemplateType();
    await app.adminProjectPage.clickUploadButton();

    await logStep('Step 06: Publish the unit model');
    await app.adminProjectPage.clickUnitModelsSection();
    await app.adminProjectPage.clickUnitModelCell();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickMediaDraftSection();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickPublishUnitButton();
    await app.adminProjectPage.clickUnitModelLink();
    await app.adminProjectPage.clickProjectDetailsText();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
  });
  test('TC-02 Admin add services packeges linked with the project', { annotation: [{ product: 'Self-Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const projectName = data.projectName;
    const servicesPackegesUrl = data.servicesPackegesUrl;

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(servicesPackegesUrl, adminUsername, adminPassword);
    await logStep('Step 02: Navigate to services packages');
    //  await app.partnersLoginPage.gotoAuth(servicesPackegesUrl);
    await app.commonMethods.clickElement(SelfConstructionObjects.linkedWithSection);

    await logStep('Step 03: Link the package with the project');
    await app.commonMethods.clickElement(SelfConstructionObjects.addIconButton);
    await app.commonMethods.clickElement(SelfConstructionObjects.selectProjectInputfield);
    await app.selfConstructionPage.waitUntilNotFoundOptionHidden();
    await app.selfConstructionPage.fill(SelfConstructionObjects.selectProjectInputfield, projectName);
    await page.waitForTimeout(3000);
    await app.commonMethods.clickElement(SelfConstructionObjects.selectProjectOption);
    await page.waitForTimeout(5000);
    await app.commonMethods.clickElement(SelfConstructionObjects.selectBlockDropdownList);
    await app.commonMethods.clickElement(SelfConstructionObjects.selectBlocksOption);
    await app.commonMethods.clickElement(SelfConstructionObjects.updateButton);

    await logStep('Step 04: Verify the successful message');
    await app.commonMethods.verifyElementVisible(SelfConstructionObjects.succsessfullToasMessage);
  });
  test('TC-03  Admin approve media and publish the project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to the project');
    await app.adminProjectPage.openProjects();
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);

    await logStep('Step 04: Upload project media and enter media details');
    await app.adminProjectPage.clickProjectMediaTab();
    const bannerImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image.jpg');
    const masterPlanImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');
    await app.adminProjectPage.uploadBannerImage(bannerImagePath);
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadMasterPlan(masterPlanImagePath);
    await app.adminProjectPage.clickUploadButton();
    await app.selfConstructionPage.uploadImage(masterPlanImagePath);
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
    await app.adminProjectPage.clickMediaSaveButton();

    await logStep('Step 05: Approve project media');
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickKeepProjectUnpublishedButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 06: Select participating banks');
    await app.adminProjectPage.expectFinancingEntitiesVisible();
    await app.adminProjectPage.clickFinancingEntities();
    await app.adminProjectPage.expectSelectAllRowsVisible();
    await app.adminProjectPage.clickSelectAllRows();
    await app.adminProjectPage.clickSaveButton();

    await logStep('Step 07: Publish the project and validate the toast message');
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.publishProject();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
  });
  test('TC-04 Admin remove the project from linked services packeges', { annotation: [{ product: 'Self-Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const projectName = data.projectName;
    const servicesPackegesUrl = data.servicesPackegesUrl;

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(servicesPackegesUrl, adminUsername, adminPassword);
    await logStep('Step 02: Navigate to services packages');
    await app.commonMethods.clickElement(SelfConstructionObjects.linkedWithSection);
    await logStep('Step 03: Remove the project from the package');
    await app.commonMethods.clickElement(SelfConstructionObjects.deleteButton);
    await page.waitForTimeout(3000);
    await logStep('Step 04: Verify the successful message');
    await app.commonMethods.clickElement(SelfConstructionObjects.updateButton);
    await page.waitForTimeout(3000);
  });
});
