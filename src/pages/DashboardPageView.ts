import {Page} from "@playwright/test";
import {DashboardViewObjects} from "@objects/DashboardViewObjects";

let DEFAULT_TIMEOUT = 30_000;

export class DashboardViewPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnDashboardView() {
        const dashboardView = this.page.getByRole(DashboardViewObjects.dashboardViewLink.role, {name: DashboardViewObjects.dashboardViewLink.name});
        await dashboardView.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await dashboardView.click();
        await this.page.waitForTimeout(3000);
    }

    async clickOnBookingCard() {
        const bookingCard = this.page.locator(DashboardViewObjects.bookingViewCard);
        await bookingCard.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await bookingCard.click();
        await this.page.waitForTimeout(3000);
    }

    async clickOnTheProjectsCard() {
        const bookingCard = this.page.locator(DashboardViewObjects.theProjectsViewCard);
        await bookingCard.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await bookingCard.click();
        await this.page.waitForTimeout(3000);
    }

    async clickOnProjectsCard() {
        const bookingCard = this.page.locator(DashboardViewObjects.projectsViewCard);
        await bookingCard.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await bookingCard.click();
        await this.page.waitForTimeout(3000);
    }

    async clickOnUpdatedBookings() {
        const updatedBookingCard = this.page.locator(DashboardViewObjects.updatedBookingCard);
        await updatedBookingCard.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await updatedBookingCard.click();
        await this.page.waitForTimeout(3000);
    }

    async clickOnPayCard() {
        const payCardView = this.page.locator(DashboardViewObjects.payCard);
        await payCardView.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await payCardView.click();
        await this.page.waitForTimeout(3000);
    }

    async areAllDashboardViewElementsVisible() {
        const allDashboardView = this.page.locator(DashboardViewObjects.allDashboardViewElements);
        await allDashboardView.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await allDashboardView.isVisible();
    }

    async areAllReservationsElementsVisible() {
        const reservationView = this.page.locator(DashboardViewObjects.appReservationTable);
        await reservationView.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await reservationView.isVisible();
    }

    async areAllProjectsVisible() {
        const projectsView = this.page.locator(DashboardViewObjects.appProjectsView);
        await projectsView.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await projectsView.isVisible();
    }

    async areAllBookingsPaymentVisible() {
        const bookingPayments = this.page.locator(DashboardViewObjects.allBookingPaymentView);
        await bookingPayments.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await bookingPayments.isVisible();
    }

    async areAllUpdatedBookingsVisible() {
        const updatedBookings = this.page.locator(DashboardViewObjects.updatedBookingsTable);
        await updatedBookings.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await updatedBookings.isVisible();
    }

}