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

test("TC-01 - Add new project", async ({ page }) => {
  test.setTimeout(120000);
  const app = new WebApp(page);

  await app.adminProjectPage.login(
    testData.adminPortalUrl,
    testData.adminUsername,
    testData.adminPassword,
  );

  await app.adminProjectPage.openProjects();
  await page.pause(2000);
  await page.getByRole('textbox').nth(1).fill(testData.projectName);
  await page.getByRole('button', { name: 'بحث' }).click();
  await page.getByRole('cell', { name: testData.projectName, exact: true }).click();
  // await page.locator('div').filter({ hasText: testData.projectName }).click();
  await page.getByText('إعدادات المشاريع').click();
  await page.getByRole('switch', { name: 'Use General setting for' }).click();
  await page.getByRole('switch', { name: 'تفعيل أتمتة تحصيل المدفوعات' }).click();
  await page.getByRole("button", { name: "حفظ" }).click();
  await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

});
