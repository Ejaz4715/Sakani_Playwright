import { expect, Locator, Page, test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DateUtils } from '@pages/utils/DateUtils';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import path from 'node:path';

const SERVICE = 'unit-delivery';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;

async function waitAndClick(locator: Locator, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click();
}

async function waitAndFill(locator: Locator, value: string, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.fill(value);
}

const unitCheckbox = (page: Page, row: number) => page.locator(`//datatable-row-wrapper[${row}]/datatable-body-row/div[3]/datatable-body-cell/div/div/app-sapa-checkbox-v2/div/div/input/..`);

test.describe('Unit Delivery Partner/Marketplace', () => {
  let deliveryUnitCode: string;

  test('TC-01 Admin adds new offplan project for unit delivery', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const projectName = `Automation Project ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    writeServiceData('projectName', projectName);

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

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

    await logStep('Step 12: Activate multiple units booking for non-beneficiary > Verify setting is saved');
    // Project settings
    await page.keyboard.press('PageDown');
    await waitAndClick(page.locator("//span[contains(text(), 'إعدادات المشاريع')]"));
    // تفعيل الحجز المتعدد في سكني (الويب، تطبيقات الهاتف المحمول)
    //await page.locator("//label[contains(text(), ' تفعيل الحجز المتعدد في سكني (الويب، تطبيقات الهاتف المحمول) ')]/../button/div").click();
    await waitAndClick(page.locator('//mat-tab-body[1]/div/div/form/div[2]/div[4]/div[2]/div/div[2]/div[5]/mat-slide-toggle[1]/div/button'));
    // تفعيل الحجز المتعدد في بوابة شركاء
    //await page.locator("//label[contains(text(), ' تفعيل الحجز المتعدد في بوابة شركاء ')]/../button/div").click();
    await waitAndClick(page.locator('//mat-tab-body[1]/div/div/form/div[2]/div[4]/div[2]/div/div[2]/div[5]/mat-slide-toggle[2]/div/button'));
    await waitAndFill(page.locator("input[formcontrolname='maximum_booking_per_non_beneficiary']"), '5');

    await page.keyboard.press('PageDown');
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateProjectSavedToastMessage();
    await page.waitForTimeout(3000);
    expect(await page.locator("input[formcontrolname='maximum_booking_per_non_beneficiary']").inputValue()).toEqual('5');
  });

  test(
    'TC-02 Developer approves sales contract',
    {
      annotation: [
        {
          product: 'Marketplace',
          type: 'critical',
        },
      ] as any,
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;

      await logStep('Step 01: Navigate to partners portal > Login as developer');
      await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
      await app.developerProjectPage.loginDeveloper(developerUserId);
      await app.developerProjectPage.switchRoleToDeveloper();

      await logStep('Step 02: Search for the project > Open it');
      await app.developerProjectPage.openProjectBySearch(projectName);

      await logStep('Step 03: Approve the sales contract > Verify approval success message');
      await app.developerProjectPage.openSalesContractsTab();
      await app.developerProjectPage.viewAndApproveSalesContract();
      await app.developerProjectPage.approveUnitSpecification();
      await app.developerProjectPage.fillOtp('1234');
      await app.developerProjectPage.verifyOtp();
      await app.developerProjectPage.verifyApprovalSuccessMessage();
    }
  );

  test('TC-03 Developer books one unit', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to bookings management > Individual bookings > New booking');
    await waitAndClick(page.locator("//span[contains(text(),' إدارة الحجوزات')]/../.."));
    await waitAndClick(page.locator("//span[contains(text(),'الحجوزات الفردية')]/../.."));

    await waitAndClick(page.locator("//span[contains(text(),' حجز جديد ')]/.."), LONG_TIMEOUT);

    await logStep('Step 03: Search for the customer by ID');
    await waitAndFill(page.locator("//label[contains(text(),' رقم الهوية ')]/../..//input"), '1300070834');
    await waitAndClick(page.locator("//button[contains(text(),' بحث ')]"));

    const nextButton = page.locator("//button[contains(text(), 'التالي')]");
    await expect(nextButton).toBeEnabled({ timeout: DEFAULT_TIMEOUT });
    await nextButton.click();

    await page.waitForTimeout(3000);

    await logStep('Step 04: Select the project > Select one unit > Keep booking');
    await page.locator("(//input[@aria-autocomplete='list'])[1]").fill(projectName);

    await page.waitForTimeout(2000);

    await page.locator("div[role='listbox'] span").click();

    await page.waitForTimeout(10000);
    await waitAndClick(unitCheckbox(page, 1));
    await nextButton.click();
    await waitAndClick(page.locator("//button[contains(text(),' مواصلة الحجز')]"));

    await logStep('Step 05: Select the bank');
    // Select the bank
    await waitAndClick(page.locator("app-bank-list-dropdown-control input[role='combobox']"));
    await waitAndClick(page.locator("//span[contains(text(),'CRM Bank Test')]"));
    await nextButton.click();
    await page.waitForTimeout(1000);

    await logStep('Step 06: Confirm the booking > Verify booking details are visible');
    await waitAndClick(page.locator("//span[contains(text(),'تأكيد')]/.."), DEFAULT_TIMEOUT);

    await expect(page.locator("//button[contains(text(),'عرض التفاصيل')]")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  });

  test('TC-04 - User Pays the invoices for a unit', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await page.waitForTimeout(3000);

    await logStep('Step 02: Navigate to my activities > Active bookings > Not billed');
    await app.marketplaceLandingPage.openProfileManagement();
    await app.offPlanBasketMultipleBookingPage.clickMyActivities();
    await app.offPlanBasketMultipleBookingPage.clickOnBookings();
    await app.offPlanBasketMultipleBookingPage.clickOnActiveBooking();
    await app.offPlanBasketMultipleBookingPage.clickOnNotBilled();

    await logStep('Step 03: Save the delivery unit code to test data');
    deliveryUnitCode = await app.offPlanBasketMultipleBookingPage.getUnit1Code();
    writeServiceData('deliveryUnitCode', deliveryUnitCode);

    await logStep('Step 04: Select the unit > Pay the invoice');
    await app.offPlanBasketMultipleBookingPage.clickOnUnit1CheckBox();
    await app.offPlanBasketMultipleBookingPage.clickOnPayBills();
    await app.paymentGatewayPage.fillCardDetails();
    await page.waitForTimeout(10000);
  });

  test('TC-05 - User Signs sale contract for a unit', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Navigate to my activities > Active bookings > Ready for sign');
    await app.marketplaceLandingPage.openProfileManagement();
    await app.offPlanBasketMultipleBookingPage.clickMyActivities();
    await app.offPlanBasketMultipleBookingPage.clickOnBookings();
    await app.offPlanBasketMultipleBookingPage.clickOnActiveBooking();
    await app.offPlanBasketMultipleBookingPage.clickOnReadyForSign();

    await logStep('Step 03: Select the unit > Continue');
    await app.offPlanBasketMultipleBookingPage.clickOnUnit1CheckBox();
    await app.offPlanBasketMultipleBookingPage.clickOnContinue();

    await logStep('Step 04: Agree on the sale contract > Verify OTP > Verify contract is signed');
    await app.offPlanBasketMultipleBookingPage.clickOnProjectCheckBox();
    await app.offPlanBasketMultipleBookingPage.clickOnAgreeOnAll();

    await app.offPlanBasketMultipleBookingPage.typeVerifyOtpCode();
    await app.offPlanBasketMultipleBookingPage.clickOnVerify();

    await expect.poll(() => app.offPlanBasketMultipleBookingPage.isSuccessfulContractSignMessage(), { timeout: LONG_TIMEOUT }).toBe(true);
  });

  test('TC-06 Confirm the cash payment from the developer side', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Open financial management > Cash payment > Search customer by ID');
    await app.flexiblePaymentPage.clickOnFinancialManagement();
    await app.flexiblePaymentPage.clickOnCashPayment();
    await app.flexiblePaymentPage.clickOnCustomerDropdownMenu();
    await app.flexiblePaymentPage.selectIndividualCustomersType();
    await app.flexiblePaymentPage.fillNationalIdentity(data.sakaniUserId);
    await app.flexiblePaymentPage.clickOnSearch();

    await logStep('Step 03: View booked unit details > Confirm the cash payment > Verify success');
    await app.flexiblePaymentPage.viewTheBookedUnitDetails();
    await app.flexiblePaymentPage.confirmTheCashPayment();
    await app.cashPaymentPage.expectCashPaymentSuccess();
  });

  test('TC-07 Unit delivery preparation by the developer', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const projectName = data.projectName;
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Open units delivery > Start preparing > Search by project name > Select the unit');
    await app.unitsDeliveryPage.clickOnUnitsDelivery();
    await app.unitsDeliveryPage.clickOnStartForPreparingUnitDelivery();
    await app.unitsDeliveryPage.selectSearchingUsingProjectName();
    await app.unitsDeliveryPage.fillProjectName(projectName);
    await app.unitsDeliveryPage.clickOnSearch();
    await page.waitForTimeout(10000);
    await app.unitsDeliveryPage.clickOnSelectProject();
    await app.unitsDeliveryPage.clickOnSelectUnit();

    await logStep('Step 03: Mark as ready for delivery > Set date and time > Send > Verify unit is ready');
    await app.unitsDeliveryPage.clickOnReadyForDelivery();
    await app.unitsDeliveryPage.selectDeliveryDate();
    await app.unitsDeliveryPage.selectDeliveryTime();
    await app.unitsDeliveryPage.clickOnSend();

    expect(await app.unitsDeliveryPage.isUnitReadyForDelivery()).toBe(true);
  });

  test('TC-08 Delivery of the ready units from Partner', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Open units delivery > Ready units > Search by unit code');
    await app.unitsDeliveryPage.clickOnUnitsDelivery();
    await app.unitsDeliveryPage.clickOnStartForReadyUnitDelivery();
    await app.unitsDeliveryPage.selectSearchingUsingUnitCode();
    await app.unitsDeliveryPage.fillUnitCode(data.deliveryUnitCode);
    await app.unitsDeliveryPage.clickOnSearch();

    await logStep('Step 03: Send the unit to the customer for delivery > Verify unit is delivered');
    await app.unitsDeliveryPage.sendToCustomerForDelivery();

    expect(await app.unitsDeliveryPage.isUnitDelivered()).toBe(true);
  });

  test('TC-09 Delivery confirmation from the sakani user side', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Navigate to my activities > Units delivery > Pending units');
    await app.marketplaceLandingPage.openProfileManagement();
    await app.offPlanBasketMultipleBookingPage.clickMyActivities();
    await app.unitsDeliveryPage.clickOnUnitDeliveryFromSakani();
    await app.unitsDeliveryPage.clickOnPendingUnitsForDelivery();

    await logStep('Step 03: Show the delivery unit details > Confirm the unit delivery');
    await app.unitsDeliveryPage.clickOnShowDeliveryUnitModel();
    await app.unitsDeliveryPage.clickUnitDeliveryConfirmationFromSakani();

    await logStep('Step 04: Agree on unit state, terms and conditions and delivery');
    await app.unitsDeliveryPage.agreeOnUnitDeliveryState();
    await app.unitsDeliveryPage.agreeOnTermsAndConditions();
    await app.unitsDeliveryPage.agreeOnUnitDelivery();
    await page.waitForTimeout(5000);

    await logStep('Step 05: Verify OTP > Verify unit is delivered and accepted');
    await app.unitsDeliveryPage.typeVerifyOtpCode();
    await app.unitsDeliveryPage.clickOnVerify();

    expect(await app.unitsDeliveryPage.isUnitDeliveredAndAcceptedFromSakani()).toBe(true);
  });
});
