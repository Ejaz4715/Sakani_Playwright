import { test, expect } from '@playwright/test';
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import loyaltyTestData from '@data/payment-system-test-data.json';
import { DateUtils } from '@pages/utils/DateUtils';
test('test', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any}, async ({ page }) => {
  const app = new WebApp(page);
  const { faker } = await import('@faker-js/faker');

  await logStep("Step 01: Login to admin portal");
  await app.adminProjectPage.login(
    loyaltyTestData.environments.adminPortalUrl,
    loyaltyTestData['loyalty-sharrai'].adminUsername,
    loyaltyTestData['loyalty-sharrai'].adminPassword
  );

  const companyName = `Automation Test Company ${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`;
  const dealName = `Automation Test Deal ${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`;

  DataHelper.updateServiceData("loyalty-sharrai", "companyName", companyName);
  DataHelper.updateServiceData("loyalty-sharrai", "dealName", dealName);

  await logStep("Step 02: Navigate to add new partner");
  app.adminLoyaltyPage.clickLoyaltyProgram();
  app.adminLoyaltyPage.clickManagePartners();
  app.adminLoyaltyPage.clickAddNewPartner();

  await logStep("Step 03: Fill company information");
  app.adminLoyaltyPage.fillCompanyName(companyName);
  app.adminLoyaltyPage.fillActivity("Automation Test Activity");
  app.adminLoyaltyPage.selectIsActiveOption("نعم");
  app.adminLoyaltyPage.fillContactPerson("Testing Automation User");
  app.adminLoyaltyPage.fillContactEmail("test@email.com");
  app.adminLoyaltyPage.fillContactPhone("588938198");
  app.adminLoyaltyPage.fillContactWhatsapp("58893819");
  const random = faker.string.numeric({ length: 22, allowLeadingZeros: false });
  app.adminLoyaltyPage.fillIbanNumber("SA" + random);
  app.adminLoyaltyPage.fillBankAccountName("Al Rajhi");

  await logStep("Step 04: Upload logo > Save > Validate toast message");
  const imageFilePath = path.join(process.cwd(), "src", "data", "Sample image 2.png");
  app.adminLoyaltyPage.uploadFile(imageFilePath);
  app.adminLoyaltyPage.clickSave();
  app.adminLoyaltyPage.validatePartnerAddedSuccessMessage();

  await logStep("Step 05: Navigate to add new deal");
  app.adminLoyaltyPage.clickManageDeals();
  app.adminLoyaltyPage.clickAddNewOffer();
  app.adminLoyaltyPage.selectCompanyName(companyName);

  await logStep("Step 06: Fill all the details > Save");

  const campaignStartDate = DateUtils.getDateWithOffsetAndFormat(0, "DD/MM/YYYY");
  const campaignEndDate = DateUtils.getDateWithOffsetAndFormat(0, "DD/MM/YYYY");

  app.adminLoyaltyPage.fillCampaignStartDate(campaignStartDate);
  app.adminLoyaltyPage.fillCampaignEndDate(campaignEndDate);
  app.adminLoyaltyPage.fillPrice("5000");
  app.adminLoyaltyPage.fillDiscount("2");
  app.adminLoyaltyPage.fillAcceptableQuantityPerUser("1");
  app.adminLoyaltyPage.selectSakaniCommissionType("كمية");
  app.adminLoyaltyPage.fillSakaniCommissionValue("100");
  app.adminLoyaltyPage.fillTitle("Test Deal");
  app.adminLoyaltyPage.fillDescription("Test Desc");
  app.adminLoyaltyPage.fillDetails("Test Details");
  app.adminLoyaltyPage.fillTermsAndConditions("Testing terms and condition for sharrai offer");
  app.adminLoyaltyPage.clickSave();

  await logStep("Step 07: Import deal file > Save the file");
  app.adminLoyaltyPage.clickDealIdentifiersTab();
  app.adminLoyaltyPage.clickImportOfferCodes();
  const importDealFilePath = path.join(process.cwd(), "src", "data", "Sample image 2.png");
  app.adminLoyaltyPage.uploadDealFile(importDealFilePath);


  // await page.getByRole('button', { name: ' حفظ' }).click();
  app.adminLoyaltyPage.clickSave();
  app.adminLoyaltyPage.validateTheFileImportToast();

  await logStep("Step 08: Commit the deal codes");
  app.adminLoyaltyPage.clickFirstProcessedCell();
  app.adminLoyaltyPage.clickApprove();
  app.adminLoyaltyPage.clickConfirm();
  app.adminLoyaltyPage.clickSendImportApprovalRequest();
  app.adminLoyaltyPage.clickManageDeals();

  await logStep("Step 09: Change the deal status to Active");
  app.adminLoyaltyPage.searchAndNavigateToDeal(dealName);
  app.adminLoyaltyPage.clickEdit();
  app.adminLoyaltyPage.selectStatusToActive("نشط");
  app.adminLoyaltyPage.clickSave();
  app.adminLoyaltyPage.clickYesOnPopUp();
  app.adminLoyaltyPage.verifyActiveStatusVisible();

  // await page.locator('ng-select').filter({ hasText: 'اختيارغير نشط' }).getByRole('combobox').click();
});