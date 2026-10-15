import {expect, test} from '@fixtures/pages.fixture';
import {logStep} from '@helpers/LogSteps';
import {DataHelper} from "@helpers/DataHelper";
import {WebApp} from "@base-class/web-app";

const SERVICE = "search-engine";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Search Engine', () => {
    test('Verify the user searching any valid data in smart search field produces a result', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        //await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(data.sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 02: Search for a valid text > check the search results are available");
        await app.marketplaceLandingPage.searchFor("Riydah");
        expect(await app.marketplaceLandingPage.isSearchResultsCardVisible()).toBe(true);
    });

    test('TC-02 Verify that no result appears if user enter only 2 character', {
        annotation: [{
            product: 'Marketplace', type: 'non-critical'
        } as any]
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        //await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(data.sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 02: Search for an invalid text > check the search results are not available");
        await app.marketplaceLandingPage.searchFor("rr");
        expect(await app.marketplaceLandingPage.getSearchResultsCardText()).toContain("لم يتم العثور على نتائج لبحثك. يرجى تعديل بحثك أو استكشاف عقارات قريبة.")
    });
});
