import { test, expect } from '@playwright/test';
import path from 'node:path';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'cash-payment';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Cash Payment', () => {
  test('TC-01 Admin creates new offplan Moh land project', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
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

  test('TC-02 Developer adds payment schedules', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaUrl = environment.sapaPortalUrl;
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.openProjectBySearch(projectName);

    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: 'cash',
      scheduleName: 'Cash 22',
      completionPercentageOneValue: '50',
      percentageOneValue: '50',
      completionPercentageTwoValue: '100',
      percentageTwoValue: '50',
    });

    await app.developerProjectPage.openProjectBySearch(projectName);
    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: 'lending',
      scheduleName: 'Lending 22',
      completionPercentageOneValue: '50',
      percentageOneValue: '50',
      completionPercentageTwoValue: '100',
      percentageTwoValue: '50',
    });
  });

  test('TC-03 Developer approves sales contract', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaUrl = environment.sapaPortalUrl;
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to searched project > Navigate to sale contracts ');
    await app.developerProjectPage.openProjectBySearch(projectName);
    await app.developerProjectPage.openSalesContractsTab();
    await app.developerProjectPage.viewAndApproveSalesContract();

    await logStep('Step 03: Approve sales contract and verify is approved');
    await app.developerProjectPage.approveUnitSpecification();
    await app.developerProjectPage.fillOtp('1234');
    await app.developerProjectPage.verifyOtp();
    await app.developerProjectPage.verifyApprovalSuccessMessage();
  });

  test('TC-04 Admin enables comprehensive booking', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUrl = environment.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const projectName = data.projectName;

    await logStep('Step 01: Login to admin portal');
    await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to projects');
    await app.adminProjectPage.openProjects();

    await logStep('Step 03: Search and navigate to project details page');
    await app.resaleOfUnitsPage.fillProjectName(projectName);
    await app.resaleOfUnitsPage.clickProjectSearchButton();
    await app.resaleOfUnitsPage.clickSearchedProjectResult(data.projectName);
    await page.waitForTimeout(10000);

    await logStep('Step 04: Enbale comprehensive booking from project setting and save the project');
    await app.paymentTrackingPage.clickOnProjectSettings();
    await app.paymentTrackingPage.clickOnUseGeneralSettingSwitch();
    await app.paymentTrackingPage.clickOnSaveButton();
    await app.paymentTrackingPage.verifySaveSuccessToast();
  });

  test('TC-05 - User books and pays the fees', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
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
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep('Step 03: Reserve unit > Pay the fees and verify the unit is booked');
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
      await bookingApp.unitDetailsPage.reserveUnit();
      await bookingApp.bookingAndSelectPaymentMethodPage.checkOnTermAndCondition();
      await bookingApp.bookingAndSelectPaymentMethodPage.clickOnApproveAndContinueIfVisible();
      await bookingApp.bookingAndSelectPaymentMethodPage.clickOnPayBookingFeesButton();
      await bookingApp.paymentGatewayPage.fillCardDetails();
      await bookingApp.paymentConfirmationPage.closePayment();
      await bookingApp.page.waitForTimeout(5000);
    }
  });

  test('TC-06 - User selects cash payment schedule and signs sales contract', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;
    const userID = data.sakaniUserId;

    await logStep('Step 01: Login to user protal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userID);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02 Navigate to active booking');
    await app.bookingPage.openActiveBookings();
    const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
    expect(bookedUnitCode).toBeTruthy();
    DataHelper.updateServiceData('cash-payment', 'bookedUnitCode', bookedUnitCode);

    await logStep('Step 03: Select cash payment');
    await app.bookingPage.openBookingDetails();
    await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
    await app.cashPaymentPage.clickOnSchedulePaymentCard();
    await app.bookingAndSelectPaymentMethodPage.clickOnSaveAndContinueButton();

    await logStep('Step 04: Sign the sale contract > Verify the success message');
    await app.bookingAndSelectPaymentMethodPage.clickOnSignContractButton();
    await app.cashPaymentPage.signSalesContract();
    await app.paymentConfirmationPage.closePayment();
    await app.page.waitForTimeout(4000);
  });

  test('TC-07 User checks the selected payment is reflect on the booking details page', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;
    const userID = data.sakaniUserId;

    await logStep('Step 01: Login to user protal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(userID);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02 Navigate to active booking');
    await app.bookingPage.openActiveBookings();

    await logStep('Step 03: Sign the sale contract > Verify the success message');
    await app.bookingPage.openBookingDetails();
    await app.bookingAndSelectPaymentMethodPage.validateSelectedPaymentType('نقدي');
  });

  test('TC-07 - Developer documents the cash payment', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaUrl = environment.sapaPortalUrl;
    const developerUserId = data.developerUserId;
    const userID = data.sakaniUserId;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Open financial management > cash payment');
    await app.flexiblePaymentPage.clickOnFinancialManagement();
    await app.cashPaymentPage.clickOnCashPaymentLink();

    await logStep('Step 03: Search for ID number > Verify cash payment is documented successfully');
    await app.cashPaymentPage.selectCustomerType();
    await app.cashPaymentPage.fillIDNumber(userID);
    await app.cashPaymentPage.clickSearchButton();
    await app.cashPaymentPage.clickShowPasswordIcon();
    await app.cashPaymentPage.clickDocumentCashPaymentButton();
    await app.cashPaymentPage.clickConfirmYesButton();
    await app.cashPaymentPage.expectCashPaymentSuccess();
  });
});
