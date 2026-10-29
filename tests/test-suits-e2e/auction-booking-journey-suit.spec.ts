import { test } from '@playwright/test';
import path from 'node:path';
const XLSX = require('xlsx');
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'auction-journey';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

function updateAuctionUnitsFile(data: any) {
  const workbookPath = path.join(process.cwd(), 'src', 'data', 'Auction_Units.xlsx');
  const workbook = XLSX.readFile(workbookPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const headerColumns: Record<string, number> = {};
  for (let column = range.s.c; column <= range.e.c; column++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: column })];
    const header = String(cell?.v ?? '').trim();
    if (header) headerColumns[header] = column;
  }
  const columns = {
    startDate: 'تاريخ بدء المزاد/ Auction start date',
    startTime: 'وقت بدء المزاد / Auction start time',
    endDate: 'تاريخ نهاية المزاد/ Auction end date',
    endTime: 'وقت نهاية المزاد / Auction end time',
  };
  const firstDataRow = range.s.r + 1;
  for (const [dataKey, header] of Object.entries(columns)) {
    const column = headerColumns[header];
    const cellAddress = XLSX.utils.encode_cell({ r: firstDataRow, c: column });
    worksheet[cellAddress] = { t: 's', v: data[dataKey] };
  }
  XLSX.writeFile(workbook, workbookPath);
}

