// @ts-nocheck
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
import { WebApp } from "@base-class/web-app";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

test.describe("MOH land booking journey", () => {
  test("TC-01 - Add new moh land project", { annotation: [{ product: "Gov Support", type: "critical" }] }, async ({ page }) => {
    test.setTimeout(120000);
    const app = new WebApp(page);
    const testData = readTestData();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const projectName = `Automation Auction ${timestamp}`;
    const updatedData = { ...testData, projectName };
    writeTestData(updatedData);

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
      if (projectTypeVisible) break;
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

    await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
    await expect(page.getByRole("button", { name: "استيراد وحدة جديدة" })).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
    await page.locator("//input[@type='file']").setInputFiles(
      path.join(process.cwd(), "src", "data", "MOHLand.xlsx"),
    );
    await page.getByRole("button", { name: " حفظ" }).click();

    const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
    await expect(importInProgress).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(5000);
    await page.reload();
    const fileProcessedMessage = page.getByText("تم إكمال الإجراء", { exact: true });
    let completedVisible = false;
    while (!completedVisible) {
      completedVisible = await fileProcessedMessage.isVisible().catch(() => false);
      if (!completedVisible) {
        await page.reload();
        await page.waitForTimeout(3000);
      }
    }
    await page.getByRole("button", { name: "اعتماد" }).click();
    await page.getByRole("button", { name: "موافق" }).click();
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "رجوع" }).click();

    await page.locator("span").filter({ hasText: /المحتوى المرئي/i }).first().click();
    await page.locator(
      "//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",
    ).setInputFiles(path.join(process.cwd(), "src", "data", "Sample image.jpg"));
    await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();

    const image2Path = path.join(process.cwd(), "src", "data", "Sample image 2.png");
    await page.waitForTimeout(2000);
    await page.locator(
      "//h1[contains (text(), 'ملف المخطط الرئيسي ')]/parent::div/following-sibling::div/child::input[@type='file']",
    ).setInputFiles(image2Path);
    await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
    await page.waitForTimeout(2000);
    await page.locator(
      "//h1[contains (text(), 'صورة العر')]/parent::div/following-sibling::div/child::input[@type='file']",
    ).setInputFiles(image2Path);
    await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
    await page.locator("div").filter({ hasText: /^Display method$/ }).first().click();
    await page.getByText("Hero").click();
    await page.getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" }).fill(projectName);
    await page.getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)" }).fill(projectName);
    await page.getByRole("textbox", { name: "تاريخ جهوزية أول وحدة" }).fill("2026-01-01");
    await page.getByRole("textbox", { name: "الاسم (باللغة العربية)" }).fill("test bb");
    await page.getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" }).fill("test bb");
    await page.getByRole("textbox", { name: "الملخص AR" }).fill("الملخص AR".repeat(8));
    await page.getByRole("textbox", { name: "ملخص EN" }).fill("Summary EN ".repeat(10));
    await page.getByRole("textbox", { name: "الوصف (باللغة العربية)" }).fill("الوصف (باللغة العربية)".repeat(7));
    await page.getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" }).fill("Description EN ".repeat(10));
    await page.getByRole("textbox", { name: "السعر يبدأ من" }).fill("500000");
    await page.getByRole("spinbutton", { name: "خط العرض" }).fill("1.1");
    await page.getByRole("spinbutton", { name: "خط الطول" }).fill("1.1");
    await expect(page.locator("(//button[contains (@class, 'uploadStatus')])[3]")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.locator("#save_btn").click();

    await page.getByRole("tab", { name: "تفاصيل المشروع" }).click();
    await page.getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" }).click();
    await page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }).click();
    await page.getByRole("button", { name: "إبقاء المشروع غير منشور" }).click();
    await page.getByRole("button", { name: "حفظ" }).click();
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

    await page.getByText("نماذج الوحدات").click();
    await page.getByRole("cell", { name: "model_1" }).click();
    await page.getByRole("button", { name: "حفظ" }).click();
    await page.getByText("المحتوى المرئي ( مسودة )").click();
    await page.getByRole("button", { name: "حفظ" }).click();
    await page.getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" }).click();
    await page.getByRole("button", { name: "قبول المحتوى المرئي المرفوع" }).click();

    const publishButton = page.getByRole("button", { name: "وحدة النشر" });
    await publishButton.click();
    while (true) {
      await page.waitForTimeout(3000);
      if (!await publishButton.isVisible().catch(() => false)) break;
      await page.reload();
    }

    await page.locator("a").filter({ hasText: /model_1/ }).click();
    await page.waitForTimeout(3000);
    const chevronElement = page.locator("(//div[contains (@class, 'chevron')]/parent::div)[1]");
    if (await chevronElement.isVisible().catch(() => false)) await chevronElement.click();
    await page.getByText("تفاصيل المشروع").click();

    const bookingAvailableToggle = page.locator(
      "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
    );
    const visualContentTab = page.getByRole("tab", { name: /تمت الموافقة/ });
    while (!await visualContentTab.isVisible().catch(() => false)) {
      await page.reload();
      await page.waitForTimeout(2000);
    }
    await expect(visualContentTab).toBeVisible();
    await expect(bookingAvailableToggle).toBeVisible({ timeout: 30000 });
    if (await bookingAvailableToggle.getAttribute("aria-checked") === "false") {
      await bookingAvailableToggle.click();
    }
    await expect(bookingAvailableToggle).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: "حفظ" }).click();

    const publishProjectToggle = page.locator(
      "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
    );
    await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
    if (await publishProjectToggle.getAttribute("aria-checked") === "false") {
      await publishProjectToggle.click();
    }
    await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "حفظ" }).click();
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
  });

  test("TC-02 - Book moh land", { annotation: [{ product: "Gov Support", type: "critical" }] }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);

    await app.loginPage.gotoHomePage(testData.userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(testData.sakaniUserIdMoh);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(testData.projectName);
    await app.projectDetailsPage.openUnitsAndScroll();
    await app.projectUnitsPage.selectLand(1);
    await app.unitDetailsPage.reserveUnit();
    await app.unitBookingPage.signMohLandBooking();
    await expect(page.getByText("تهانينا!")).toBeVisible();
  });

  test("TC-03 - Cancel moh land booking", { annotation: [{ product: "Gov Support", type: "critical" }] }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);

    await app.loginPage.gotoHomePage(testData.userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(testData.sakaniUserIdMoh);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();
    await app.bookingCancellationPage.openMyBookings();
    await app.bookingCancellationPage.openBookingDetails();
    await app.bookingCancellationPage.cancelMohLandBooking();
  });
});
