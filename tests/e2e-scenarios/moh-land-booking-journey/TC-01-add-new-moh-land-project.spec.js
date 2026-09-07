import { test, expect } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const { DateUtils } = require(
  path.join(process.cwd(), "src", "Pages", "utils", "DateUtils"),
);
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

test("TC-01 - Add new moh land project", async ({ page }) => {
  test.setTimeout(120000);
  const app = new WebApp(page);

  // const currentDate = DateUtils.getDateISO(600);
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  const projectName = `Automation Auction ${timestamp}`;
  const updatedData = { ...testData, projectName };
  writeTestData(updatedData);

  // Project details
  await app.adminProjectPage.login(
    updatedData.adminPortalUrl,
    updatedData.adminUsername,
    updatedData.adminPassword,
  );
  await app.adminProjectPage.openProjectCreation();

  await page
    .locator("form-field-component")
    .filter({ hasText: "إسم المشروع *" })
    .getByPlaceholder("إسم المشروع")
    .fill(projectName);
  const projectTypeDropdown = page.locator(
    "//mat-select[@formcontrolname='project_type']",
  );

  const projectTypeOption = page.getByText("أراضي وزارة البلديات والإسكان", {
    exact: true,
  });

  let projectTypeVisible = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    await projectTypeDropdown.click();
    projectTypeVisible = await projectTypeOption.isVisible().catch(() => false);

    if (projectTypeVisible) {
      break;
    }

    await page.waitForTimeout(2000);
  }

  await expect(projectTypeOption).toBeVisible({ timeout: 30000 });
  await projectTypeOption.click();
  await page
    .locator("//ng-select[@formcontrolname='region_id']")
    .getByRole("combobox")
    .click();
  await page.getByText("الرياض").click();
  await page.locator("//input[@id='inputCity']").click();
  await page.getByRole("option", { name: "الرياض", exact: true }).click();

  await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
  await page.getByText("دعم عيني كامل").click();

  await page.getByRole("button", { name: "حفظ" }).click();
  const saveSuccessToast = page.getByText("تم الحفظ بنجاح!");
  await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

  // Import units
  await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "استيراد وحدة جديدة" }),
  ).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();

  const unitsImportFilePath = path.join(
    process.cwd(), "src",
    "data",
    "MOHLand.xlsx",
  );
  await page
    .locator("//input[@type='file']")
    .setInputFiles(unitsImportFilePath);
  await page.getByRole("button", { name: " حفظ" }).click();

  const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
  await expect(importInProgress).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(5000);
  await page.reload();
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
  await page.getByRole("button", { name: "اعتماد" }).click();
  await page.getByRole("button", { name: "موافق" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "رجوع" }).click();

  // //Upload media
  await page
    .locator("span")
    .filter({ hasText: /المحتوى المرئي/i })
    .first()
    .click();
  const bannerImagePath = path.join(
    process.cwd(), "src",
    "data",
    "Sample image.jpg",
  );
  await page
    .locator(
      "//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",
    )
    .setInputFiles(bannerImagePath);
  await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();

  const Image2Path = path.join(
    process.cwd(), "src",
    "data",
    "Sample image 2.png",
  );
  await page.waitForTimeout(2000);
  await page
    .locator(
      "//h1[contains (text(), 'ملف المخطط الرئيسي ')]/parent::div/following-sibling::div/child::input[@type='file']",
    )
    .setInputFiles(Image2Path);
  await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();

  await page.waitForTimeout(2000);
  await page
    .locator(
      "//h1[contains (text(), 'صورة العر')]/parent::div/following-sibling::div/child::input[@type='file']",
    )
    .setInputFiles(Image2Path);
  await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
  await page
    .locator("div")
    .filter({ hasText: /^Display method$/ })
    .first()
    .click();
  await page.getByText("Hero").click();
  await page
    .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" })
    .fill(projectName);
  await page
    .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)" })
    .fill(projectName);
  await page
    .getByRole("textbox", { name: "تاريخ جهوزية أول وحدة" })
    .fill("2026-01-01");
  await page
    .getByRole("textbox", { name: "الاسم (باللغة العربية)" })
    .fill("test bb");
  await page
    .getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" })
    .fill("test bb");
  await page
    .getByRole("textbox", { name: "الملخص AR" })
    .fill(
      "الملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص AR",
    );
  await page
    .getByRole("textbox", { name: "ملخص EN" })
    .fill(
      "Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN",
    );
  await page
    .getByRole("textbox", { name: "الوصف (باللغة العربية)" })
    .fill(
      "الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)",
    );
  await page
    .getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" })
    .fill(
      "Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN",
    );
  await page.getByRole("textbox", { name: "السعر يبدأ من" }).fill("500000");
  await page.getByRole("spinbutton", { name: "خط العرض" }).fill("1.1");
  await page.getByRole("spinbutton", { name: "خط الطول" }).fill("1.1");
  await expect(
    page.locator("(//button[contains (@class, 'uploadStatus')])[3]"),
  ).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.locator("#save_btn").click();

  // // Approve media
  await page.getByRole("tab", { name: "تفاصيل المشروع" }).click();
  await page
    .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
    .click();
  await page
    .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
    .click();
  await page.getByRole("button", { name: "إبقاء المشروع غير منشور" }).click();
  await page.getByRole("button", { name: "حفظ" }).click();
  await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

  // Publish unit model
  await page.getByText("نماذج الوحدات").click();
  await page.getByRole("cell", { name: "model_1" }).click();
  await page.getByRole("button", { name: "حفظ" }).click();
  await page.getByText("المحتوى المرئي ( مسودة )").click();
  await page.getByRole("button", { name: "حفظ" }).click();
  await page
    .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
    .click();
  await page
    .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
    .click();

    // await page.getByRole("button", { name: "وحدة النشر" }).click();


  const publishButton = page.getByRole("button", { name: "وحدة النشر" });

  await publishButton.click();


