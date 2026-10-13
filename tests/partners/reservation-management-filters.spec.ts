import {expect, test} from "@playwright/test";
import {WebApp} from "@base-class/web-app";
import {DataHelper} from "@helpers/DataHelper";
import {logStep} from "@helpers/LogSteps";

const SERVICE = "reservation-management-filters";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe("Reservation Management Filters", () => {

    test("TC-01 Verify that the system can filter eligible and ineligible bookings", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open projects > Individual bookings");
        await app.developerProjectPage.openProjectsPage();
        await app.developerProjectPage.clickOnIndividualBookings();

        await logStep("Step 03: Filter by beneficiary bookings > Search > Verify search results are visible");
        await app.reservationManagementFiltersPage.clickOnFilter();
        await app.reservationManagementFiltersPage.filterUsingBeneficiaryBookings();
        await app.reservationManagementFiltersPage.clickOnSearch();
        expect(await app.reservationManagementFiltersPage.isSearchResultTableVisible()).toEqual(true);

        await logStep("Step 04: Filter by non-beneficiary bookings > Search > Verify search results are visible");
        await app.reservationManagementFiltersPage.clickOnFilter();
        await app.reservationManagementFiltersPage.filterUsingNonBeneficiaryBookings();
        await app.reservationManagementFiltersPage.clickOnSearch();
        expect(await app.reservationManagementFiltersPage.isSearchResultTableVisible()).toEqual(true);

    });
    test("TC-02 Verify that the system can display all booking statuses and allow filtering based on them", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open projects > Individual bookings");
        await app.developerProjectPage.openProjectsPage();
        await app.developerProjectPage.clickOnIndividualBookings();

        await logStep("Step 03: Filter by booking status > Verify all bookings have the same status");
        await app.reservationManagementFiltersPage.clickOnIndividualBookingsStatusFilter();

        const texts1 = await app.reservationManagementFiltersPage.getIndividualBookingsStatusColumnTexts();
        console.log(texts1);
        expect(texts1.length).toBeGreaterThan(0);
        expect(texts1.every(t => t === texts1[0])).toBe(true);

        await logStep("Step 04: Change the status filter > Verify all bookings have the same status, different from the first filter");
        await app.reservationManagementFiltersPage.clickOnIndividualBookingsStatusFilter();

        const texts2 = await app.reservationManagementFiltersPage.getIndividualBookingsStatusColumnTexts();
        console.log(texts2);
        expect(texts2.length).toBeGreaterThan(0);
        expect(texts2.every(t => t === texts2[0])).toBe(true);
        expect(texts1).not.toEqual(texts2);

    });
    test("TC-03 Verify that the system can display booking details", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open projects > Individual bookings");
        await app.developerProjectPage.openProjectsPage();
        await app.developerProjectPage.clickOnIndividualBookings();

        await logStep("Step 03: View the first booking details > Bookings tab > Verify booking details are visible");
        await app.reservationManagementFiltersPage.viewTheFirstBookingDetails();
        await app.reservationManagementFiltersPage.clickOnBookings();

        expect(await app.reservationManagementFiltersPage.areBookingDetailsVisible()).toEqual(true);

    });
    test("TC-04 Verify that the system can display all company booking statuses and allow filtering based on them", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open projects > Company bookings");
        await app.developerProjectPage.openProjectsPage();
        await app.developerProjectPage.clickOnCompanyBookings();

        await logStep("Step 03: Filter by company booking status > Verify all bookings have the same status");
        await app.reservationManagementFiltersPage.clickOnCompanyBookingsStatusFilter();

        const texts1 = await app.reservationManagementFiltersPage.getCompanyBookingsStatusColumnTexts();
        console.log(texts1);
        expect(texts1.length).toBeGreaterThan(0);
        expect(texts1.every(t => t === texts1[0])).toBe(true);

        await logStep("Step 04: Change the status filter > Verify all bookings have the same status, different from the first filter");
        await app.reservationManagementFiltersPage.clickOnCompanyBookingsStatusFilter();

        const texts2 = await app.reservationManagementFiltersPage.getCompanyBookingsStatusColumnTexts();
        console.log(texts2);
        expect(texts2.length).toBeGreaterThan(0);
        expect(texts2.every(t => t === texts2[0])).toBe(true);
        expect(texts1).not.toEqual(texts2);

    });
    test("TC-05 Verify that the system can display the company booking details", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open projects > Company bookings");
        await app.developerProjectPage.openProjectsPage();
        await app.developerProjectPage.clickOnCompanyBookings();

        await logStep("Step 03: View the first company booking details > Bookings tab > Verify booking details are visible");
        await app.reservationManagementFiltersPage.viewTheFirstBookingDetails();
        await app.reservationManagementFiltersPage.clickOnBookings();

        expect(await app.reservationManagementFiltersPage.areBookingDetailsVisible()).toEqual(true);

    });

});
