// @ts-nocheck
const path = require("path");
import {Page} from '@playwright/test';
import { MarketplaceLandingObjects } from '@objects/MarketplaceLandingObjects'

export class MarketplaceLandingPage {
  page: Page;
  constructor(page: Page) {
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

  async openResidentialUnit() {
    const unit = this.page.locator("//app-marketplace-project-card-template/descendant::span[text() ='SAR']").first();
    await unit.waitFor({ state: "visible", timeout: 30000 });
    await unit.click();
  }
}
