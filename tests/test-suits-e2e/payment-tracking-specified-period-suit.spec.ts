import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { DateUtils } from "@pages/utils/DateUtils";
import { WebApp } from "@base-class/web-app";
const fs = require("fs");
const path = require("path");

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}
test.describe("Payment tracking - specified period", () => {
  test("TC-01 - Add new project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any}, async ({ page }) => {
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
    await expect(saveSuccessToast).toBeVisible({ timeout:120000 });
  
  
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

  test("TC-04  Admin enables comprehensive and automation payment", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(120000);
    const testData = readTestData();
    const app = new WebApp(page);
  
    await app.adminProjectPage.login(
      testData.adminPortalUrl,
      testData.adminUsername,
      testData.adminPassword,
    );
  
    await app.adminProjectPage.openProjects();
    await page.locator("//input[@formcontrolname='name']").fill(testData.projectName);
    await page.getByRole('button', { name: 'بحث' }).click();
    await page.getByRole('cell', { name: testData.projectName, exact: true }).click();
    // await page.locator('div').filter({ hasText: testData.projectName }).click();
    await page.waitForTimeout(10000);
    await page.getByText('إعدادات المشاريع').click();
    await page.getByRole('switch', { name: 'Use General setting for' }).click();
    await page.getByRole('switch', { name: 'تفعيل أتمتة تحصيل المدفوعات' }).click();
    await page.getByRole("button", { name: "حفظ" }).click();
    const saveSuccessToast = page.getByText("تم الحفظ بنجاح!");
    await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
  
  });

  test("TC-02 - Developer adds flexible payment schedules", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any}, async ({ page }: { page: Page }) => {
      test.setTimeout(0);
      const testData = readTestData();
      const app = new WebApp(page);
      const projectName = testData.projectName;
      const developerUserId = testData.developerUserId;
  
      await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
      await app.developerProjectPage.loginDeveloper(developerUserId);
      await app.developerProjectPage.switchRoleToDeveloper();
      await app.flexiblePaymentPage.clickOnFinancialManagemnt();
      await app.flexiblePaymentPage.clickOnPaymentSchedules();
      await app.flexiblePaymentPage.clickOnNewSchedulesButton();
      await app.flexiblePaymentPage.enterScheduleNameInArabic("Test");
      await app.flexiblePaymentPage.selectScheduleType("specificPeriod");
      await app.flexiblePaymentPage.selectPalnType();
      await app.flexiblePaymentPage.enterPlanPeriod("36");
      await app.flexiblePaymentPage.clickOnNextButton();
      await app.flexiblePaymentPage.clickOnNextButton();
      await app.flexiblePaymentPage.serachByprojectName(projectName);
      await app.flexiblePaymentPage.checkOnProjectNameSearchedResult();
      await app.flexiblePaymentPage.clickOnNextButton();
      await app.flexiblePaymentPage.clickOnNextButton();
      await app.flexiblePaymentPage.clickOnConfirmButton();
      await app.flexiblePaymentPage.verifyTheSuccessfulMessage();
  
  });

  test("TC-05 - Book , pay and select payment method", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const testData = readTestData();
    const app = new WebApp(page);
    const sakaniUserId = testData.sakaniUserId;
    const userPortalUrl = testData.userPortalUrl;
    const projectName = testData.projectName;
    const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");
  
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
    const bookingApp = new WebApp(page2);
  
    await bookingApp.unitDetailsPage.reserveUnit();
    await bookingApp.bookingAndSelectPaymentMethodPage.checkOnTermAndCondition();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnApproveAndContinueIfVisible();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnPayBookingFeesButton();
    await bookingApp.paymentGatewayPage.fillCardDetails();
    await bookingApp.paymentConfirmationPage.closePayment();
    await bookingApp.paymentConfirmationPage.expectSuccessMessage();
  
    const unitCodeNew =
      await bookingApp.bookingAndSelectPaymentMethodPage.getUnitCode();
    expect(unitCodeNew).toBeTruthy();
    testData.unitCodeNew = unitCodeNew;
    fs.writeFileSync(
      testDataPath,
      JSON.stringify(testData, null, 2) + "\n",
      "utf8",
    );
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSelectPaymentMethodButton();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnFlexiblePaymentRadioButton();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSaveAndContinueButton();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnSignContractButton();
    await bookingApp.unitBookingPage.signSalesContract();
    await bookingApp.unitBookingPage.expectSalesContractSuccess();
    await bookingApp.bookingAndSelectPaymentMethodPage.clickOnBookingDetailsButton();
    await bookingApp.page.waitForTimeout(10000);
  
  });
  
  // await page.pause();

  test("TC-07  Verify same payment schedle in payment tracking and booking details", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any}, async ({ page }) => {
    test.setTimeout(120000);
    const testData = readTestData();
    const app = new WebApp(page);
  
    await app.adminProjectPage.login(
      testData.adminPortalUrl,
      testData.adminUsername,
      testData.adminPassword,
    );
  
    await app.adminProjectPage.openProjects();
    await page.locator("//input[@formcontrolname='name']").fill(testData.projectName);
    await page.getByRole('button', { name: 'بحث' }).click();
    await page.getByRole('cell', { name: testData.projectName, exact: true }).click();
    // await page.locator('div').filter({ hasText: testData.projectName }).click();
    await page.waitForTimeout(10000);
  
    await app.paymentTrackingPage.clickOnPaymentTrackingTab();
    await app.paymentTrackingPage.fillUnitCode(testData.unitCodeNew);
    await app.paymentTrackingPage.clickOnSearchButton();
    await app.paymentTrackingPage.clickOnSearchedUnit();
    await app.paymentTrackingPage.waitForCompletionPercentageVisible();
    await app.paymentTrackingPage.clickOnBeneficiariesSideMenu();
    await app.paymentTrackingPage.clickOnBeneficiariesListSideMenu();
    // await app.paymentTrackingPage.selectSearchByOption();
    await app.paymentTrackingPage.fillSearchUnit(testData.sakaniUserId);
    await app.paymentTrackingPage.clickOnSearchButtonForUnit();
    await app.paymentTrackingPage.clickOnSearchResult();
    await app.paymentTrackingPage.clickOnBookingDetailsTab();
    await app.paymentTrackingPage.clickOnSearchResult();
    await app.paymentTrackingPage.clickOnPaymentTrackingTab();
    await app.paymentTrackingPage.waitForSpecifiedPeriodVisible();
  });
});

