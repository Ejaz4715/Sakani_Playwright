import {expect, test} from '@fixtures/pages.fixture';
import {logStep} from '@helpers/LogSteps';
import {DataHelper} from "@helpers/DataHelper";
import {WebApp} from "@base-class/web-app";

const SERVICE = "metaverse-management";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Metaverse Management', () => {
    test('TC-01 Sakani Admin blocks the SAPA user\'s access to the Metaverse service', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        await logStep("Step 01: Navigate to admin portal > Login");
        await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword,);

        await app.metaverseManagementPage.clickOnMetaverseManagementAccess();
        await app.metaverseManagementPage.clickOnFirstActiveUser();
        await app.metaverseManagementPage.blockUser();
        expect(await app.metaverseManagementPage.isUserBlocked()).toBe(true);
    });

    test('TC-02 Sapa User verifies that Metaverse service access is restricted from the SAPA Portal', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(data.sapaCompanyUser);

        await app.metaverseManagementPage.clickOnSakaniMetaverse();
        await app.metaverseManagementPage.clickOnSakaniMetaverseAccessButton();
        expect(await app.metaverseManagementPage.isSapaUserBlocked()).toBe(true);

    });

    test('TC-03 TC_03_Sapa Company Admin validates that the user\'s status reflects as "Blocked" (synchronized with Sakani Admin\'s action) and unblocks the user\'s Metaverse access', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(data.sapaCompanyAdmin);

        await app.metaverseManagementPage.clickOnSakaniMetaverseRequests();
        await app.metaverseManagementPage.fillIdentityNumber(data.sapaCompanyUser);
        await app.metaverseManagementPage.clickOnSearch();

        expect(await app.metaverseManagementPage.isSapaUserBlockedFromCompanyAdminView()).toBe(true);

        await app.metaverseManagementPage.clickOnUnBlockedFromCompanyAdminView();
        await app.metaverseManagementPage.confirmUnBlockingFromCompanyAdminView();

        expect(await app.metaverseManagementPage.isSapaUserBlockedFromCompanyAdminView()).toBe(false);

    });

    test('TC-04 Sapa User verifies that the Metaverse service is once again accessible from the SAPA Portal', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(data.sapaCompanyUser);

        await app.metaverseManagementPage.clickOnSakaniMetaverse();
        await app.metaverseManagementPage.clickOnSakaniMetaverseAccessButton();
        expect(await app.metaverseManagementPage.isSapaUserBlocked()).toBe(false);

    });

    test('TC-05 Sakani Admin validates that the user\'s status reflects as "Unblocked" (synchronized with Company Admin\'s action)', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        await logStep("Step 01: Navigate to admin portal > Login");
        await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword,);

        await app.metaverseManagementPage.clickOnMetaverseManagementAccess();
        await app.metaverseManagementPage.clickOnFirstActiveUser();
        expect(await app.metaverseManagementPage.isUserActive()).toBe(true);
    });

});
