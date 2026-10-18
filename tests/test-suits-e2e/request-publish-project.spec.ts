import { test } from "@playwright/test";
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import { RequestPublishProjectObjects } from "@objects/RequestPublishProjectObjects";

const SERVICE = "request-publish-project";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

test.describe("Request publish project", () => {
    test("TC-01 - Developer creates offplan project", { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const environment = readEnvironments();
        const data = readServiceData();
        const { faker } = await import('@faker-js/faker');
        const currentDate = DateUtils.getCurrentDateISO();
        const projectName = `Automation Developer Project Offplan ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        writeServiceData("projectName", projectName);
        const app = new WebApp(page);
        const sapaUrl = environment.sapaPortalUrl;
        const developerUserId = data.developerUserId;
        await logStep("Step 01: Navigate to partners portal > Login");

        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await logStep("Step 02: Navigate to create new project");

        await app.requestPublishProjectPage.clickProjectsLink();
        await app.requestPublishProjectPage.clickNewProjectButton();

        await logStep("Step 03: Fill project information > Next");
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.projectNameInputfield, projectName);
        await app.requestPublishProjectPage.selectAnyDropdownOption(RequestPublishProjectObjects.proejctTypeDropddownList, RequestPublishProjectObjects.projectTypeOption);
        await app.requestPublishProjectPage.selectAnyDropdownOption(RequestPublishProjectObjects.regionDropdownList, RequestPublishProjectObjects.regionOption);
        await app.requestPublishProjectPage.selectAnyDropdownOption(RequestPublishProjectObjects.cityDropdownList, RequestPublishProjectObjects.cityOption);
        await app.requestPublishProjectPage.selectAnyDropdownOption(RequestPublishProjectObjects.developerDropdownList, RequestPublishProjectObjects.developerOption);
        await app.requestPublishProjectPage.clickBookableToggle();
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.signAggrementProjectDateInputfield, currentDate);
        const random = faker.string.numeric({ length: 10, allowLeadingZeros: false });
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.projectLicenseNumberInpufield, random);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.projectLicenseDateInputfield, currentDate);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.escrowAccountNameInputfield, "AccountName");
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.escrowAccountNubmerInputfield, "SA1111111111111111111111");
        await app.requestPublishProjectPage.selectAnyDropdownOption(RequestPublishProjectObjects.escrowBankNameDropdownList, RequestPublishProjectObjects.escrowBankNameOption);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.projectDeductPerecentageInputfield, 10);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.deedCityInputfield, "الرباض");
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.landDeliveryDateToDeveloperInputfield, currentDate);
        await app.requestPublishProjectPage.clickNextButton();

        await logStep("Step 04: Select financial institues > Next");
        await app.requestPublishProjectPage.clickBankCheckbox();
        await app.requestPublishProjectPage.clickNextButton();

        await logStep("Step 05: Fill payemnt schedules > confirm and send");
        await app.requestPublishProjectPage.clickLendingPaymentDropdownButton();
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.templateNameForLendingInputfield, "Lending");
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.firstPayCompletionPercentageForLending, 50);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.firstPayPaidPercentageForLending, 40);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.lastPayCompletionPercentageForLending, 100);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.lastPayPaidPercentageForLending, 60);
        await app.requestPublishProjectPage.clickCashPaymentDropdownButton();
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.templateNameForCashInputfield, "Cash");
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.firstPayCompletionPercentageForCash, 50);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.firstPayPaidPercentageForCash, 40);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.lastPayCompletionPercentageForCash, 100);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.lastPayPaidPercentageForCash, 60);
        await app.requestPublishProjectPage.fillAnyInputField(RequestPublishProjectObjects.lastPayPaidPercentageForCash, 60);
        await app.requestPublishProjectPage.clickConfirmAndSendButton();
        
        await logStep("Step 06: Send > Verify the project created successfully");
        await app.requestPublishProjectPage.clickSendButton();
        await app.requestPublishProjectPage.verifySuccessMessageIsVisible();
    });

    test("TC-02 - Admin approves create new project request", { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        const environment = readEnvironments();
        const data = readServiceData();
        // const cashPaymentData = testData.services["cash-payment"];
        const app = new WebApp(page);
        const adminUrl = environment.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const projectName = data.projectName;

        await logStep("Step 01: Login to admin portal");
        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );

        await logStep("Step 02: Navigate to developer projects > Approve the the request > Verify the success message");
        await app.adminProjectPage.openProjects();
        await app.requestPublishProjectPage.clickDeveloperProjectsTab();
        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
        await page.waitForTimeout(10000);
        await app.requestPublishProjectPage.clickApproveButton();
        await app.requestPublishProjectPage.verifySuccessApprovedToastMessageIsVisible();

    });
    test("TC-03 - Developer adds units", { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        await logStep("Step 00: Read data from json relative to the service");
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const filePath = path.join(process.cwd(), "src", "data", "add-unit.xlsx");

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await page.pause();
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for project");
        await app.developerProjectPage.openProjectBySearch(projectName);

        await logStep('Step 03: Navigate to add unit > Upload units file');
        await app.updateUnitsPage.selectManageProjectOption("إضافة وحدات");
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

    test("TC-04 - Admin approve the units and publish the project", { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const adminUrl = environment.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const projectName = data.projectName;

        await logStep("Step 01: Login to admin portal");
        await app.adminProjectPage.login(
            adminUrl,
            adminUsername,
            adminPassword,
        );

        await logStep("Step 02: Navigate to developer projects > Approve the added units");
        await app.adminProjectPage.openProjects();
        await app.requestPublishProjectPage.clickDeveloperProjectsTab();
        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
        // await page.locator('div').filter({ hasText: data.projectName }).click();
        await page.waitForTimeout(5000);
        await app.adminProjectPage.selectSubsidyType("دعم عيني كامل");
        await app.adminProjectPage.fillMaxSubsidyAmount("2");
        await app.adminProjectPage.clickSaveButton();
        await app.adminProjectPage.validateProjectSavedToastMessage();
        await app.adminProjectPage.clickUnitsTab();
        await app.requestPublishProjectPage.clickApproveButton();
        await app.requestPublishProjectPage.verifySuccessApprovedUnitsToastMessageIsVisible();

        await logStep("Step 03: Upload project media and enter media details");
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

        await logStep("Step 04: Approve project media");
        await app.adminProjectPage.clickProjectDetailsTab();
        await app.adminProjectPage.clickRequestMediaApprovalButton();
        await app.adminProjectPage.clickAcceptUploadedMediaButton();
        await app.adminProjectPage.clickKeepProjectUnpublishedButton();
        await app.adminProjectPage.clickSaveButton();
        await app.adminProjectPage.validateProjectSavedToastMessage();

        await logStep("Step 05: Publish the unit model");
        await app.adminProjectPage.clickUnitModelsSection();
        await app.adminProjectPage.clickUnitModelCell();
        await app.adminProjectPage.clickSaveButton();
        await app.adminProjectPage.clickMediaDraftSection();
        await app.adminProjectPage.clickSaveButton();
        await app.adminProjectPage.clickRequestMediaApprovalButton();
        await app.adminProjectPage.clickAcceptUploadedMediaButton();
        await app.adminProjectPage.clickPublishUnitButton();
        await app.adminProjectPage.clickUnitModelLink();

        await logStep("Step 06: Set project availability");
        await app.adminProjectPage.clickProjectDetailsText();
        await app.adminProjectPage.selectProjectStatus("متاح");
        // await app.adminProjectPage.selectAvailableProjectStatus();
        await app.adminProjectPage.clickSaveButton();

        await logStep("Step 07: Publish the project and validate the toast message");
        await app.adminProjectPage.enableAvailableForBookingToggle();
        await app.adminProjectPage.publishProject();
        await app.adminProjectPage.clickSaveButton();
        await app.adminProjectPage.validateProjectSavedToastMessage();
    });
    test("TC-05 - Verify the project is published in sakani portal", { annotation: [{ product: "Digitar Developer", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const environment = readEnvironments();
        const data = readServiceData();
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

        await logStep("Step 02: Find the project and verify is published");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.requestPublishProjectPage.verifyProjectName(projectName);
    });
});