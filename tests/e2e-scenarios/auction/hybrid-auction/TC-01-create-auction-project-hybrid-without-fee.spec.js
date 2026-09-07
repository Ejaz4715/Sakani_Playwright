const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { WebApp } = require(path.join(process.cwd(), "src", "base-class", "web-app"));

const testDataPath = path.join(
  process.cwd(), "src",
  "data",
  "test-data.json",
);
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

function writeTestData(data) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

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
  const workbookPath = path.join(
    process.cwd(), "src",
    "data",
    "Auction_Units.xlsx",
  );
  const workbook = XLSX.readFile(workbookPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const headerColumns = {};

  for (let column = range.s.c; column <= range.e.c; column++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: column })];
    const header = String(cell?.v ?? "").trim();

    if (header) {
      headerColumns[header] = column;
    }
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

test("TC-01 - Add new hybrid auction project", async ({ page }) => {
  test.setTimeout(180000);
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
