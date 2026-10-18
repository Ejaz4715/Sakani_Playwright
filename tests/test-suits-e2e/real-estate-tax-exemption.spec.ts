import { test, expect } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'real-estate-tax-exemption';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Real estate tax exemption Verify the certificate inquiry message', () => {
  test('TC-01 Request real estate tax exemption', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const userPortalUrl = environment.userPortalUrl;
    const sakaniUserId = data.sakaniUserId;

    await logStep('Step 01: Open the user portal and login');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Open services menu > View all services');
    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnAllServices();

    await logStep('Step 03: Open real estate tax exemption service > Start service');
    await app.realEstateTaxExemptionPage.clickOnRealEstateTaxExemptionService();
    await app.realEstateTaxExemptionPage.clickOnStartServiceButton();

    await logStep('Step 04: Copy the issued certificate number');
    const certificateNumber = await app.realEstateTaxExemptionPage.getCertificateNumber();
    expect(certificateNumber).toMatch(/^\d{14}$/);

    await logStep('Step 05: View the certificate');
    await app.realEstateTaxExemptionPage.clickOnViewCertificateButton();
    expect(await app.realEstateTaxExemptionPage.isCertificateDialogVisible()).toBeTruthy();

    await logStep('Step 06: Close the certificate dialog');
    await app.realEstateTaxExemptionPage.closeCertificateDialog();

    await logStep('Step 07: Open the certificate inquiry tab');
    await app.realEstateTaxExemptionPage.clickOnCertificateInquiryTab();

    await logStep('Step 08: Paste the copied certificate number and national ID > Verify');
    await app.realEstateTaxExemptionPage.enterCertificateNumber(certificateNumber);
    await app.realEstateTaxExemptionPage.enterNationalId(sakaniUserId);
    await app.realEstateTaxExemptionPage.clickOnVerifyButton();

    await logStep('Step 09: Verify the certificate inquiry message');
    expect(await app.realEstateTaxExemptionPage.isCertificateNotBelongMessageVisible()).toBeTruthy();

    await logStep('Step 10: Verify the national ID and certificate number are displayed in certificate details');
    expect(await app.realEstateTaxExemptionPage.isCertificateDetailDisplayed(sakaniUserId)).toBeTruthy();
    expect(await app.realEstateTaxExemptionPage.isCertificateDetailDisplayed(certificateNumber)).toBeTruthy();
  });
});