test.describe('Auction booking journey', () => {
  test('TC-01 Add new electronic auction project', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(180000);
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();

    await logStep('Step 01: Define auction start/end date and time');
    const auctionStartDateTime = new Date(Date.now() + 5 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 9 * 60 * 1000);
    const auctionDate = new Date();
    auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date: any, separator: any, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return dayFirst ? `${day}${separator}${month}${separator}${year}` : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date: any) => [date.getHours(), date.getMinutes()].map((value) => String(value).padStart(2, '0')).join(':');
    const auctionStartDate = formatDate(auctionDate, '/', true);
    const auctionEndDate = formatDate(auctionDate, '/', true);
    const auctionStartDateForData = formatDate(auctionDate, '-', true);
    const auctionEndDateForData = formatDate(auctionDate, '-', true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(':');
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(':');
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);
    DataHelper.updateServiceData(SERVICE, 'auctionStartDate', auctionStartDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionEndDate', auctionEndDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionStartTime', auctionStartTime);
    DataHelper.updateServiceData(SERVICE, 'auctionEndTime', auctionEndTime);

    await logStep('Step 02: Write the auction start and end dates and times to the Auction_Units.xlsx file');
    updateAuctionUnitsFile({
      startDate: auctionStartDate,
      endDate: auctionEndDate,
      startTime: auctionStartTime,
      endTime: auctionEndTime,
    });

    const electronicAuctionPage = app.electronicAuctionProjectPage;
    await logStep('Step 03: Login to admin portal');
    await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 04: Navigate to the auction project creation page');
    await app.adminProjectPage.openAuctionCreation();

    await logStep('Step 05: Fill in the auction project details');
    await electronicAuctionPage.fillProjectName(projectName);
    await electronicAuctionPage.selectAuctionType('الكترونية');
    await electronicAuctionPage.openHousingSector();
    await electronicAuctionPage.selectHousingSector();

    await logStep('Step 06: Select region and city');
    await electronicAuctionPage.openRegion();
    await electronicAuctionPage.selectRegion();
    await electronicAuctionPage.openCity();
    await electronicAuctionPage.selectCity();

    await logStep('Step 07: Enter date, time and save');
    await electronicAuctionPage.fillAuctionStartDate(auctionStartDate);
    await electronicAuctionPage.fillAuctionStartHour(auctionStartHour);
    await electronicAuctionPage.fillAuctionStartMinute(auctionStartMinute);
    await electronicAuctionPage.fillAuctionEndDate(auctionEndDate);
    await electronicAuctionPage.fillAuctionEndHour(auctionEndHour);
    await electronicAuctionPage.fillAuctionEndMinute(auctionEndMinute);
    await page.waitForTimeout(2500);
    await electronicAuctionPage.saveProject();

    await logStep('Step 08: Upload auction media > Enter media details > Save');
    await electronicAuctionPage.openProjectMedia();
    await electronicAuctionPage.fillArabicDetailsTitle(projectName);
    await electronicAuctionPage.fillEnglishDetailsTitle(projectName);
    await electronicAuctionPage.fillArabicName(projectName);
    await electronicAuctionPage.fillEnglishName(projectName);
    await electronicAuctionPage.fillArabicDescription('الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)');
    await electronicAuctionPage.fillEnglishDescription('English auction project description\nEnglish auction project description\nEnglish auction project description');
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.fillAssetCount('10');
    await electronicAuctionPage.saveProject();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectMediaSaved();
    await page.waitForTimeout(3000);
    await electronicAuctionPage.openProjectDetails();
    await electronicAuctionPage.submitMediaForApproval();
    await electronicAuctionPage.approveProjectMedia();

    await logStep('Step 09: Upload auction units file > commit the units');
    await electronicAuctionPage.openUnits();
    await electronicAuctionPage.openUnitsSubTab();
    await electronicAuctionPage.openNewUnitImport();
    await electronicAuctionPage.openUnitType();
    await electronicAuctionPage.selectApartmentUnitType();
    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'Auction_Units.xlsx');
    await electronicAuctionPage.uploadUnitsFile(unitsImportFilePath);
    await electronicAuctionPage.saveUnitImport();
    await electronicAuctionPage.waitForUnitImportToComplete();
    await electronicAuctionPage.approveUnitImport();
    await electronicAuctionPage.confirmUnitImport();
    await page.waitForTimeout(3000);
    await electronicAuctionPage.returnFromUnitImport();

    await logStep('Step 10: Save unit model');
    await electronicAuctionPage.openUnitModels();
    await electronicAuctionPage.openApartmentModel();
    await electronicAuctionPage.saveUnitModel();

    await logStep('Step 11: Unit model media > Save and approve media');
    await electronicAuctionPage.openUnitVisualMedia();
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.submitUnitMediaForApproval();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.approveUnitMedia();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.publishUnitModel();
    await electronicAuctionPage.waitForUnitMediaApproval();

    await logStep('Step 12: Unit model auction legal > Upload documents > Save');
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(process.cwd(), 'src', 'data', 'Sample pdf.pdf');
    await electronicAuctionPage.openAuctionLegal();
    await electronicAuctionPage.uploadTerms(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.uploadWinnerContract(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectUnitModelUpdated();

    await logStep('Step 13: Auction setting > enable fee > Save');
    await electronicAuctionPage.openAuctionSettings();
    await electronicAuctionPage.openSettingsEdit();
    await electronicAuctionPage.enableGeneralAuctionSetting();
    await electronicAuctionPage.updateAuctionSettings();
    await electronicAuctionPage.expectSettingsUpdated();

    await logStep('Step 14: Publish unit model');
    await electronicAuctionPage.publishUnitModelCategories();
    await electronicAuctionPage.openPublishedUnitModel();

    await logStep('Step 15: Publish auction project');
    await electronicAuctionPage.waitForProjectMediaApproval();
    await electronicAuctionPage.publishProject();
  });

  test('TC-02 User bids electronic auction and pays fee', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();

    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Log in to the Sakani user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Search for the auction project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);

    await logStep('Step 03: Open the auction unit and join the electronic auction');
    await app.auctionPage.openUnit();
    await app.auctionPage.joinElectronicAuction();

    await logStep('Step 04: Pay the auction fee and verify the payment status');
    await app.paymentGatewayPage.fillCardDetails();
    await app.auctionPage.validateCongratulationsMessaeg();
    await app.auctionPage.returnToAuction('العودة إلى وحدة المزاد');
    await app.auctionPage.expectAuctionPaymentPending();
  });

  test('TC-03 Admin adds new hybrid auction project without fee', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(180000);
    const app = new WebApp(page);

    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();

    await logStep('Step 01: Define the hybrid auction schedule and project data');
    const auctionStartDateTime = new Date(Date.now() + 120 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 240 * 60 * 1000);

    const auctionDate = new Date();
    // auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date: any, separator: any, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return dayFirst ? `${day}${separator}${month}${separator}${year}` : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date: any) => [date.getHours(), date.getMinutes()].map((value) => String(value).padStart(2, '0')).join(':');
    const auctionStartDate = formatDate(auctionDate, '/', true);
    const auctionEndDate = formatDate(auctionDate, '/', true);
    const auctionStartDateForData = formatDate(auctionDate, '-', true);
    const auctionEndDateForData = formatDate(auctionDate, '-', true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(':');
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(':');
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);
    DataHelper.updateServiceData(SERVICE, 'auctionStartDate', auctionStartDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionEndDate', auctionEndDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionStartTime', auctionStartTime);
    DataHelper.updateServiceData(SERVICE, 'auctionEndTime', auctionEndTime);

    await logStep('Step 02: Write the auction start and end dates and times to the Auction_Units.xlsx file');
    updateAuctionUnitsFile({
      startDate: auctionStartDate,
      endDate: auctionEndDate,
      startTime: auctionStartTime,
      endTime: auctionEndTime,
    });

    const electronicAuctionPage = app.electronicAuctionProjectPage;
    await logStep('Step 03: Login to admin portal');
    await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 04: Navigate to the auction project creation page');
    await app.adminProjectPage.openAuctionCreation();

    await logStep('Step 05: Fill in the auction project details');
    await electronicAuctionPage.fillProjectName(projectName);
    await electronicAuctionPage.selectAuctionType('هجين');
    await electronicAuctionPage.openHousingSector();
    await electronicAuctionPage.selectHousingSector();

    await logStep('Step 06: Select the project region and city');
    await electronicAuctionPage.openRegion();
    await electronicAuctionPage.selectRegion();
    await electronicAuctionPage.openCity();
    await electronicAuctionPage.selectCity();

    await logStep('Step 07: Set the auction start and end date and time, then save');
    await electronicAuctionPage.fillAuctionStartDate(auctionStartDate);
    await electronicAuctionPage.fillAuctionStartHour(auctionStartHour);
    await electronicAuctionPage.fillAuctionStartMinute(auctionStartMinute);
    await electronicAuctionPage.fillAuctionEndDate(auctionEndDate);
    await electronicAuctionPage.fillAuctionEndHour(auctionEndHour);
    await electronicAuctionPage.fillAuctionEndMinute(auctionEndMinute);
    await page.waitForTimeout(2500);
    await electronicAuctionPage.saveProject();

    await logStep('Step 08: Enter auction media details and submit them for approval');
    await electronicAuctionPage.openProjectMedia();
    await electronicAuctionPage.fillArabicDetailsTitle(projectName);
    await electronicAuctionPage.fillEnglishDetailsTitle(projectName);
    await electronicAuctionPage.fillArabicName(projectName);
    await electronicAuctionPage.fillEnglishName(projectName);
    await electronicAuctionPage.fillArabicDescription('الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)');
    await electronicAuctionPage.fillEnglishDescription('English auction project description\nEnglish auction project description\nEnglish auction project description');
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.fillAssetCount('10');
    await electronicAuctionPage.saveProject();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectMediaSaved();
    await electronicAuctionPage.openProjectDetails();
    await electronicAuctionPage.submitMediaForApproval();
    await electronicAuctionPage.approveProjectMedia();

    await logStep('Step 09: Upload the auction units file and commit the units');
    await electronicAuctionPage.openUnits();
    await electronicAuctionPage.openUnitsSubTab();
    await electronicAuctionPage.openNewUnitImport();
    await electronicAuctionPage.openUnitType();
    await electronicAuctionPage.selectApartmentUnitType();

    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'Auction_Units.xlsx');
    await electronicAuctionPage.uploadUnitsFile(unitsImportFilePath);
    await electronicAuctionPage.saveUnitImport();
    await electronicAuctionPage.waitForUnitImportToComplete();
    await electronicAuctionPage.approveUnitImport();
    await electronicAuctionPage.confirmUnitImport();
    await page.waitForTimeout(3000);
    await electronicAuctionPage.returnFromUnitImport();

    await logStep('Step 10: Save the imported unit model');
    await electronicAuctionPage.openUnitModels();
    await electronicAuctionPage.openApartmentModel();
    await electronicAuctionPage.saveUnitModel();

    await logStep('Step 11: Save and approve the unit model media');
    await electronicAuctionPage.openUnitVisualMedia();
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.fillVideoLink('https://pre-sakani-admin.housingapps.sa/');
    await electronicAuctionPage.fillLocation('Riyadh');
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.submitUnitMediaForApproval();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.approveUnitMedia();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.publishUnitModel();
    await electronicAuctionPage.waitForUnitMediaApproval();
    await page.pause();

    await logStep('Step 12: Upload and save the auction legal documents');
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(process.cwd(), 'src', 'data', 'Sample pdf.pdf');
    await electronicAuctionPage.openAuctionLegal();
    await electronicAuctionPage.uploadTerms(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.uploadWinnerContract(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.saveUnitModel();
    await electronicAuctionPage.expectUnitModelUpdated();

    await logStep('Step 13: Publish the unit model');
    await electronicAuctionPage.publishUnitModelCategories();
    await electronicAuctionPage.openPublishedUnitModel();

    await logStep('Step 14: Publish the auction project');
    await electronicAuctionPage.waitForProjectMediaApproval();
    await electronicAuctionPage.publishProject();
  });

  test('TC-04 User joins hybrid auction and signs contract', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Log in to the Sakani user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Search for the hybrid auction project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);

    await logStep('Step 03: Join the hybrid auction');
    await app.auctionPage.openUnit();
    await app.auctionPage.joinHybridAuctionWithoutFee();

    await logStep('Step 04: Open and approve the winner contract');
    await app.auctionPage.returnToAuction('العودة الى المزاد');
    await app.auctionPage.waitForWinnerAndOpenContract();
    await app.auctionPage.approveContract();

    await logStep('Step 05: Verify the auction completes successfully');
    await app.auctionPage.expectAuctionSuccess();
  });

  test('TC-05 Admin adds new hybrid auction project with fee', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(180000);
    const app = new WebApp(page);

    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();

    await logStep('Step 01: Define the hybrid auction schedule and project data');
    const auctionStartDateTime = new Date(Date.now() + 120 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 240 * 60 * 1000);

    const auctionDate = new Date();
    // auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date: any, separator: any, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return dayFirst ? `${day}${separator}${month}${separator}${year}` : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date: any) => [date.getHours(), date.getMinutes()].map((value) => String(value).padStart(2, '0')).join(':');
    const auctionStartDate = formatDate(auctionDate, '/', true);
    const auctionEndDate = formatDate(auctionDate, '/', true);
    const auctionStartDateForData = formatDate(auctionDate, '-', true);
    const auctionEndDateForData = formatDate(auctionDate, '-', true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(':');
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(':');
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    DataHelper.updateServiceData(SERVICE, 'projectName', projectName);
    DataHelper.updateServiceData(SERVICE, 'auctionStartDate', auctionStartDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionEndDate', auctionEndDateForData);
    DataHelper.updateServiceData(SERVICE, 'auctionStartTime', auctionStartTime);
    DataHelper.updateServiceData(SERVICE, 'auctionEndTime', auctionEndTime);

    await logStep('Step 02: Write the auction start and end dates and times to the Auction_Units.xlsx file');
    updateAuctionUnitsFile({
      startDate: auctionStartDate,
      endDate: auctionEndDate,
      startTime: auctionStartTime,
      endTime: auctionEndTime,
    });

    const electronicAuctionPage = app.electronicAuctionProjectPage;
    await logStep('Step 03: Login to admin portal');
    await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

    await logStep('Step 04: Open the auction project creation page');
    await app.adminProjectPage.openAuctionCreation();

    await logStep('Step 05: Fill in the auction project details');
    await electronicAuctionPage.fillProjectName(projectName);
    await electronicAuctionPage.selectAuctionType('هجين');
    await electronicAuctionPage.openHousingSector();
    await electronicAuctionPage.selectHousingSector();

    await logStep('Step 06: Select the project region and city');
    await electronicAuctionPage.openRegion();
    await electronicAuctionPage.selectRegion();
    await electronicAuctionPage.openCity();
    await electronicAuctionPage.selectCity();

    await logStep('Step 07: Set the auction start and end date and time, then save');
    await electronicAuctionPage.fillAuctionStartDate(auctionStartDate);
    await electronicAuctionPage.fillAuctionStartHour(auctionStartHour);
    await electronicAuctionPage.fillAuctionStartMinute(auctionStartMinute);
    await electronicAuctionPage.fillAuctionEndDate(auctionEndDate);
    await electronicAuctionPage.fillAuctionEndHour(auctionEndHour);
    await electronicAuctionPage.fillAuctionEndMinute(auctionEndMinute);
    await page.waitForTimeout(2500);
    await electronicAuctionPage.saveProject();

    await logStep('Step 08: Enter auction media details and submit them for approval');
    await electronicAuctionPage.openProjectMedia();
    await electronicAuctionPage.fillArabicDetailsTitle(projectName);
    await electronicAuctionPage.fillEnglishDetailsTitle(projectName);
    await electronicAuctionPage.fillArabicName(projectName);
    await electronicAuctionPage.fillEnglishName(projectName);
    await electronicAuctionPage.fillArabicDescription('الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)');
    await electronicAuctionPage.fillEnglishDescription('English auction project description\nEnglish auction project description\nEnglish auction project description');
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.fillAssetCount('10');
    await electronicAuctionPage.saveProject();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectMediaSaved();
    await electronicAuctionPage.openProjectDetails();
    await electronicAuctionPage.submitMediaForApproval();
    await electronicAuctionPage.approveProjectMedia();

    await logStep('Step 09: Upload the auction units file and commit the units');
    await electronicAuctionPage.openUnits();
    await electronicAuctionPage.openUnitsSubTab();
    await electronicAuctionPage.openNewUnitImport();
    await electronicAuctionPage.openUnitType();
    await electronicAuctionPage.selectApartmentUnitType();

    const unitsImportFilePath = path.join(process.cwd(), 'src', 'data', 'Auction_Units.xlsx');
    await electronicAuctionPage.uploadUnitsFile(unitsImportFilePath);
    await electronicAuctionPage.saveUnitImport();
    await electronicAuctionPage.waitForUnitImportToComplete();
    await electronicAuctionPage.approveUnitImport();
    await electronicAuctionPage.confirmUnitImport();
    await page.waitForTimeout(3000);
    await electronicAuctionPage.returnFromUnitImport();

    await logStep('Step 10: Save the imported unit model');
    await electronicAuctionPage.openUnitModels();
    await electronicAuctionPage.openApartmentModel();
    await electronicAuctionPage.saveUnitModel();

    await logStep('Step 11: Save and approve the unit model media');
    await electronicAuctionPage.openUnitVisualMedia();
    await electronicAuctionPage.fillLatitude('1.1');
    await electronicAuctionPage.fillLongitude('1.2');
    await electronicAuctionPage.fillVideoLink('https://pre-sakani-admin.housingapps.sa/');
    await electronicAuctionPage.fillLocation('Riyadh');
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.submitUnitMediaForApproval();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.approveUnitMedia();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.publishUnitModel();
    await electronicAuctionPage.waitForUnitMediaApproval();

    await logStep('Step 12: Upload and save the auction legal documents');
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(process.cwd(), 'src', 'data', 'Sample pdf.pdf');
    await electronicAuctionPage.openAuctionLegal();
    await electronicAuctionPage.uploadTerms(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.uploadWinnerContract(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.saveUnitModel();
    await electronicAuctionPage.expectUnitModelUpdated();

    await logStep('Step 13: Auction setting > enable fee > Save');
    await electronicAuctionPage.openAuctionSettings();
    await electronicAuctionPage.openSettingsEdit();
    await electronicAuctionPage.enableGeneralAuctionSetting();
    await electronicAuctionPage.updateAuctionSettings();
    await electronicAuctionPage.expectSettingsUpdated();

    await logStep('Step 14: Publish the unit model');
    await electronicAuctionPage.publishUnitModelCategories();
    await electronicAuctionPage.openPublishedUnitModel();

    await logStep('Step 15: Publish the auction project');
    await electronicAuctionPage.waitForProjectMediaApproval();
    await electronicAuctionPage.publishProject();
  });

  test('TC-06 User joins hybrid auction and pays the fee', { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);
    await logStep('Step 00: Read data from json relative to the service');
    const data = readServiceData();
    const environments = readEnvironments();
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;
    const projectName = data.projectName;

    await logStep('Step 01: Log in to the Sakani user portal');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Search for the hybrid auction project');
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);

    await logStep('Step 03: Join the hybrid auction');
    await app.auctionPage.openUnit();
    await app.auctionPage.joinHybridAuctionWithFee();

    await logStep('Step 04: Pay the auction fee');
    await app.paymentGatewayPage.fillCardDetails();
    await app.auctionPage.validateCongratulationsMessaeg();
    await app.auctionPage.returnToAuction('العودة إلى وحدة المزاد');

    await logStep('Step 05: Verify the auction payment status');
    await app.auctionPage.expectAuctionPaymentPending();
  });
});
