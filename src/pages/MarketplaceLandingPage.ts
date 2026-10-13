// @ts-nocheck
import {ProfileManagementObjects} from "@objects/ProfileManagementObjects";
const path = require("path");
import { expect, Page } from '@playwright/test';
import { MarketplaceLandingObjects } from '@objects/MarketplaceLandingObjects'

export class MarketplaceLandingPage {
  page: Page;
  DEFAULT_TIMEOUT=30_000
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
      .getByText(projectName, { exact: true })
    await this.click(projectResult);
  }

  async clickSearchedResultIfTextMatches(expectedText: string) {
     const searchInput = this.page.getByRole(
      MarketplaceLandingObjects.searchInput.role,
      { name: MarketplaceLandingObjects.searchInput.name },
    );
    await searchInput.fill(expectedText);
    const searchedResult = this.page.locator(
      MarketplaceLandingObjects.searchedResutl.xpath,
    );
    await expect(searchedResult).toHaveText(expectedText);
    await searchedResult.click();
  }

  async openReadyMadeUniy() {
        const readyMadeUnitCard = this.page.locator(
            MarketplaceLandingObjects.readyMadeUnitCard.xpath
        ).first();

        await expect(readyMadeUnitCard).toBeVisible({ timeout: 90000 });
        await readyMadeUnitCard.click();
    }
  async openResidentialUnit() {
    const unit = this.page.locator("//app-marketplace-project-card-template/descendant::span[text() ='SAR']").first();
    await unit.waitFor({ state: "visible", timeout: 30000 });
    await unit.click();
  }

  async expandProfileDropDownMenu(){
    await this.page.waitForTimeout(1000)
     await this.page.locator(MarketplaceLandingObjects.profileDropDown).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
     await this.page.locator(MarketplaceLandingObjects.profileDropDown).click();
     await this.page.waitForTimeout(1000);
  }

  async openProfileManagement() {
    await this.expandProfileDropDownMenu();
    await this.page.locator(MarketplaceLandingObjects.profileManagement).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.profileManagement).click();
    await this.page.waitForTimeout(1000);
  }

  async clickOnNews() {
    await this.page.keyboard.press('PageDown');
    await this.page.locator(MarketplaceLandingObjects.news).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.news).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnServices(){
    await this.page.locator(MarketplaceLandingObjects.services).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.services).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnAllServices(){
    await this.page.locator(MarketplaceLandingObjects.allServicesButton).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.allServicesButton).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnEligibilityCheckerLink(){
    await this.page.locator(MarketplaceLandingObjects.eligibilityCheckerLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.eligibilityCheckerLink).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnRealStateTaxExemptionLink(){
    await this.page.locator(MarketplaceLandingObjects.realStateTaxExemptionLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.realStateTaxExemptionLink).click();
    await this.page.waitForTimeout(3000);

  }

  async clickOnFinancialAdvisoryLink(){
    await this.page.locator(MarketplaceLandingObjects.financialAdvisoryLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.financialAdvisoryLink).click();
    await this.page.waitForTimeout(3000);

  }

  async clickOnTermsAndConditionsLink(){
    await this.page.keyboard.press('PageDown');
    await this.page.locator(MarketplaceLandingObjects.termsAndConditionsLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.termsAndConditionsLink).click();
    await this.page.waitForTimeout(3000);

  }

  async clickOnExecutiveRegulationLink(){
    await this.page.keyboard.press('PageDown');
    await this.page.locator(MarketplaceLandingObjects.executiveRegulationLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.executiveRegulationLink).click();
    await this.page.waitForTimeout(3000);

  }

  async clickOnSupportAndHelpLink(){
    await this.page.keyboard.press('PageDown');
    await this.page.locator(MarketplaceLandingObjects.supportAndHelpLink).waitFor({state: "visible",timeout:this.DEFAULT_TIMEOUT});
    await this.page.locator(MarketplaceLandingObjects.supportAndHelpLink).click();
    await this.page.waitForTimeout(3000);

  }

  async clickOnSupportAndHelpFAQLink() {
    await this.page.keyboard.press('PageDown');
    await this.page.locator(MarketplaceLandingObjects.supportAndHelpFAQLink).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    await this.page.locator(MarketplaceLandingObjects.supportAndHelpFAQLink).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnOffPlanProjectsProductLink() {
    await this.page.locator(MarketplaceLandingObjects.offPlanProjectsProductLink).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    await this.page.locator(MarketplaceLandingObjects.offPlanProjectsProductLink).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnReadyUnitsProductLink() {
    await this.page.locator(MarketplaceLandingObjects.readyUnitsProductLink).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    await this.page.locator(MarketplaceLandingObjects.readyUnitsProductLink).click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnLandsProductLink() {
    await this.page.locator(MarketplaceLandingObjects.landsProductLink).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    await this.page.locator(MarketplaceLandingObjects.landsProductLink).click();
    await this.page.waitForTimeout(3000);
  }

  async isOffPlanProductPageVisible() {
    await this.page.locator(MarketplaceLandingObjects.offPlanProductHeaderText).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    return await this.page.locator(MarketplaceLandingObjects.offPlanProductHeaderText).isVisible();
  }

  async isReadyUnitsProductPageVisible() {
    await this.page.locator(MarketplaceLandingObjects.readyUnitProductHeaderText).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    return await this.page.locator(MarketplaceLandingObjects.readyUnitProductHeaderText).isVisible();
  }

  async isLandsProductPageVisible() {
    await this.page.locator(MarketplaceLandingObjects.landsProductHeaderText).waitFor({
      state: "visible",
      timeout: this.DEFAULT_TIMEOUT
    });
    return await this.page.locator(MarketplaceLandingObjects.landsProductHeaderText).isVisible();
  }

}
