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
      .getByText(ProjectUnitsObjects.propertyText)
      .nth(unitIndex);
    await unitCard.waitFor({ state: "visible", timeout: 30000 });
    await this.click(unitCard);
  }

    async selectLand(unitIndex) {
    const landCard = this.page
      .locator(ProjectUnitsObjects.landUnitCard).nth(unitIndex);
    await landCard.waitFor({ state: "visible", timeout: 30000 });
    await this.click(landCard);
  }
}

module.exports = { ProjectUnitsPage };
