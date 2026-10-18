import { test } from '@playwright/test';
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'

const SERVICE = "update-financial-institute";
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe("Update project financial institute", () => {
    test("TC-01 Update the bank information", { annotation: [{ product: 'Digitar', type: 'non-critical' }] as any }, async ({ page }) => {
        await logStep("Step 00: Read test data relative to the service");
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readEnvironments();
        const data = readServiceData();

        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

        await logStep("Step 02: Navigate to financial institutes");
        await app.adminProjectPage.clickInternalInventory();
        await app.adminProjectPage.openFinancialInstitutes();
        
        await logStep("Step 03: Search for the institute");
        await app.adminProjectPage.searchFinancialInstitute(data.bankName);
        
        await logStep("Step 04: Update bank Arabic, English and Real names");
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14);
        const bankName = `Test Automation Bank ${timestamp}`;
        await app.adminProjectPage.fillFinancialInstituteArabicName(bankName);
        await app.adminProjectPage.fillFinancialInstituteEnglishName(bankName);
        await app.adminProjectPage.fillFinancialInstituteRealName(bankName);
        
        await logStep("Step 05: save and validate the toast message");
        await app.adminProjectPage.clickFinancialInstituteSaveButton();
        await app.adminProjectPage.expectFinancialInstituteSavedToast();
        DataHelper.updateServiceData(SERVICE, "bankName", bankName);
    });

    test("TC-02 Check the updates are reflected in the project financial institutions page in admin portal", { annotation: [{ product: 'Digitar', type: 'non-critical' }] as any }, async ({ page }) => {
        await logStep("Step 00: Read test data relative to the service");
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readEnvironments();
        const data = readServiceData();
        const adminUrl = environment.adminPortalUrl;
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const projectName = data.projectName;
        const bankName = data.bankName;
        
        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(adminUrl, adminUsername, adminPassword,);
        
        await logStep("Step 02: Navigate to projects and search for a project");
        await app.adminProjectPage.openProjects();
        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
        await page.waitForTimeout(10000);

        await logStep("Step 03: Validate the updated bank name is present");
        await app.adminProjectPage.expectFinancingEntitiesVisible();
        await app.adminProjectPage.clickFinancingEntities();
        await app.adminProjectPage.expectBankNameVisibility(bankName);
    });

    test("TC-03 Check the updates are reflected in the project financial institutions page in user portal", { annotation: [{ product: "Digitar", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        await logStep("Step 00: Read test data relative to the service");
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environment.userPortalUrl;
        const projectName = data.projectName;
        const bankName = data.bankName;

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

        await logStep("Step 04: Validate the updated project name is present");
        await app.marketplaceLandingPage.clickFinancingShowMore();
        await app.marketplaceLandingPage.expectUpdateProjectNameIsVisible(bankName);
    });
});
