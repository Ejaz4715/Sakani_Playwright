import { test, expect } from "@playwright/test";
const fs = require("fs");
const path = require("path");
import { DateUtils } from "@pages/utils/DateUtils";
import { WebApp } from "@base-class/web-app";
import { logStep } from "@helpers/LogSteps";
import offplanTestData from '@data/test-data.json';
import { DataHelper } from "@helpers/DataHelper";

test.describe("Offplan private land booking journey", () => {

  //read data from json relative to the service
  const environment = offplanTestData.environments;
  const data = offplanTestData.services["offplan-booking"];

  test("TC-01 - Admin adds new offplan private land project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    const app = new WebApp(page);
    const currentDate = DateUtils.getDateISO(600);
    const projectName = `Automation Project Offplan ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14)}`;
    DataHelper.updateServiceData("test-data.json", "offplan-booking", "projectName", projectName);

    await logStep("Step 01: Login to admin portal as a super admin");
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep("Step 02: Navigate to add new project");
    await app.adminProjectPage.clickInternalInventory();
    await app.adminProjectPage.clickProjectsLink();
    await app.adminProjectPage.clickAddNewProjectButton();

    await logStep("Step 03: Enter project details and save");
    await app.adminProjectPage.fillProjectName(projectName);
    await app.adminProjectPage.selectProjectType("مشاريع البيع على الخارطة على الأراضي الخاصة");
    await app.adminProjectPage.selectRegion("الرياض");
    await app.adminProjectPage.selectCity("الخرج");
    await app.adminProjectPage.selectDeveloperName("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
    await app.adminProjectPage.toggleBookableOn();
    await app.adminProjectPage.selectProjectStatus("متاح");
    await app.adminProjectPage.fillWafiLicenseExpiryDate(currentDate);
    await app.adminProjectPage.selectSubsidyType("دعم عيني كامل");
    await app.adminProjectPage.fillMaxSubsidyAmount("2");
    await app.adminProjectPage.fillProjectAgreementDate("2026-01-01");
    await app.adminProjectPage.fillProjectLicenseNumber("665334");
    await app.adminProjectPage.fillProjectLicenseDate("2026-01-01");
    await app.adminProjectPage.fillEscrowAccountName("Sakani Test User");
    await app.adminProjectPage.fillEscrowAccountNumber("SA1111111111111111111111");
    await app.adminProjectPage.selectBank("بنك الأهلي السعودي");
    await app.adminProjectPage.fillDeductionPercentage("2");
    await app.adminProjectPage.fillDeedIssueCityArabic("الرياض");
    await app.adminProjectPage.fillDeedIssueCityEnglish("Riyadh");
    await app.adminProjectPage.fillDeedDate("01/01/2026");
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateToastMessage();

    await logStep("Step 04: Link the project to AZM");
    await app.adminProjectPage.linkProjectToAzm();

    await logStep("Step 05: Select participating banks");
    await app.adminProjectPage.expectFinancingEntitiesVisible();
    await app.adminProjectPage.clickFinancingEntities();
    await app.adminProjectPage.expectSelectAllRowsVisible();
    await app.adminProjectPage.clickSelectAllRows();
    await app.adminProjectPage.clickSaveButton();

    await logStep("Step 06: Import and commit project units");
    await app.adminProjectPage.clickUnitsTab();
    await app.adminProjectPage.expectImportNewUnitButtonVisible();
    await app.adminProjectPage.clickImportNewUnitButton();
    await app.adminProjectPage.expectResidentialUnitTypeVisible();
    await app.adminProjectPage.openResidentialUnitTypeDropdown();
    await app.adminProjectPage.selectApartmentUnitType();
    const unitsImportFilePath = path.join(process.cwd(), "src", "data", "Offplan_MOH.xlsx");
    await app.adminProjectPage.uploadUnitsFile(unitsImportFilePath);
    await app.adminProjectPage.clickImportSaveButton();
    await app.adminProjectPage.expectUnitImportInProgress();
    await app.adminProjectPage.waitForUnitImportCompletion();
    await app.adminProjectPage.clickApproveButton();
    await app.adminProjectPage.clickConfirmButton();
    await app.adminProjectPage.waitForImportConfirmation();
    await app.adminProjectPage.clickBackButton();

    await logStep("Step 07: Upload project media and enter media details");
    await app.adminProjectPage.clickProjectMediaTab();
    const bannerImagePath = path.join(process.cwd(), "src", "data", "Sample image.jpg");
    await app.adminProjectPage.uploadBannerImage(bannerImagePath);
    await app.adminProjectPage.clickUploadButton();
    await app.adminProjectPage.selectDisplayMethod("Hero");
    await app.adminProjectPage.fillDetailsTitleArabic(projectName);
    await app.adminProjectPage.fillDetailsTitleEnglish(projectName);
    await app.adminProjectPage.fillFirstUnitReadyDate("2026-01-01");
    await app.adminProjectPage.fillNameArabic(projectName);
    await app.adminProjectPage.fillNameEnglish(projectName);
    await app.adminProjectPage.fillSummaryArabic("ملخص المشروع".repeat(10));
    await app.adminProjectPage.fillSummaryEnglish("Project Summary".repeat(10));
    await app.adminProjectPage.fillDescriptionArabic("الوصف (باللغة العربية)".repeat(10));
    await app.adminProjectPage.fillDescriptionEnglish("Description EN".repeat(10));
    await app.adminProjectPage.fillStartingPrice("500000");
    await app.adminProjectPage.fillLatitude("1.1");
    await app.adminProjectPage.fillLongitude("1.1");
    await app.adminProjectPage.expectMediaUploadComplete(0);
    await app.adminProjectPage.fillGuarenteeAfterServices("Test guarantee after services");
    await app.adminProjectPage.clickMediaSaveButton();

    await logStep("Step 08: Approve project media");
    await app.adminProjectPage.clickProjectDetailsTab();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickKeepProjectUnpublishedButton();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateToastMessage();

    await logStep("Step 09: Publish the unit model");
    await app.adminProjectPage.clickUnitModelsSection();
    await app.adminProjectPage.clickUnitModelCell();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickMediaDraftSection();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();
    await app.adminProjectPage.clickPublishUnitButton();
    await app.adminProjectPage.clickUnitModelLink();

    await logStep("Step 10: Set project availability");
    await app.adminProjectPage.clickProjectDetailsText();
    await app.adminProjectPage.selectProjectStatus("متاح");
    await app.adminProjectPage.clickSaveButton();

    await logStep("Step 11: Publish the project and validate the toast message");
    await app.adminProjectPage.enableAvailableForBookingToggle();
    await app.adminProjectPage.publishProject();
    await app.adminProjectPage.clickSaveButton();
    await app.adminProjectPage.validateToastMessage();
  });

  test(
    "TC-02 - Developer adds cash and lending payment schedules to the project (Offplan Private Land)",
    { annotation: [{ product: "Marketplace", type: "critical" }] as any },
    async ({ page }) => {
      test.setTimeout(0);
      const app = new WebApp(page);
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const sapaPortalUrl = environment.sapaPortalUrl;

      await logStep("Step 01: Login as developer to sapa portal and open the project");
      await app.developerProjectPage.gotoAuth(sapaPortalUrl);
      await app.developerProjectPage.loginDeveloper(developerUserId);
      await app.developerProjectPage.switchRoleToDeveloper();

      await logStep("Step 02: Search and open the project");
      await app.developerProjectPage.openProjectBySearch(projectName);

      await logStep("Step 03: Add a cash payment schedule and verify it is added successfully");
      await app.developerProjectPage.openPaymentSchedulesTab();
      await app.developerProjectPage.addPaymentSchedule({
        type: "cash",
        scheduleName: "Cash 22",
        completionPercentageOneValue: "50",
        percentageOneValue: "50",
        completionPercentageTwoValue: "100",
        percentageTwoValue: "50",
      });

      await logStep("Step 04: Add a lending payment schedule and verify it is added successfully");
      await app.developerProjectPage.openProjectBySearch(projectName);
      await app.developerProjectPage.openPaymentSchedulesTab();
      await app.developerProjectPage.addPaymentSchedule({
        type: "lending",
        scheduleName: "Lending 22",
        completionPercentageOneValue: "50",
        percentageOneValue: "50",
        completionPercentageTwoValue: "100",
        percentageTwoValue: "50",
      });
    },
  );

  test(
    "TC-03 - Developer approves sales contract of project (Offplan Private Land)",
    { annotation: [{ product: "Marketplace", type: "critical" }] as any },
    async ({ page }) => {
      test.setTimeout(0);
      const app = new WebApp(page);
      const projectName = data.projectName;
      const developerUserId = data.developerUserId;
      const sapaPortalUrl = environment.sapaPortalUrl;


      await logStep("Step 01: Login as developer to sapa portal and open the project");
      await app.developerProjectPage.gotoAuth(sapaPortalUrl);
      await app.developerProjectPage.loginDeveloper(developerUserId);
      await app.developerProjectPage.switchRoleToDeveloper();

      await logStep("Step 02: Search and open the project");
      await app.developerProjectPage.openProjectBySearch(projectName);

      await logStep("Step 03: Approve the sales contract");
      await app.developerProjectPage.openSalesContractsTab();
      await app.developerProjectPage.viewAndApproveSalesContract();
      await app.developerProjectPage.approveUnitSpecification();
      await app.developerProjectPage.fillOtp("1234");
      await app.developerProjectPage.verifyOtp();

      await logStep("Step 04: Verify contract approval message");
      await app.developerProjectPage.verifyApprovalSuccessMessage();
    },
  );

  test("TC-04 - User books unit (Offplan Private Land)", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environment.userPortalUrl;
    const projectName = data.projectName;

    await logStep("Step 01: Open the user portal and login");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 02: Find the project and open its unit model");
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.projectDetailsPage.openUnitsAndScroll();

    await logStep("Step 03: Open a unit and start the booking");
    const page1Promise = page.waitForEvent("popup");
    await app.marketplaceLandingPage.openResidentialUnit();
    const page1 = await page1Promise;
    const page2Promise = page1.waitForEvent("popup");
    {
      const unitApp = new WebApp(page1);
      await unitApp.projectUnitsPage.openUnitInPopup(1);
    }
    const page2 = await page2Promise;
    {
      let bookingPage = page2;
      let bookingApp = new WebApp(bookingPage);

      await logStep("Step 04: Confirm terms and conditons");
      await bookingApp.unitDetailsPage.reserveUnit();
      await bookingApp.unitBookingPage.acceptTermsAndConfirm();

      await logStep("Step 05: Pay booking fees and validate payment success");
      await bookingApp.paymentGatewayPage.fillCardDetails();
      await bookingApp.paymentConfirmationPage.closePayment();
      await bookingApp.paymentConfirmationPage.expectSuccessMessage();
    }
  });

  test("TC-05 - User cancels a booking", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environment.userPortalUrl;

    await logStep("Step 01: Open user portal");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep("Step 02: Log in with Nafath");
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 03: Open active bookings");
    await app.bookingPage.openActiveBookings();

    await logStep("Step 04: Open booking details");
    await app.bookingPage.openBookingDetails();

    await logStep("Step 05: Cancel the booking and validate cancellation success message");
    await app.bookingPage.cancelBooking();
    await app.bookingPage.expectCancellationSuccess();
  });
});

