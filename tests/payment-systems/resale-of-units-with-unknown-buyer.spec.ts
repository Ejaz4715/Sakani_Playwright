import { test, expect } from '@playwright/test';
import path from 'node:path';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'resale-of-units';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Resale Of Units - With Unknown Buyer', () => {
  test('TC-01 Admin creates new offplan Moh land project for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
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
    await app.adminProjectPage.fillWafiLicenseExpiryDate(DateUtils.getDateWithOffset(600));
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
    await app.adminProjectPage.fillGuaranteeAfterServices('Test guarantee after services');
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

  test('TC-02 Developer adds payment schedules for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaUrl = environment.sapaPortalUrl;
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Login to sapa portal as a developer');
    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to projects and search for a project');
    await app.developerProjectPage.openProjectBySearch(projectName);

    await logStep('Step 03: Navigate to add new payment schedule');
    await app.developerProjectPage.openPaymentSchedulesTab();

    await logStep('Step 04: Add cash payment schedule');
    await app.developerProjectPage.addPaymentSchedule({
      type: 'cash',
      scheduleName: 'Cash 22',
      completionPercentageOneValue: '50',
      percentageOneValue: '50',
      completionPercentageTwoValue: '100',
      percentageTwoValue: '50',
    });

    await logStep('Step 05: Add lending payment schedule');
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

  test('TC-03 Developer approves sales contract for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

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

  test('TC-04 Seller books offplan unit and pay the fees for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const projectName = data.projectName;
    const seller = data.sellerUserId;
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(seller);
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
      await bookingApp.unitBookingPage.acceptTermsAndConfirm();
      await bookingApp.paymentGatewayPage.fillCardDetails();
      await bookingApp.paymentConfirmationPage.closePayment();
      await bookingApp.paymentConfirmationPage.expectSuccessMessage();
    }
  });

  test('TC-05 Seller signs sales contract for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const seller = data.sellerUserId;
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(seller);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Open active bookings');
    await app.bookingPage.openActiveBookings();
    const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
    expect(bookedUnitCode).toBeTruthy();
    DataHelper.updateServiceData('test-data.json', 'resale-of-units', 'bookedUnitCode', bookedUnitCode);

    await logStep('Step 04: Open booking details > Sign the sales contract');
    await app.bookingPage.openBookingDetails();
    await app.unitDetailsPage.openSalesContract();
    await app.unitBookingPage.signSalesContract();
    await app.unitBookingPage.expectSalesContractSuccess();
  });

  test('TC-06 Developer confirms the booking for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const bookedUnitCode = data.bookedUnitCode;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to booking page > Confirm booking');
    await app.developerProjectPage.confirmBooking(bookedUnitCode);
  });

  test(
    'TC-07 - Admin configures project-level of resale settings for relase of units with unknown buyer',
    { annotation: [{ product: 'Shared Product', type: 'critical' }] as any },
    async ({ page }) => {
      const app = new WebApp(page);
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const adminPortalUrl = environment.adminPortalUrl;
      const adminUsername = data.adminUsername;
      const adminPassword = data.adminPassword;
      const projectName = data.projectName;

      await logStep('Step 01: Login to admin platform');
      await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);

      await logStep('Step 02: Search for project > navigate to resale settings');
      await app.adminProjectPage.openProjects();
      await app.resaleOfUnitsPage.fillProjectName(projectName);
      await app.resaleOfUnitsPage.clickProjectSearchButton();
      await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
      await app.resaleOfUnitsPage.clickOnResaleSettingTab();

      await logStep('Step 03: Apply the confiqguartion and save');
      await app.resaleOfUnitsPage.clickOnuseGeneralResaleSettingsSwitch();
      await app.resaleOfUnitsPage.selectResaleFeeType();
      await app.resaleOfUnitsPage.fillResaleFeeValue(10);
      await app.resaleOfUnitsPage.clickOnSaveButton();
      await app.resaleOfUnitsPage.verifyTheToastMessage();
    }
  );

  test('TC-08 Seller submits new resale request for unkown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const seller = data.sellerUserId;
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(seller);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Open complete bookings');
    await app.bookingPage.openCompletedBookings();
    const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
    expect(bookedUnitCode).toBeTruthy();
    DataHelper.updateServiceData('resale-of-units', 'bookedUnitCode', bookedUnitCode);

    await logStep('Step 04: Open booking details > Click on resale of units');
    await app.bookingPage.openBookingDetails();
    await app.resaleOfUnitsPage.clickOnResaleOfUnitsButton();

    await logStep('Step 05: Select assign to unkown buyer');
    await app.resaleOfUnitsPage.clickOnAssignWithoutBuyerOption();

    await logStep('Step 06: Click on next to fainancial information');
    await app.resaleOfUnitsPage.clickOnNextToFinancialInfoButton();

    await logStep('Step 07: Select and fill resale reason and fill waiver amount');
    await app.resaleOfUnitsPage.selectResaleReason();
    await app.resaleOfUnitsPage.fillResaleReasonDetails('test resale deatils');
    await app.resaleOfUnitsPage.fillWaiverAmount(100);

    await logStep('Step 08: Select payment method');
    await app.resaleOfUnitsPage.selectPaymentMethod();

    await logStep('Step 09: Add an istallment');
    await app.resaleOfUnitsPage.fillPriceAmountInputfield(100);
    await app.resaleOfUnitsPage.fillPriceAmountPercentageInputfield(100);
    await app.resaleOfUnitsPage.fillCompletionPercentageInputfield(100);
    await app.resaleOfUnitsPage.selectStatus();
    await app.resaleOfUnitsPage.clickOnAddInstallmentButton();

    await logStep('Step 10: Check on desclaimer waiver then click on submit the request');
    await app.resaleOfUnitsPage.clickOnDisclaimerWaiverCheckbox();
    await app.resaleOfUnitsPage.clickOnSubmitButton();
    await app.resaleOfUnitsPage.getAndSaveRequestNumber();
  });

  test('TC-09 Developer approves unknown-buyer request', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const requestNumber = data.requestNumber;

    await logStep('Step 01: Open partners portal');
    await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);

    await logStep('Step 02: Login to the platfrom');
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 03: Click on resale requests from side menu');
    await app.resaleOfUnitsPage.clickOnResaleRequestSideMenu();

    await logStep('Step 04: Search by reference number and click on view deatails');
    await app.resaleOfUnitsPage.selectSearchByReference();
    await app.resaleOfUnitsPage.fillRequestNumberInputfield(requestNumber);
    await app.resaleOfUnitsPage.clickOnViewDetailsButton();

    await logStep('Step 05: Approve the request and verify the request is apporved');
    await app.resaleOfUnitsPage.clickOnApproveButton();
    await app.resaleOfUnitsPage.clickOnSendButton();
    await app.resaleOfUnitsPage.verifyTheRequestisApproved();
  });

  test('TC-10 Admin adds a buyer to resale request', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const adminPortalUrl = environment.adminPortalUrl;
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const buyerId = data.buyerUserId;
    const buyerDob = data.buyerDOB;
    const requestNumber = data.requestNumber;

    await logStep('Step 01: Login to admin platform');
    await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to resale requests page and search for request number');
    await app.adminProjectPage.openResaleRequests();
    await app.resaleOfUnitsPage.fillRequestNumberInputfieldAdmin(requestNumber);
    await app.resaleOfUnitsPage.clickOnSearchButton();
    await app.resaleOfUnitsPage.clickOnSearchedResult();

    await logStep('Step 03: Add buyer information then save');
    await app.resaleOfUnitsPage.clickOnAddBuyerButton();
    await app.resaleOfUnitsPage.fillBuyerIDInputfield(buyerId);
    await app.resaleOfUnitsPage.clickOnBuyerDobInputButton();
    await app.resaleOfUnitsPage.selectBuyerDobFromHijriCalendar(buyerDob);
    await app.resaleOfUnitsPage.clickOnVerifyFromBuyerButton();
    await app.resaleOfUnitsPage.selectBuyerSource();
    await app.resaleOfUnitsPage.clickOnSaveBuyerButton();
    await app.resaleOfUnitsPage.verifyBuyerAddedToastMessage();
  });

  test('TC-11 Buyer signs contract and pays waiver for relase of units with unknown buyer', { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const buyerId = data.buyerUserId;
    const userPortalUrl = environment.userPortalUrl;

    await logStep('Step 01: Open user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep('Step 02: Log in with Nafath');
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(buyerId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 03: Open wating to sign contract');
    await app.resaleOfUnitsPage.openWaitingToSignContract();

    await logStep('Step 04: Open request details > Click confirm booking');
    await app.resaleOfUnitsPage.clickOnViewButton();
    await app.resaleOfUnitsPage.clickOnConfirmBookingButton();

    await logStep('Step 05: Click on approve sale contract and pay waiver amount');
    await app.resaleOfUnitsPage.clickOnApproveSaleContractButton();
    await app.resaleOfUnitsPage.enterOTP();
    await app.resaleOfUnitsPage.clickOnVerifyButton();
    await app.paymentGatewayPage.fillCardDetails();
    await app.resaleOfUnitsPage.verifyWaiverFeesSuccessfullyPaidMessage();
  });
});
