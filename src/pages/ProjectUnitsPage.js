import { expect, Page } from "@playwright/test";
const path = require("path");
const { ProjectUnitsObjects } = require(
  path.join(process.cwd(), "src", "Objects", "ProjectUnitsObjects"),
);

class ProjectUnitsPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async openUnitInPopup(unitIndex) {
    const unitCard = this.page
      .locator(ProjectUnitsObjects.unitCard).nth(unitIndex);
    await unitCard.waitFor({ state: "visible", timeout: 30000 });
    await this.click(unitCard);
  }


  // async openUnitInPopup() {
  // const unitCard = this.page.locator(
  //     ProjectUnitsObjects.unitCard.xpath, {
      
  //   }
  //   );
  //   // await this.page.waitForTimeout(10000);
  //   await expect(unitCard).toBeVisible({ timeout: 90000 });
  //   await unitCard.click();
  
  // }

  async selectLand(unitIndex) {
    const landCard = this.page
      .locator(ProjectUnitsObjects.landUnitCard).nth(unitIndex);
    await landCard.waitFor({ state: "visible", timeout: 30000 });
    await this.click(landCard);
  }
}

module.exports = { ProjectUnitsPage };
