import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';

const SERVICE = 'waiting-list';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Card Details', () => {
  test('TC-01 Verify user viewing the project card details', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Open the user portal and login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Search for a project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.clickSearchedResultIfTextMatches(projectName);

    await logStep('Step 03: Validate the presence of project information section');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectInfoSection, true);

    await logStep('Step 03: Validate the presence of project information section');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectInfoSection, true);

    await logStep('Step 04: Validate the presence of favorite and share buttons');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.favoriteButton, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.shareButton, true);

    await logStep('Step 05: Validate brochure and masterplan section presence and brochure viewer functionality');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.brochureAndMasterplanSection, true);
    await app.bookingPage.clickBrochureButton();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.brochureViewer, true);
    await app.bookingPage.clickCloseBrochureButton();

    await logStep('Step 06: Validate masterplan viewer functionality');
    await app.bookingPage.clickMasterplanButton();
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.masreplanViewer, true); // Note: verify spelling 'masreplanViewer' vs 'masterplanViewer' in your page object
    await app.bookingPage.clickCloseMasterplanButton();

    await logStep('Step 07: Validate project unit types and facilities sections');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectUnitsTypesSection, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectFacilitiesSection, true);

    await logStep('Step 08: Validate location and schedule payment sections');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.locationSection, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.schdualePaymentSection, true);

    await logStep('Step 09: Validate participating banks and project contacts sections');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.participatinBanksSection, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.projectContactsSection, true);

    await logStep('Step 10: Validate call and WhatsApp communication buttons');
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.callButton, true);
    await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.whatsAppButton, true);
  });
});