while (true) {
  await page.waitForTimeout(3000);

  // Check if the button is still visible in the DOM
  const isStillPresent = await publishButton.isVisible().catch(() => false);

  if (isStillPresent) {
    await page.reload();
    // Optional: Re-click after reload if required by your application flow
    // await publishButton.click();
  } else {
    break; // Exit loop when the button is no longer present
  }
}

  await page
    .locator("a")
    .filter({ hasText: /model_1/ })
    .click();

  // Navigate to project details page
  await page.waitForTimeout(3000);
  // await page.locator("(//div[contains (@class, 'chevron')]/parent::div)[1]").click();

  const chevronElement = page.locator("(//div[contains (@class, 'chevron')]/parent::div)[1]");

if (await chevronElement.isVisible().catch(() => false)) {
  await chevronElement.click();
}

  await page.getByText("تفاصيل المشروع").click();

  // Check the bookable toggle
  const bookingAvailableToggle = page.locator(
    "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
  );

  
const visualContentTab = page.getByRole('tab', { name: /تمت الموافقة/ });

// Loop until the tab is present/visible
while (true) {
  const isPresent = await visualContentTab.isVisible().catch(() => false);
  
  if (isPresent) {
    break; // Exit loop once present
  }

  await page.reload();
  await page.waitForTimeout(2000); // Wait 2 seconds after reload
}

// Validate visibility
await expect(visualContentTab).toBeVisible();

  await expect(bookingAvailableToggle).toBeVisible({ timeout: 30000 });
  const isBookingAvailable =
    await bookingAvailableToggle.getAttribute("aria-checked");
  if (isBookingAvailable === "false") {
    await bookingAvailableToggle.click();
    await expect(bookingAvailableToggle).toHaveAttribute(
      "aria-checked",
      "true",
    );
  } else {
    await expect(bookingAvailableToggle).toHaveAttribute(
      "aria-checked",
      "true",
    );
  }
  await page.getByRole("button", { name: "حفظ" }).click();

  // Publish project
  const publishProjectToggle = page.locator(
    "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
  );
  await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
  const isPublished = await publishProjectToggle.getAttribute("aria-checked");
  if (isPublished === "false") {
    await publishProjectToggle.click();
    await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
  } else {
    await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
  }

  // Save project
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "حفظ" }).click();
  await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(3000);
});
