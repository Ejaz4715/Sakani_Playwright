const path = require("path");
const { MarketplaceLandingObjects } = require(
  path.join(process.cwd(), "src", "Objects", "MarketplaceLandingObjects"),
);

class MarketplaceLandingPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async openSearch() {
    const searchButton = this.page.getByRole(
      MarketplaceLandingObjects.searchButton.role,
      {
        name: MarketplaceLandingObjects.searchButton.name,
        exact: MarketplaceLandingObjects.searchButton.exact,
      },
    );
    await this.click(searchButton);
  }

  async searchForProject(projectName) {
    const searchInput = this.page.getByRole(
      MarketplaceLandingObjects.searchInput.role,
      { name: MarketplaceLandingObjects.searchInput.name },
    );
    await searchInput.fill(projectName);

    const projectResult = this.page
      .locator(MarketplaceLandingObjects.projectResultModal)
      .getByText(projectName, { exact: true });
    await this.click(projectResult);
  }

  async openResidentialUnit(unitIndex = 0) {
    const unit = this.page.getByText("شقة معروضة للبيع في").first();
    await unit.waitFor({ state: "visible", timeout: 30000 });
    await unit.click();
  }
}

module.exports = { MarketplaceLandingPage };
