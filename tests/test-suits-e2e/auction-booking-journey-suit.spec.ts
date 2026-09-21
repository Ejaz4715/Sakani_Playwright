// @ts-nocheck
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
async function waitForVisible(locator) {
  await expect(locator).toBeVisible({ timeout: 30000 });
  return locator;
}

async function clickVisible(locator) {
  await (await waitForVisible(locator)).click();
}

async function fillVisible(locator, value) {
  await (await waitForVisible(locator)).fill(value);
}

async function uploadFile(locator, filePath) {
  await locator.waitFor({ state: "attached", timeout: 30000 });
  await locator.setInputFiles(filePath);
}

function updateAuctionUnitsFile(data) {
  const workbookPath = path.join(process.cwd(), "src", "data", "Auction_Units.xlsx");
  const workbook = XLSX.readFile(workbookPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const headerColumns = {};
  for (let column = range.s.c; column <= range.e.c; column++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: column })];
    const header = String(cell?.v ?? "").trim();
    if (header) headerColumns[header] = column;
  }
  const columns = {
    startDate: "تاريخ بدء المزاد/ Auction start date",
    startTime: "وقت بدء المزاد / Auction start time",
    endDate: "تاريخ نهاية المزاد/ Auction end date",
    endTime: "وقت نهاية المزاد / Auction end time",
  };
  const firstDataRow = range.s.r + 1;
  for (const [dataKey, header] of Object.entries(columns)) {
    const column = headerColumns[header];
    const cellAddress = XLSX.utils.encode_cell({ r: firstDataRow, c: column });
    worksheet[cellAddress] = { t: "s", v: data[dataKey] };
  }
  XLSX.writeFile(workbook, workbookPath);
}
const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}
test.describe("Auction booking journey", () => {
  test("TC-01 Add new electronic auction project", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({ page }) => {
    test.setTimeout(180000);
    const testData = readTestData();
    const app = new WebApp(page);

    await logStep("Step 01: Define auction start/end date and time");
    const auctionStartDateTime = new Date(Date.now() + 5 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 9 * 60 * 1000);
    const auctionDate = new Date();
    auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date, separator, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      return dayFirst
        ? `${day}${separator}${month}${separator}${year}`
        : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date) =>
      [date.getHours(), date.getMinutes()]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
    const auctionStartDate = formatDate(auctionDate, "/", true);
    const auctionEndDate = formatDate(auctionDate, "/", true);
    const auctionStartDateForData = formatDate(auctionDate, "-", true);
    const auctionEndDateForData = formatDate(auctionDate, "-", true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(":");
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(":");
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    const updatedData = { ...testData, projectName };
    writeTestData(updatedData);
    updatedData.auctionStartDate = auctionStartDateForData;
    updatedData.auctionEndDate = auctionEndDateForData;
    updatedData.auctionStartTime = auctionStartTime;
    updatedData.auctionEndTime = auctionEndTime;
    writeTestData(updatedData);

    await logStep("Step 02: Write the auction start and end dates and times to the Auction_Units.xlsx file");
    updateAuctionUnitsFile({
      startDate: updatedData.auctionStartDate,
      endDate: updatedData.auctionEndDate,
      startTime: updatedData.auctionStartTime,
      endTime: updatedData.auctionEndTime,
    });
    const electronicAuctionPage = app.electronicAuctionProjectPage;
    await logStep("Step 03: Login to admin portal");
    await app.adminProjectPage.login(
      updatedData.adminPortalUrl,
      updatedData.adminUsername,
      updatedData.adminPassword,
    );

    await logStep("Step 04: Navigate to the auction project creation page");
    await app.adminProjectPage.openAuctionCreation();

    await logStep("Step 04: Fill in the auction project details");
    await electronicAuctionPage.fillProjectName(projectName);
    await electronicAuctionPage.selectElectronicAuctionType();
    await electronicAuctionPage.openHousingSector();
    await electronicAuctionPage.selectHousingSector();

    await logStep("Step 05: Select region and city");
    await electronicAuctionPage.openRegion();
    await electronicAuctionPage.selectRegion();
    await electronicAuctionPage.openCity();
    await electronicAuctionPage.selectCity();

    await logStep("Step 06: Enter date, time and save");
    await electronicAuctionPage.fillAuctionStartDate(auctionStartDate);
    await electronicAuctionPage.fillAuctionStartHour(auctionStartHour);
    await electronicAuctionPage.fillAuctionStartMinute(auctionStartMinute);
    await electronicAuctionPage.fillAuctionEndDate(auctionEndDate);
    await electronicAuctionPage.fillAuctionEndHour(auctionEndHour);
    await electronicAuctionPage.fillAuctionEndMinute(auctionEndMinute);
    await page.waitForTimeout(2500);
    await electronicAuctionPage.saveProject();

    await logStep("Step 07: Upload auction media > Enter media details > Save");
    await electronicAuctionPage.openProjectMedia();
    await electronicAuctionPage.fillArabicDetailsTitle(projectName);
    await electronicAuctionPage.fillEnglishDetailsTitle(projectName);
    await electronicAuctionPage.fillArabicName(projectName);
    await electronicAuctionPage.fillEnglishName(projectName);
    await electronicAuctionPage.fillArabicDescription("الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)");
    await electronicAuctionPage.fillEnglishDescription("English auction project description\nEnglish auction project description\nEnglish auction project description");
    await electronicAuctionPage.fillLatitude("1.1");
    await electronicAuctionPage.fillLongitude("1.2");
    await electronicAuctionPage.fillAssetCount("10");
    await electronicAuctionPage.saveProject();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectMediaSaved();
    await electronicAuctionPage.openProjectDetails();
    await electronicAuctionPage.submitMediaForApproval();
    await electronicAuctionPage.approveProjectMedia();

    await logStep("Step 08: Upload auction units file > commit the units");
    await electronicAuctionPage.openUnits();
    await electronicAuctionPage.openUnitsSubTab();
    await electronicAuctionPage.openNewUnitImport();
    await page.waitForTimeout(2000);
    await electronicAuctionPage.openUnitType();
    await electronicAuctionPage.selectApartmentUnitType();
    const unitsImportFilePath = path.join(
      process.cwd(), "src",
      "data",
      "Auction_Units.xlsx",
    );
    await electronicAuctionPage.uploadUnitsFile(unitsImportFilePath);
    await electronicAuctionPage.saveUnitImport();
    await page.waitForTimeout(5000);
    await electronicAuctionPage.waitForUnitImportToComplete();
    await electronicAuctionPage.approveUnitImport();
    await electronicAuctionPage.confirmUnitImport();
    await page.waitForTimeout(3000);
    await electronicAuctionPage.returnFromUnitImport();

    await logStep("Step 09: Save unit model");
    await electronicAuctionPage.openUnitModels();
    await electronicAuctionPage.openApartmentModel();
    await electronicAuctionPage.saveUnitModel();

    await logStep("Step 10: Unit model media > Save and approve media");
    await electronicAuctionPage.openUnitVisualMedia();
    await electronicAuctionPage.fillLatitude("1.1");
    await electronicAuctionPage.fillLongitude("1.2");
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.submitUnitMediaForApproval();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.approveUnitMedia();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.publishUnitModel();
    await electronicAuctionPage.waitForUnitMediaApproval();

    await logStep("Step 11: Unit model auction legal > Upload documents > Save");
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(
      process.cwd(), "src",
      "data",
      "Sample pdf.pdf",
    );
    await electronicAuctionPage.openAuctionLegal();
    await electronicAuctionPage.uploadTerms(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.uploadWinnerContract(PDFfilePath);
    await page.waitForTimeout(2000);
    await electronicAuctionPage.saveUnitModel();
    await page.waitForTimeout(1000);
    await electronicAuctionPage.expectUnitModelUpdated();

    await logStep("Step 12: Auction setting > enable fee > Save");
    await electronicAuctionPage.openAuctionSettings();
    await electronicAuctionPage.openSettingsEdit();
    await electronicAuctionPage.enableGeneralAuctionSetting();
    await electronicAuctionPage.updateAuctionSettings();
    await electronicAuctionPage.expectSettingsUpdated();

    await logStep("Step 13: Pulish unit model");
    await electronicAuctionPage.publishUnitModelCategories();
    await electronicAuctionPage.openPublishedUnitModel();

    await logStep("Step 14: Publish auction project");
    await electronicAuctionPage.waitForProjectMediaApproval();
    await electronicAuctionPage.publishProject();
  });

  test("TC-02 - User bids electronic auction and pays fee", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;
    const projectName = testData.projectName;
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    // search for auction project and navigate to project details page
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);

    //Navigate to auction unit and join the auction
    await app.auctionPage.openUnit();
    await app.auctionPage.joinElectronicAuction();

    //Select mada > Enter payment details
    await app.paymentGatewayPage.fillCardDetails();
    await app.auctionPage.validateCongratulationsMessaeg();
    await app.auctionPage.returnToAuction("العودة إلى وحدة المزاد");

    //Validate the auction booking fees is paid
    await app.auctionPage.expectAuctionPaymentPending();
  });

  test("TC-01 - Add new hybrid auction project", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({ page }) => {
    test.setTimeout(180000);
    const testData = readTestData();
    const app = new WebApp(page);

    // define auction start and end dates and times
    // const auctionStartDateTime = new Date(Date.now() + 2 * 60 * 1000);
    // const auctionEndDateTime = new Date(Date.now() + 3 * 60 * 1000);

    const auctionStartDateTime = new Date(Date.now() + 120 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 240 * 60 * 1000);

    const auctionDate = new Date();
    // auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date, separator, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      return dayFirst
        ? `${day}${separator}${month}${separator}${year}`
        : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date) =>
      [date.getHours(), date.getMinutes()]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
    const auctionStartDate = formatDate(auctionDate, "/", true);
    const auctionEndDate = formatDate(auctionDate, "/", true);
    const auctionStartDateForData = formatDate(auctionDate, "-", true);
    const auctionEndDateForData = formatDate(auctionDate, "-", true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(":");
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(":");
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    const updatedData = { ...testData, projectName };
    writeTestData(updatedData);
    updatedData.auctionStartDate = auctionStartDateForData;
    updatedData.auctionEndDate = auctionEndDateForData;
    updatedData.auctionStartTime = auctionStartTime;
    updatedData.auctionEndTime = auctionEndTime;
    writeTestData(updatedData);

    // write the auction start and end dates and times to the Auction_Units.xlsx file
    updateAuctionUnitsFile({
      startDate: updatedData.auctionStartDate,
      endDate: updatedData.auctionEndDate,
      startTime: updatedData.auctionStartTime,
      endTime: updatedData.auctionEndTime,
    });

    // Login to admin portal
    await app.adminProjectPage.login(
      updatedData.adminPortalUrl,
      updatedData.adminUsername,
      updatedData.adminPassword,
    );

    // Navigate to the auction project creation page
    await app.adminProjectPage.openAuctionCreation();

    // Fill in the auction project details
    await fillVisible(
      page.getByRole("textbox", { name: "إسم المشروع" }),
      projectName,
    );


    const combobox = page.getByRole("combobox", { name: "نوع المزاد" });
    const option = page.getByRole("option", { name: "هجين" });

    while (!(await option.isVisible().catch(() => false))) {
      await clickVisible(combobox);
      await page.waitForTimeout(1000);
    }
    await clickVisible(option);

    await clickVisible(page.getByRole("combobox", { name: "نوع القطاع" }));
    await clickVisible(page.getByText("وزارة الإسكان"));

    await clickVisible(
      page
        .locator("//ng-select[@formcontrolname='region_id']")
        .getByRole("combobox"),
    );
    await clickVisible(page.getByText("الرياض"));
    await clickVisible(page.locator("//input[@id='inputCity']"));
    await clickVisible(page.getByRole("option", { name: "الرياض", exact: true }));

    const auctionStartDateInput = page.locator(
      "//app-gregorian-datepicker[@formcontrolname='start_date']/descendant::input[@placeholder='DD/MM/YYYY']",
    );
    const auctionEndDateInput = page.locator(
      "//app-gregorian-datepicker[@formcontrolname='end_date']/descendant::input[@placeholder='DD/MM/YYYY']",
    );
    const auctionStartHourInput = page.locator(
      "//ngb-timepicker[@formcontrolname='start_time']/descendant::input[@aria-label='Hours']",
    );
    const auctionStartMinuteInput = page.locator(
      "//ngb-timepicker[@formcontrolname='start_time']/descendant::input[@aria-label='Minutes']",
    );
    const auctionEndHourInput = page.locator(
      "//ngb-timepicker[@formcontrolname='end_time']/descendant::input[@aria-label='Hours']",
    );
    const auctionEndMinuteInput = page.locator(
      "//ngb-timepicker[@formcontrolname='end_time']/descendant::input[@aria-label='Minutes']",
    );

    await fillVisible(auctionStartDateInput, auctionStartDate);
    await fillVisible(auctionStartHourInput, auctionStartHour);
    await fillVisible(auctionStartMinuteInput, auctionStartMinute);
    await fillVisible(auctionEndDateInput, auctionEndDate);
    await fillVisible(auctionEndHourInput, auctionEndHour);
    await fillVisible(auctionEndMinuteInput, auctionEndMinute);

    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    // Auction media > Enter media details > Save
    await clickVisible(
      page.getByRole("tab", { name: "وسائل الإعلام مشروع المزاد ( مسودة )" }),
    );
    await fillVisible(
      page.getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", {
        name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)",
      }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الاسم (باللغة العربية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الوصف (باللغة العربية)" }),
      "الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)",
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" }),
      "English auction project description\nEnglish auction project description\nEnglish auction project description",
    );
    await fillVisible(page.getByRole("spinbutton", { name: "خط العرض" }), "1.1");
    await fillVisible(page.getByRole("spinbutton", { name: "خط الطول" }), "1.2");
    await fillVisible(page.getByRole("spinbutton", { name: "عدد الأصول" }), "10");
    await clickVisible(page.getByRole("button", { name: "حفظ" }));
    await page.waitForTimeout(1000);
    await expect(page.getByText("تم حفظ بيانات الملف بنجاح")).toBeVisible();
    await clickVisible(page.getByText("تفاصيل المشروع"));
    await clickVisible(
      page.getByRole("button", {
        name: "تقديم طلب موافقة على نشر المحتوى المرفوع",
      }),
    );
    await clickVisible(
      page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }),
    );

    // Auction units > upload unit file and commit
    await clickVisible(page.getByRole("tab", { name: "الوحدات", exact: true }));
    await clickVisible(
      page.locator("#mat-tab-group-1-label-1").getByText("الوحدات"),
    );
    await clickVisible(
      page.locator("//span[normalize-space()='وحدة مزاد جديدة للاستيراد']"),
    );
    await page.waitForTimeout(2000);
    await expect(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    ).toBeVisible({ timeout: 30000 });
    await clickVisible(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    );
    await clickVisible(page.getByRole("option", { name: "شقة" }));

    const unitsImportFilePath = path.join(
      process.cwd(), "src",
      "data",
      "Auction_Units.xlsx",
    );
    await uploadFile(page.locator("//input[@type='file']"), unitsImportFilePath);
    await clickVisible(page.getByRole("button", { name: " حفظ" }));

    const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
    await expect(importInProgress).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(5000);
    await page.reload();
    await page.waitForTimeout(3000);
    const fileProcessedMessage = page.getByText("تم إكمال الإجراء", {
      exact: true,
    });
    let completedVisible = false;

    while (!completedVisible) {
      completedVisible = await fileProcessedMessage
        .isVisible()
        .catch(() => false);
      if (!completedVisible) {
        await page.reload();
        await page.waitForTimeout(3000);
        continue;
      }
    }
    await clickVisible(page.getByRole("button", { name: "اعتماد" }));
    await clickVisible(page.getByRole("button", { name: "موافق" }));
    await page.waitForTimeout(3000);
    await clickVisible(page.getByRole("button", { name: "رجوع" }));

    // Unit Models > save
    await clickVisible(page.getByRole("tab", { name: "نماذج الوحدات" }));
    await clickVisible(page.getByRole("cell", { name: "model_1" }));
    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    // Unit model > Save and approve media
    await clickVisible(page.getByRole("tab", { name: /المحتوى المرئي/ }));
    await page
      .getByRole("textbox", { name: "رابط الفيديو المباشر" })
      .fill("https://pre-sakani.housingapps.sa/en");
    await page.getByRole("textbox", { name: "مكان إجراء المزاد" }).fill("Riyadh");
    await fillVisible(page.getByRole("spinbutton", { name: "خط العرض" }), "1.1");
    await fillVisible(page.getByRole("spinbutton", { name: "خط الطول" }), "1.2");
    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    await page.waitForTimeout(1000);
    await clickVisible(
      page.getByRole("button", {
        name: "تقديم طلب موافقة على نشر المحتوى المرفوع",
      }),
    );
    await page.waitForTimeout(1000);
    await clickVisible(
      page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }),
    );
    await page.waitForTimeout(1000);
    await clickVisible(page.getByRole("button", { name: "وحدة النشر" }));

    let isApprovedModelMedia = false;

    while (!isApprovedModelMedia) {
      const tabText = await page
        .locator(
          "//div[@role='tab']/descendant::span[contains (text(), 'المحتوى المرئي')]",
        )
        .textContent();

      if (tabText && tabText.includes("تمت الموافقة وتم النشر")) {
        isApprovedModelMedia = true;
      } else {
        await page.reload();
        await page.waitForTimeout(3000); // Wait 3 seconds after reload
      }
    }

    // Unit model > Auction legal > Upload documents
    await clickVisible(page.getByRole("tab", { name: "المزاد قانوني" }));
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(
      process.cwd(), "src",
      "data",
      "Sample pdf.pdf",
    );
    await uploadFile(
      page.locator(
        "//lib-sakani-upload-files[@formcontrolname='term_and_condition']//input[@type='file']",
      ),
      PDFfilePath,
    );
    await page.waitForTimeout(2000);
    await uploadFile(
      page.locator(
        "//lib-sakani-upload-files[@formcontrolname='winner_contract']//input[@type='file']",
      ),
      PDFfilePath,
    );
    await page.waitForTimeout(2000);
    await clickVisible(page.getByRole("button", { name: "حفظ" }));
    await expect(page.getByText("AR Model was updated")).toBeVisible();

    // Unit model > Publish
    const publishUnitModelToggle = page.locator(
      "//label[contains (text(), 'هل تم نشر التصانيف')]/preceding-sibling::button",
    );
    await expect(publishUnitModelToggle).toBeVisible({ timeout: 30000 });
    const isPublishedUnitModel =
      await publishUnitModelToggle.getAttribute("aria-checked");
    if (isPublishedUnitModel === "false") {
      await clickVisible(publishUnitModelToggle);
      await expect(publishUnitModelToggle).toHaveAttribute(
        "aria-checked",
        "true",
      );
    } else {
      await expect(publishUnitModelToggle).toHaveAttribute(
        "aria-checked",
        "true",
      );
    }
    await clickVisible(page.locator("a").filter({ hasText: "model_1 - شقة" }));



    await page.pause();

    // Publish project
    const publishProjectToggle = page.locator(
      "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
    );
    await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
    const isPublishedProject =
      await publishProjectToggle.getAttribute("aria-checked");
    if (isPublishedProject === "false") {
      await clickVisible(publishProjectToggle);
      await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
    } else {
      await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
    }
    await expect(page.getByText(/بنجاح/)).toBeVisible();
    await clickVisible(page.getByText("تفاصيل المشروع"));
  });

  test("TC-02 - User joins hybrid auction and signs contract", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({
    page,
  }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;
    const projectName = testData.projectName;
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.auctionPage.openUnit();
    await app.auctionPage.joinHybridAuction();
    await app.auctionPage.returnToAuction("العودة الى المزاد");
    await app.auctionPage.waitForWinnerAndOpenContract();
    await app.auctionPage.approveContract();
    await app.auctionPage.expectAuctionSuccess();
  });

  test("TC-03 - Add new hybrid auction project with fee", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({ page }) => {
    test.setTimeout(180000);
    const testData = readTestData();
    const app = new WebApp(page);

    // define auction start and end dates and times
    // const auctionStartDateTime = new Date(Date.now() + 2 * 60 * 1000);
    // const auctionEndDateTime = new Date(Date.now() + 3 * 60 * 1000);

    const auctionStartDateTime = new Date(Date.now() + 120 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 240 * 60 * 1000);

    const auctionDate = new Date();
    // auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date, separator, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      return dayFirst
        ? `${day}${separator}${month}${separator}${year}`
        : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date) =>
      [date.getHours(), date.getMinutes()]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
    const auctionStartDate = formatDate(auctionDate, "/", true);
    const auctionEndDate = formatDate(auctionDate, "/", true);
    const auctionStartDateForData = formatDate(auctionDate, "-", true);
    const auctionEndDateForData = formatDate(auctionDate, "-", true);
    const auctionStartTime = formatTime(auctionStartDateTime);
    const auctionEndTime = formatTime(auctionEndDateTime);
    const [auctionStartHour, auctionStartMinute] = auctionStartTime.split(":");
    const [auctionEndHour, auctionEndMinute] = auctionEndTime.split(":");
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    const updatedData = { ...testData, projectName };
    writeTestData(updatedData);
    updatedData.auctionStartDate = auctionStartDateForData;
    updatedData.auctionEndDate = auctionEndDateForData;
    updatedData.auctionStartTime = auctionStartTime;
    updatedData.auctionEndTime = auctionEndTime;
    writeTestData(updatedData);

    // write the auction start and end dates and times to the Auction_Units.xlsx file
    updateAuctionUnitsFile({
      startDate: updatedData.auctionStartDate,
      endDate: updatedData.auctionEndDate,
      startTime: updatedData.auctionStartTime,
      endTime: updatedData.auctionEndTime,
    });

    // Login to admin portal
    await app.adminProjectPage.login(
      updatedData.adminPortalUrl,
      updatedData.adminUsername,
      updatedData.adminPassword,
    );

    // Navigate to the auction project creation page
    await app.adminProjectPage.openAuctionCreation();

    // Fill in the auction project details
    await fillVisible(
      page.getByRole("textbox", { name: "إسم المشروع" }),
      projectName,
    );


    const combobox = page.getByRole("combobox", { name: "نوع المزاد" });
    const option = page.getByRole("option", { name: "هجين" });

    while (!(await option.isVisible().catch(() => false))) {
      await clickVisible(combobox);
      await page.waitForTimeout(1000);
    }
    await clickVisible(option);

    await clickVisible(page.getByRole("combobox", { name: "نوع القطاع" }));
    await clickVisible(page.getByText("وزارة الإسكان"));

    await clickVisible(
      page
        .locator("//ng-select[@formcontrolname='region_id']")
        .getByRole("combobox"),
    );
    await clickVisible(page.getByText("الرياض"));
    await clickVisible(page.locator("//input[@id='inputCity']"));
    await clickVisible(page.getByRole("option", { name: "الرياض", exact: true }));

    const auctionStartDateInput = page.locator(
      "//app-gregorian-datepicker[@formcontrolname='start_date']/descendant::input[@placeholder='DD/MM/YYYY']",
    );
    const auctionEndDateInput = page.locator(
      "//app-gregorian-datepicker[@formcontrolname='end_date']/descendant::input[@placeholder='DD/MM/YYYY']",
    );
    const auctionStartHourInput = page.locator(
      "//ngb-timepicker[@formcontrolname='start_time']/descendant::input[@aria-label='Hours']",
    );
    const auctionStartMinuteInput = page.locator(
      "//ngb-timepicker[@formcontrolname='start_time']/descendant::input[@aria-label='Minutes']",
    );
    const auctionEndHourInput = page.locator(
      "//ngb-timepicker[@formcontrolname='end_time']/descendant::input[@aria-label='Hours']",
    );
    const auctionEndMinuteInput = page.locator(
      "//ngb-timepicker[@formcontrolname='end_time']/descendant::input[@aria-label='Minutes']",
    );

    await fillVisible(auctionStartDateInput, auctionStartDate);
    await fillVisible(auctionStartHourInput, auctionStartHour);
    await fillVisible(auctionStartMinuteInput, auctionStartMinute);
    await fillVisible(auctionEndDateInput, auctionEndDate);
    await fillVisible(auctionEndHourInput, auctionEndHour);
    await fillVisible(auctionEndMinuteInput, auctionEndMinute);

    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    // Auction media > Enter media details > Save
    await clickVisible(
      page.getByRole("tab", { name: "وسائل الإعلام مشروع المزاد ( مسودة )" }),
    );
    await fillVisible(
      page.getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", {
        name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)",
      }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الاسم (باللغة العربية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" }),
      projectName,
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الوصف (باللغة العربية)" }),
      "الوصف (باللغة العربية)\nالوصف (باللغة العربية)\nالوصف (باللغة العربية)",
    );
    await fillVisible(
      page.getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" }),
      "English auction project description\nEnglish auction project description\nEnglish auction project description",
    );
    await fillVisible(page.getByRole("spinbutton", { name: "خط العرض" }), "1.1");
    await fillVisible(page.getByRole("spinbutton", { name: "خط الطول" }), "1.2");
    await fillVisible(page.getByRole("spinbutton", { name: "عدد الأصول" }), "10");
    await clickVisible(page.getByRole("button", { name: "حفظ" }));
    await page.waitForTimeout(1000);
    await expect(page.getByText("تم حفظ بيانات الملف بنجاح")).toBeVisible();
    await clickVisible(page.getByText("تفاصيل المشروع"));
    await clickVisible(
      page.getByRole("button", {
        name: "تقديم طلب موافقة على نشر المحتوى المرفوع",
      }),
    );
    await clickVisible(
      page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }),
    );

    // Auction units > upload unit file and commit
    await clickVisible(page.getByRole("tab", { name: "الوحدات", exact: true }));
    await clickVisible(
      page.locator("#mat-tab-group-1-label-1").getByText("الوحدات"),
    );
    await clickVisible(
      page.locator("//span[normalize-space()='وحدة مزاد جديدة للاستيراد']"),
    );
    await page.waitForTimeout(2000);
    await expect(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    ).toBeVisible({ timeout: 30000 });
    await clickVisible(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    );
    await clickVisible(page.getByRole("option", { name: "شقة" }));

    const unitsImportFilePath = path.join(
      process.cwd(), "src",
      "data",
      "Auction_Units.xlsx",
    );
    await uploadFile(page.locator("//input[@type='file']"), unitsImportFilePath);
    await clickVisible(page.getByRole("button", { name: " حفظ" }));

    const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
    await expect(importInProgress).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(5000);
    await page.reload();
    await page.waitForTimeout(3000);
    const fileProcessedMessage = page.getByText("تم إكمال الإجراء", {
      exact: true,
    });
    let completedVisible = false;

    while (!completedVisible) {
      completedVisible = await fileProcessedMessage
        .isVisible()
        .catch(() => false);
      if (!completedVisible) {
        await page.reload();
        await page.waitForTimeout(3000);
        continue;
      }
    }
    await clickVisible(page.getByRole("button", { name: "اعتماد" }));
    await clickVisible(page.getByRole("button", { name: "موافق" }));
    await page.waitForTimeout(3000);
    await clickVisible(page.getByRole("button", { name: "رجوع" }));

    // Unit Models > save
    await clickVisible(page.getByRole("tab", { name: "نماذج الوحدات" }));
    await clickVisible(page.getByRole("cell", { name: "model_1" }));
    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    // Unit model > Save and approve media
    await clickVisible(page.getByRole("tab", { name: /المحتوى المرئي/ }));
    await page
      .getByRole("textbox", { name: "رابط الفيديو المباشر" })
      .fill("https://pre-sakani.housingapps.sa/en");
    await page.getByRole("textbox", { name: "مكان إجراء المزاد" }).fill("Riyadh");
    await fillVisible(page.getByRole("spinbutton", { name: "خط العرض" }), "1.1");
    await fillVisible(page.getByRole("spinbutton", { name: "خط الطول" }), "1.2");
    await clickVisible(page.getByRole("button", { name: "حفظ" }));

    await page.waitForTimeout(1000);
    await clickVisible(
      page.getByRole("button", {
        name: "تقديم طلب موافقة على نشر المحتوى المرفوع",
      }),
    );
    await page.waitForTimeout(1000);
    await clickVisible(
      page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }),
    );
    await page.waitForTimeout(1000);
    await clickVisible(page.getByRole("button", { name: "وحدة النشر" }));

    let isApprovedModelMedia = false;

    while (!isApprovedModelMedia) {
      const tabText = await page
        .locator(
          "//div[@role='tab']/descendant::span[contains (text(), 'المحتوى المرئي')]",
        )
        .textContent();

      if (tabText && tabText.includes("تمت الموافقة وتم النشر")) {
        isApprovedModelMedia = true;
      } else {
        await page.reload();
        await page.waitForTimeout(3000); // Wait 3 seconds after reload
      }
    }

    // Unit model > Auction legal > Upload documents
    await clickVisible(page.getByRole("tab", { name: "المزاد قانوني" }));
    await page.waitForTimeout(1000);
    const PDFfilePath = path.join(
      process.cwd(), "src",
      "data",
      "Sample pdf.pdf",
    );
    await uploadFile(
      page.locator(
        "//lib-sakani-upload-files[@formcontrolname='term_and_condition']//input[@type='file']",
      ),
      PDFfilePath,
    );
    await page.waitForTimeout(2000);
    await uploadFile(
      page.locator(
        "//lib-sakani-upload-files[@formcontrolname='winner_contract']//input[@type='file']",
      ),
      PDFfilePath,
    );
    await page.waitForTimeout(2000);
    await clickVisible(page.getByRole("button", { name: "حفظ" }));
    await expect(page.getByText("AR Model was updated")).toBeVisible();

    // Unit model > Auction settion > enable fee
    await clickVisible(page.getByRole("tab", { name: "إعدادات المزاد" }));
    await clickVisible(page.getByRole("button", { name: "تعديل" }));
    await clickVisible(
      page.locator("//ui-switch[@formcontrolname='apply_general_setting']"),
    );
    // await clickVisible(page.locator("//ui-switch[@formcontrolname='auction_fee_flag']"));
    await clickVisible(page.getByRole("button", { name: "تحديث" }));
    await expect(page.getByText("AR")).toBeVisible();

    // Unit model > Publish
    const publishUnitModelToggle = page.locator(
      "//label[contains (text(), 'هل تم نشر التصانيف')]/preceding-sibling::button",
    );
    await expect(publishUnitModelToggle).toBeVisible({ timeout: 30000 });
    const isPublishedUnitModel =
      await publishUnitModelToggle.getAttribute("aria-checked");
    if (isPublishedUnitModel === "false") {
      await clickVisible(publishUnitModelToggle);
      await expect(publishUnitModelToggle).toHaveAttribute(
        "aria-checked",
        "true",
      );
    } else {
      await expect(publishUnitModelToggle).toHaveAttribute(
        "aria-checked",
        "true",
      );
    }
    await clickVisible(page.locator("a").filter({ hasText: "model_1 - شقة" }));

    // Publish project
    const publishProjectToggle = page.locator(
      "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
    );
    await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
    const isPublishedProject =
      await publishProjectToggle.getAttribute("aria-checked");
    if (isPublishedProject === "false") {
      await clickVisible(publishProjectToggle);
      await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
    } else {
      await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
    }
    await expect(page.getByText(/بنجاح/)).toBeVisible();
    await clickVisible(page.getByText("تفاصيل المشروع"));
  });

  test("TC-04 - User joins hybrid auction and pays the fee", { annotation: [{ product: 'Gov Support', type: 'critical' }] }, async ({
    page,
  }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;
    const projectName = testData.projectName;

    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);
    await app.auctionPage.openUnit();
    // await page.getByRole('button', { name: 'المشاركة في المزاد' }).click();
    // await page.getByRole('radio', { name: 'متصل' }).check();
    // await page.getByRole('button', { name: 'تأكيد' }).click();
    // await page.locator('app-choose-payment-method').filter({ hasText: 'بطاقة ائتمانالدفع باستخدام مدى، فيزا، ماستركارد' }).locator('#id').check();
    // await page.getByRole('checkbox', { name: 'أؤكد قراءتي وفهمي وموافقتي على الشروط والأحكام' }).check();
    // await page.getByRole('button', { name: 'تأكيد' }).click();
    await app.auctionPage.joinHybridAuction();
    await app.paymentGatewayPage.fillCardDetails();
    await app.auctionPage.validateCongratulationsMessaeg();
    await app.auctionPage.returnToAuction("العودة إلى وحدة المزاد");
    await app.auctionPage.expectAuctionPaymentPending();
  });
});

