import { test, expect } from '@playwright/test';
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import data from '@data/payment-system-test-data.json';
import { DateUtils } from '@pages/utils/DateUtils';
test('test', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any}, async ({ page }) => {
  test.setTimeout(0)
  const app = new WebApp(page);
  const { faker } = await import('@faker-js/faker');

  await logStep("Step 01: Login to admin portal");
  await app.adminProjectPage.login(
    data.environments.adminPortalUrl,
    data['loyalty-sharrai'].adminUsername,
    data['loyalty-sharrai'].adminPassword
  );

  const companyName = `Automation Test Company ${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`;
  const dealName = `Automation Test Deal ${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`;

  DataHelper.updateServiceData("loyalty-sharrai", "companyName", companyName);
  DataHelper.updateServiceData("loyalty-sharrai", "dealName", dealName);

  await logStep("Step 02: Navigate to add new partner");
  await app.adminLoyaltyPage.clickLoyaltyProgram();
  await app.adminLoyaltyPage.clickManagePartners();
  await app.adminLoyaltyPage.clickAddNewPartner();

  await logStep("Step 03: Fill company information");
  await app.adminLoyaltyPage.fillCompanyName(companyName);
  await app.adminLoyaltyPage.fillActivity("Automation Test Activity");
  await app.adminLoyaltyPage.selectIsActiveOption("نعم");
  await app.adminLoyaltyPage.fillContactPerson("Testing Automation User");
  await app.adminLoyaltyPage.fillContactEmail("test@email.com");
  await app.adminLoyaltyPage.fillContactPhone("588938198");
  await app.adminLoyaltyPage.fillContactWhatsapp("58893819");
  const random = faker.string.numeric({ length: 22, allowLeadingZeros: false });
  await app.adminLoyaltyPage.fillIbanNumber("SA" + random);
  await app.adminLoyaltyPage.fillBankAccountName("Al Rajhi");

  await logStep("Step 04: Upload logo > Save > Validate toast message");
  const imageFilePath = path.join(process.cwd(), "src", "data", "Sample image 2.png");
  await app.adminLoyaltyPage.uploadFile(imageFilePath);
  await app.adminLoyaltyPage.clickSave();
  await app.adminLoyaltyPage.validatePartnerAddedSuccessMessage();

  await logStep("Step 05: Navigate to add new deal");
  await app.adminLoyaltyPage.clickManageDeals();
  await app.adminLoyaltyPage.clickAddNewOffer();
  await app.adminLoyaltyPage.selectCompanyName(companyName);

  await logStep("Step 06: Fill all the details > Save");

  const campaignStartDate = DateUtils.getDateWithOffsetAndFormat(0, "DD/MM/YYYY");
  const campaignEndDate = DateUtils.getDateWithOffsetAndFormat(0, "DD/MM/YYYY");

  await app.adminLoyaltyPage.fillCampaignStartDate(campaignStartDate);
  await app.adminLoyaltyPage.fillCampaignEndDate(campaignEndDate);
  await app.adminLoyaltyPage.fillPrice("5000");
  await app.adminLoyaltyPage.fillDiscount("2");
  await app.adminLoyaltyPage.fillAcceptableQuantityPerUser("1");
  await app.adminLoyaltyPage.selectSakaniCommissionType("كمية");
  await app.adminLoyaltyPage.fillSakaniCommissionValue("100");
  await app.adminLoyaltyPage.fillTitle("Test Deal");
  await app.adminLoyaltyPage.fillDescription("Test Desc");
  await app.adminLoyaltyPage.fillDetails("Test Details");
  await app.adminLoyaltyPage.fillTermsAndConditions("Testing terms and condition for sharrai offer");
  await app.adminLoyaltyPage.clickSave();

  await logStep("Step 07: Import deal file > Save the file");
  await app.adminLoyaltyPage.clickDealIdentifiersTab();
  await app.adminLoyaltyPage.clickImportOfferCodes();
  const importDealFilePath = path.join(process.cwd(), "src", "data", "Sample image 2.png");
  await app.adminLoyaltyPage.uploadDealFile(importDealFilePath);


  // await page.getByRole('button', { name: ' حفظ' }).click();
  await app.adminLoyaltyPage.clickSave();
  await app.adminLoyaltyPage.validateTheFileImportToast();

  await logStep("Step 08: Commit the deal codes");
  await app.adminLoyaltyPage.clickFirstProcessedCell();
  await app.adminLoyaltyPage.clickApprove();
  await app.adminLoyaltyPage.clickConfirm();
  await app.adminLoyaltyPage.clickSendImportApprovalRequest();
  await app.adminLoyaltyPage.clickManageDeals();

  await logStep("Step 09: Change the deal status to Active");
  await app.adminLoyaltyPage.searchAndNavigateToDeal(dealName);
  await app.adminLoyaltyPage.clickEdit();
  await app.adminLoyaltyPage.selectStatusToActive("نشط");
  await app.adminLoyaltyPage.clickSave();
  await app.adminLoyaltyPage.clickYesOnPopUp();
  await app.adminLoyaltyPage.verifyActiveStatusVisible();

  // await page.locator('ng-select').filter({ hasText: 'اختيارغير نشط' }).getByRole('combobox').click();
});