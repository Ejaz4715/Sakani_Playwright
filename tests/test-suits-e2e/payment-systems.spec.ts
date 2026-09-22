const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { test, expect } from "@playwright/test";
import { DateUtils } from "@pages/utils/DateUtils";
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

test.describe("Offplan booking fees refund", () => {
  test("TC-01 - Add new project offplan project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    const testData = readTestData();
    const app = new WebApp(page);

    const currentDate = DateUtils.getDateISO(600);
    const projectName = `Automation Project ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14)}`;
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
    const projectTypeOption = page.getByText(
      "مشاريع البيع على الخارطة على أراضي الوزارة",
      { exact: true },
    );

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
    await page.getByRole("option", { name: "الخرج", exact: true }).click();
    await page
      .locator("//input[@id='inputDeveloper']")
      .fill("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
    await page
      .getByText(/شركة الضاحية المثالية للتطوير والاستثمار العقاري.*/)
      .click();
    await page.getByRole("switch", { name: "قابل للحجز؟" }).click();
    await page.locator("//mat-select[@formcontrolname='status']").click();
    await page.getByRole("option", { name: "متاح" }).click();
    await page
      .getByRole("textbox", { name: "تاريخ انتهاء رخصة البيع في وافي" })
      .fill(currentDate);
    await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
    await page.getByText("دعم عيني كامل").click();
    await page
      .locator("//input[@formcontrolname='max_subsidy_amount']")
      .fill("2");
    await page
      .getByRole("textbox", { name: "تاريخ توقيع الاتفاقيه للمشروع" })
      .fill("2026-01-01");
    await page.getByRole("textbox", { name: "رقم ترخيص المشروع" }).fill("665334");
    await page
      .getByRole("textbox", { name: "تاريخ ترخيص المشروع" })
      .fill("2026-01-01");
    await page
      .getByRole("textbox", { name: "اسم حساب الضمان" })
      .fill("Test user");
    await page
      .getByRole("textbox", { name: "رقم حساب الضمان" })
      .fill("SA1111111111111111111111");
    await page
      .locator(
        "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
      )
      .first()
      .click();
    await page.getByText("بنك الأهلي السعودي").click();
    await page.locator("//input[@formcontrolname='deduct_percentage']").fill("2");
    await page
      .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالعربية)" })
      .fill("test");
    await page
      .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالإنجليزية)" })
      .fill("test");
    await page.getByRole("textbox", { name: "DD/MM/YYYY" }).fill("01/01/2026");
    await page.getByRole("button", { name: "حفظ" }).click();
    const saveSuccessToast = page.locator("//app-toasts").getByText("تم الحفظ بنجاح!");
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });


    // Link with AZM
    await page.waitForTimeout(3000);
    const azmToggle = page.locator(
      "//label[contains (text(), 'AZM')]/preceding-sibling::button",
    );
    const isAzmLinked = await azmToggle.getAttribute("aria-checked");
    if (isAzmLinked === "false") {
      await azmToggle.click();
      await page.waitForTimeout(5000);
      await expect(azmToggle).toHaveAttribute("aria-checked", "true");
    } else {
      await expect(azmToggle).toHaveAttribute("aria-checked", "true");
    }

    // Partcipating banks
    await expect(page.getByText(/قائمة الجهات التمويلية/i)).toBeVisible({
      timeout: 30000,
    });
    await page.getByText(/قائمة الجهات التمويلية/i).click();
    await expect(
      page.getByRole("checkbox", { name: "Select all rows" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("checkbox", { name: "Select all rows" }).click();
    await page.getByRole("button", { name: "حفظ" }).click();

    // Import units
    await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "استيراد وحدة جديدة" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
    await expect(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("combobox", { name: "نوع الوحدة السكنية" }).click();
    await page.getByRole("option", { name: "شقة" }).click();
    const unitsImportFilePath = path.join(
      process.cwd(), "src",
      "data",
      "Offplan_MOH.xlsx",
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
      page.locator("//button[contains (@class, 'uploadStatus')]"),
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

    // // Publish unit model
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
    await page.getByRole("button", { name: "وحدة النشر" }).click();
    await page.locator("a").filter({ hasText: "model_1 - شقة" }).click();

    // Navigate to project details page
    await page.getByText("تفاصيل المشروع").click();

    // Select status to be available
    await page.locator("//mat-select[@formcontrolname='status']").click();
    await page.getByRole("option", { name: "متاح" }).click();

    //Save project details
    await page.getByRole("button", { name: "حفظ" }).click();
    // await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

    // Check the bookable toggle
    const bookingAvailableToggle = page.locator(
      "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
    );
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
    await page.getByRole("button", { name: "حفظ" }).click();
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
  });


  test("TC-02 - Developer adds payment schedules", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const projectName = testData.projectName;
    const developerUserId = testData.developerUserId;

    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.openProjectBySearch(projectName);

    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: "cash",
      scheduleName: "Cash 22",
      completionPercentageOneValue: "50",
      percentageOneValue: "50",
      completionPercentageTwoValue: "100",
      percentageTwoValue: "50"
    });

    await app.developerProjectPage.openProjectBySearch(projectName);
    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: "lending",
      scheduleName: "Lending 22",
      completionPercentageOneValue: "50",
      percentageOneValue: "50",
      completionPercentageTwoValue: "100",
      percentageTwoValue: "50"
    });
  });

  test("TC-03 - Developer approves sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const projectName = testData.projectName;
    const developerUserId = testData.developerUserId;

    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.openProjectBySearch(projectName);

    await app.developerProjectPage.openSalesContractsTab();
    await app.developerProjectPage.viewAndApproveSalesContract();
    await app.developerProjectPage.approveUnitSpecification();
    await app.developerProjectPage.fillOtp("1234");
    await app.developerProjectPage.verifyOtp();
    await app.developerProjectPage.verifyApprovalSuccessMessage();
  });

  test("TC-04 - Book offplan unit and pay the fees", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
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
    await app.projectDetailsPage.openUnitsAndScroll();

    const page1Promise = page.waitForEvent("popup");
    await app.marketplaceLandingPage.openResidentialUnit();
    const page1 = await page1Promise;
    const page2Promise = page1.waitForEvent("popup");

    {
      const unitApp = new WebApp(page1);
      await unitApp.projectUnitsPage.openUnitInPopup(1);
    }

    const page2 = await page2Promise;

    {
      let bookingPage = page2;
      let bookingApp = new WebApp(bookingPage);
      await bookingApp.unitDetailsPage.reserveUnit();

      await bookingApp.unitBookingPage.acceptTermsAndConfirm();
      await bookingApp.paymentGatewayPage.fillCardDetails();
      await bookingApp.paymentConfirmationPage.closePayment();
      await bookingApp.paymentConfirmationPage.expectSuccessMessage();
    }
  });

  test("TC-05 - User signs sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(30000);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;

    await logStep("Step 01: Open user portal");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep("Step 02: Log in with Nafath");
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 03: Open active bookings");
    await app.bookingPage.openActiveBookings();
    const bookedUnitCode =
      await app.bookingPage.getBookedUnitCode();
    expect(bookedUnitCode).toBeTruthy();
    testData.bookedUnitCode = bookedUnitCode;
    fs.writeFileSync(
      testDataPath,
      JSON.stringify(testData, null, 2) + "\n",
      "utf8",
    );

    await logStep("Step 04: Open booking details > Sign the sales contract");
    await app.bookingPage.openBookingDetails();
    await app.unitDetailsPage.openSalesContract();
    await app.unitBookingPage.signSalesContract();
    await app.unitBookingPage.expectSalesContractSuccess();
  });

  test("TC-06 - Developer confirms the booking and adds annex", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const developerUserId = testData.developerUserId;
    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.confirmBooking(testData.bookedUnitCode);
  });

  test("TC-07 User verifies the refundable status is present for the booking", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(30000);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;

    await logStep("Step 01: Open user portal");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep("Step 02: Log in with Nafath");
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 03: Open completed bookings");
    await app.bookingPage.openCompletedBookings();

    await logStep("Step 04: Open booking details");
    await app.bookingPage.openBookingDetails();

  });
});

