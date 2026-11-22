import { test, expect } from '@playwright/test';
import { WebApp, Products } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { UserProfilePage } from '@pages/UserProfilePage';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'show-real-estate-advisor';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Show real estate advisor', () => {
  test(
    'SAK-1724-01 Admin enables comprehensive journey and show real estate advisor project settings',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
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

      await logStep('Step 04: Enbale comprehensive booking and show real estate advisor from project setting and save the project');
      await app.paymentTrackingPage.clickOnProjectSettings();
      await app.paymentTrackingPage.enableComprehensiveJourney();
      await app.adminProjectPage.enableShowRealEstateAdvisorSetting();
      await app.paymentTrackingPage.clickOnSaveButton();
      await app.paymentTrackingPage.verifySaveSuccessToast();
    }
  );

  test(
    'SAK-1724-02 Developer books a unit for an eligible beneficiary user from offplan project with comprehensive booking enabled',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userId = data.bene.userId;
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const bankName = 'بنك الأهلي السعودي';

      await logStep('Step 01: Navigate to partners portal > Login as developer');
      await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
      await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
      await app.partnersLoginPage.switchRoleToDeveloper();

      await logStep('Step 02: Start new individual booking > Enter user id');
      await app.developerProjectPage.bookUnitsForCustomers(userId, projectName);
      await page.waitForTimeout(5000);

      await logStep('Step 03: Select unit and move to financial information page');
      await app.developerProjectPage.selectUnitCheckbox(1);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.clickSelectAndContinue();
      await app.developerProjectPage.clickContinueBookingButton();

      await logStep('Step 04: Select the bank and confirm the booking > Verify booking list is visible');
      await app.developerProjectPage.selectBank(bankName);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.clickOnConfirmationButton();

      await logStep('Step 05: Verify the reservation is successful');
      await app.developerProjectPage.validateSuccessReservationPopup();
    }
  );

  test(
    'SAK-1724-03 Verify as an eligible user the complete financing requirment CTA is present when Lending is selected as payment method',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.bene.userId;

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
      DataHelper.updateServiceData(SERVICE, 'bookedUnitCode1', bookedUnitCode);

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Navigate to select payment > select Lending');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnElectronicFinancePaymentRadioButton();

      await logStep('Step 05: Validate the presence of financing requirment CTA');
      await app.bookingAndSelectPaymentMethodPage.validatePresenceOfCompleteFinancingRequrementText();
    }
  );

  test(
    'SAK-1724-04 Verify as an eligible user the complete financing requirment CTA heading is not present when Cash is selected as payment method',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.bene.userId;

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

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Navigate to select payment > select Cash');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnCashPaymentRadioButton();

      await logStep('Step 05: Validate the financing requirment CTA is not present');
      await app.bookingAndSelectPaymentMethodPage.validateCompleteFinancingRequrementTextisNotPresent();
    }
  );

  test(
    'SAK-1724-05 Verify as an eligible user, Complete Requirment button in CTA is functional and navigates the user to financial advisor service page',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.bene.userId;

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

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Select lending payment method');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnElectronicFinancePaymentRadioButton();

      await logStep('Step 04: Navigate to complete financing requirement > Validate the system naviagtes to financial advisory page');
      await app.bookingAndSelectPaymentMethodPage.validatePresenceOfCompleteFinancingRequrementText();
      await app.bookingAndSelectPaymentMethodPage.clickComepleteRequirements();
      await app.bookingAndSelectPaymentMethodPage.validatePresenceOfFinancialAdvisoryPageHeading();
    }
  );

  test(
    'SAK-1724-06 Developer books a unit for non-eligible user from offplan project with comprehensive booking enabled',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userId = data.nonBene.userId;
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const bankName = 'بنك الأهلي السعودي';

      await logStep('Step 01: Navigate to partners portal > Login as developer');
      await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
      await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
      await app.partnersLoginPage.switchRoleToDeveloper();

      await logStep('Step 02: Start new individual booking > Enter user id');
      await app.developerProjectPage.bookUnitsForCustomers(userId, projectName);
      await page.waitForTimeout(5000);

      await logStep('Step 03: Select unit and move to financial information page');
      await app.developerProjectPage.selectUnitCheckbox(1);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.selectUnitAndContinue();

      await logStep('Step 04: Select the bank and confirm the booking > Verify booking list is visible');
      await app.developerProjectPage.selectBank(bankName);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.clickOnConfirmationButton();

      await logStep('Step 05: Verify the reservation is successful');
      await app.developerProjectPage.validateSuccessReservationPopup();
    }
  );

  test(
    'SAK-1724-07 Verify as non-eligible user the complete financing requirment CTA heading is not present when comprehensive and show real estate advisor project settings are enabled',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.nonBene.userId;

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
      DataHelper.updateServiceData(SERVICE, 'bookedUnitCode2', bookedUnitCode);

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Select lending payment method');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnElectronicFinancePaymentRadioButton();

      await logStep('Step 05: Validate financing requirment CTA is not present');
      await app.bookingAndSelectPaymentMethodPage.validateCompleteFinancingRequrementTextisNotPresent();
    }
  );

  test(
    'SAK-1724-08 Developer books a unit for an eligible user who has active real-estate-advisor certificate from offplan project with comprehensive and show real estate advisor settings enabled',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userId = data.beneWithCertificate.userId;
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const bankName = 'بنك الأهلي السعودي';

      await logStep('Step 01: Navigate to partners portal > Login as developer');
      await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
      await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
      await app.partnersLoginPage.switchRoleToDeveloper();

      await logStep('Step 02: Start new individual booking > Enter user id');
      await app.developerProjectPage.bookUnitsForCustomers(userId, projectName);
      await page.waitForTimeout(5000);

      await logStep('Step 03: Select unit and move to financial information page');
      await app.developerProjectPage.selectUnitCheckbox(1);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.selectUnitAndContinue();

      await logStep('Step 04: Select the bank and confirm the booking > Verify booking list is visible');
      await app.developerProjectPage.selectBank(bankName);
      await app.developerProjectPage.clickOnNextButton();
      await app.developerProjectPage.clickOnConfirmationButton();

      await logStep('Step 05: Verify the reservation is successful');
      await app.developerProjectPage.validateSuccessReservationPopup();
    }
  );

  test(
    'SAK-1724-09 Verify as an eligible user with active real-estate-advisor certificate the complete financing requirment CTA is not present when comprehensive and show real estate advisor project settings are enabled',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.beneWithCertificate.userId;

      await logStep('Step 01: Login to user protal');
      await app.loginPage.gotoHomePage(userPortalUrl);
      await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(userID);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02 Verify the user has purchasing power');
      await app.bookingPage.openActiveBookings();
      const profile = new UserProfilePage(page);
      await profile.clickFinancialAdvisorySideMenu();
      await profile.validateThePresenceOfPurchasingPower();

      await logStep('Step 03 Navigate to active booking');
      await app.bookingPage.openActiveBookings();

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Select lending payment method');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnElectronicFinancePaymentRadioButton();

      await logStep('Step 05: Validate the financing requirment CTA is not present');
      await app.bookingAndSelectPaymentMethodPage.validateCompleteFinancingRequrementTextisNotPresent();
    }
  );

  test(
    'SAK-1724-10 Admin disbales the comprehensive jounrey and show real estate advisor project settings',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
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

      await logStep('Step 04: Enbale comprehensive booking and show real estate advisor from project setting and save the project');
      await app.paymentTrackingPage.clickOnProjectSettings();
      await app.paymentTrackingPage.disableComprehensiveJourney();
      await app.adminProjectPage.disableShowRealEstateAdvisorSetting();
      await app.paymentTrackingPage.clickOnSaveButton();
      await app.paymentTrackingPage.verifySaveSuccessToast();
    }
  );

  test(
    'SAK-1724-11 Verify as an eligible user the complete financing requirment CTA heading is not present when comprehensive and show real estate advisor project settings are disbaled',
    { annotation: [{ product: Products.Marketplace, type: 'critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const environment = readEnvironments();
      const data = readServiceData();
      const app = new WebApp(page);
      const userPortalUrl = environment.userPortalUrl;
      const userID = data.bene.userId;

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

      await logStep('Step 03: Navigate to booking details');
      await app.bookingPage.openBookingDetails();

      await logStep('Step 04: Select lending payment method');
      await app.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
      await app.bookingAndSelectPaymentMethodPage.clickOnElectronicFinancePaymentRadioButton();

      await logStep('Step 05: Validate the financing requirment CTA is not present');
      await app.bookingAndSelectPaymentMethodPage.validateCompleteFinancingRequrementTextisNotPresent();
    }
  );

  test('SAK-1724-12 Developer cancels the bookings', { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const app = new WebApp(page);
    const environment = readEnvironments();
    const data = readServiceData();
    const unitCode1 = data.bookedUnitCode1;
    const unitCode2 = data.bookedUnitCode2;
    const developerUserId = data.developerUserId;
    const sapaUrl = environment.sapaPortalUrl;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to the booked unit details');
    await app.discountOnReservedUnitsPage.clickOnManageBookingsButton();
    await app.discountOnReservedUnitsPage.clickOnIndividualBookingsButton();
    await app.discountOnReservedUnitsPage.fillSearchForUnitOrIDInputfield(unitCode1);
    await app.discountOnReservedUnitsPage.selectPriceQuotationStatus();
    await app.discountOnReservedUnitsPage.clickOnViewDetailsOfSearchedResultButton();

    await logStep('Step 03: Navigate to booking details > Click on cancel booking and select reason then verify the success toast message');
    await app.discountOnReservedUnitsPage.clickOnBookingsTab();
    await app.discountOnReservedUnitsPage.selectCancellationReasonOption();
    await app.discountOnReservedUnitsPage.clickOnCancelBookingButton();
    await app.discountOnReservedUnitsPage.clickOnContinueCancellationButton();
    await app.discountOnReservedUnitsPage.clickOnNoButton();
    await app.discountOnReservedUnitsPage.clickOnYesButton();
    await app.discountOnReservedUnitsPage.fillCancellationOtpCodeInput(1234);
    await app.discountOnReservedUnitsPage.clickOnVerifyCancellationCodeButton();
    await app.discountOnReservedUnitsPage.verifyBeneficiaryCancellationToastSuccessMessage();
    await app.discountOnReservedUnitsPage.clickOnYesButton();

    await logStep('Step 04: Cancel the booking of 2nd unit');
    // await app.discountOnReservedUnitsPage.clickOnManageBookingsButton();
    await app.discountOnReservedUnitsPage.clickOnIndividualBookingsButton();
    await app.discountOnReservedUnitsPage.fillSearchForUnitOrIDInputfield(unitCode2);
    await app.discountOnReservedUnitsPage.selectPriceQuotationStatus();
    await app.discountOnReservedUnitsPage.clickOnViewDetailsOfSearchedResultButton();
    await app.discountOnReservedUnitsPage.clickOnBookingsTab();
    await app.discountOnReservedUnitsPage.selectCancellationReasonOption();
    await app.discountOnReservedUnitsPage.clickOnCancelBookingButton();
    await app.discountOnReservedUnitsPage.clickOnContinueCancellationButton();
    await app.discountOnReservedUnitsPage.clickOnNoButton();
    await app.discountOnReservedUnitsPage.clickOnYesButton();
    await app.discountOnReservedUnitsPage.fillCancellationOtpCodeInput(1234);
    await app.discountOnReservedUnitsPage.clickOnVerifyCancellationCodeButton();
    await app.discountOnReservedUnitsPage.verifyBeneficiaryCancellationToastSuccessMessage();
  });
});
