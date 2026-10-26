import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { CreatingAnAdvertisingCampaignObjects } from '@objects/CreatingAnAdvertisingCampaignObjects';

const SERVICE = 'creating-an-advertising-campaign';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Creating an advertising campaign', () => {
  test('TC-01 Developer creates an advirtising campaign with WhatsApp Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to create an advistisng campaign  > Select WhatsApp channel');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.whatsAppCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);

    await logStep('Step 03: Fill all information > Click next then send > Take the request number');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'WhatsApp Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'WhatsApp Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.messageTitleInputfield, 'Message Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.messageContentTextarea, 'Message Content');
    await app.creatingAnAdvertisingCampaignPage.selectAllInputFieldText(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.dateInputField, DateUtils.getDateWithOffset(1));
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-02 Developer creates an advirtising campaign with SMS Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();
    await logStep('Step 02: Navigate to create an advistisng campaign  > Select SMS channel');

    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.smsCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await logStep('Step 03: Fill all information > Click next then send > Take the request number');

    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'SMS Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'SMS Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.smsContentTextarea, 'SMS Message Content');
    await app.creatingAnAdvertisingCampaignPage.selectAllInputFieldText(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.dateInputField, DateUtils.getDateWithOffset(1));
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-02 Developer creates an advirtising campaign with Email Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal and');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to create an advistisng campaign  > Select Email channel');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.emailCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);

    await logStep('Step 03: Fill all information > Click next then send > Take the request number');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'Email Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'Email Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.emailTitleInputfield, 'Email Message Tile');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.emailContectTextarea, 'Email Message Content');
    await app.creatingAnAdvertisingCampaignPage.selectAllInputFieldText(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.dateInputField, DateUtils.getDateWithOffset(1));
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-04 Developer creates an advirtising campaign with Sakani App Notification Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to create an advistisng campaign  > Select Sakani App Notification  channel');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.InAppWebOrProomotionDropdDownButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sakaniAppNotificationCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);

    await logStep('Step 03: Fill all information > Click next then send > Take the request number');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'Notification Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'Notification Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.messageTitleInputfield, 'Message Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.messageContentTextarea, 'Message Content');
    await app.creatingAnAdvertisingCampaignPage.selectAllInputFieldText(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.dateInputField, DateUtils.getDateWithOffset(1));
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.dateInputField);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-05 Developer creates an advirtising campaign with Sakani Platform Banner Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();
    await logStep('Step 02: Navigate to create an advistisng campaign  > Select Sakani Platform Banner channel');

    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.InAppWebOrProomotionDropdDownButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sakaniPlatformBannerCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await logStep('Step 03: Fill all information > Click next then send > Take the request number');

    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'Notification Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'Notification Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.pannerContentTextarea, 'Banner Content');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-06 Developer creates an advirtising campaign with Pop Up Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();
    await logStep('Step 02: Navigate to create an advistisng campaign  > Select Pop Up channel');

    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.InAppWebOrProomotionDropdDownButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.PopUpCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await logStep('Step 03: Fill all information > Click next then send > Take the request number');

    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'Popup Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'Popup Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.popUpContentTextarea, 'Popup Content');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-07 Admin rejects the request', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const email = data.email;
    const password = data.password;
    const otp = data.otp;
    const sayalUrl = environments.sayalUrl;

    await logStep('Step 01: Login as admin to sayal portal');
    await app.partnersLoginPage.gotoAuth(sayalUrl);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.emailInput, email);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.passwordInput, password);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.verificationCodeInput, otp);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.loginButton);

    await logStep('Step 02: Navigate to campaigns request page > Serach for the request number');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignsLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignsTab);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignSearchInput, requestNumber);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignSearchButton);

    await logStep('Step 03: Reject the request > Verify the successfull rejection message');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.actionIconButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.rejectButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.rejectionMessageInput, 'Reject The request');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.confirmButton);
    await app.creatingAnAdvertisingCampaignPage.verifyElementVisible(CreatingAnAdvertisingCampaignObjects.rejectionSuccessMessage);
  });

  test('TC-08 Developer creates an advirtising campaign with Cold Call Channel', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environments.sapaPortalUrl;

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to create an advistisng campaign  > Select Pop Up channel');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.advertisingCampaigntLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.newRequestButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.directOutreachDropdownButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.coldCallingCheckbox);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);

    await logStep('Step 03: Fill all information > Click next then send > Take the request number');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignNameInputfield, 'Cold Call Title');
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.requestDescriptionTextarea, 'Cold Call Description');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.headingButton);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.coldCallTextarea, 'Colde Call Content');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.nextButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.sendButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.viewRequestButton);
    await app.creatingAnAdvertisingCampaignPage.saveRequestNumber(CreatingAnAdvertisingCampaignObjects.requestNumber);
  });
  test('TC-09 Admin approves the request', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const requestNumber = data.requestNumber;
    const email = data.email;
    const password = data.password;
    const otp = data.otp;
    const sayalUrl = environments.sayalUrl;

    await logStep('Step 01: Login as admin to sayal portal');
    await app.partnersLoginPage.gotoAuth(sayalUrl);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.emailInput, email);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.passwordInput, password);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.verificationCodeInput, otp);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.loginButton);

    await logStep('Step 02: Navigate to campaigns request page > Serach for the request number');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignsLink);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignsTab);
    await app.creatingAnAdvertisingCampaignPage.fillInputField(CreatingAnAdvertisingCampaignObjects.campaignSearchInput, requestNumber);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.campaignSearchButton);

    await logStep('Step 03: Approve the request > Verify the successfull approval message');
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.actionIconButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.approveButton);
    await app.creatingAnAdvertisingCampaignPage.clickElement(CreatingAnAdvertisingCampaignObjects.confirmButton);
    await app.creatingAnAdvertisingCampaignPage.verifyElementVisible(CreatingAnAdvertisingCampaignObjects.approvalSuccessMessage);
  });
});