test.describe("Offplan unit booking and fees payment", () => {
  test("TC-01 - Add new project offplan project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    const testData = readTestData();
    const app = new WebApp(page);

    const currentDate = DateUtils.getDateISO(600);
    const projectName = `Automation Project ${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14)}`;
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
    const projectTypeOption = page.getByText(
      "مشاريع البيع على الخارطة على أراضي الوزارة",
      { exact: true },
    );

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
    await page.getByRole("option", { name: "الخرج", exact: true }).click();
    await page
      .locator("//input[@id='inputDeveloper']")
      .fill("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
    await page
      .getByText(/شركة الضاحية المثالية للتطوير والاستثمار العقاري.*/)
      .click();
    await page.getByRole("switch", { name: "قابل للحجز؟" }).click();
    await page.locator("//mat-select[@formcontrolname='status']").click();
    await page.getByRole("option", { name: "متاح" }).click();
    await page
      .getByRole("textbox", { name: "تاريخ انتهاء رخصة البيع في وافي" })
      .fill(currentDate);
    await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
    await page.getByText("دعم عيني كامل").click();
    await page
      .locator("//input[@formcontrolname='max_subsidy_amount']")
      .fill("2");
    await page
      .getByRole("textbox", { name: "تاريخ توقيع الاتفاقيه للمشروع" })
      .fill("2026-01-01");
    await page.getByRole("textbox", { name: "رقم ترخيص المشروع" }).fill("665334");
    await page
      .getByRole("textbox", { name: "تاريخ ترخيص المشروع" })
      .fill("2026-01-01");
    await page
      .getByRole("textbox", { name: "اسم حساب الضمان" })
      .fill("Test user");
    await page
      .getByRole("textbox", { name: "رقم حساب الضمان" })
      .fill("SA1111111111111111111111");
    await page
      .locator(
        "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
      )
      .first()
      .click();
    await page.getByText("بنك الأهلي السعودي").click();
    await page.locator("//input[@formcontrolname='deduct_percentage']").fill("2");
    await page
      .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالعربية)" })
      .fill("test");
    await page
      .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالإنجليزية)" })
      .fill("test");
    await page.getByRole("textbox", { name: "DD/MM/YYYY" }).fill("01/01/2026");
    await page.getByRole("button", { name: "حفظ" }).click();
    const saveSuccessToast = page.locator("//app-toasts").getByText("تم الحفظ بنجاح!");
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });


    // Link with AZM
    await page.waitForTimeout(3000);
    const azmToggle = page.locator(
      "//label[contains (text(), 'AZM')]/preceding-sibling::button",
    );
    const isAzmLinked = await azmToggle.getAttribute("aria-checked");
    if (isAzmLinked === "false") {
      await azmToggle.click();
      await page.waitForTimeout(5000);
      await expect(azmToggle).toHaveAttribute("aria-checked", "true");
    } else {
      await expect(azmToggle).toHaveAttribute("aria-checked", "true");
    }

    // Partcipating banks
    await expect(page.getByText(/قائمة الجهات التمويلية/i)).toBeVisible({
      timeout: 30000,
    });
    await page.getByText(/قائمة الجهات التمويلية/i).click();
    await expect(
      page.getByRole("checkbox", { name: "Select all rows" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("checkbox", { name: "Select all rows" }).click();
    await page.getByRole("button", { name: "حفظ" }).click();

    // Import units
    await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "استيراد وحدة جديدة" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
    await expect(
      page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("combobox", { name: "نوع الوحدة السكنية" }).click();
    await page.getByRole("option", { name: "شقة" }).click();
    const unitsImportFilePath = path.join(
      process.cwd(), "src",
      "data",
      "Offplan_MOH.xlsx",
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
      page.locator("//button[contains (@class, 'uploadStatus')]"),
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

    // // Publish unit model
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
    await page.getByRole("button", { name: "وحدة النشر" }).click();
    await page.locator("a").filter({ hasText: "model_1 - شقة" }).click();

    // Navigate to project details page
    await page.getByText("تفاصيل المشروع").click();

    // Select status to be available
    await page.locator("//mat-select[@formcontrolname='status']").click();
    await page.getByRole("option", { name: "متاح" }).click();

    //Save project details
    await page.getByRole("button", { name: "حفظ" }).click();
    // await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

    // Check the bookable toggle
    const bookingAvailableToggle = page.locator(
      "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
    );
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
    await page.getByRole("button", { name: "حفظ" }).click();
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
  });


  test("TC-02 - Developer adds payment schedules", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const projectName = testData.projectName;
    const developerUserId = testData.developerUserId;

    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.openProjectBySearch(projectName);

    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: "cash",
      scheduleName: "Cash 22",
      completionPercentageOneValue: "50",
      percentageOneValue: "50",
      completionPercentageTwoValue: "100",
      percentageTwoValue: "50"
    });

    await app.developerProjectPage.openProjectBySearch(projectName);
    await app.developerProjectPage.openPaymentSchedulesTab();
    await app.developerProjectPage.addPaymentSchedule({
      type: "lending",
      scheduleName: "Lending 22",
      completionPercentageOneValue: "50",
      percentageOneValue: "50",
      completionPercentageTwoValue: "100",
      percentageTwoValue: "50"
    });
  });

  test("TC-03 - Developer approves sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const projectName = testData.projectName;
    const developerUserId = testData.developerUserId;

    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.openProjectBySearch(projectName);

    await app.developerProjectPage.openSalesContractsTab();
    await app.developerProjectPage.viewAndApproveSalesContract();
    await app.developerProjectPage.approveUnitSpecification();
    await app.developerProjectPage.fillOtp("1234");
    await app.developerProjectPage.verifyOtp();
    await app.developerProjectPage.verifyApprovalSuccessMessage();
  });

  test("TC-04 - Book offplan unit and pay the fees", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
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
    await app.projectDetailsPage.openUnitsAndScroll();

    const page1Promise = page.waitForEvent("popup");
    await app.marketplaceLandingPage.openResidentialUnit();
    const page1 = await page1Promise;
    const page2Promise = page1.waitForEvent("popup");

    {
      const unitApp = new WebApp(page1);
      await unitApp.projectUnitsPage.openUnitInPopup(1);
    }

    const page2 = await page2Promise;

    {
      let bookingPage = page2;
      let bookingApp = new WebApp(bookingPage);
      await bookingApp.unitDetailsPage.reserveUnit();

      await bookingApp.unitBookingPage.acceptTermsAndConfirm();
      await bookingApp.paymentGatewayPage.fillCardDetails();
      await bookingApp.paymentConfirmationPage.closePayment();
      await bookingApp.paymentConfirmationPage.expectSuccessMessage();
    }
  });

  test("TC-05 - User signs sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(30000);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;

    await logStep("Step 01: Open user portal");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();

    await logStep("Step 02: Log in with Nafath");
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 03: Open active bookings");
    await app.bookingPage.openActiveBookings();
    const bookedUnitCode =
      await app.bookingPage.getBookedUnitCode();
    expect(bookedUnitCode).toBeTruthy();
    testData.bookedUnitCode = bookedUnitCode;
    fs.writeFileSync(
      testDataPath,
      JSON.stringify(testData, null, 2) + "\n",
      "utf8",
    );

    await logStep("Step 04: Open booking details > Sign the sales contract");
    await app.bookingPage.openBookingDetails();
    await app.unitDetailsPage.openSalesContract();
    await app.unitBookingPage.signSalesContract();
    await app.unitBookingPage.expectSalesContractSuccess();
  });

  test("TC-06 - Developer confirms the booking and adds annex", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const developerUserId = testData.developerUserId;
    await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();
    await app.developerProjectPage.confirmBooking(testData.bookedUnitCode);
  });
});

