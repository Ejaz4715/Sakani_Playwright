import {expect, Locator, Page} from "@playwright/test";
import {RecommendationsObjects} from "@objects/RecommendationsObjects";

const DEFAULT_TIMEOUT = 30_000;

export class RecommendationsPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnRecommendations() {
        await this.page.locator(RecommendationsObjects.recommendationsLink).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.recommendationsLink).click();
    }

    async openRecommendationsForm() {
        await this.page.locator(RecommendationsObjects.recommendationsFormLink).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.recommendationsFormLink).click();
    }

    async selectFirstRegion() {
        await this.page.locator(RecommendationsObjects.regionTextField).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.regionTextField).click();
        await this.page.locator(RecommendationsObjects.firstOptionFromDropdownMenus).click();
    }

    async selectFirstCity() {
        await this.page.locator(RecommendationsObjects.cityTextField).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.cityTextField).click();
        await this.page.locator(RecommendationsObjects.firstOptionFromDropdownMenus).click();
    }

    async selectDistrict() {
        await this.page.locator(RecommendationsObjects.districtTextField).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.districtTextField).click();
        await this.page.locator(RecommendationsObjects.firstOptionFromDropdownMenus).click();
    }

    async selectProjectType(projectType: string = 'وحدات جاهزة') {
        const {role, name} = RecommendationsObjects.selectProjectType(projectType);
        await this.selectChip(this.page.getByRole(role, {name}));
    }

    async selectUnitType(unitType: string = 'شقة') {
        const {role, name} = RecommendationsObjects.selectUnitType(unitType);
        await this.selectChip(this.page.getByRole(role, {name}));
    }

    async selectBedRoomsNumber(bedRoomsNumber: number = 3) {
        await this.selectChip(this.page.locator(RecommendationsObjects.selectNumberOfBedrooms(bedRoomsNumber)));
    }

    async selectBathroomsNumber(bathroomsNumber: number = 3) {
        await this.selectChip(this.page.locator(RecommendationsObjects.selectNumberOfBathrooms(bathroomsNumber)));
    }

    async clickOnSave() {
        await this.page.locator(RecommendationsObjects.saveButton).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.saveButton).click();
    }

    async isPreferenceSavedSuccessfully() {
        await this.page.locator(RecommendationsObjects.preferenceSaveStatusText).waitFor({timeout: DEFAULT_TIMEOUT});
        return await this.page.locator(RecommendationsObjects.preferenceSaveStatusText).isVisible();
    }

    async setMinimumPrice(price: number = 100000) {
        const label = this.page.getByText(RecommendationsObjects.minimumPriceLabel, {exact: true});
        const priceField = this.page.locator("div").filter({has: label}).last().getByRole("textbox");
        await priceField.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await priceField.fill(String(price));
        await priceField.blur();
    }

    async clickOnContinue() {
        await this.page.locator(RecommendationsObjects.continueButton).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.continueButton).click();
    }

    private async selectChip(chip: Locator) {
        await chip.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        const classes = (await chip.getAttribute("class")) ?? "";
        if (!classes.split(/\s+/).includes("active")) {
            await chip.click();
        }
        await expect(chip).toHaveClass(/\bactive\b/, {timeout: DEFAULT_TIMEOUT});
    }

    async clickOnForYou() {
        await this.page.locator(RecommendationsObjects.forYouButton).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.forYouButton).click();
    }

    async isGuestRecommendationCardVisible(){
        await this.page.locator(RecommendationsObjects.guestRecommendationText).waitFor({timeout: DEFAULT_TIMEOUT});
        return await this.page.locator(RecommendationsObjects.guestRecommendationText).isVisible();
    }

    async enterNationalId(nationalId: string) {
        await this.page.locator(RecommendationsObjects.nationalIdTextField).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.nationalIdTextField).fill(nationalId);
    }


    async clickOnSearch() {
        await this.page.locator(RecommendationsObjects.searchButton).waitFor({timeout: DEFAULT_TIMEOUT});
        await this.page.locator(RecommendationsObjects.searchButton).click();
        await this.page.waitForTimeout(2000);
    }
}
