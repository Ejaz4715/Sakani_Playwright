import {Page} from "@playwright/test";
import {ReservationManagementFiltersObjects} from "@objects/ReservationManagementFiltersObjects";


const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;

export class ReservationManagementFiltersPage {
    page: Page;
    defaultTimeout: number | undefined;

    constructor(page: Page) {
        this.page = page;
        this.defaultTimeout = 60000;
    }

    async clickOnFilter() {
        await this.page.locator(ReservationManagementFiltersObjects.filtersButton).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.filtersButton).click();

    }

    async filterUsingAllBookings() {
        await this.page.locator(ReservationManagementFiltersObjects.allUsers).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.allUsers).click();

    }

    async filterUsingBeneficiaryBookings() {
        await this.page.locator(ReservationManagementFiltersObjects.beneficiaryUsers).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.beneficiaryUsers).click();
    }

    async filterUsingNonBeneficiaryBookings() {
        await this.page.locator(ReservationManagementFiltersObjects.nonBeneficiaryUsers).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.nonBeneficiaryUsers).click();
    }

    async isSearchResultTableVisible() {
        await this.page.locator(ReservationManagementFiltersObjects.searchResultTable).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        return await this.page.locator(ReservationManagementFiltersObjects.searchResultTable).isVisible();
    }

    async clickOnSearch() {
        await this.page.locator(ReservationManagementFiltersObjects.searchButton).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.searchButton).click();
    }

    async clickOnIndividualBookingsStatusFilter() {
        await this.page.locator(ReservationManagementFiltersObjects.IndividualBookingsStatusFilter).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.IndividualBookingsStatusFilter).click();
        await this.page.waitForTimeout(10000);
    }

    async clickOnCompanyBookingsStatusFilter() {
        await this.page.locator(ReservationManagementFiltersObjects.companyBookingsStatusFilter).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        await this.page.locator(ReservationManagementFiltersObjects.companyBookingsStatusFilter).click();
        await this.page.waitForTimeout(10000);
    }


    async getIndividualBookingsStatusColumnTexts(): Promise<string[]> {
        const items = this.page.locator(ReservationManagementFiltersObjects.allIndividualBookingsStatusesColumn);
        await items.first().waitFor({ state: "visible", timeout: DEFAULT_TIMEOUT });
        return (await items.allInnerTexts()).map(t => t.trim());
    }

    async getCompanyBookingsStatusColumnTexts(): Promise<string[]> {
        const items = this.page.locator(ReservationManagementFiltersObjects.allcompanyBookingsStatusesColumn);
        await items.first().waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return (await items.allInnerTexts()).map(t => t.trim());
    }

    async viewTheFirstBookingDetails(){
        await this.page.locator(ReservationManagementFiltersObjects.firstBookingDetailsButton).waitFor({state: "visible", timeout: DEFAULT_TIMEOUT });
        await this.page.locator(ReservationManagementFiltersObjects.firstBookingDetailsButton).click();
    }

    async clickOnBookings(){
        await this.page.locator(ReservationManagementFiltersObjects.bookingTab).waitFor({state: "visible", timeout: DEFAULT_TIMEOUT });
        await this.page.locator(ReservationManagementFiltersObjects.bookingTab).click();
    }

    async areBookingDetailsVisible() {
        await this.page.locator(ReservationManagementFiltersObjects.bookingDetails).waitFor({
            state: "visible",
            timeout: DEFAULT_TIMEOUT
        });
        return await this.page.locator(ReservationManagementFiltersObjects.bookingDetails).isVisible();
    }


}