test.describe("Payments and transactions", () => {
  test("TC-01 User preview and download the invoice and receipt", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async () => {

  })
});

test.describe("Offplan basket multiple booking", () => {

});

test.describe("Order design", () => {

});

test.describe("Resale of units", () => {

});

test.describe("Loyalty sharrai", () => {

});

test.describe("Issue an ad license and publish", () => {

});



test.describe("Electronic auction with fees", () => {

  async function waitForVisible(locator: any) {
    await expect(locator).toBeVisible({ timeout: 30000 });
    return locator;
  }

  async function clickVisible(locator: any) {
    await (await waitForVisible(locator)).click();
  }

  async function fillVisible(locator: any, value: string) {
    await (await waitForVisible(locator)).fill(value);
  }

  async function uploadFile(locator: any, filePath: string) {
    await locator.waitFor({ state: "attached", timeout: 30000 });
    await locator.setInputFiles(filePath);
  }

  function updateAuctionUnitsFile(data: any) {
    const workbookPath = path.join(process.cwd(), "src", "data", "Auction_Units.xlsx");
    const workbook = XLSX.readFile(workbookPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerColumns: Record<string, number> = {};
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

  function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  }

  test("TC-01 Add new electronic auction project", { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(180000);
    const testData = readTestData();
    const app = new WebApp(page);

    await logStep("Step 01: Define auction start/end date and time");
    const auctionStartDateTime = new Date(Date.now() + 5 * 60 * 1000);
    const auctionEndDateTime = new Date(Date.now() + 9 * 60 * 1000);
    const auctionDate = new Date();
    auctionDate.setDate(auctionDate.getDate() + 1);
    const formatDate = (date: any, separator: any, dayFirst = false) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      return dayFirst
        ? `${day}${separator}${month}${separator}${year}`
        : `${month}${separator}${day}${separator}${year}`;
    };
    const formatTime = (date: any) =>
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

  test("TC-02 - User bids electronic auction and pays fee", { annotation: [{ product: 'Gov Support', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;
    const projectName = testData.projectName;

    await logStep("Step 01: Login to user portal");
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 02: search for auction project and navigate to project details page");
    await app.marketplaceLandingPage.openSearch();
    await app.marketplaceLandingPage.searchForProject(projectName);

    await logStep("Step 03: Navigate to auction unit and join the auction");
    await app.auctionPage.openUnit();
    await app.auctionPage.joinElectronicAuction();

    await logStep("Step 04: Select mada > Enter payment details");
    await app.paymentGatewayPage.fillCardDetails();
    await app.auctionPage.validateCongratulationsMessaeg();
    await app.auctionPage.returnToAuction("العودة إلى وحدة المزاد");

    await logStep("Step 05: Validate the auction booking fees is paid");
    await app.auctionPage.expectAuctionPaymentPending();
  });
});

test.describe("Hybrid auction with fees", () => {



});

test.describe("Withdraw funds from wallet", () => {
  test("TC-01 Withdraw funds from wallet", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const userPortalUrl = testData.userPortalUrl;

    await logStep('Step 01: Open the user portal and log in');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath("1129051502");
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep('Step 02: Open the wallet page and capture balances');
    await app.bookingPage.clickProfileIcon();
    await page.getByText('محفظة').click();
    const balanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
    const rawBalanceText = await balanceElement.textContent();
    const balanceBeforewithdraw = rawBalanceText ? rawBalanceText.trim() : '';
    const reservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
    const rawReservedBalance = await reservedBalanceElement.textContent();
    const reservedBalanceBeforeWithdraw = rawReservedBalance ? rawReservedBalance.trim() : '';

    await logStep('Step 03: Submit a withdrawal request');
    await page.getByRole('button', { name: 'استرداد' }).click();
    await page.getByRole('spinbutton').fill('1');
    await page.getByRole('button', { name: 'استرداد' }).click();

    await logStep('Step 04: Confirm the withdrawal with OTP');
    await page.getByRole('textbox').nth(0).fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');
    await page.getByRole('button', { name: 'تحقق' }).click();

    await logStep('Step 05: Close the success confirmation');
    await page.getByRole('heading', { name: 'تهانينا' }).click();
    await page.getByRole('button', { name: 'إغلاق' }).click();

    await logStep('Step 06: Validate the wallet balances changed after withdrawal');
    const updatedBalanceElement = page.locator("(//p[contains(text(), 'الرصيد المتوفر')])[1]/parent::div/descendant::app-sar-currency/child::span");
    const rawUpdatedBalanceText = await updatedBalanceElement.textContent();
    const balanceAfterWithdraw = rawUpdatedBalanceText ? rawUpdatedBalanceText.trim() : '';
    expect(balanceAfterWithdraw).not.toEqual(balanceBeforewithdraw);

    const updatedReservedBalanceElement = page.locator("(//p[contains(text(), 'رصيد محجوز')])[1]/parent::div/descendant::app-sar-currency/child::span");
    const rawUpdatedReservedBalance = await updatedReservedBalanceElement.textContent();
    const reservedBalanceAfterWithdraw = rawUpdatedReservedBalance ? rawUpdatedReservedBalance.trim() : '';
    expect(reservedBalanceBeforeWithdraw).not.toEqual(reservedBalanceAfterWithdraw);

  });
});

test.describe("Rental behavior", () => {

});
