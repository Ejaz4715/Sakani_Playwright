import { test } from '@playwright/test';
import path from 'node:path';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
import { ExcelUtils } from '@pages/utils/ExcelUtils';

const SERVICE = 'update-unit';

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Generate Reoprts', () => {
  test('TC-01 Developer generate reoprt for a project', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const projectName = data.projectName;
    const developerUserId = data.developerUserId;
    const sapaPortalUrl = environment.sapaPortalUrl;
    const filePath = path.join(process.cwd(), 'src', 'downloads', 'generate-reports.xlsx');

    await logStep('Step 01: Login as developer to sapa portal and open the project');
    await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortal(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to reports page');
    await app.developerProjectPage.clickOnReports();

    await logStep('Step 03: Select project and unit report to issue the report');
    await app.developerProjectPage.selectBookingsAndUnitsReport();
    await app.developerProjectPage.clickIssueTheReportButton();

    await logStep('Step 04: Select a project > Issue report');
    await app.developerProjectPage.searchProjectForReport(projectName);
    await app.developerProjectPage.clickIssueReportButton();
    await app.developerProjectPage.isReportAddedToastMessageVisible();
    await app.developerProjectPage.refreshUntilReportStatusChanges();
    await app.partnersLoginPage.dismissNewServiceAlertPopUp();

    await logStep('Step 05: Clear the downloads folder');
    const downloadDirectory = path.join(process.cwd(), 'src', 'downloads');
    await app.paymentsAndTransactionsPage.clearDownloadsFolder(downloadDirectory);
    await logStep('Step 06: Download the report');

    const excelDownloadPromise = ExcelUtils.waitForExcelDownload(page);
    await app.developerProjectPage.clickReportDownloadButton();
    const excelDownload = await excelDownloadPromise;
    const fileName = 'generate-reports.xlsx';
    const downloadPath = path.join(downloadDirectory, fileName);

    await logStep('Step 07: Save the report and verify it exists');
    await ExcelUtils.saveExcelDownload(excelDownload, downloadPath);
    await app.paymentsAndTransactionsPage.verifySavedFile(downloadPath, downloadDirectory);
  });
});
