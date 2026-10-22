import { test } from '@playwright/test';
const path = require('path');
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { DateUtils } from '@pages/utils/DateUtils';
import { SelfConstructionObjects } from '@objects/SelfConstructionObjects';

const SERVICE = 'engineering-offices';

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

test.describe('Engineering Office', () => {
  test('TC-01 Add new engineering office', { annotation: [{ product: 'Self-Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const engineeringOfficeName = `Engineering Office Name ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    writeServiceData('engineeringOfficeName', engineeringOfficeName);
    const tenRandomNumbers = `1${Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, '0')}`;
    const ibanNumber = `SA${Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('')}`;
    const randomText = Array.from({ length: 20 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);
    await logStep('Step 02: Navigate to add new engineering office');
    await app.commonMethods.clickElement(SelfConstructionObjects.selfConstructionLink);
    await app.commonMethods.clickElement(SelfConstructionObjects.engineeringOfficeLink);
    await app.commonMethods.clickElement(SelfConstructionObjects.addEngineeringOfficeButton);
    await logStep('Step 03: Fill all information of the new engineering office');

    await app.selfConstructionPage.fill(SelfConstructionObjects.enginerringOfficeNameInputfield, engineeringOfficeName);
    await app.commonMethods.clickElement(SelfConstructionObjects.statusDropdownList);
    await app.commonMethods.clickElement(SelfConstructionObjects.statusOption);
    await app.selfConstructionPage.fill(SelfConstructionObjects.crNubmerInputfield, tenRandomNumbers);
    await app.selfConstructionPage.fill(SelfConstructionObjects.councilNubmerInputfield, tenRandomNumbers);
    await app.selfConstructionPage.fill(SelfConstructionObjects.buildingPermitPriceInputfield, tenRandomNumbers);
    await app.selfConstructionPage.fill(SelfConstructionObjects.ibanNumberInputfield, ibanNumber);
    await app.selfConstructionPage.fill(SelfConstructionObjects.bankAccountNameInputfield, randomText);

    await logStep('Step 04: Save then verify the successful message');
    await app.adminProjectPage.clickSaveButton();
    await app.commonMethods.verifyElementVisible(SelfConstructionObjects.succsessfullToasMessage);
  });
  test('TC-02 Add new interior design offers', { annotation: [{ product: 'Self-Construction', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const adminUsername = data.adminUsername;
    const adminPassword = data.adminPassword;
    const adminPortalUrl = environment.adminPortalUrl;
    const designerNameInputfield = `Designer Name ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}`;
    writeServiceData('designerNameInputfield', designerNameInputfield);
    const tenRandomNumbers = `1${Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, '0')}`;
    const ibanNumber = `SA${Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('')}`;
    const randomText = Array.from({ length: 20 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const randomTextEmail = Math.random().toString(36).slice(2, 7).padEnd(5, '0');
    const email = `${randomTextEmail}@a.com`;
    const about = Array.from({ length: 50 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const designLogoImagePath = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');

    await logStep('Step 01: Login to admin portal as a super admin');
    await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);

    await logStep('Step 02: Navigate to add new interior design offer');
    await app.commonMethods.clickElement(SelfConstructionObjects.selfConstructionLink);
    await app.commonMethods.clickElement(SelfConstructionObjects.interiorDesignOffersLink);
    await app.commonMethods.clickElement(SelfConstructionObjects.addNewInteriorOfficeDesignLink);

    await logStep('Step 03: Fill all information of the new interior design office');
    await app.selfConstructionPage.fill(SelfConstructionObjects.designerNameInputfield, designerNameInputfield);
    await app.selfConstructionPage.fill(SelfConstructionObjects.officeNameInputfield, randomText);
    await app.selfConstructionPage.fill(SelfConstructionObjects.crNubmerInputfield, tenRandomNumbers);
    await app.selfConstructionPage.fill(SelfConstructionObjects.aboutDesignerTextarea, about);
    await app.selfConstructionPage.fill(SelfConstructionObjects.emailInputfield, email);
    await app.selfConstructionPage.fill(SelfConstructionObjects.ibanNumberInputfield, ibanNumber);
    await app.selfConstructionPage.fill(SelfConstructionObjects.bankAccountNameInputfield, randomText);

    await logStep('Step 04: Save then verify the successful message');
    await app.adminProjectPage.clickSaveButton();
    await app.commonMethods.verifyElementVisible(SelfConstructionObjects.succsessfullToasMessage);

    await logStep('Step 06: Upload design logo and approve');
    await app.selfConstructionPage.uploadDesignLogo(designLogoImagePath);
    await app.adminProjectPage.clickUploadButton();
    await app.adminProjectPage.clickRequestMediaApprovalButton();
    await app.adminProjectPage.clickAcceptUploadedMediaButton();

    await logStep('Step 07: Verify is published');
    await page.waitForTimeout(2000);
    await page.keyboard.press('F5');
    await app.selfConstructionPage.publishProject();
  });
});
