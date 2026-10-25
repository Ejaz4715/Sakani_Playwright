import { test, expect, Page } from '@playwright/test';
const path = require('path');
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { DataHelper } from '@helpers/DataHelper';
import buyDesignData from '@data/test-data.json';

const SERVICE = 'buy-design';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Order design', () => {
  test('TC-01 User buys a design (only design option)', { annotation: [{ product: 'Self Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    const data = readServiceData();
    const environments = readEnvironments();

    const userId = data['with-fitting'].userId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Navigate to designs page');
    await app.buyDesignPage.clickOnServicesButton();
    await app.buyDesignPage.clickOnViewAllServicesButton();
    await app.buyDesignPage.clickOnSelfConstructionServiceLink();
    const page1Promise = page.waitForEvent('popup');
    await app.buyDesignPage.clickOnViewDetailsLink();
    const page1 = await page1Promise;
    const designApp = new WebApp(page1);

    await logStep('Step 04: Select design');
    await designApp.buyDesignPage.checkAdvancedSearchToggle();
    await designApp.buyDesignPage.selectDesign();
    await designApp.buyDesignPage.clickOnViewDesignProfileText();
    await designApp.buyDesignPage.clickOnViewText();
    await designApp.buyDesignPage.clickOnBuyDesignButton();
    await logStep('Step 05: Select only design then fill all steps and pay');
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.checkTermsAndConditionsCheckbox();
    await designApp.buyDesignPage.clickOnPayNowButton();
    await designApp.paymentGatewayPage.fillCardDetails();
    await logStep('Step 06: Verify successfully paid');
    await designApp.buyDesignPage.verifyPaymentSuccess();
  });

  test('TC-02 Admin adds an Moh land project (design only)', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const projectName = `Automation Moh Land Project ${timestamp}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 02: Navigate to add new project');
    await app.adminProjectPage.clickInternalInventory();
    await app.adminProjectPage.clickProjectsLink();
    await app.adminProjectPage.clickAddNewProjectButton();

    await logStep('Step 03: Enter project details and save');
    await app.adminProjectPage.fillProjectName(projectName);
    await app.adminProjectPage.selectProjectType('أراضي وزارة البلديات والإسكان');
    await app.adminProjectPage.selectRegion('الرياض');
    await app.adminProjectPage.selectCity('الخرج');
    await app.adminProjectPage.selectSubsidyType('دعم عيني كامل');
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 06: Import and commit project units');
    await app.adminProjectPage.clickUnitsTab();
    await app.adminProjectPage.expectImportNewUnitButtonVisible();
    await app.adminProjectPage.clickImportNewUnitButton();
    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'MOHLand.xlsx');
    await app.adminProjectPage.uploadUnitsFile(unitsImportFilePath);
    await app.adminProjectPage.clickImportSaveButton();
    await app.adminProjectPage.waitForUnitImportCompletion();
    await app.adminProjectPage.clickApproveButton();
    await app.adminProjectPage.clickConfirmButton();
    await app.adminProjectPage.waitForImportConfirmation();
    await app.adminProjectPage.clickBackButton();

    await logStep('Step 07: Upload project media');
    await app.adminProjectPage.clickProjectMediaTab();
    const bannerImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image.jpg');
    await app.adminProjectPage.uploadBannerImage(bannerImagePath);
    await app.adminProjectPage.clickUploadButton();

    const image2Path = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');
    await app.adminProjectPage.uploadMasterPlanImage(image2Path);
    await app.adminProjectPage.clickUploadButton();
    await app.adminProjectPage.uploadAerialImage(image2Path);
    await app.adminProjectPage.clickUploadButton();

    await logStep('Step 08: Enter project textual media details and save');
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
    await app.adminProjectPage.expectMediaUploadComplete(2);
    await app.adminProjectPage.clickMediaSaveButton();

    await logStep('Step 09: Approve project media');
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickKeepProjectUnpublishedButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 10: Publish the unit model');
    await app.adminProjectPage.clickUnitModelsSection();
    await app.adminProjectPage.clickUnitModelCell();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickMediaDraftSection();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickPublishUnitButton();
    await app.adminProjectPage.clickUnitModelLink();

    await logStep('Step 11: Set project open for booking');
    await app.adminProjectPage.clickProjectDetailsText();
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.clickSaveButton();

    await logStep('Step 12: Publish the project and validate the toast message');
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.publishProject();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
  });

  test('TC-02 User books moh land unit (design only)', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const data = readServiceData();
    const environments = readEnvironments();
    const userId = data['with-fitting'].userId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Search for the project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(data.projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 04: Select land to book');
    await app.projectUnitsPage.selectLand(1);

    await logStep('Step 05: Complete the booking and sign contract');
    await app.unitDetailsPage.reserveUnit();
    await app.unitBookingPage.signMohLandBookingContract();

    await logStep('Step 05: Validate the success page');
    await expect(page.getByText('تهانينا!')).toBeVisible();
  });

  test('TC-03 User buys a design (design with fitting option)', { annotation: [{ product: 'Self Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    const data = readServiceData();
    const environments = readEnvironments();

    const userId = data['with-fitting'].userId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Navigate to designs page');
    await app.buyDesignPage.clickOnServicesButton();
    await app.buyDesignPage.clickOnViewAllServicesButton();
    await app.buyDesignPage.clickOnSelfConstructionServiceLink();
    const page1Promise = page.waitForEvent('popup');
    await app.buyDesignPage.clickOnViewDetailsLink();
    const page1 = await page1Promise;
    const designApp = new WebApp(page1);

    await logStep('Step 04: Select design');
    await designApp.buyDesignPage.checkAdvancedSearchToggle();
    await designApp.buyDesignPage.selectDesign();
    await designApp.buyDesignPage.clickOnViewDesignProfileText();
    await designApp.buyDesignPage.clickOnViewText();
    await designApp.buyDesignPage.clickOnBuyDesignButton();
    await logStep('Step 05: Select design with fitting then fill all steps and pay');
    await designApp.buyDesignPage.clickOnDesignWithFittingOption();
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.checkAlignmentCheckbox();
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.fillFirstAlignmentInput('10');
    await designApp.buyDesignPage.fillSecondAlignmentInput('10');
    await designApp.buyDesignPage.fillThirdAlignmentInput('10');
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.clickOnWantFittingServiceButton();
    await designApp.buyDesignPage.checkTermsAndConditionsCheckbox();
    page1.once('dialog', (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await designApp.buyDesignPage.clickOnPayNowButton();
    await designApp.paymentGatewayPage.fillCardDetails();
    await logStep('Step 06: Verify successfully paid');
    await designApp.buyDesignPage.verifyPaymentSuccess();
  });

  test('TC-04 Admin adds Moh land project (design with fitting)', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const projectName = `Automation Moh Land Project ${timestamp}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 02: Navigate to add new project');
    await app.adminProjectPage.clickInternalInventory();
    await app.adminProjectPage.clickProjectsLink();
    await app.adminProjectPage.clickAddNewProjectButton();

    await logStep('Step 03: Enter project details and save');
    await app.adminProjectPage.fillProjectName(projectName);
    await app.adminProjectPage.selectProjectType('أراضي وزارة البلديات والإسكان');
    await app.adminProjectPage.selectRegion('الرياض');
    await app.adminProjectPage.selectCity('الخرج');
    await app.adminProjectPage.selectSubsidyType('دعم عيني كامل');
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 06: Import and commit project units');
    await app.adminProjectPage.clickUnitsTab();
    await app.adminProjectPage.expectImportNewUnitButtonVisible();
    await app.adminProjectPage.clickImportNewUnitButton();
    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'MOHLand.xlsx');
    await app.adminProjectPage.uploadUnitsFile(unitsImportFilePath);
    await app.adminProjectPage.clickImportSaveButton();
    await app.adminProjectPage.waitForUnitImportCompletion();
    await app.adminProjectPage.clickApproveButton();
    await app.adminProjectPage.clickConfirmButton();
    await app.adminProjectPage.waitForImportConfirmation();
    await app.adminProjectPage.clickBackButton();

    await logStep('Step 07: Upload project media');
    await app.adminProjectPage.clickProjectMediaTab();
    const bannerImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image.jpg');
    await app.adminProjectPage.uploadBannerImage(bannerImagePath);
    await app.adminProjectPage.clickUploadButton();

    const image2Path = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');
    await app.adminProjectPage.uploadMasterPlanImage(image2Path);
    await app.adminProjectPage.clickUploadButton();
    await app.adminProjectPage.uploadAerialImage(image2Path);
    await app.adminProjectPage.clickUploadButton();

    await logStep('Step 08: Enter project textual media details and save');
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
    await app.adminProjectPage.expectMediaUploadComplete(2);
    await app.adminProjectPage.clickMediaSaveButton();

    await logStep('Step 09: Approve project media');
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickKeepProjectUnpublishedButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();

    await logStep('Step 10: Publish the unit model');
    await app.adminProjectPage.clickUnitModelsSection();
    await app.adminProjectPage.clickUnitModelCell();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickMediaDraftSection();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickPublishUnitButton();
    await app.adminProjectPage.clickUnitModelLink();

    await logStep('Step 11: Set project open for booking');
    await app.adminProjectPage.clickProjectDetailsText();
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.clickSaveButton();

    await logStep('Step 12: Publish the project and validate the toast message');
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.publishProject();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
  });

  test('TC-05 User books moh land unit (design with fitting)', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read test data relative to the service');
    const app = new WebApp(page);
    const data = readServiceData();
    const environments = readEnvironments();
    const userId = data['with-fitting'].userId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Search for the project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(data.projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 04: Select land to book');
    await app.projectUnitsPage.selectLand(1);

    await logStep('Step 05: Complete the booking and sign contract');
    await app.unitDetailsPage.reserveUnit();
    await app.unitBookingPage.signMohLandBookingContract();

    await logStep('Step 05: Validate the success page');
    await expect(page.getByText('تهانينا!')).toBeVisible();
  });

  test('TC-06 User buys a design (design with fitting and building permit)', { annotation: [{ product: 'Self Construction', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    const data = buyDesignData.services['buy-design'];
    const userId = data['with-fitting-and-building-permit'].userId;
    const userPortalUrl = buyDesignData.environments.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Navigate to designs page');
    await app.buyDesignPage.clickOnServicesButton();
    await app.buyDesignPage.clickOnViewAllServicesButton();
    await app.buyDesignPage.clickOnSelfConstructionServiceLink();
    const page1Promise = page.waitForEvent('popup');
    await app.buyDesignPage.clickOnViewDetailsLink();
    const page1 = await page1Promise;
    const designApp = new WebApp(page1);

    await logStep('Step 04: Select design');
    await designApp.buyDesignPage.checkAdvancedSearchToggle();
    await designApp.buyDesignPage.selectDesign();
    await designApp.buyDesignPage.clickOnViewDesignProfileText();
    await designApp.buyDesignPage.clickOnViewText();
    await designApp.buyDesignPage.clickOnBuyDesignButton();

    await logStep('Step 05: Select design with fitting and building permit then fill all steps and pay');
    await designApp.buyDesignPage.clickOnDesignWithFittingAndBuildingPermitOption();
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.checkAlignmentCheckbox();
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.fillFirstAlignmentInput('10');
    await designApp.buyDesignPage.fillSecondAlignmentInput('10');
    await designApp.buyDesignPage.fillThirdAlignmentInput('10');
    await designApp.buyDesignPage.clickOnContinueButton();
    await designApp.buyDesignPage.clickOnWantFittingServiceButton();
    await designApp.buyDesignPage.checkTermsAndConditionsCheckbox();
    page1.once('dialog', (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await designApp.buyDesignPage.clickOnPayNowButton();
    await designApp.paymentGatewayPage.fillCardDetails();

    await logStep('Step 06: Verify successfully paid');
    await designApp.buyDesignPage.verifyPaymentSuccess();
  });
});
