
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

function writeTestData(data: Record<string, unknown>) {
  fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}


test("TC-02 Create Mega Project", async ({ page }) => {
  test.setTimeout(120000);
  const app = new WebApp(page);

  const megaProjectName = `Mega Project ${new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14)}`;
  const updatedData = { ...testData, megaProjectName };
  writeTestData(updatedData);




  await app.adminProjectPage.login(
    testData.adminPortalUrl,
    testData.adminUsername,
    testData.adminPassword,
  );
  await app.adminProjectPage.clickInternalInventory();
  await app.createMegaProjectPage.clickOnMegaProjects();
  await app.createMegaProjectPage.clickOnAddNewMegaProject();
  await app.createMegaProjectPage.enterMegaProjectInformation(megaProjectName);
  await app.createMegaProjectPage.selectRegion("الرياض");
  await app.createMegaProjectPage.selectCity("الرياض");
  await app.createMegaProjectPage.enterLatitude("10");
  await app.createMegaProjectPage.enterLongitude("10");
  await app.createMegaProjectPage.enterVideoLink("www.test.com");
  await app.createMegaProjectPage.uploadBannerImage("C:\\Users\\user\\Desktop\\RackMultipart20251223-19-cq6g4a.jpg");
  await app.createMegaProjectPage.uploadImageGallery("C:\\Users\\user\\Desktop\\RackMultipart20251223-19-cq6g4a.jpg");
  await app.createMegaProjectPage.clickOnAddMegaProject();
  await app.createMegaProjectPage.searchAndSelectProject(testData.projectName);
  await app.createMegaProjectPage.selectSearchedProject(testData.projectName);
  await app.createMegaProjectPage.clickOnAddToMegaProject();
  await app.createMegaProjectPage.clickOnMegaProjectInformationLink();
  await page.waitForTimeout(10000);
});
